// generate_jogos_pdf.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const assets = require('./assets_base64.js');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 28 Domino pieces
const dominoVals = [
  { val: 12, label: '12', eq: '3 × 4' },
  { val: 18, label: '18', eq: '3 × 6' },
  { val: 24, label: '24', eq: '4 × 6' },
  { val: 30, label: '30', eq: '5 × 6' },
  { val: 36, label: '36', eq: '6 × 6' },
  { val: 42, label: '42', eq: '6 × 7' },
  { val: 56, label: '56', eq: '7 × 8' }
];

const dominoStones = [];
for (let i = 0; i < dominoVals.length; i++) {
  for (let j = i; j < dominoVals.length; j++) {
    dominoStones.push({
      leftVal: dominoVals[i].label,
      leftEq: dominoVals[i].eq,
      rightVal: dominoVals[j].label,
      rightEq: dominoVals[j].eq
    });
  }
}

// 8 Bingo Cards (3x3 each)
const bingoNumbersPool = [6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 35, 36, 40, 42, 45, 48, 49, 54, 56, 63, 64, 72, 81, 90];

const bingoCards = [
  { id: 1, color: '#0284C7', title: 'Cartela do Herói Raio', nums: [12, 24, 36, 18, 42, 56, 15, 28, 48] },
  { id: 2, color: '#16A34A', title: 'Cartela da Guardiã Estrela', nums: [16, 20, 45, 21, 35, 63, 14, 32, 72] },
  { id: 3, color: '#9333EA', title: 'Cartela do Mago Cósmico', nums: [10, 27, 54, 18, 40, 64, 25, 36, 81] },
  { id: 4, color: '#E11D48', title: 'Cartela da Fênix de Fogo', nums: [8, 24, 49, 12, 30, 56, 28, 42, 90] },
  { id: 5, color: '#EA580C', title: 'Cartela do Tigre Dourado', nums: [15, 32, 48, 16, 25, 72, 18, 35, 64] },
  { id: 6, color: '#0D9488', title: 'Cartela do Dragão Marinho', nums: [14, 28, 42, 20, 36, 63, 24, 45, 81] },
  { id: 7, color: '#4F46E5', title: 'Cartela do Titã Blindado', nums: [12, 27, 56, 21, 40, 54, 30, 48, 72] },
  { id: 8, color: '#C026D3', title: 'Cartela do Campeão Galáctico', nums: [16, 30, 49, 18, 32, 64, 25, 42, 90] }
];

// Bingo caller tokens (36 tokens)
const bingoCallers = [
  { eq: '2 × 3', res: 6 }, { eq: '2 × 4', res: 8 }, { eq: '2 × 5', res: 10 }, { eq: '3 × 4', res: 12 },
  { eq: '2 × 7', res: 14 }, { eq: '3 × 5', res: 15 }, { eq: '4 × 4', res: 16 }, { eq: '3 × 6', res: 18 },
  { eq: '4 × 5', res: 20 }, { eq: '3 × 7', res: 21 }, { eq: '4 × 6', res: 24 }, { eq: '5 × 5', res: 25 },
  { eq: '3 × 9', res: 27 }, { eq: '4 × 7', res: 28 }, { eq: '5 × 6', res: 30 }, { eq: '4 × 8', res: 32 },
  { eq: '5 × 7', res: 35 }, { eq: '6 × 6', res: 36 }, { eq: '5 × 8', res: 40 }, { eq: '6 × 7', res: 42 },
  { eq: '5 × 9', res: 45 }, { eq: '6 × 8', res: 48 }, { eq: '7 × 7', res: 49 }, { eq: '6 × 9', res: 54 },
  { eq: '7 × 8', res: 56 }, { eq: '7 × 9', res: 63 }, { eq: '8 × 8', res: 64 }, { eq: '8 × 9', res: 72 },
  { eq: '9 × 9', res: 81 }, { eq: '9 × 10', res: 90 }, { eq: '2 × 6', res: 12 }, { eq: '2 × 8', res: 16 },
  { eq: '2 × 9', res: 18 }, { eq: '3 × 8', res: 24 }, { eq: '4 × 9', res: 36 }, { eq: '8 × 6', res: 48 }
];

