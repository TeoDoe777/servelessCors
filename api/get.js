exports.handler = async function(event, context) {
 let reqHeaders = event.headers,
     outBody, outStatus = 200,
     outStatusText = 'OK',
     outCt = null,
     outHeaders = {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
         "Access-Control-Allow-Headers": reqHeaders['Access-Control-Allow-Headers'] || "Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With, Token, x-access-token"
     };

 try {
     let url = event.path.substr(8);
     url = decodeURIComponent(url.substr(url.indexOf('/') + 1));

     if (event.httpMethod == "OPTIONS" || url.length < 3 || url.indexOf('.') == -1 || url == "favicon.ico" || url == "robots.txt") {
         const invalid = !(event.httpMethod == "OPTIONS" || url.length === 0)
         outBody = JSON.stringify({
             code: invalid ? 400 : 0,
             usage: 'Host/{URL}',
             source: 'https://github.com/netnr/workers',
             note: 'Blocking a large number of requests, please deploy it yourself'
         });
         outCt = "application/json";
         outStatus = invalid ? 400 : 200;
     } else {
         url = fixUrl(url);

         let options = {
             hostname: url.split('/')[2],
             port: 443,
             path: '/' + url.split('/').slice(3).join('/'),
             method: event.httpMethod,
             headers: {}
         }

         const dropHeaders = ['content-length', 'content-type', 'host'];
         for (let key in reqHeaders) {
             const value = reqHeaders[key];
             if (!dropHeaders.includes(key)) {
               options.headers[key] = value;
             }
         }

         if (["POST", "PUT", "PATCH", "DELETE"].indexOf(event.httpMethod) >= 0) {
             const ct = (reqHeaders['content-type'] || "").toLowerCase();
             if (ct.includes('application/json')) {
               options.headers['Content-Length'] = Buffer.byteLength(event.body);
               options.headers['Content-Type'] = 'application/json';
               options.body = event.body;
             } else if (ct.includes('application/text') || ct.includes('text/html')) {
               options.headers['Content-Length'] = Buffer.byteLength(event.body);
               options.headers['Content-Type'] = 'text/plain';
               options.body = event.body;
             } else if (ct.includes('form')) {
               options.headers['Content-Length'] = Buffer.byteLength(event.body);
               options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
               options.body = event.body;
             } else {
               options.headers['Content-Length'] = Buffer.byteLength(event.body);
               options.headers['Content-Type'] = 'application/octet-stream';
               options.body = event.body;
             }
         }

         let fr = await new Promise((resolve, reject) => {
             const req = https.request(options, res => {
                let data = '';
                res.on('data', chunk => { data += chunk; });
                res.on('end', () => { resolve({ status: res.statusCode, headers: res.headers, body: data }); });
             });
             req.on('error', error => { reject(error); });
             if (options.body) req.write(options.body);
             req.end();
         });
         outCt = fr.headers['content-type'];
         outStatus = fr.status;
         outStatusText = fr.statusText;
         outBody = fr.body;
     }
 } catch (err) {
     outCt = "application/json";
     outBody = JSON.stringify({
         code: -1,
         msg: JSON.stringify(err.stack) || err
     });
     outStatus = 500;
 }

 if (outCt && outCt != "") {
     outHeaders["content-type"] = outCt;
 }

 let response = {
     statusCode: outStatus,
     statusDescription: outStatusText,
     headers: outHeaders,
     body: outBody
 }

 return response;
}

function fixUrl(url) {
 if (url.includes("://")) {
     return url;
 } else if (url.includes(':/')) {
     return url.replace(':/', '://');
 } else {
     return "http://" + url;
 }
}
