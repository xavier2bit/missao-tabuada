const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url + '?t=' + Date.now(), res => {
      resolve({ status: res.statusCode, length: res.headers['content-length'] });
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function wait() {
  const url1 = 'https://xavier2bit.github.io/missao-tabuada/tabuada-assets/banner-checkout-missao-tabuada.png';
  const url2 = 'https://xavier2bit.github.io/missao-tabuada/tabuada-assets/banner-checkout-liga-herois.png';

  for (let i = 0; i < 15; i++) {
    const res1 = await checkUrl(url1);
    const res2 = await checkUrl(url2);
    console.log(`Attempt ${i+1}: b1 length=${res1.length}, b2 length=${res2.length}`);
    if (res1.length > 900000 && res2.length > 900000) {
      console.log('GitHub Pages updated with new banners!');
      return;
    }
    await new Promise(r => setTimeout(r, 4000));
  }
}

wait();
