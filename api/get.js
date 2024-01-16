module.exports = async (req, res) => {
   const {
       method
   } = req;
   const {
       url
   } = req.query;

   if (method !== "GET") {
       const responseMessage = "";
       return res.status(405).send(responseMessage);
   }

   if (url === undefined) {
       const responseMessage = "Bad usage! /?url=<put the url here>\n"
       return res.status(400).send(responseMessage);
   }

   const response = await fetch(url, {
       headers: {
           "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
           "Accept-Encoding": "gzip, deflate, br",
           "Accept-Language": "ru,en;q=0.9",
           "DNT": "1",
           "sec-ch-ua": '"Chromium";v="118", "YaBrowser";v="23.11", "Not=A?Brand";v="99", "Yowser";v="2.5"',
           "sec-ch-ua-mobile": "?0",
           "sec-ch-ua-platform": "Windows",
           "Sec-Fetch-Dest": "document",
           "Sec-Fetch-Mode": "navigate",
           "Sec-Fetch-Site": "none",
           "Sec-Fetch-User": "?1",
           "Upgrade-Insecure-Requests": "1",
           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 YaBrowser/23.11.0.0 Safari/537.36"
       },
   });
   const responseBody = await response.text();

   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "GET");
   res.setHeader("Access-Control-Allow-Headers", "*");
   res.setHeader("Content-Type", "text/html");

   return res.send(responseBody);
}
