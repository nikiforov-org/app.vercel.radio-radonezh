const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const url = 'https://radonezh.ru/ajax/update';

/**
 * Запрашивает внешний ресурс, парсит XML, извлекает данные и записывает их в Firestore.
 */
async function fetchAndWriteData() {
  try {
    // Используем глобальный fetch (Node 18+)
    const response = await fetch(url);
    const xmlData = await response.text();

    const result = parseXml(xmlData);

    // Ищем элементы с id="current" и id="next"
    const current = result.update.p.find((p) => p.$.id === 'current');
    const next = result.update.p.find((p) => p.$.id === 'next');

    if (!current || !next) {
      console.error('Не найдены элементы с id="current" или id="next"');
      return;
    }

    // Обрабатываем текстовые данные для получения времени и заголовка
    const currentData = processText(current._);
    const nextData = processText(next._);

    const data = {
      current: currentData,
      next: nextData,
      updatedAt: new Date().toISOString(), // для отслеживания времени обновления
    };

    // Записываем данные в Firestore: коллекция "files", документ "shedule"
    await db.collection('files').doc('shedule').set(data);
    console.log('Firestore успешно обновлен');
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

/**
 * Удаляет HTML-теги, делит строку по точке и извлекает время и заголовок.
 */
function processText(text) {
  // Удаляем HTML-теги
  const cleanedText = text.replace(/<[^>]+>/g, '').trim();
  // Разбиваем по точке, чтобы отделить время от заголовка
  const [timePart, ...titleParts] = cleanedText.split('.');
  // Извлекаем последнее слово из первой части — предполагается, что это время
  const timeTokens = timePart.trim().split(' ');
  const timeOnly = timeTokens[timeTokens.length - 1].trim();
  // Заголовок может содержать точки, поэтому объединяем оставшиеся части
  const title = titleParts.join('.').trim();
  return { time: timeOnly, title };
}

/**
 * Простейший парсер XML для ожидаемой структуры:
 * <update>
 *   <p id="current">...</p>
 *   <p id="next">...</p>
 * </update>
 */
function parseXml(xml) {
  const result = { update: { p: [] } };
  // Регулярное выражение для поиска тегов <p id="...">...</p>
  const pRegex = /<p\s+id="([^"]+)"\s*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(xml)) !== null) {
    result.update.p.push({
      $: { id: match[1] },
      _: match[2].trim(),
    });
  }
  return result;
}

/**
 * Функция, запускаемая по расписанию (каждую минуту, поскольку минимальный интервал – 1 минута).
 * Если требуется именно каждые 30 секунд, потребуется использовать альтернативные решения.
 */
exports.scheduledUpdate = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  await fetchAndWriteData();
  return null;
});

/**
 * Функция-прокси, которая читает документ из Firestore и отдает его в виде JSON.
 * Настраивайте rewrite в firebase.json для маршрута, например, "/api/v1/shedule".
 */
exports.proxyShedule = functions.https.onRequest(async (req, res) => {
  try {
    const doc = await db.collection('files').doc('shedule').get();
    if (!doc.exists) {
      res.status(404).send('Документ не найден');
      return;
    }
    // При необходимости добавить заголовки CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.json(doc.data());
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore:', error);
    res.status(500).send('Ошибка сервера');
  }
});
