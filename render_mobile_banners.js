const puppeteer = require('puppeteer-core');
const path = require('path');

async function renderBanners() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Viewport 750x340 with deviceScaleFactor 2 for crisp retina rendering
  await page.setViewport({ width: 750, height: 340, deviceScaleFactor: 2 });

  // Banner 1
  const b1Path = 'file:///' + path.resolve('c:/Users/Admin/Downloads/Criativos/banner1_mobile.html').replace(/\\/g, '/');
  console.log('Loading Banner 1:', b1Path);
  await page.goto(b1Path, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: 'c:/Users/Admin/Downloads/Criativos/tabuada-assets/banner-checkout-missao-tabuada.png',
    clip: { x: 0, y: 0, width: 750, height: 340 }
  });
  console.log('Banner 1 rendered successfully!');

  // Banner 2
  const b2Path = 'file:///' + path.resolve('c:/Users/Admin/Downloads/Criativos/banner2_mobile.html').replace(/\\/g, '/');
  console.log('Loading Banner 2:', b2Path);
  await page.goto(b2Path, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: 'c:/Users/Admin/Downloads/Criativos/tabuada-assets/banner-checkout-liga-herois.png',
    clip: { x: 0, y: 0, width: 750, height: 340 }
  });
  console.log('Banner 2 rendered successfully!');

  await browser.close();
}

renderBanners().catch(console.error);
