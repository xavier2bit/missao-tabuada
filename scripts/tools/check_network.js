const puppeteer = require('puppeteer-core');

async function checkNetwork() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const requests = [];
  page.on('response', async resp => {
    const url = resp.url();
    if (url.includes('api') || url.includes('checkout') || url.includes('graphql')) {
      try {
        const text = await resp.text();
        requests.push({ url, status: resp.status(), length: text.length, preview: text.slice(0, 300) });
      } catch (e) {
        requests.push({ url, status: resp.status(), error: e.message });
      }
    }
  });

  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });
  console.log('Network API calls:', JSON.stringify(requests, null, 2));
  await browser.close();
}

checkNetwork().catch(console.error);
