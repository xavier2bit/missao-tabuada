const puppeteer = require('puppeteer-core');

async function testThemes() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Test 1: Light mode emulation
  const pageLight = await browser.newPage();
  await pageLight.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await pageLight.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await pageLight.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });
  await pageLight.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  await pageLight.screenshot({ path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\theme_emulated_light.png' });

  const lightInfo = await pageLight.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Kit Jogos'));
    const card = h3 ? h3.closest('.rounded-lg') : null;
    return {
      htmlClass: document.documentElement.className,
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      h3Color: h3 ? window.getComputedStyle(h3).color : null,
      cardBg: card ? window.getComputedStyle(card).backgroundColor : null,
      cardBorder: card ? window.getComputedStyle(card).border : null
    };
  });

  // Test 2: Dark mode emulation
  const pageDark = await browser.newPage();
  await pageDark.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await pageDark.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await pageDark.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });
  await pageDark.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  await pageDark.screenshot({ path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\theme_emulated_dark.png' });

  const darkInfo = await pageDark.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Kit Jogos'));
    const card = h3 ? h3.closest('.rounded-lg') : null;
    return {
      htmlClass: document.documentElement.className,
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      h3Color: h3 ? window.getComputedStyle(h3).color : null,
      cardBg: card ? window.getComputedStyle(card).backgroundColor : null,
      cardBorder: card ? window.getComputedStyle(card).border : null
    };
  });

  console.log('LIGHT MODE:', JSON.stringify(lightInfo, null, 2));
  console.log('DARK MODE:', JSON.stringify(darkInfo, null, 2));

  await browser.close();
}

testThemes().catch(console.error);
