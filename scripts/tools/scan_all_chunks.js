const https = require('https');

async function searchAll() {
  const fs = require('fs');
  const appInfo = JSON.parse(fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\inspect_app.js', 'utf8') || '{}');
  // Or read scripts from inspect_app output
  const checkNetwork = JSON.parse(fs.readFileSync('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\aaa787a0-9a77-4904-8951-7a1fe3f50539\\scratch\\check_network.js', 'utf8') || '{}');
}

// Let's get the script URLs directly
const urls = [
  "https://ggcheckout.app/_next/static/chunks/1t4jc4rgps1-7.js",
  "https://ggcheckout.app/_next/static/chunks/16t_yc77fqx8e.js",
  "https://ggcheckout.app/_next/static/chunks/29p01ta7503zr.js",
  "https://ggcheckout.app/_next/static/chunks/3q-rie5qk8lm2.js",
  "https://ggcheckout.app/_next/static/chunks/0xbkmoz1jw1y-.js",
  "https://ggcheckout.app/_next/static/chunks/turbopack-18hpueb50ebbw.js",
  "https://ggcheckout.app/_next/static/chunks/1od5i4fxsxe53.js",
  "https://ggcheckout.app/_next/static/chunks/376igtvv_b4b9.js",
  "https://ggcheckout.app/_next/static/chunks/2hcq3hriuv32l.js",
  "https://ggcheckout.app/_next/static/chunks/0gip8j2nv8jb_.js",
  "https://ggcheckout.app/_next/static/chunks/0vtyb-9vuwb7e.js",
  "https://ggcheckout.app/_next/static/chunks/1khpolfyvcgy_.js",
  "https://ggcheckout.app/_next/static/chunks/2hype9vkutw0w.js",
  "https://ggcheckout.app/_next/static/chunks/40qe_z1ixbe_t.js",
  "https://ggcheckout.app/_next/static/chunks/34-3kpf0noaz0.js",
  "https://ggcheckout.app/_next/static/chunks/0ivhx747iep2n.js",
  "https://ggcheckout.app/_next/static/chunks/42rxfbmdsf1s-.js",
  "https://ggcheckout.app/_next/static/chunks/3o4ot19xtj8ct.js",
  "https://ggcheckout.app/_next/static/chunks/2p1dqestkpq1h.js",
  "https://ggcheckout.app/_next/static/chunks/3af0_92jo7l5b.js",
  "https://ggcheckout.app/_next/static/chunks/2lmgamvatiouk.js",
  "https://ggcheckout.app/_next/static/chunks/082vb6y-gbin7.js",
  "https://ggcheckout.app/_next/static/chunks/1fc75h0jk36er.js",
  "https://ggcheckout.app/_next/static/chunks/3za1fpgtx1mp7.js",
  "https://ggcheckout.app/_next/static/chunks/2syzw37897tz1.js",
  "https://ggcheckout.app/_next/static/chunks/25a80hqiun6-o.js",
  "https://ggcheckout.app/_next/static/chunks/0yn2zyzm-9iez.js",
  "https://ggcheckout.app/_next/static/chunks/1-cma_y1v0-ac.js",
  "https://ggcheckout.app/_next/static/chunks/12vrrsw3-6e-u.js",
  "https://ggcheckout.app/_next/static/chunks/2xa66jstwfpb_.js",
  "https://ggcheckout.app/_next/static/chunks/1v7cat7fe6qjw.js",
  "https://ggcheckout.app/_next/static/chunks/1nx-jtkm7_avt.js",
  "https://ggcheckout.app/_next/static/chunks/3b9-ifps9edke.js",
  "https://ggcheckout.app/_next/static/chunks/1t-kn6ja560rm.js",
  "https://ggcheckout.app/_next/static/chunks/3vix5vehtusk7.js",
  "https://ggcheckout.app/_next/static/chunks/3e1hednppr0i9.js",
  "https://ggcheckout.app/_next/static/chunks/206yb3gqkljoj.js",
  "https://ggcheckout.app/_next/static/chunks/3m8amqzmtmbqi.js",
  "https://ggcheckout.app/_next/static/chunks/2894z25zobjr1.js",
  "https://ggcheckout.app/_next/static/chunks/3ghr5j1gyp1us.js",
  "https://ggcheckout.app/_next/static/chunks/0cz1d0mv5g_q7.js",
  "https://ggcheckout.app/_next/static/chunks/109c5gz67r1t2.js"
];

async function scan() {
  for (const u of urls) {
    try {
      const text = await new Promise((res, rej) => {
        https.get(u, r => {
          let b = '';
          r.on('data', c => b += c);
          r.on('end', () => res(b));
          r.on('error', rej);
        });
      });
      if (text.includes('checkoutTheme') || text.includes('orderBumps') || text.includes('customColors')) {
        console.log('Match in:', u.split('/').pop());
        // find order bump color logic
        let idx = 0;
        while ((idx = text.indexOf('orderBumps', idx)) !== -1) {
          console.log('orderBumps snippet:', text.substring(Math.max(0, idx - 100), Math.min(text.length, idx + 200)));
          idx += 10;
        }
      }
    } catch (e) {}
  }
}

scan();
