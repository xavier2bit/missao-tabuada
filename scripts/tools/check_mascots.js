const fs = require('fs');

async function checkImgs() {
  const Jimp = require('jimp');
  const dir = 'c:\\Users\\Admin\\Downloads\\Criativos\\tabuada-assets';
  const files = [
    'heroi-menino-transparente.png',
    'heroi-menina-voando.png',
    'logo-transparente.png',
    'monstro-transparente.png'
  ];

  for (const f of files) {
    const img = await Jimp.Jimp.read(`${dir}\\${f}`);
    console.log(`${f}: width=${img.bitmap.width}, height=${img.bitmap.height}`);
  }
}

checkImgs().catch(console.error);
