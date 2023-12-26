export default async function handleRequest(request) {
 const baseUrl = 'https://serveless-cors.vercel.app/api/lang'; // Замените на ваш домен
 const fullUrl = new URL(baseUrl + request.url);
 const target = fullUrl.searchParams.get('target');
 const source = fullUrl.searchParams.get('source');
 const textArray = fullUrl.searchParams.getAll('text');
 const getRaw = fullUrl.searchParams.get('getraw');
 const translator = fullUrl.searchParams.get('te');

  const generateSid = () => {
    var t, e, n = Date.now().toString(16)
    for (t = 0, e = 16 - n.length; t < e; t++) {
      n += Math.floor(16 * Math.random()).toString(16)
    }
    return n
  }

  const supportedLanguageList = ["af","sq","am","ar","hy","az","ba","eu","be","bn","bs","bg","my","ca","ceb","zh","cv","hr","cs","da","nl","sjn","emj","en","eo","et","fi","fr","gl","ka","de","el","gu","ht","he","mrj","hi","hu","is","id","ga","it","ja","jv","kn","kk","kazlat","km","ko","ky","lo","la","lv","lt","lb","mk","mg","ms","ml","mt","mi","mr","mhr","mn","ne","no","pap","fa","pl","pt","pt-BR","pa","ro","ru","gd","sr","si","sk","sl","es","su","sw","sv","tl","tg","ta","tt","te","th","tr","udm","uk","ur","uz","uzbcyr","vi","cy","xh","sah","yi","zu"]

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

async function translateWithMicrosoftTranslator(source, target, textArray) {
  const jwtResponse = await fetch('https://edge.microsoft.com/translate/auth', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.2272 YaBrowser/23.9.0.2272 Yowser/2.5 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'ru,en;q=0.9',
      'DNT': '1',
      'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "YaBrowser";v="23"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    }
  })
  const jwt = await jwtResponse.text()
  console.log('JWT:', jwt)
  const url = `https://api.cognitive.microsofttranslator.com/translate?from=${source}&to=${target}&api-version=3.0&includeSentenceLength=true`
  const body = JSON.stringify(textArray.map(text => ({ Text: text })))

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.2272 YaBrowser/23.9.0.2272 Yowser/2.5 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'ru,en;q=0.9',
      'DNT': '1',
      'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "YaBrowser";v="23"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      
    },
    body: body,
  })

  const content = await response.json()
  return content
}


