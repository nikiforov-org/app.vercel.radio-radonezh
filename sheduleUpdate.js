import fetch from 'node-fetch';
import fs from 'fs';
import xml2js from 'xml2js';

const url = 'https://radonezh.ru/ajax/update';

async function fetchAndWriteData() {
    try {
        // Получаем XML-данные с сервера
        const response = await fetch(url);
        const xmlData = await response.text();

        // Парсим XML
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Ошибка при парсинге XML:', err);
                return;
            }

            // result.update.p – массив элементов <p>
            const current = result.update.p.find(p => p.$.id === 'current');
            const next = result.update.p.find(p => p.$.id === 'next');

            if (!current || !next) {
                console.error('Не найдены элементы с id="current" или id="next"');
                return;
            }

            // Текстовое содержимое находится в свойстве "_"
            const currentText = current._?.trim() || "";
            const nextText = next._?.trim() || "";

            // Предполагается, что строка имеет формат "ВРЕМЯ. Заголовок"
            const [currentTime, ...currentTitleParts] = currentText.split('.');
            const [nextTime, ...nextTitleParts] = nextText.split('.');

            const currentTitle = currentTitleParts.join('.').trim();
            const nextTitle = nextTitleParts.join('.').trim();

            const data = {
                current: {
                    time: currentTime,
                    title: currentTitle
                },
                next: {
                    time: nextTime,
                    title: nextTitle
                }
            };

            // Записываем данные в файл
            fs.writeFileSync('./public/shedule.json', JSON.stringify(data, null, 2));
            console.log('Файл обновлен');
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

fetchAndWriteData();
