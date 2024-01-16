module.exports = async (req, res) => {
  const { method } = req;
  const { url } = req.query;

  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const responseMessage = "";
      return res.status(405).send(responseMessage);
  }

  if (url === undefined) {
      const responseMessage = "Bad usage! /?url=<put the url here>\n";
      return res.status(400).send(responseMessage);
  }

  const body = req.body;

  const response = await fetch(url, {
      method: req.method,
      headers: {
          "User-Agent": "cors-get-proxy.sirjosh.workers.dev",
          "Content-Type": req.headers['content-type']
      },
      body: body
  });

  const responseBody = await response.text();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "text/plain");

  return res.send(responseBody);
}
