const https = require('https');

async function inspectOrderBumpComponent() {
  const text = await new Promise((res, rej) => {
    https.get('https://ggcheckout.app/_next/static/chunks/3vix5vehtusk7.js', r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => res(b));
      r.on('error', rej);
    });
  });

  const idx = text.indexOf('bgOrderbumpBorder');
  console.log('--- Code around bgOrderbumpBorder ---');
  console.log(text.substring(idx - 200, idx + 1000));
}

inspectOrderBumpComponent();