function generateCoverHtml() {
  return `
  <div class="page page-cover">
    <div class="c-frame">
      <div class="c-top">
        <span class="c-badge">🎲 RECURSOS LÚDICOS DE APRENDIZAGEM</span>
        <h1 class="c-title">KIT SUPREMO DE<br><span class="c-hl">JOGOS DA TABUADA</span></h1>
        <p class="c-sub">Trilha dos Heróis, Dominó da Multiplicação e Bingo Maluco! Transforme o estudo da tabuada na noite de jogos mais empolgante da família.</p>
      </div>

      <div class="c-preview-games">
        <div class="game-box">
          <div class="gb-icon">🗺️</div>
          <h3>A Trilha dos Heróis</h3>
          <p>Tabuleiro com desafios, atalhos do Lápis Herói e armadilhas do Monstro Roxo.</p>
          <span class="gb-tag">2 a 4 Jogadores</span>
        </div>
        <div class="game-box">
          <div class="gb-icon">🀄</div>
          <h3>Dominó Matemático</h3>
          <p>28 pedras completas com operações e produtos para encaixar e competir.</p>
          <span class="gb-tag">2 a 4 Jogadores</span>
        </div>
        <div class="game-box">
          <div class="gb-icon">🎉</div>
          <h3>Bingo da Multiplicação</h3>
          <p>8 cartelas exclusivas + 36 fichas de sorteio para brincar com a turma toda.</p>
          <span class="gb-tag">Até 8 Jogadores</span>
        </div>
      </div>

      <div class="c-mascots-center">
        <img src="${assets.heroi_menino}" class="cm-char" alt="Herói" />
        <div class="cm-center-info">
          <img src="${assets.logo}" class="c-logo" alt="Logo" />
          <div class="cm-how-to">
            <strong>✂️ DICA DE PRODUÇÃO CASEIRA:</strong>
            <p>Imprima em papel cartão ou sulfite 90g/120g. Se desejar maior durabilidade, passe fita adesiva transparente ou papel contact antes de recortar as peças!</p>
          </div>
        </div>
        <img src="${assets.heroi_menina}" class="cm-char" alt="Heroína" />
      </div>

      <div class="c-footer">
        <span>Missão Tabuada • Volume 1 • Kit de Jogos Pedagógicos em Família</span>
        <strong>Pronto para Imprimir e Recortar</strong>
      </div>
    </div>
  </div>`;
}

