const axios = require('axios');

module.exports = async (req, res) => {
    const url = 'https://klondiketest.turp777.workers.dev/';
    try {
        const response = await axios.get(url, { maxRedirects: 0 });
    } catch (error) {
        if (error.response && error.response.status === 302) {
            res.redirect(error.response.headers.location);
        } else {
            res.status(500).send('Ошибка при перенаправлении');
        }
    }
};
