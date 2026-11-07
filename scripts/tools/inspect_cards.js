const puppeteer = require('puppeteer-core');

async function inspectCards() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0', timeout: 30000 });

  const structure = await page.evaluate(() => {
    // Check localStorage or cookies or next-themes
    const themeStorage = localStorage.getItem('theme');
    
    // Find all cards or bump containers
    const h3s = Array.from(document.querySelectorAll('h3')).filter(h => h.textContent.includes('Kit Jogos'));
    if (!h3s.length) return { error: 'No bump h3 found' };
    
    let el = h3s[0];
    const path = [];
    while (el && el !== document.body) {
      const s = window.getComputedStyle(el);
      path.push({
        tag: el.tagName,
        className: el.className,
        bg: s.backgroundColor,
        color: s.color,
        border: s.border
      });
      el = el.parentElement;
    }
    return {
      themeStorage,
      htmlClasses: document.documentElement.className,
      path
    };
  });

  console.log('Structure:', JSON.stringify(structure, null, 2));
  await browser.close();
}

inspectCards().catch(console.error);