function generateBoardHtml() {
  // 30 tiles trail
  const tiles = [
    { num: 1, type: 'start', text: 'LARGADA', sub: 'Inicie a Jornada!' },
    { num: 2, eq: '2 × 4', ans: '8' },
    { num: 3, eq: '3 × 3', ans: '9' },
    { num: 4, type: 'bonus', text: 'ATALHO!', sub: 'Avance 2 casas', color: '#16A34A' },
    { num: 5, eq: '4 × 3', ans: '12' },
    { num: 6, eq: '5 × 2', ans: '10' },
    { num: 7, eq: '3 × 5', ans: '15' },
    { num: 8, type: 'monster', text: 'MONSTRO!', sub: 'Volte 1 casa', color: '#9333EA' },
    { num: 9, eq: '4 × 4', ans: '16' },
    { num: 10, eq: '2 × 9', ans: '18' },
    { num: 11, eq: '5 × 4', ans: '20' },
    { num: 12, type: 'bonus', text: 'LÁPIS HERÓI', sub: 'Jogue Novamente!', color: '#F59E0B' },
    { num: 13, eq: '3 × 7', ans: '21' },
    { num: 14, eq: '4 × 6', ans: '24' },
    { num: 15, eq: '5 × 5', ans: '25' },
    { num: 16, eq: '3 × 9', ans: '27' },
    { num: 17, type: 'monster', text: 'ARMADILHA!', sub: 'Fique 1 rodada sem jogar', color: '#E11D48' },
    { num: 18, eq: '4 × 7', ans: '28' },
    { num: 19, eq: '5 × 6', ans: '30' },
    { num: 20, eq: '4 × 8', ans: '32' },
    { num: 21, eq: '6 × 6', ans: '36' },
    { num: 22, type: 'bonus', text: 'ESCUDO', sub: 'Avance 3 casas!', color: '#0284C7' },
    { num: 23, eq: '6 × 7', ans: '42' },
    { num: 24, eq: '7 × 7', ans: '49' },
    { num: 25, eq: '6 × 8', ans: '48' },
    { num: 26, eq: '7 × 8', ans: '56' },
    { num: 27, type: 'monster', text: 'CONFUSÃO!', sub: 'Volte para a casa 23', color: '#9333EA' },
    { num: 28, eq: '8 × 8', ans: '64' },
    { num: 29, eq: '8 × 9', ans: '72' },
    { num: 30, eq: '9 × 9', ans: '81' },
    { num: 31, eq: '10 × 10', ans: '100' },
    { num: 32, type: 'finish', text: 'CHEGADA!', sub: 'Herói Supremo da Tabuada!' }
  ];

  return `
  <div class="page page-board">
    <div class="board-top-bar">
      <div class="btb-left">
        <img src="${assets.logo}" class="btb-logo" alt="Logo" />
        <h2 class="btb-title">🗺️ O GRANDE TABULEIRO DA TRILHA DOS HERÓIS</h2>
      </div>
      <div class="btb-right">
        <span>Regra: Acerte a conta para ficar na casa! Se errar, recua 1.</span>
      </div>
    </div>

    <div class="board-grid">
      ${tiles.map(t => {
        if (t.type === 'start') {
          return `
          <div class="tile tile-start">
            <span class="t-badge">CASA 1</span>
            <strong>${t.text}</strong>
            <small>${t.sub}</small>
          </div>`;
        }
        if (t.type === 'finish') {
          return `
          <div class="tile tile-finish">
            <span class="t-badge">CASA 32</span>
            <strong>🏆 ${t.text}</strong>
            <small>${t.sub}</small>
          </div>`;
        }
        if (t.type === 'bonus') {
          return `
          <div class="tile tile-bonus" style="border-color: ${t.color}; background: #ECFDF5;">
            <span class="t-badge" style="background: ${t.color};">CASA ${t.num}</span>
            <strong style="color: ${t.color};">${t.text}</strong>
            <small>${t.sub}</small>
          </div>`;
        }
        if (t.type === 'monster') {
          return `
          <div class="tile tile-monster" style="border-color: ${t.color}; background: #FAF5FF;">
            <span class="t-badge" style="background: ${t.color};">CASA ${t.num}</span>
            <strong style="color: ${t.color};">${t.text}</strong>
            <small>${t.sub}</small>
          </div>`;
        }
        return `
        <div class="tile tile-normal">
          <div class="tn-head">
            <span class="t-num">${t.num}</span>
            <span class="t-ans">R: ${t.ans}</span>
          </div>
          <div class="t-eq">${t.eq}</div>
        </div>`;
      }).join('')}
    </div>

    <div class="board-footer-guide">
      <div class="bfg-rule"><strong>🎯 Como Jogar:</strong> Coloque os peões na LARGADA. Cada jogador rola o dado e avança as casas. Ao parar em uma casa de conta, o jogador deve falar a resposta em voz alta. Se acertar, continua na casa. Se errar, volta 1 casa! Quem alcançar a CHEGADA primeiro vence!</div>
      <div class="bottom-page-id">
        <span>Missão Tabuada • Volume 1 • Tabuleiro da Trilha</span>
        <strong>Página 2 de 8</strong>
      </div>
    </div>
  </div>`;
}

