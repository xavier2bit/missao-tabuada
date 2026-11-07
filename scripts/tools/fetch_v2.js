const https = require('https');
const fs = require('fs');

https.get('https://ggcheckout.app/checkout/v2/DJ7r66JatfLqr0LXVPjm17', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\checkout_v2.html', body);
    console.log('Saved checkout_v2.html, size:', body.length);
  });
});
