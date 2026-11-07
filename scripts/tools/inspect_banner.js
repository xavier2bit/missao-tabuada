const puppeteer = require('puppeteer-core');

async function inspectBanner() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });

  const bannerInfo = await page.evaluate(() => {
    // Look for image with bannerUrl or top image
    const imgs = Array.from(document.querySelectorAll('img'));
    const bannerImg = imgs.find(img => img.src.includes('r2-proxy') || img.src.includes('banner') || img.parentElement.className.includes('banner'));
    if (!bannerImg) return { found: false, allImgs: imgs.map(i => ({ src: i.src, width: i.width, height: i.height })) };

    const style = window.getComputedStyle(bannerImg);
    const parentStyle = window.getComputedStyle(bannerImg.parentElement);
    return {
      found: true,
      src: bannerImg.src,
      width: bannerImg.offsetWidth,
      height: bannerImg.offsetHeight,
      naturalWidth: bannerImg.naturalWidth,
      naturalHeight: bannerImg.naturalHeight,
      className: bannerImg.className,
      parentClassName: bannerImg.parentElement.className,
      parentWidth: bannerImg.parentElement.offsetWidth,
      aspectRatio: bannerImg.naturalWidth / bannerImg.naturalHeight
    };
  });

  console.log('Banner Info on mobile (375px):', JSON.stringify(bannerInfo, null, 2));
  await browser.close();
}

inspectBanner().catch(console.error);