function generateTokensAndDiceHtml() {
  return `
  <div class="page page-tokens">
    <div class="tokens-top-bar">
      <div class="ttb-left">
        <img src="${assets.logo}" class="btb-logo" alt="Logo" />
        <h2 class="btb-title">🎲 PEÕES, MARCADORES & DADO MONTÁVEL</h2>
      </div>
      <div class="ttb-right">✂️ Recorte nas linhas pontilhadas</div>
    </div>

    <div class="tokens-layout">
      <!-- Left side: 3D Dice -->
      <div class="dice-section">
        <h3 class="ds-title">DADO DOS HERÓIS (MONTÁVEL)</h3>
        <p class="ds-desc">Recorte todo o contorno pontilhado, dobre as abas cinzas para dentro e cole com cola branca ou fita adesiva.</p>

        <div class="dice-net-wrapper">
          <!-- SVG Cube Net with Tabs -->
          <svg viewBox="0 0 320 400" class="dice-svg">
            <!-- Row 1: Face 1 -->
            <!-- Tab Top -->
            <polygon points="120,40 140,20 180,20 200,40" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
            <!-- Face 1 -->
            <rect x="120" y="40" width="80" height="80" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
            <circle cx="160" cy="80" r="8" fill="#EF4444" />
            
            <!-- Row 2: Face 2, Face 3, Face 4, Face 5 -->
            <!-- Tab Left -->
            <polygon points="40,120 20,140 20,180 40,200" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
            
            <!-- Face 2 (Left) -->
            <rect x="40" y="120" width="80" height="80" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
            <circle cx="60" cy="140" r="7" fill="#0F172A" />
            <circle cx="100" cy="180" r="7" fill="#0F172A" />
            <!-- Tab Top Face 2 -->
            <polygon points="40,120 60,105 100,105 120,120" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
            <!-- Tab Bot Face 2 -->
            <polygon points="40,200 60,215 100,215 120,200" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />

            <!-- Face 3 (Center) -->
            <rect x="120" y="120" width="80" height="80" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
            <circle cx="140" cy="140" r="7" fill="#0F172A" />
            <circle cx="160" cy="160" r="7" fill="#0F172A" />
            <circle cx="180" cy="180" r="7" fill="#0F172A" />

            <!-- Face 4 (Right 1) -->
            <rect x="200" y="120" width="80" height="80" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
            <circle cx="220" cy="140" r="7" fill="#0F172A" />
            <circle cx="260" cy="140" r="7" fill="#0F172A" />
            <circle cx="220" cy="180" r="7" fill="#0F172A" />
            <circle cx="260" cy="180" r="7" fill="#0F172A" />
            <!-- Tab Top Face 4 -->
            <polygon points="200,120 220,105 260,105 280,120" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
            <!-- Tab Bot Face 4 -->
            <polygon points="200,200 220,215 260,215 280,200" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />

            <!-- Row 3: Face 6 -->
            <rect x="120" y="200" width="80" height="80" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
            <circle cx="140" cy="220" r="7" fill="#0F172A" />
            <circle cx="180" cy="220" r="7" fill="#0F172A" />
            <circle cx="140" cy="240" r="7" fill="#0F172A" />
            <circle cx="180" cy="240" r="7" fill="#0F172A" />
            <circle cx="140" cy="260" r="7" fill="#0F172A" />
            <circle cx="180" cy="260" r="7" fill="#0F172A" />

            <!-- Row 4: Face 5 -->
            <rect x="120" y="280" width="80" height="80" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
            <circle cx="140" cy="300" r="7" fill="#0F172A" />
            <circle cx="180" cy="300" r="7" fill="#0F172A" />
            <circle cx="160" cy="320" r="7" fill="#0F172A" />
            <circle cx="140" cy="340" r="7" fill="#0F172A" />
            <circle cx="180" cy="340" r="7" fill="#0F172A" />
            <!-- Tab Bot Face 5 -->
            <polygon points="120,360 140,375 180,375 200,360" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
            <!-- Tab Left Face 5 -->
            <polygon points="120,280 105,300 105,340 120,360" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
            <!-- Tab Right Face 5 -->
            <polygon points="200,280 215,300 215,340 200,360" fill="#E2E8F0" stroke="#0F172A" stroke-width="1.5" stroke-dasharray="3,3" />
          </svg>
        </div>
      </div>

      <!-- Right side: 4 Standee Pawns -->
      <div class="pawns-section">
        <h3 class="ds-title">4 PEÕES DOS HERÓIS (COM BASE DOBRÁVEL)</h3>
        <p class="ds-desc">Recorte em volta, dobre a base para trás na linha pontilhada para o peão ficar em pé sobre o tabuleiro!</p>

        <div class="pawns-grid">
          <div class="pawn-card">
            <div class="pc-art">
              <img src="${assets.heroi_menino}" class="pc-img" alt="Herói" />
            </div>
            <div class="pc-name">HERÓI AZUL</div>
            <div class="pc-base">BASE (DOBRAR)</div>
          </div>

          <div class="pawn-card">
            <div class="pc-art">
              <img src="${assets.heroi_menina}" class="pc-img" alt="Heroína" />
            </div>
            <div class="pc-name">HEROÍNA ROSA</div>
            <div class="pc-base">BASE (DOBRAR)</div>
          </div>

          <div class="pawn-card">
            <div class="pc-art">
              <img src="${assets.lapis_trans}" class="pc-img" alt="Lápis" />
            </div>
            <div class="pc-name">LÁPIS HERÓI</div>
            <div class="pc-base">BASE (DOBRAR)</div>
          </div>

          <div class="pawn-card">
            <div class="pc-art">
              <img src="${assets.monstro_trans}" class="pc-img" alt="Monstro" />
            </div>
            <div class="pc-name">MONSTRO ROXO</div>
            <div class="pc-base">BASE (DOBRAR)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-page-id">
      <span>Missão Tabuada • Volume 1 • Dado e Peões Recortáveis</span>
      <strong>Página 3 de 8</strong>
    </div>
  </div>`;
}

