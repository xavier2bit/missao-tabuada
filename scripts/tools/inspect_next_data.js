const puppeteer = require('puppeteer-core');

async function inspectNextData() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17', { waitUntil: 'networkidle0' });

  const data = await page.evaluate(() => {
    const nextDataEl = document.getElementById('__NEXT_DATA__');
    if (!nextDataEl) return null;
    return JSON.parse(nextDataEl.textContent);
  });

  console.log('NextData keys:', data ? Object.keys(data) : 'No next data');
  if (data && data.props) {
    console.log('Props keys:', Object.keys(data.props));
    console.log('PageProps:', JSON.stringify(data.props.pageProps, null, 2).slice(0, 3000));
  }

  await browser.close();
}

inspectNextData().catch(console.error);
