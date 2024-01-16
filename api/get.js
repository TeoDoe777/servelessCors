addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    // Заголовки запроса и ответа
    let reqHeaders = new Headers(request.headers),
        outBody, outStatus = 200, outStatusText = 'OK', outCt = null, outHeaders = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": reqHeaders.get('Access-Control-Request-Headers') || "Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With, Token, x-access-token"
        });

    try {
        // Извлечение URL из запроса
        let url = new URL(request.url);
        let targetUrl = url.searchParams.get('url');
        if (!targetUrl) {
            throw new Error('URL parameter is missing');
        }

        // Проверка на недопустимые методы
        if (request.method === "OPTIONS" || !targetUrl.includes('.')) {
            outBody = 'Method not allowed';
            outStatus = 405;
            return new Response(outBody, { status: outStatus, headers: outHeaders });
        }

        // Конфигурация fetch
        let fetchConfig = {
            method: request.method,
            headers: {}
        };

        // Копирование заголовков, исключая некоторые
        const excludedHeaders = ['host', 'referer', 'cf-connecting-ip', 'cf-ray', 'cf-visitor'];
        for (let [key, value] of reqHeaders) {
            if (!excludedHeaders.includes(key.toLowerCase())) {
                fetchConfig.headers[key] = value;
            }
        }

        // Добавление тела запроса для соответствующих методов
        if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
            fetchConfig.body = await request.text();
        }

        // Выполнение запроса
        let response = await fetch(targetUrl, fetchConfig);
        outCt = response.headers.get('content-type');
        outStatus = response.status;
        outStatusText = response.statusText;
        outBody = response.body;

        // Копирование заголовков ответа
        for (let [key, value] of response.headers) {
            if (!excludedHeaders.includes(key.toLowerCase())) {
                outHeaders.append(key, value);
            }
        }
    } catch (err) {
        outCt = "application/json";
        outBody = JSON.stringify({ error: err.message });
        outStatus = 500;
    }

    // Установка Content-Type
    if (outCt) {
        outHeaders.set("content-type", outCt);
    }

    // Возврат ответа
    return new Response(outBody, {
        status: outStatus,
        statusText: outStatusText,
        headers: outHeaders
    });
}
