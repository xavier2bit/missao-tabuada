const https = require('https');

async function inspectO() {
  const text = await new Promise((res, rej) => {
    https.get('https://ggcheckout.app/_next/static/chunks/3vix5vehtusk7.js', r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => res(b));
      r.on('error', rej);
    });
  });

  const idx = text.indexOf('function eN(');
  const fnBody = text.substring(idx, idx + 4000);
  console.log(fnBody);
}

inspectO();
