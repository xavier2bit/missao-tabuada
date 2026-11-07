const puppeteer = require('puppeteer-core');

async function fullMobileCapture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({
    path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\full_checkout_mobile_fixed.png',
    fullPage: true
  });
  console.log('Full mobile checkout screenshot saved!');
  await browser.close();
}

fullMobileCapture().catch(console.error);
