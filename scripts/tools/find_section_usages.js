const https = require('https');

async function findSectionUsages() {
  const text = await new Promise((res, rej) => {
    https.get('https://ggcheckout.app/_next/static/chunks/3vix5vehtusk7.js', r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => res(b));
      r.on('error', rej);
    });
  });

  let idx = 0;
  while ((idx = text.indexOf('checkout?.section', idx)) !== -1) {
    console.log('--- Section usage at', idx, '---');
    console.log(text.substring(Math.max(0, idx - 80), Math.min(text.length, idx + 250)));
    idx += 17;
  }
}

findSectionUsages();
