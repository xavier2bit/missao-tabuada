const puppeteer = require('puppeteer-core');

async function inspectApp() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });

  const appInfo = await page.evaluate(() => {
    return {
      title: document.title,
      htmlAttributes: Array.from(document.documentElement.attributes).map(a => `${a.name}="${a.value}"`),
      bodyAttributes: Array.from(document.body.attributes).map(a => `${a.name}="${a.value}"`),
      scripts: Array.from(document.scripts).map(s => s.src).filter(Boolean),
    };
  });

  console.log('App Info:', JSON.stringify(appInfo, null, 2));
  await browser.close();
}

inspectApp().catch(console.error);
