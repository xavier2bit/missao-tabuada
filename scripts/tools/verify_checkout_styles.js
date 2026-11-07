const puppeteer = require('puppeteer-core');

async function verifyCheckoutStyles() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Test Dark mode emulation (the worst case before)
  const pageDark = await browser.newPage();
  await pageDark.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await pageDark.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await pageDark.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0', timeout: 30000 });
  await pageDark.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  await pageDark.screenshot({ path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\verify_checkout_dark.png' });

  const darkCheck = await pageDark.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Kit Jogos'));
    const sectionTitle = document.querySelector('h2, h3, h4, p');
    return {
      h3Found: !!h3,
      h3Text: h3 ? h3.textContent.trim() : null,
      h3StyleAttr: h3 ? h3.getAttribute('style') : null,
      h3ComputedColor: h3 ? window.getComputedStyle(h3).color : null,
      h3CardBg: h3 && h3.closest('.rounded-lg') ? window.getComputedStyle(h3.closest('.rounded-lg')).backgroundColor : null
    };
  });

  // Test Light mode emulation
  const pageLight = await browser.newPage();
  await pageLight.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await pageLight.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await pageLight.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0', timeout: 30000 });
  await pageLight.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  await pageLight.screenshot({ path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\verify_checkout_light.png' });

  const lightCheck = await pageLight.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Kit Jogos'));
    return {
      h3Found: !!h3,
      h3Text: h3 ? h3.textContent.trim() : null,
      h3StyleAttr: h3 ? h3.getAttribute('style') : null,
      h3ComputedColor: h3 ? window.getComputedStyle(h3).color : null,
      h3CardBg: h3 && h3.closest('.rounded-lg') ? window.getComputedStyle(h3.closest('.rounded-lg')).backgroundColor : null
    };
  });

  console.log('DARK CHECK:', JSON.stringify(darkCheck, null, 2));
  console.log('LIGHT CHECK:', JSON.stringify(lightCheck, null, 2));

  await browser.close();
}

verifyCheckoutStyles().catch(console.error);
