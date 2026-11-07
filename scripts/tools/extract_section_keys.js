const https = require('https');

async function extractSectionKeys() {
  const text = await new Promise((res, rej) => {
    https.get('https://ggcheckout.app/_next/static/chunks/3vix5vehtusk7.js', r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => res(b));
      r.on('error', rej);
    });
  });

  const matches = text.match(/checkout\??\.section\??\.[a-zA-Z0-9_\.]+/g);
  console.log('Section matches:', Array.from(new Set(matches)));

  const checkoutMatches = text.match(/checkout\??\.[a-zA-Z0-9_\.]+/g);
  console.log('Checkout matches:', Array.from(new Set(checkoutMatches)));
}

extractSectionKeys();
