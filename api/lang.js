module.exports = async (req, res) => {
    try {
        const response = await fetch('https://translate.sn-storage.workers.dev/http:///api/lang?target=en&source=ru&te=2&text=%D1%82%D0%B5%D1%81%D1%82&getraw=true');
        const data = await response.text();
        res.status(200).send(data);
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Произошла ошибка');
    }
};
