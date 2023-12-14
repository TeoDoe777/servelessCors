addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const target = url.searchParams.get('target')
  const source = url.searchParams.get('source')
  const textArray = url.searchParams.getAll('text')
  const getRaw = url.searchParams.get('getraw')
  const translator = url.searchParams.get('te')

  const generateSid = () => {
    var t, e, n = Date.now().toString(16)
    for (t = 0, e = 16 - n.length; t < e; t++) {
      n += Math.floor(16 * Math.random()).toString(16)
    }
    return n
  }


  let query = new URLSearchParams({
    translateMode: 'context',
    context_title: 'Twitter Monitor Translator',
    id: `${generateSid()}-0-0`,
    srv: 'yabrowser',
    lang: `${source || 'en'}-${target}`,
    format: 'html',
    options: 2
  })

  let translationUrl = 'https://browser.translate.yandex.net/api/v1/tr.json/translate?' + query.toString() + '&text=' + (textArray.map(text => encodeURIComponent(text)).join('&text='))

  if (translator === '2') {
    const content = await translateWithMicrosoftTranslator(source || '', target, textArray)
    const translations = content.map(item => item.translations[0].text).join('\n')
    return new Response(translations, {
      headers: { 'content-type': 'text/plain' },
    })
  } else {
    const response = await fetch(translationUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.2272 YaBrowser/23.9.0.2272 Yowser/2.5 Safari/537.36'
      }
    })
    const content = await response.json()

    // Удаление "align" из ответа
    delete content.align;

    if (getRaw === 'true') {
      const translations = content.text.join('\n');
      return new Response(translations, {
        headers: { 'content-type': 'text/plain' },
      })
    } else {
      return new Response(JSON.stringify(content), {
        headers: { 'content-type': 'application/json' },
      })
    }
  }
}
