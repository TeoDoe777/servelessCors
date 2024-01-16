module.exports = async (req, res) => {
  const {
      method
  } = req;
  const {
      url
  } = req.query;

  if (!["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].includes(method)) {
      const responseMessage = "";
      return res.status(405).send(responseMessage);
  }

  if (url === undefined) {
      const responseMessage = "Bad usage! /?url=<put the url here>\n";
      return res.status(400).send(responseMessage);
  }

  const response = await fetch(url, {
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 YaBrowser/23.11.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "ru,en;q=0.9"
      },
  });
  const responseBody = await response.text();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With, Token, x-access-token");
  res.setHeader("Content-Type", "text/html");

  return res.send(responseBody);
}
