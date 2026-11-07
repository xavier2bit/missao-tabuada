const puppeteer = require('puppeteer-core');

async function findChunk() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const chunks = [];
  page.on('response', async resp => {
    if (resp.url().includes('_next/static/chunks/')) {
      try {
        const text = await resp.text();
        if (text.includes('orderBump') || text.includes('order-bump') || text.includes('orderBumps')) {
          chunks.push({ url: resp.url(), length: text.length });
        }
      } catch (e) {}
    }
  });

  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });
  console.log('Matching chunks:', chunks);
  await browser.close();
}

findChunk().catch(console.error);
