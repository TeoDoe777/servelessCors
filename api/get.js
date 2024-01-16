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

   let body;
   const contentType = req.headers['content-type'];
   if (contentType && contentType.includes('application/json')) {
       body = JSON.stringify(await req.json());
   } else if (contentType && (contentType.includes('application/text') || contentType.includes('text/html'))) {
       body = await req.text();
   } else if (contentType && contentType.includes('form')) {
       body = await req.formData();
   } else {
       body = await req.blob();
   }

   const response = await fetch(url, {
       method: req.method,
       headers: {
           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 YaBrowser/23.11.0.0 Safari/537.36",
           "Content-Type": contentType
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