function renderDominoStone(s, idx) {
  return `
  <div class="domino-stone">
    <div class="ds-half ds-left">
      <span class="ds-eq">${s.leftEq}</span>
      <strong class="ds-val">${s.leftVal}</strong>
    </div>
    <div class="ds-divider"></div>
    <div class="ds-half ds-right">
      <span class="ds-eq">${s.rightEq}</span>
      <strong class="ds-val">${s.rightVal}</strong>
    </div>
    <span class="ds-id">#${idx + 1}</span>
  </div>`;
}

function generateDominoPageHtml(startIndex, endIndex, pageNum) {
  const stones = dominoStones.slice(startIndex, endIndex);

  return `
  <div class="page page-domino">
    <div class="domino-top-bar">
      <div class="dtb-left">
        <img src="${assets.logo}" class="btb-logo" alt="Logo" />
        <h2 class="btb-title">🀄 DOMINÓ DA MULTIPLICAÇÃO (CARTELA ${pageNum - 3} DE 2)</h2>
      </div>
      <div class="dtb-right">✂️ Recorte nas bordas pontilhadas</div>
    </div>

    <div class="domino-intro-banner">
      <span>🎯 <b>Regra do Dominó:</b> Conecte o cálculo ao seu resultado correspondente! Ex: A ponta com <b>3 × 4</b> pode se conectar a qualquer pedra com valor <b>12</b>.</span>
    </div>

    <div class="domino-grid">
      ${stones.map((s, idx) => renderDominoStone(s, startIndex + idx)).join('')}
    </div>

    <div class="domino-footer-rule">
      <span>Instruções: Embaralhe com a face para baixo. Cada jogador pega 5 a 7 pedras. Quem tiver a pedra com dois cálculos iguais inicia o jogo!</span>
      <div class="bottom-page-id">
        <span>Missão Tabuada • Volume 1 • Dominó da Multiplicação</span>
        <strong>Página ${pageNum} de 8</strong>
      </div>
    </div>
  </div>`;
}

function renderBingoCard(c) {
  return `
  <div class="b-card" style="border-color: ${c.color};">
    <div class="bc-head" style="background: ${c.color};">
      <span class="bc-logo">🎯 BINGO TABUADA</span>
      <h3 class="bc-title">${c.title}</h3>
    </div>
    <div class="bc-grid">
      ${c.nums.map(n => `
        <div class="bc-cell">
          <span>${n}</span>
        </div>
      `).join('')}
    </div>
    <div class="bc-foot">
      <span>Marque com grãos de feijão, botões ou lápis!</span>
    </div>
  </div>`;
}

function generateBingoCardsPageHtml(cards, pageNum) {
  return `
  <div class="page page-bingo">
    <div class="bingo-top-bar">
      <div class="btb-left">
        <img src="${assets.logo}" class="btb-logo" alt="Logo" />
        <h2 class="btb-title">🎉 BINGO DA MULTIPLICAÇÃO • CARTELAS (${cards[0].id} A ${cards[cards.length - 1].id})</h2>
      </div>
      <div class="btb-right">✂️ Recorte para 4 jogadores</div>
    </div>

    <div class="bingo-grid-4">
      ${cards.map(renderBingoCard).join('')}
    </div>

    <div class="bottom-page-id">
      <span>Missão Tabuada • Volume 1 • Cartelas de Bingo</span>
      <strong>Página ${pageNum} de 8</strong>
    </div>
  </div>`;
}

