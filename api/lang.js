module.exports = async (req, res) => {
  try {
    const response = await fetch('https://translate.sn-storage.workers.dev/?target=en&source=ru&te=2&text=пример мир&getraw=true');
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Произошла ошибка');
  }
};
