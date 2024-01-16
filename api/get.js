module.exports = async (req, res) => {
   // Заголовки запроса и ответа
   let reqHeaders = req.headers,
       outBody, outStatus = 200,
       outStatusText = 'OK',
       outCt = null,
       outHeaders = {
           "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
           "Access-Control-Allow-Headers": reqHeaders['access-control-request-headers'] || "Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With, Token, x-access-token"
       };

   try {
       // Извлечение URL из запроса
       let targetUrl = req.query.url;
       if (!targetUrl) {
           throw new Error('URL parameter is missing');
       }

       // Проверка на недопустимые методы
       if (req.method === "OPTIONS" || !targetUrl.includes('.')) {
           outBody = 'Method not allowed';
           outStatus = 405;
           res.status(outStatus).send(outBody);
           return;
       }

       // Конфигурация fetch
       let fetchConfig = {
           method: req.method,
           headers: {}
       };

       // Копирование заголовков, исключая некоторые
       const excludedHeaders = ['host', 'referer', 'cf-connecting-ip', 'cf-ray', 'cf-visitor'];
       for (let key in reqHeaders) {
           if (!excludedHeaders.includes(key.toLowerCase())) {
               fetchConfig.headers[key] = reqHeaders[key];
           }
       }

       // Добавление тела запроса для соответствующих методов
       if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
           fetchConfig.body = req.body;
       }

       // Выполнение запроса
       let response = await fetch(targetUrl, fetchConfig);
       outCt = response.headers.get('content-type');
       outStatus = response.status;
       outStatusText = response.statusText;
       outBody = await response.text();

       // Копирование заголовков ответа
       for (let [key, value] of Object.entries(response.headers)) {
           if (!excludedHeaders.includes(key.toLowerCase())) {
               res.setHeader(key, value);
           }
       }
   } catch (err) {
       outCt = "application/json";
       outBody = JSON.stringify({
           error: err.message
       });
       outStatus = 500;
   }

   // Установка Content-Type
   if (outCt) {
       res.setHeader("content-type", outCt);
   }

   // Возврат ответа
   res.status(outStatus).send(outBody);
};
