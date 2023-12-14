module.exports = async (req, res) => {
  const request = req;
  const testUrl = 'https://sharemods.com/rw4fg79bnavw/1gbTest.html';

  async function handleRequest(request) {
    const clientIp = request.headers.get('cf-connecting-ip'); // Получаем IP клиента через Cloudflare

    try {
      const apiUrl = testUrl;
      console.log('API URL:', apiUrl);
      const fetchOptions = {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
          'X-Client-IP': clientIp,
          'X-Real-IP': request.headers.get('cf-connecting-ip'),
          'CF-Connecting-IP': request.headers.get('cf-connecting-ip'),
          'Fastly-Client-IP': request.headers.get('cf-connecting-ip'),
          'True-Client-IP': request.headers.get('cf-connecting-ip'),
          'X-Cluster-Client-IP': request.headers.get('cf-connecting-ip')
        },
      };

      let id, op;

      // Результаты первого запроса кешируются на 5 минут
      const cacheKey = `${apiUrl}`;
      let cachedResponse = await cache.match(cacheKey);
      console.log('Cached Response:', cachedResponse);
      if (cachedResponse) {
        const data = await cachedResponse.json();
        id = data.id;
        op = data.op;
      } else {
        const response1 = await fetch(apiUrl, fetchOptions);
        console.log('Response 1:', response1);
        const content1 = await response1.text();

        const idMatch = content1.match(/<input[^>]*name="id"[^>]*value="([^"]*)"/i);
        const opMatch = content1.match(/<input[^>]*name="op"[^>]*value="([^"]*)"/i);

        id = idMatch ? idMatch[1] : '';
        op = opMatch ? opMatch[1] : '';

        await cache.put(cacheKey, new Response(JSON.stringify({
          id,
          op
        }), {
          status: 200
        }), {
          expirationTtl: 300
        });
      }

      const newUrl = testUrl + '?id=' + id + '&op=' + op;
      console.log('New URL:', newUrl);

      const [response2, content2] = await Promise.all([
        fetch(newUrl, fetchOptions),
        fetch(newUrl, fetchOptions).then(res => res.text()),
      ]);

      const linkMatch = content2.match(/<a\s+href="([^"]+)"\s+id="downloadbtn"/i);
      const link = linkMatch ? linkMatch[1].replace(/^http:/, 'https:') : '';
      console.log('Link:', link);
      return Response.redirect(link, 302);
    } catch (error) {
      console.error('Error:', error);
      return new Response('Unable to process the request', {
        status: 500
      });
    }
  }
};
