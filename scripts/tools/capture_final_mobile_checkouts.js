const puppeteer = require('puppeteer-core');

async function captureBoth() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const checkouts = [
    { name: 'checkout_1_mobile_375px', url: 'https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17' },
    { name: 'checkout_2_mobile_375px', url: 'https://ggcheckout.com/checkout/p8JH5jQwcxR0SLjkv7kiFN' }
  ];

  for (const c of checkouts) {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    console.log(`Loading ${c.name}...`);
    await page.goto(c.url, { waitUntil: 'networkidle0', timeout: 35000 });
    
    // Top view (header + banner + offer)
    await page.screenshot({
      path: `C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\${c.name}_top.png`
    });

    // Middle view (order bumps)
    await page.evaluate(() => window.scrollBy(0, 420));
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({
      path: `C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\${c.name}_bumps.png`
    });

    console.log(`Saved screenshots for ${c.name}`);
    await page.close();
  }

  await browser.close();
}

captureBoth().catch(console.error);
