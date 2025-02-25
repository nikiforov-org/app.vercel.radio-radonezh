import fs from 'fs';

const url = 'https://radonezh.ru/ajax/update';

async function fetchAndWriteData() {
  try {
    // Если ваша версия Node.js поддерживает глобальный fetch (Node 18+)
    const response = await fetch(url);
    const xmlData = await response.text();

    // Парсим XML с помощью собственного примитивного парсера
    const result = parseXml(xmlData);

    // Ищем элементы с id="current" и id="next"
    const current = result.update.p.find((p) => p.$.id === 'current');
    const next = result.update.p.find((p) => p.$.id === 'next');

    if (!current || !next) {
      console.error('Не найдены элементы с id="current" или id="next"');
      return;
    }

    // Обрабатываем текстовые данные, чтобы получить время без HTML-тегов и заголовок
    const currentData = processText(current._);
    const nextData = processText(next._);

    const data = {
      current: currentData,
      next: nextData,
    };

    // Записываем данные в файл
    fs.writeFileSync('./api/shedule.json', JSON.stringify(data, null, 2));
    console.log('Файл обновлен');
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

/**
 * Функция для обработки строки вида:
 * "<span>Сейчас в эфире</span> 23:00. Много любви не бывает. Беседа с педагогом..."
 *
 * 1. Удаляет HTML-теги.
 * 2. Делит строку по первой точке: первая часть содержит время (с поясняющим текстом),
 *    а вторая – заголовок.
 * 3. Из первой части извлекается последнее слово, которое и считается временем.
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

fetchAndWriteData();
