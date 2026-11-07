const puppeteer = require('puppeteer-core');

async function inspectCardStyles() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });

  const rules = await page.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Kit Jogos'));
    const bumpCard = h3.closest('.rounded-lg');
    
    // Find all CSS rules matching this card
    const matchedRules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && bumpCard.matches(rule.selectorText)) {
            matchedRules.push({
              selector: rule.selectorText,
              cssText: rule.cssText
            });
          }
        }
      } catch (e) {}
    }

    return {
      classes: bumpCard.className,
      styleAttr: bumpCard.getAttribute('style'),
      computedBg: window.getComputedStyle(bumpCard).backgroundColor,
      computedColor: window.getComputedStyle(bumpCard).color,
      matchedRules: matchedRules.slice(0, 10),
      rootCssVars: {
        background: window.getComputedStyle(document.documentElement).getPropertyValue('--background'),
        card: window.getComputedStyle(document.documentElement).getPropertyValue('--card'),
        cardForeground: window.getComputedStyle(document.documentElement).getPropertyValue('--card-foreground'),
      }
    };
  });

  console.log('BUMP CARD STYLES (DARK MODE):', JSON.stringify(rules, null, 2));
  await browser.close();
}

inspectCardStyles().catch(console.error);
