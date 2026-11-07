const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function inspect() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0', timeout: 30000 });

  // Scroll down to make sure bumps are loaded and visible
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\puppeteer_checkout_scroll.png', fullPage: true });

  const info = await page.evaluate(() => {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const allDivs = Array.from(document.querySelectorAll('div, p, span, h1, h2, h3, h4'));
    
    // Find text containing "Kit Jogos" or "Guia Rápido" or "Missão Tabuada"
    const bumpElements = allDivs.filter(el => 
      (el.textContent && (el.textContent.includes('Kit Jogos') || el.textContent.includes('Guia Rápido'))) &&
      el.children.length === 0
    ).map(el => {
      const style = window.getComputedStyle(el);
      const parentStyle = window.getComputedStyle(el.parentElement);
      return {
        text: el.textContent.trim(),
        tagName: el.tagName,
        color: style.color,
        background: style.backgroundColor,
        parentBg: parentStyle.backgroundColor,
        fontSize: style.fontSize,
        className: el.className
      };
    });

    // Check containers
    const mainContainer = document.querySelector('main') || document.body;
    return {
      bodyBg,
      bumpElements,
      themeClass: document.documentElement.className,
      bodyClass: document.body.className
    };
  });

  console.log('Inspection info:', JSON.stringify(info, null, 2));
  await browser.close();
}

inspect().catch(console.error);