function generateBingoCallerPageHtml() {
  return `
  <div class="page page-caller">
    <div class="caller-top-bar">
      <div class="btb-left">
        <img src="${assets.logo}" class="btb-logo" alt="Logo" />
        <h2 class="btb-title">📢 FICHAS DE SORTEIO DO BINGO DA TABUADA</h2>
      </div>
      <div class="btb-right">✂️ 36 Fichas Recortáveis</div>
    </div>

    <div class="caller-intro">
      <p><b>Como Sortear:</b> Recorte as 36 fichas abaixo e coloque-as dentro de um saquinho, copo ou tigela. O "Cantor do Bingo" sorteia uma ficha e lê apenas o cálculo em voz alta (ex: <i>"Atenção: 6 vezes 7!"</i>). As crianças calculam mentalmente; quem tiver o número correspondente (<b>42</b>) em sua cartela, marca um ponto!</p>
    </div>

    <div class="caller-grid">
      ${bingoCallers.map((c, i) => `
        <div class="c-token">
          <span class="ct-id">#${i + 1}</span>
          <strong class="ct-eq">${c.eq}</strong>
          <span class="ct-ans">Resultado: <b>${c.res}</b></span>
        </div>
      `).join('')}
    </div>

    <div class="caller-trophy-box">
      <img src="${assets.lapis_trans}" class="ctb-mascot" alt="Lápis" />
      <div class="ctb-text">
        <h4>🎉 DICA DE COMEMORAÇÃO DO BINGO:</h4>
        <p>Quem completar a primeira linha ou coluna grita: <b>"LINHA DOS HERÓIS!"</b>. Quem preencher a cartela inteira primeiro levanta e grita: <b>"BINGO DA TABUADA!"</b> e recebe a salva de palmas oficial da família!</p>
      </div>
    </div>

    <div class="bottom-page-id">
      <span>Missão Tabuada • Volume 1 • Fichas de Sorteio do Bingo</span>
      <strong>Página 8 de 8</strong>
    </div>
  </div>`;
}

