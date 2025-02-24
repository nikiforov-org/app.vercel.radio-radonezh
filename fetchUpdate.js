const fetch = require('node-fetch');
const fs = require('fs');
const xml2js = require('xml2js'); // Для парсинга XML

// URL для фетча
const url = 'https://radonezh.ru/ajax/update';

// Функция для получения и преобразования данных
async function fetchAndWriteData() {
    try {
        // Фетчим данные с URL
        const response = await fetch(url);
        const xmlData = await response.text();

        // Парсим XML
        const parser = new xml2js.Parser();
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Ошибка при парсинге XML:', err);
                return;
            }

            // Извлекаем необходимые данные
            const current = result.update.p.find(p => p.$.id === 'current');
            const next = result.update.p.find(p => p.$.id === 'next');

            const data = {
                current: {
                    time: current?.strong[0],
                    title: current?.span[1]
                },
                next: {
                    time: next?.strong[0],
                    title: next?.span[1]
                }
            };

            // Записываем данные в файл
            fs.writeFileSync('./public/update.json', JSON.stringify(data, null, 2));
            console.log('Файл обновлен');
        });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Запуск функции
fetchAndWriteData();
