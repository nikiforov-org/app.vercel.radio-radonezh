export async function GET(request) {
  const url = 'https://radonezh.ru/ajax/update';

  try {
    // Получаем XML с внешнего ресурса
    const response = await fetch(url);
    const xmlData = await response.text();

    // Парсим XML
    const result = parseXml(xmlData);

    // Ищем элементы с id="current" и id="next"
    const current = result.update.p.find((p) => p.$.id === 'current');
    const next = result.update.p.find((p) => p.$.id === 'next');

    if (!current || !next) {
      return new Response(
        JSON.stringify({ error: 'Не найдены элементы с id="current" или id="next"' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Обрабатываем текст для извлечения времени и заголовка
    const currentData = processText(current._);
    const nextData = processText(next._);

    const data = { current: currentData, next: nextData };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Ошибка при получении данных', details: error.toString() }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

/**
 * Удаляет HTML-теги, разделяет строку по первой точке и извлекает время и заголовок.
 */
function processText(text) {
  const cleanedText = text.replace(/<[^>]+>/g, '').trim();
  const [timePart, ...titleParts] = cleanedText.split('.');
  const timeTokens = timePart.trim().split(' ');
  const timeOnly = timeTokens[timeTokens.length - 1].trim();
  const title = titleParts.join('.').trim();
  return { time: timeOnly, title };
}

/**
 * Простейший парсер XML для структуры:
 * <update>
 *   <p id="current">...</p>
 *   <p id="next">...</p>
 * </update>
 */
function parseXml(xml) {
  const result = { update: { p: [] } };
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
