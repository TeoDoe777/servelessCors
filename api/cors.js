module.exports = async (req, res) => {
 const { method } = req;
 const { url } = req.query;

 if (method !== "GET") {
   const responseMessage = "";
   
   return res.status(405).send(responseMessage);
 }

 if (url === undefined) {
   const responseMessage =
     "Bad usage! /?url=<put the url here>\n" 
   return res.status(400).send(responseMessage);
 }

 const response = await fetch(url, {
   headers: {
     "User-Agent": "cors-get-proxy.sirjosh.workers.dev",
   },
 });
 const responseBody = await response.text();

 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Methods", "GET");
 res.setHeader("Access-Control-Allow-Headers", "*");
 res.setHeader("Content-Type", "text/plain");

 return res.send(responseBody);
}
