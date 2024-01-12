const fetch = require('node-fetch');


module.exports = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const key = req.query.k || false;

  if (key !== false) {
   const response = await fetch('https://cdn.jsdelivr.net/gh/TeoDoe777/servelessCors/LaJson.json');
    const json = await response.json();

    if (!links[key]) {
      const keyWithoutSlash = key.replace(/\/$/, '');
      if (links[keyWithoutSlash]) {
        key = keyWithoutSlash;
      }
    }

    if (links[key]) {
      let link = links[key]['link'];
      const host = new URL(link).hostname;

      if (['sharemods.com', 'modsbase.com'].includes(host)) {
        link = await sharemodsLogic(link, ip);
      } else if (host === 'modsfire.com') {
        link = await modsfireLogic(link);
      } else if (host === 'simfileshare.net') {
        link = simfileshare(link, ip);
      }

      res.writeHead(302, { Location: link });
      return res.end();
    }
  }

  res.status(400).send('Key not found');
};

async function sharemodsLogic(decrypted_link, ip) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'X-Client-IP': ip,
    'X-Real-IP': ip,
    'CF-Connecting-IP': ip,
    'Fastly-Client-IP': ip,
    'True-Client-IP': ip,
    'X-Cluster-Client-IP': ip
  };

  const parsed_url = new URL(decrypted_link);
  const path_parts = parsed_url.pathname.split('/');
  const id = path_parts[1];

  decrypted_link += `?id=${encodeURIComponent(id)}&op=download2`;
  const url = `https://lastgames.vercel.app/api/cors?url=${encodeURIComponent(decrypted_link)}`;
  const response = await fetch(url, { headers });
  const responseBody = await response.text();
  const linkMatch = responseBody.match(/<a\s+href="([^"]+)"\s+id="downloadbtn"/i);

  return linkMatch[1];
}

async function modsfireLogic(decrypted_url) {
  const id = extractIdFromUrl(decrypted_url);
  const newUrl = `https://modsfire.com/d/${id}`;

  const response = await fetch(newUrl, {
    method: 'GET',
    headers: {
      'Referer': 'https://modsfire.com/'
    }
  });

  const result = await response.text();
  const matches = result.match(/url=(.*)/);
  const extractedUrl = matches[1];
  const cleanedUrl = extractedUrl.substring(0, extractedUrl.lastIndexOf('"'));

  const response2 = await fetch(cleanedUrl, {
    method: 'GET',
    headers: {
      'Referer': 'https://modsfire.com/'
    }
  });

  const headers = response2.headers;
  const location = headers.get('location') || cleanedUrl.match(/^Location:(.*)$/mi)[1].trim();

  return location;
}

function simfileshare(decrypted_link, ip) {
  const referer = decrypted_link.replace('/download/', '/filedetails/');
  const headers = {
    'Referer': referer
  };

  decrypted_link += "?dl";
  return decrypted_link;
}

function extractIdFromUrl(url) {
  const parts = new URL(url);
  const pathParts = parts.pathname.split('/');
  return pathParts[pathParts.length - 2];
}
