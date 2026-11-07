const https = require('https');

async function search() {
  const text = await new Promise(res => {
    https.get('https://ggcheckout.app/_next/static/chunks/3ghr5j1gyp1us.js', r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => res(b));
    });
  });

  let pos = 0;
  while ((pos = text.indexOf('checkoutTheme', pos)) !== -1) {
    console.log('--- Match at pos', pos, '---');
    console.log(text.substring(Math.max(0, pos - 150), Math.min(text.length, pos + 300)));
    pos += 13;
  }
}

search();
