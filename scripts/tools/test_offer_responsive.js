const puppeteer = require('puppeteer-core');
const path = require('path');

async function testOfferResponsiveness() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const offerUrl = 'file:///' + path.resolve('c:/Users/Admin/Downloads/Criativos/tabuada-offer.html').replace(/\\/g, '/');

  const widths = [360, 375, 390, 412];
  const results = {};

  for (const w of widths) {
    await page.setViewport({ width: w, height: 800 });
    await page.goto(offerUrl, { waitUntil: 'networkidle0' });

    const overflowInfo = await page.evaluate((vpWidth) => {
      const docWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      
      const overflowingElements = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > vpWidth + 1) { // 1px tolerance
          overflowingElements.push({
            tag: el.tagName,
            id: el.id,
            className: el.className ? String(el.className).slice(0, 50) : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      }

      return {
        vpWidth,
        docWidth,
        bodyWidth,
        hasHorizontalScroll: docWidth > vpWidth,
        overflowCount: overflowingElements.length,
        topOverflows: overflowingElements.slice(0, 5)
      };
    }, w);

    results[w] = overflowInfo;
  }

  console.log('Responsiveness test results:', JSON.stringify(results, null, 2));
  await browser.close();
}

testOfferResponsiveness().catch(console.error);