function generateJogosHtml() {
  const pages = [
    generateCoverHtml(),
    generateBoardHtml(),
    generateTokensAndDiceHtml(),
    generateDominoPageHtml(0, 14, 4),
    generateDominoPageHtml(14, 28, 5),
    generateBingoCardsPageHtml(bingoCards.slice(0, 4), 6),
    generateBingoCardsPageHtml(bingoCards.slice(4, 8), 7),
    generateBingoCallerPageHtml()
  ];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Kit Supremo de Jogos de Tabuada - Missão Tabuada</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #1E293B; color: #0F172A; }

    .page {
      width: 210mm; height: 297mm; min-height: 297mm; max-height: 297mm;
      background: #FFFFFF; position: relative; page-break-after: always; break-after: page;
      padding: 10mm 12mm 8mm 12mm; display: flex; flex-direction: column; overflow: hidden;
      margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    @media print { body { background: transparent; } .page { box-shadow: none; margin: 0; } }

    /* COVER */
    .page-cover { padding: 8mm; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); }
    .c-frame { border: 4px solid #16A34A; border-radius: 16px; height: 100%; padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; background: #FFFFFF; }
    .c-top { text-align: center; }
    .c-badge { display: inline-block; background: #16A34A; color: #FFFFFF; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 8px; }
    .c-title { font-family: 'Fredoka', sans-serif; font-size: 32px; font-weight: 900; color: #0F172A; line-height: 1.15; }
    .c-hl { color: #16A34A; }
    .c-sub { font-size: 11.5px; color: #475569; max-width: 520px; margin: 8px auto 0 auto; line-height: 1.4; font-weight: 600; }

    .c-preview-games { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 10px 0; }
    .game-box { background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 12px 10px; text-align: center; }
    .gb-icon { font-size: 28px; margin-bottom: 4px; }
    .game-box h3 { font-family: 'Fredoka', sans-serif; font-size: 13.5px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
    .game-box p { font-size: 9.5px; color: #64748B; line-height: 1.3; margin-bottom: 8px; }
    .gb-tag { background: #E0F2FE; color: #0284C7; font-family: 'Fredoka', sans-serif; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 10px; }

    .c-mascots-center { display: flex; align-items: center; justify-content: space-around; margin: 6px 0; }
    .cm-char { width: 130px; height: 160px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.15)); }
    .cm-center-info { display: flex; flex-direction: column; align-items: center; max-width: 250px; text-align: center; }
    .c-logo { width: 150px; object-fit: contain; margin-bottom: 8px; }
    .cm-how-to { background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 8px; font-size: 9.5px; color: #78350F; line-height: 1.3; }
    .cm-how-to strong { font-family: 'Fredoka', sans-serif; font-size: 10.5px; color: #B45309; display: block; margin-bottom: 2px; }

    .c-footer { display: flex; justify-content: space-between; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 8px 14px; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 700; color: #475569; }

    /* BOARD */
    .page-board { display: flex; flex-direction: column; justify-content: space-between; }
    .board-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; }
    .btb-left { display: flex; align-items: center; gap: 8px; }
    .btb-logo { height: 32px; object-fit: contain; }
    .btb-title { font-family: 'Fredoka', sans-serif; font-size: 15px; font-weight: 900; color: #0F172A; }
    .btb-right { font-size: 9.5px; color: #64748B; font-weight: 700; }

    .board-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(8, 1fr);
      gap: 5px; flex: 1; margin: 6px 0;
    }
    .tile { border-radius: 8px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: space-between; border: 2px solid #CBD5E1; }
    .tile-normal { background: #FFFFFF; border-color: #E2E8F0; }
    .tn-head { display: flex; justify-content: space-between; align-items: center; }
    .t-num { font-family: 'Fredoka', sans-serif; font-size: 9px; font-weight: 800; color: #94A3B8; }
    .t-ans { font-size: 7.5px; color: #CBD5E1; }
    .t-eq { font-family: 'Fredoka', sans-serif; font-size: 15px; font-weight: 800; color: #0F172A; text-align: center; margin: 2px 0; }

    .tile-start { background: #22C55E; color: #FFFFFF; border-color: #16A34A; text-align: center; justify-content: center; }
    .tile-start strong { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 900; }
    .tile-finish { background: #F59E0B; color: #FFFFFF; border-color: #D97706; text-align: center; justify-content: center; }
    .tile-finish strong { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 900; }
    .tile-bonus, .tile-monster { text-align: center; justify-content: center; }
    .tile-bonus strong, .tile-monster strong { font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; }
    .tile small { font-size: 8px; line-height: 1.1; display: block; }
    .t-badge { font-family: 'Fredoka', sans-serif; font-size: 7.5px; font-weight: 800; color: #FFFFFF; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius: 4px; display: inline-block; align-self: center; margin-bottom: 2px; }

    .board-footer-guide { font-size: 9px; color: #475569; border-top: 1.5px solid #E2E8F0; padding-top: 4px; }
    .bfg-rule strong { color: #0284C7; }

    /* TOKENS & DICE */
    .tokens-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px; }
    .tokens-layout { display: flex; gap: 16px; flex: 1; }
    .dice-section { flex: 1.1; border: 2px dashed #94A3B8; border-radius: 12px; padding: 10px; background: #F8FAFC; display: flex; flex-direction: column; align-items: center; }
    .pawns-section { flex: 0.9; border: 2px dashed #94A3B8; border-radius: 12px; padding: 10px; background: #F8FAFC; display: flex; flex-direction: column; justify-content: space-between; }
    .ds-title { font-family: 'Fredoka', sans-serif; font-size: 12.5px; font-weight: 900; color: #0F172A; text-align: center; margin-bottom: 2px; }
    .ds-desc { font-size: 9px; color: #64748B; text-align: center; margin-bottom: 6px; line-height: 1.25; }
    .dice-net-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; }
    .dice-svg { width: 100%; max-height: 200mm; }

    .pawns-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; flex: 1; margin-top: 6px; }
    .pawn-card { border: 2px solid #CBD5E1; border-radius: 8px; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 6px; }
    .pc-art { flex: 1; display: flex; align-items: center; justify-content: center; }
    .pc-img { width: 65px; height: 95px; object-fit: contain; }
    .pc-name { font-family: 'Fredoka', sans-serif; font-size: 9.5px; font-weight: 800; color: #0F172A; margin: 4px 0 2px 0; }
    .pc-base { border-top: 2px dashed #94A3B8; width: 100%; text-align: center; font-size: 7.5px; font-weight: 800; color: #64748B; padding-top: 3px; background: #F1F5F9; border-radius: 0 0 6px 6px; }

    /* DOMINO */
    .domino-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; }
    .domino-intro-banner { background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 5px 10px; font-size: 9.5px; color: #78350F; margin: 6px 0; }
    .domino-grid { display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(7, 1fr); gap: 6px; flex: 1; }
    .domino-stone { border: 2px dashed #64748B; border-radius: 8px; background: #FFFFFF; display: flex; align-items: center; position: relative; padding: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .ds-half { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2px; }
    .ds-divider { width: 2px; height: 80%; background: #0F172A; }
    .ds-eq { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 800; color: #EA580C; }
    .ds-val { font-family: 'Fredoka', sans-serif; font-size: 17px; font-weight: 900; color: #0284C7; }
    .ds-id { position: absolute; top: 2px; right: 4px; font-size: 7px; color: #CBD5E1; }
    .domino-footer-rule { font-size: 9px; color: #475569; border-top: 1px solid #E2E8F0; padding-top: 4px; }

    /* BINGO */
    .bingo-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; }
    .bingo-grid-4 { display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10px; flex: 1; margin: 8px 0; }
    .b-card { border: 2.5px solid #0284C7; border-radius: 12px; background: #FFFFFF; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 3px 6px rgba(0,0,0,0.06); }
    .bc-head { padding: 6px 12px; color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; }
    .bc-logo { font-family: 'Fredoka', sans-serif; font-size: 8px; font-weight: 800; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 4px; }
    .bc-title { font-family: 'Fredoka', sans-serif; font-size: 12.5px; font-weight: 900; }
    .bc-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 4px; padding: 6px; flex: 1; }
    .bc-cell { background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'Fredoka', sans-serif; font-size: 22px; font-weight: 900; color: #0F172A; }
    .bc-foot { background: #F1F5F9; border-top: 1px solid #E2E8F0; padding: 3px 8px; font-size: 8px; text-align: center; color: #64748B; font-weight: 600; }

    /* CALLER */
    .caller-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; }
    .caller-intro { background: #EFF6FF; border: 1.5px solid #0284C7; border-radius: 8px; padding: 6px 10px; font-size: 9.5px; color: #0369A1; margin: 6px 0; line-height: 1.35; }
    .caller-grid { display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(6, 1fr); gap: 5px; flex: 1; }
    .c-token { border: 2px dashed #94A3B8; border-radius: 6px; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4px; position: relative; }
    .ct-id { position: absolute; top: 1px; left: 3px; font-size: 7px; color: #94A3B8; }
    .ct-eq { font-family: 'Fredoka', sans-serif; font-size: 14px; font-weight: 900; color: #0F172A; margin: 2px 0; }
    .ct-ans { font-size: 7.5px; color: #64748B; }
    .ct-ans b { color: #0284C7; font-family: 'Fredoka', sans-serif; font-size: 8.5px; }

    .caller-trophy-box { display: flex; align-items: center; gap: 12px; background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 10px; padding: 6px 12px; margin: 6px 0; }
    .ctb-mascot { width: 50px; height: 50px; object-fit: contain; }
    .ctb-text h4 { font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; color: #B45309; }
    .ctb-text p { font-size: 9px; color: #78350F; line-height: 1.25; }

    .bottom-page-id { display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8; padding-top: 4px; border-top: 1px solid #E2E8F0; width: 100%; }
  </style>
</head>
<body>
  ${pages.join('\n')}
</body>
</html>`;
}

async function run() {
  const html = generateJogosHtml();
  fs.writeFileSync('jogos.html', html);
  console.log('jogos.html written.');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
  const fileUrl = 'file:///' + path.resolve('jogos.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('Jogos_da_Tabuada_Trilha_Domino_Bingo.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('Generated Jogos_da_Tabuada_Trilha_Domino_Bingo.pdf! Size:', fs.statSync(pdfPath).size);
}

run();
