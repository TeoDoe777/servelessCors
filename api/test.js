const fetch = require('node-fetch');

async function fetchJson(url) {
   const response = await fetch(url);
   if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
   } else {
       return await response.json();
   }
}

fetchJson('https://klondike-gate.vercel.app/api/dl?k=test1')
   .then(data => console.log(data))
   .catch(error => console.log('An error occurred: ', error));
