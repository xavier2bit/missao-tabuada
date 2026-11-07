// generate_fichas_pdf.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const assets = require('./assets_base64.js');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Generate 20 daily activity cards (2 per page -> 10 pages)
const fichas = [
  {
    num: 1,
    title: 'Ficha Diária 01: O Início do Poder (Tabuadas do 1 e 2)',
    desc: 'Multiplique por 1 e descubra o dobro dos números! Resolva em ritmo constante.',
    color: '#0284C7',
    equations: [
      [1, 2], [2, 3], [1, 5], [2, 4], [1, 8], [2, 2],
      [1, 9], [2, 6], [1, 4], [2, 5], [1, 7], [2, 7],
      [2, 8], [1, 3], [2, 9], [1, 6], [2, 10], [1, 10]
    ]
  },
  {
    num: 2,
    title: 'Ficha Diária 02: O Pulo Triplo (Tabuada do 3)',
    desc: 'Avance de 3 em 3! Lembre-se que multiplicar é somar o mesmo número 3 vezes.',
    color: '#16A34A',
    equations: [
      [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
      [3, 7], [3, 8], [3, 9], [3, 10], [3, 4], [3, 7],
      [3, 2], [3, 6], [3, 8], [3, 3], [3, 5], [3, 9]
    ]
  },
  {
    num: 3,
    title: 'Ficha Diária 03: O Dobro do Dobro (Tabuada do 4)',
    desc: 'Técnica Ninja: Dobre o número uma vez, depois dobre o resultado novamente!',
    color: '#9333EA',
    equations: [
      [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
      [4, 7], [4, 8], [4, 9], [4, 10], [4, 3], [4, 6],
      [4, 2], [4, 8], [4, 5], [4, 7], [4, 4], [4, 9]
    ]
  },
  {
    num: 4,
    title: 'Ficha Diária 04: As Mãos e o Relógio (Tabuada do 5)',
    desc: 'Todos os resultados terminam em 0 ou 5! Como os minutos no relógio de parede.',
    color: '#E11D48',
    equations: [
      [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6],
      [5, 7], [5, 8], [5, 9], [5, 10], [5, 4], [5, 8],
      [5, 3], [5, 7], [5, 2], [5, 6], [5, 5], [5, 9]
    ]
  },
  {
    num: 5,
    title: 'Ficha Diária 05: Ficha Relâmpago (Revisão 1 ao 5)',
    desc: 'Desafio de sexta-feira! Mistura dinâmica das primeiras cinco tabuadas.',
    color: '#D97706',
    equations: [
      [2, 4], [3, 6], [4, 5], [5, 3], [2, 7], [3, 8],
      [4, 4], [5, 6], [2, 9], [3, 7], [4, 8], [5, 8],
      [2, 6], [3, 9], [4, 7], [5, 5], [4, 9], [5, 7]
    ]
  },
  {
    num: 6,
    title: 'Ficha Diária 06: A Ponte dos Titãs (Tabuada do 6)',
    desc: 'Multiplicar por 6 é calcular o dobro da tabuada do 3! Pratique com foco.',
    color: '#0D9488',
    equations: [
      [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
      [6, 7], [6, 8], [6, 9], [6, 10], [6, 4], [6, 7],
      [6, 3], [6, 8], [6, 5], [6, 6], [6, 2], [6, 9]
    ]
  },
  {
    num: 7,
    title: 'Ficha Diária 07: O Desafio Lendário (Tabuada do 7)',
    desc: 'O temido 7! Multiplique por 5 e adicione o dobro para encontrar a resposta.',
    color: '#D97706',
    equations: [
      [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6],
      [7, 7], [7, 8], [7, 9], [7, 10], [7, 3], [7, 6],
      [7, 4], [7, 8], [7, 2], [7, 7], [7, 5], [7, 9]
    ]
  },
  {
    num: 8,
    title: 'Ficha Diária 08: A Fortaleza Par (Tabuada do 8)',
    desc: 'Técnica do Triplo Dobro: o 8 dobra 3 vezes, ou é o dobro da tabuada do 4!',
    color: '#4F46E5',
    equations: [
      [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6],
      [8, 7], [8, 8], [8, 9], [8, 10], [8, 3], [8, 7],
      [8, 4], [8, 6], [8, 2], [8, 8], [8, 5], [8, 9]
    ]
  },
  {
    num: 9,
    title: 'Ficha Diária 09: O Mistério dos Dígitos (Tabuada do 9)',
    desc: 'A soma dos algarismos sempre dá 9! Observe e maravilhe-se com o padrão.',
    color: '#C026D3',
    equations: [
      [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6],
      [9, 7], [9, 8], [9, 9], [9, 10], [9, 4], [9, 7],
      [9, 3], [9, 8], [9, 2], [9, 6], [9, 5], [9, 9]
    ]
  },
  {
    num: 10,
    title: 'Ficha Diária 10: Ficha Relâmpago (Revisão 6 ao 9)',
    desc: 'Sexta-feira de consolidação! As tabuadas mais desafiadoras em ritmo veloz.',
    color: '#2563EB',
    equations: [
      [6, 6], [7, 7], [8, 8], [9, 9], [6, 7], [7, 8],
      [8, 9], [6, 8], [7, 9], [8, 6], [9, 7], [6, 9],
      [7, 6], [8, 7], [9, 6], [7, 4], [8, 5], [9, 8]
    ]
  },
  {
    num: 11,
    title: 'Ficha Diária 11: O Rei das Dezenas (Tabuada do 10)',
    desc: 'Basta acrescentar o zero no final! A tabuada mais rápida de resolver.',
    color: '#0284C7',
    equations: [
      [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6],
      [10, 7], [10, 8], [10, 9], [10, 10], [10, 4], [10, 7],
      [10, 2], [10, 8], [10, 3], [10, 6], [10, 5], [10, 9]
    ]
  },
  {
    num: 12,
    title: 'Ficha Diária 12: Duelo dos Pares (2, 4, 6 e 8)',
    desc: 'Apenas multiplicações envolvendo números pares. Encontre a simetria!',
    color: '#16A34A',
    equations: [
      [2, 8], [4, 6], [6, 4], [8, 2], [4, 8], [6, 6],
      [8, 4], [2, 9], [4, 7], [6, 8], [8, 6], [8, 8],
      [2, 6], [4, 4], [6, 7], [8, 7], [6, 9], [8, 9]
    ]
  },
  {
    num: 13,
    title: 'Ficha Diária 13: Duelo dos Ímpares (3, 5, 7 e 9)',
    desc: 'As contas com multiplicadores ímpares que exigem concentração de super-herói.',
    color: '#9333EA',
    equations: [
      [3, 3], [5, 5], [7, 7], [9, 9], [3, 7], [5, 7],
      [7, 3], [9, 3], [3, 9], [5, 9], [7, 9], [9, 7],
      [3, 5], [5, 3], [7, 5], [9, 5], [7, 8], [9, 6]
    ]
  },
  {
    num: 14,
    title: 'Ficha Diária 14: O Trio Mais Difícil (6, 7 e 8)',
    desc: 'Os cálculos que a maioria das pessoas erra! Domine o 6x7, 6x8 e 7x8.',
    color: '#EA580C',
    equations: [
      [6, 7], [7, 6], [6, 8], [8, 6], [7, 8], [8, 7],
      [6, 7], [7, 8], [8, 8], [7, 7], [6, 6], [8, 7],
      [6, 9], [7, 9], [8, 9], [7, 6], [8, 6], [7, 8]
    ]
  },
  {
    num: 15,
    title: 'Ficha Diária 15: Prova de Velocidade 1 (Circuito Alpha)',
    desc: 'Contas aleatórias do 1 ao 10! Acione o cronômetro e bata seu recorde.',
    color: '#E11D48',
    equations: [
      [3, 4], [5, 6], [7, 2], [8, 3], [9, 4], [6, 5],
      [4, 7], [2, 9], [8, 5], [7, 4], [6, 8], [9, 2],
      [5, 8], [3, 7], [4, 9], [8, 7], [7, 6], [9, 8]
    ]
  },
  {
    num: 16,
    title: 'Ficha Diária 16: Prova de Velocidade 2 (Circuito Beta)',
    desc: 'Outra rodada mista para acelerar a fluência mental sem hesitação.',
    color: '#0D9488',
    equations: [
      [4, 3], [6, 6], [8, 4], [7, 3], [9, 5], [5, 7],
      [3, 8], [9, 3], [6, 7], [8, 6], [7, 5], [4, 8],
      [2, 7], [5, 9], [8, 8], [9, 7], [6, 9], [7, 8]
    ]
  },
  {
    num: 17,
    title: 'Ficha Diária 17: O Ataque dos Quadrados Perfeitos',
    desc: 'Multiplique um número por ele mesmo (2x2, 3x3, 4x4... até 10x10)!',
    color: '#D97706',
    equations: [
      [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6],
      [7, 7], [8, 8], [9, 9], [10, 10], [6, 6], [7, 7],
      [8, 8], [9, 9], [4, 4], [5, 5], [7, 7], [8, 8]
    ]
  },
  {
    num: 18,
    title: 'Ficha Diária 18: Invasão Inversa (Propriedade Comutativa)',
    desc: 'A ordem dos fatores não altera o produto! 6x7 é igual a 7x6!',
    color: '#4F46E5',
    equations: [
      [3, 8], [8, 3], [4, 7], [7, 4], [5, 9], [9, 5],
      [6, 8], [8, 6], [7, 9], [9, 7], [6, 7], [7, 6],
      [8, 9], [9, 8], [4, 9], [9, 4], [7, 8], [8, 7]
    ]
  },
  {
    num: 19,
    title: 'Ficha Diária 19: Simulado da Batalha Épica',
    desc: 'Aqueça os motores para o teste final com 18 contas de alta densidade.',
    color: '#C026D3',
    equations: [
      [7, 7], [8, 9], [6, 8], [9, 6], [7, 8], [8, 7],
      [9, 9], [6, 7], [8, 8], [7, 9], [9, 8], [6, 9],
      [8, 4], [7, 5], [9, 4], [6, 6], [8, 5], [9, 7]
    ]
  },
  {
    num: 20,
    title: 'Ficha Diária 20: A Coroação dos Heróis (Maestria Total)',
    desc: 'A última ficha diária! Prove que você conquistou a maestria absoluta!',
    color: '#0284C7',
    equations: [
      [8, 7], [9, 8], [7, 9], [6, 7], [8, 8], [9, 9],
      [7, 6], [8, 9], [6, 8], [7, 8], [9, 7], [6, 9],
      [8, 6], [7, 7], [9, 6], [8, 7], [7, 8], [9, 9]
    ]
  }
];

function renderFichaCard(f) {
  const eqRows = f.equations.map(([a, b], idx) => `
    <div class="f-eq-row">
      <span class="f-num">${a}</span>
      <span class="f-op">×</span>
      <span class="f-num">${b}</span>
      <span class="f-eq">=</span>
      <div class="f-box"></div>
    </div>
  `).join('');

  return `
  <div class="ficha-card" style="border-color: ${f.color};">
    <div class="ficha-header" style="background: ${f.color};">
      <div class="fh-left">
        <span class="fh-badge">HERÓIS DA TABUADA</span>
        <h3 class="fh-title">${f.title}</h3>
      </div>
      <div class="fh-meta-box">
        <span>Data: ___/___</span>
        <span>Tempo: ___:___</span>
      </div>
    </div>

    <div class="ficha-body">
      <div class="ficha-desc">${f.desc}</div>
      <div class="ficha-grid">
        ${eqRows}
      </div>
    </div>

    <div class="ficha-footer">
      <div class="ff-score">
        <span>ACERTOS: <b>___ / 18</b></span>
        <span class="ff-stars">⭐ ESFORÇO: ( 1 ) ( 2 ) ( 3 ) ( 4 ) ( 5 )</span>
      </div>
      <div class="ff-sig">
        <span>Visto do Guardião: ______________________</span>
      </div>
    </div>
  </div>`;
}

function generateFichasHtml() {
  const pagesHtml = [];
  for (let i = 0; i < fichas.length; i += 2) {
    const f1 = fichas[i];
    const f2 = fichas[i + 1];
    const pageNum = i / 2 + 1;

    pagesHtml.push(`
    <div class="page page-fichas">
      <div class="top-meta-line">
        <div class="tml-left">
          <img src="${assets.logo}" class="tml-logo" alt="Logo" />
          <span>CADERNO DE ATIVIDADES & FICHAS DIÁRIAS • PÁGINA ${pageNum} DE 10</span>
        </div>
        <div class="tml-right">15 MINUTOS POR DIA</div>
      </div>

      <div class="fichas-pair-container">
        ${renderFichaCard(f1)}
        <div class="cut-line">
          <span>✂️ CORTE AQUI PARA DESTACAR A FICHA DIÁRIA ✂️</span>
        </div>
        ${renderFichaCard(f2)}
      </div>

      <div class="bottom-page-id">
        <span>Missão Tabuada • Volume 1 • Fichas Diárias de Treino</span>
        <strong>Página ${pageNum}</strong>
      </div>
    </div>`);
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Caderno de Atividades e Fichas Diárias - Missão Tabuada</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #64748B; color: #1E293B; }
    .page {
      width: 210mm; height: 297mm; min-height: 297mm; max-height: 297mm;
      background: #FFFFFF; position: relative; page-break-after: always; break-after: page;
      padding: 10mm 12mm 8mm 12mm; display: flex; flex-direction: column; overflow: hidden;
      margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    @media print { body { background: transparent; } .page { box-shadow: none; margin: 0; } }

    .top-meta-line { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px; }
    .tml-left { display: flex; align-items: center; gap: 8px; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; color: #64748B; }
    .tml-logo { height: 32px; object-fit: contain; }
    .tml-right { background: #E0F2FE; color: #0284C7; font-family: 'Fredoka', sans-serif; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 12px; }

    .fichas-pair-container { display: flex; flex-direction: column; justify-content: space-between; flex: 1; }
    .ficha-card { border: 2.5px solid #0284C7; border-radius: 10px; overflow: hidden; background: #FFFFFF; display: flex; flex-direction: column; box-shadow: 0 3px 8px rgba(0,0,0,0.06); height: 47%; }
    
    .ficha-header { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; color: #FFFFFF; }
    .fh-badge { font-family: 'Fredoka', sans-serif; font-size: 8.5px; font-weight: 800; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 4px; display: inline-block; margin-bottom: 1px; }
    .fh-title { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 800; }
    .fh-meta-box { background: rgba(0,0,0,0.15); border-radius: 6px; padding: 3px 8px; font-size: 9.5px; display: flex; gap: 10px; font-weight: 700; }

    .ficha-body { padding: 6px 10px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .ficha-desc { font-size: 9.5px; color: #64748B; margin-bottom: 4px; font-weight: 600; }
    .ficha-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; flex: 1; }

    .f-eq-row { display: flex; align-items: center; justify-content: space-between; padding: 3px 5px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 5px; }
    .f-num { font-family: 'Fredoka', sans-serif; font-size: 15px; font-weight: 800; color: #0F172A; }
    .f-op { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 800; color: #EA580C; }
    .f-eq { font-family: 'Fredoka', sans-serif; font-size: 14px; font-weight: 800; color: #64748B; }
    .f-box { width: 34px; height: 26px; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 4px; }

    .ficha-footer { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; background: #F1F5F9; border-top: 1px solid #E2E8F0; font-size: 9px; }
    .ff-score b { color: #0284C7; font-family: 'Fredoka', sans-serif; font-size: 10.5px; }
    .ff-stars { margin-left: 10px; color: #475569; font-weight: 700; }
    .ff-sig { color: #64748B; }

    .cut-line { display: flex; align-items: center; justify-content: center; position: relative; margin: 4px 0; }
    .cut-line::before { content: ''; position: absolute; left: 0; right: 0; border-top: 2px dashed #94A3B8; z-index: 1; }
    .cut-line span { position: relative; z-index: 2; background: #FFFFFF; padding: 0 10px; font-size: 8.5px; font-weight: 800; color: #64748B; letter-spacing: 0.5px; }

    .bottom-page-id { display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8; padding-top: 4px; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  ${pagesHtml.join('\n')}
</body>
</html>`;
}

async function run() {
  const html = generateFichasHtml();
  fs.writeFileSync('fichas.html', html);
  console.log('fichas.html written.');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
  const fileUrl = 'file:///' + path.resolve('fichas.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('Caderno_de_Atividades_Fichas_Diarias.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('Generated Caderno_de_Atividades_Fichas_Diarias.pdf! Size:', fs.statSync(pdfPath).size);
}
run();
