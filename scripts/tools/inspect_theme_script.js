const puppeteer = require('puppeteer-core');

async function inspectThemeScript() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });

  const result = await page.evaluate(() => {
    // Check if next-themes or something is reading a class or attribute
    const html = document.documentElement;
    const body = document.body;
    return {
      htmlClass: html.className,
      htmlStyle: html.getAttribute('style'),
      dataTheme: html.getAttribute('data-theme') || body.getAttribute('data-theme'),
      nextThemesScript: Array.from(document.querySelectorAll('script')).map(s => s.innerHTML).find(s => s.includes('theme') || s.includes('dark')),
    };
  });

  console.log('Theme inspection result:', JSON.stringify(result, null, 2));
  await browser.close();
}

inspectThemeScript().catch(console.error);
