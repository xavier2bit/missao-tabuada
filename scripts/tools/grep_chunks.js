const https = require('https');

const urls = [
  'https://ggcheckout.app/_next/static/chunks/2syzw37897tz1.js',
  'https://ggcheckout.app/_next/static/chunks/3ghr5j1gyp1us.js',
  'https://ggcheckout.app/_next/static/chunks/2894z25zobjr1.js',
  'https://ggcheckout.app/_next/static/chunks/3vix5vehtusk7.js',
  'https://ggcheckout.app/_next/static/chunks/1v7cat7fe6qjw.js'
];

async function check() {
  for (const url of urls) {
    const text = await new Promise(res => {
      https.get(url, r => {
        let b = '';
        r.on('data', c => b += c);
        r.on('end', () => res(b));
      });
    });

    if (text.includes('background-color:#ffffff') || text.includes('background-color') || text.includes('checkoutTheme') || text.includes('orderBump')) {
      const idx = text.indexOf('background-color:#ffffff');
      if (idx !== -1) {
        console.log(`FOUND in ${url}:`, text.substring(idx - 200, idx + 200));
      }
      const idxTheme = text.indexOf('checkoutTheme');
      if (idxTheme !== -1) {
        console.log(`checkoutTheme in ${url}:`, text.substring(idxTheme - 100, idxTheme + 200));
      }
    }
  }
}

check().catch(console.error);
