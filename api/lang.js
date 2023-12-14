module.exports = async (req, res) => {
  try {
    const target = req.query.target || 'en';
    const text = req.query.text || 'пример мир';
    const response = await fetch(`https://translate.sn-storage.workers.dev/?target=${target}&source=ru&te=2&text=${text}&getraw=true`);
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Произошла ошибка');
  }
};
