module.exports = async (req, res) => {
  try {
    const response = await fetch('https://worker-bold-math-0d6b.sn-storage.workers.dev/?target=en&source=&te=2&text=привет&getraw=true');
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Произошла ошибка');
  }
};
