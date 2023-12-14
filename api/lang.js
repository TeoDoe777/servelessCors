fetch('https://translate.sn-storage.workers.dev/http:///api/lang?target=en&source=ru&te=2&text=%D1%82%D0%B5%D1%81%D1%82&getraw=true')
    .then(response => response.text())
    .then(data => {
        // Вывод ответа на страницу
        document.body.innerHTML = data;
    })
    .catch(error => console.error('Ошибка:', error));
