// generate_desafios_pdf.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const assets = require('./assets_base64.js');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const desafios = [
  {
    week: 1,
    title: 'Desafio Semanal 01 • Tabuadas do 1 e 2',
    meta: 'Foco: Identidade da multiplicação e conceito de dobro.',
    color: '#0284C7',
    equations: [
      [1, 7], [2, 3], [1, 9], [2, 5], [1, 4], [2, 8],
      [1, 6], [2, 4], [1, 8], [2, 7], [1, 10], [2, 9],
      [2, 6], [2, 2], [1, 5], [2, 10]
    ]
  },
  {
    week: 2,
    title: 'Desafio Semanal 02 • Tabuada do 3',
    meta: 'Foco: Contagem tripla e padrões ímpares.',
    color: '#16A34A',
    equations: [
      [3, 2], [3, 5], [3, 7], [3, 3], [3, 8], [3, 4],
      [3, 9], [3, 6], [3, 10], [3, 1], [3, 8], [3, 5],
      [3, 7], [3, 9], [3, 6], [3, 4]
    ]
  },
  {
    week: 3,
    title: 'Desafio Semanal 03 • Tabuada do 4',
    meta: 'Foco: O dobro do dobro e agilidade nos pares.',
    color: '#9333EA',
    equations: [
      [4, 2], [4, 4], [4, 6], [4, 3], [4, 8], [4, 5],
      [4, 7], [4, 9], [4, 10], [4, 1], [4, 6], [4, 8],
      [4, 7], [4, 9], [4, 4], [4, 5]
    ]
  },
  {
    week: 4,
    title: 'Desafio Semanal 04 • Tabuada do 5 e Revisão (1 ao 5)',
    meta: 'Foco: Terminação em 0 e 5, além da consolidação da Fase Ouro.',
    color: '#E11D48',
    equations: [
      [5, 3], [5, 6], [5, 8], [5, 4], [5, 7], [5, 9],
      [2, 8], [3, 7], [4, 6], [5, 5], [3, 9], [4, 8],
      [2, 9], [3, 6], [4, 7], [5, 10]
    ]
  },
  {
    week: 5,
    title: 'Desafio Semanal 05 • Tabuada do 6',
    meta: 'Foco: Transição para os números avançados (o dobro do 3).',
    color: '#0D9488',
    equations: [
      [6, 2], [6, 4], [6, 6], [6, 3], [6, 7], [6, 5],
      [6, 8], [6, 9], [6, 10], [6, 1], [6, 7], [6, 8],
      [6, 6], [6, 9], [6, 4], [6, 5]
    ]
  },
  {
    week: 6,
    title: 'Desafio Semanal 06 • Tabuada do 7',
    meta: 'Foco: Domínio do número lendário e fixação dos cálculos primos.',
    color: '#D97706',
    equations: [
      [7, 2], [7, 4], [7, 6], [7, 3], [7, 7], [7, 5],
      [7, 8], [7, 9], [7, 10], [7, 1], [7, 6], [7, 8],
      [7, 7], [7, 9], [7, 4], [7, 5]
    ]
  },
  {
    week: 7,
    title: 'Desafio Semanal 07 • Tabuada do 8',
    meta: 'Foco: O triplo dobro e as combinações com 6 e 7.',
    color: '#4F46E5',
    equations: [
      [8, 2], [8, 4], [8, 6], [8, 3], [8, 7], [8, 5],
      [8, 8], [8, 9], [8, 10], [8, 1], [8, 6], [8, 7],
      [8, 8], [8, 9], [8, 4], [8, 5]
    ]
  },
  {
    week: 8,
    title: 'Desafio Semanal 08 • Tabuada do 9',
    meta: 'Foco: O mistério da soma dos algarismos (regra do 9).',
    color: '#C026D3',
    equations: [
      [9, 2], [9, 4], [9, 6], [9, 3], [9, 7], [9, 5],
      [9, 8], [9, 9], [9, 10], [9, 1], [9, 6], [9, 7],
      [9, 8], [9, 9], [9, 4], [9, 5]
    ]
  },
  {
    week: 9,
    title: 'Desafio Semanal 09 • Tabuada do 10 e Revisão (6 ao 10)',
    meta: 'Foco: A regra do zero e consolidação da Fase Diamante.',
    color: '#0284C7',
    equations: [
      [10, 4], [10, 7], [10, 9], [6, 7], [7, 8], [8, 9],
      [6, 8], [7, 7], [8, 8], [9, 9], [6, 9], [7, 9],
      [8, 6], [9, 7], [8, 7], [10, 10]
    ]
  },
  {
    week: 10,
    title: 'Desafio Semanal 10 • O Grande Mix de Consolidação',
    meta: 'Foco: Mistura aleatória dos multiplicadores do 1 ao 10.',
    color: '#16A34A',
    equations: [
      [3, 8], [4, 7], [5, 9], [6, 6], [7, 4], [8, 5],
      [9, 3], [6, 8], [7, 6], [8, 7], [9, 6], [7, 9],
      [8, 8], [9, 8], [6, 7], [7, 8]
    ]
  },
  {
    week: 11,
    title: 'Desafio Semanal 11 • Quadrados & Propriedade Comutativa',
    meta: 'Foco: Velocidade nas contas espelhadas e números idênticos.',
    color: '#9333EA',
    equations: [
      [6, 6], [7, 7], [8, 8], [9, 9], [6, 8], [8, 6],
      [7, 9], [9, 7], [6, 7], [7, 6], [7, 8], [8, 7],
      [8, 9], [9, 8], [5, 5], [10, 10]
    ]
  },
  {
    week: 12,
    title: 'Desafio Semanal 12 • A Prova Suprema da Maestria',
    meta: 'Foco: Prova final do curso com foco em fluência e 100% de acerto.',
    color: '#E11D48',
    equations: [
      [7, 8], [8, 7], [6, 9], [9, 6], [7, 7], [8, 8],
      [9, 9], [6, 7], [7, 6], [8, 9], [9, 8], [6, 8],
      [8, 6], [7, 9], [9, 7], [10, 9]
    ]
  }
];

function renderDesafioCard(d) {
  const eqRows = d.equations.map(([a, b]) => `
    <div class="d-eq-card">
      <span class="d-num">${a}</span>
      <span class="d-op">×</span>
      <span class="d-num">${b}</span>
      <span class="d-eq">=</span>
      <div class="d-box"></div>
    </div>
  `).join('');

  return `
  <div class="desafio-box" style="border-color: ${d.color};">
    <div class="d-head" style="background: ${d.color};">
      <div class="dh-left">
        <span class="dh-badge">SEMANA ${d.week}</span>
        <h3 class="dh-title">${d.title}</h3>
        <p class="dh-meta">${d.meta}</p>
      </div>
      <div class="dh-timer-box">
        <div class="dtb-field"><span>Início:</span> ___:___</div>
        <div class="dtb-field"><span>Fim:</span> ___:___</div>
        <div class="dtb-field"><span>Total:</span> ___:___</div>
      </div>
    </div>

    <div class="d-body">
      <div class="d-grid">
        ${eqRows}
      </div>
    </div>

    <div class="d-foot">
      <div class="df-score">
        <span>ACERTOS: <b>___ / 16</b></span>
        <div class="df-rubric">
          <span>( ) 15-16: Mestre Supremo 🏆</span>
          <span>( ) 13-14: Herói Forte ⭐</span>
          <span>( ) &lt;13: Treinar Mais 💪</span>
        </div>
      </div>
      <div class="df-sig">
        <span>Visto do Guardião: __________________________</span>
      </div>
    </div>
  </div>`;
}

function generateDesafiosHtml() {
  const pagesHtml = [];

  // Page 1: Cover
  pagesHtml.push(`
  <div class="page page-cover">
    <div class="cover-frame">
      <div class="c-top">
        <span class="c-tag">📊 ACOMPANHAMENTO PEDAGÓGICO DE 12 SEMANAS</span>
        <h1 class="c-title">CADERNO DE DESAFIOS<br><span class="c-hl">SEMANAIS DE TABUADA</span></h1>
        <p class="c-sub">O instrumento prático do Guardião para acompanhar a evolução real da memorização, celebrar pequenas vitórias e diagnosticar pontos de apoio sem gerar ansiedade na criança.</p>
      </div>

      <div class="c-mascots">
        <img src="${assets.heroi_menina}" class="cm-img" alt="Heroína" />
        <div class="c-center-box">
          <img src="${assets.logo}" class="c-logo" alt="Logo" />
          <div class="c-pillars">
            <div class="cp-pill">⏱️ Apenas 5 Minutos por Semana</div>
            <div class="cp-pill">🎯 16 Contas por Desafio</div>
            <div class="cp-pill">📈 Gráfico de Progresso Visível</div>
          </div>
        </div>
        <img src="${assets.heroi_menino}" class="cm-img" alt="Herói" />
      </div>

      <div class="c-guide-box">
        <h3>🛡️ COMO APLICAR OS DESAFIOS SEMANAIS:</h3>
        <div class="cgb-grid">
          <div class="cgb-card">
            <strong>1. Momento Certo</strong>
            <p>Aplique toda sexta-feira ou sábado pela manhã, quando a criança estiver descansada.</p>
          </div>
          <div class="cgb-card">
            <strong>2. Cronômetro Lúdico</strong>
            <p>Apresente o relógio como uma brincadeira de corrida contra o próprio tempo anterior.</p>
          </div>
          <div class="cgb-card">
            <strong>3. Feedback Positivo</strong>
            <p>Elogie o esforço e a dedicação antes de apontar os eventuais acertos ou erros.</p>
          </div>
        </div>
      </div>

      <div class="c-footer">
        <div><strong>Aluno(a) Herói:</strong> ________________________________________________</div>
        <div><strong>Data de Início:</strong> ___/___/______</div>
      </div>
    </div>
  </div>`);

  // Pages 2 to 7: 12 Desafios (2 per page)
  for (let i = 0; i < desafios.length; i += 2) {
    const d1 = desafios[i];
    const d2 = desafios[i + 1];
    const pageNum = i / 2 + 2;

    pagesHtml.push(`
    <div class="page page-test">
      <div class="test-top-bar">
        <div class="ttb-left">
          <img src="${assets.logo}" class="ttb-logo" alt="Logo" />
          <span>DESAFIOS SEMANAIS DE ACOMPANHAMENTO • PÁGINA ${pageNum} DE 8</span>
        </div>
        <div class="ttb-right">SISTEMA DE PROGRESSÃO CONTÍNUA</div>
      </div>

      <div class="test-pair-container">
        ${renderDesafioCard(d1)}
        <div class="test-divider">
          <span>⚔️ REGISTRO DE PROGRESSO SEMANAL ⚔️</span>
        </div>
        ${renderDesafioCard(d2)}
      </div>

      <div class="bottom-page-id">
        <span>Missão Tabuada • Volume 1 • Desafios Semanais</span>
        <strong>Página ${pageNum} de 8</strong>
      </div>
    </div>`);
  }

  // Page 8: Gabarito Oficial & Tabela de Diagnóstico
  pagesHtml.push(`
  <div class="page page-gabarito">
    <div class="gab-frame">
      <div class="gab-header">
        <img src="${assets.logo}" class="gab-logo" alt="Logo" />
        <h2>🔍 GABARITO OFICIAL DOS 12 DESAFIOS SEMANAIS</h2>
        <p>Consulte aqui rapidamente todas as respostas corretas de cada desafio semanal.</p>
      </div>

      <div class="gab-grid">
        ${desafios.map(d => `
          <div class="gab-box">
            <h4 style="color: ${d.color};">Semana ${d.week}</h4>
            <div class="gab-answers">
              ${d.equations.map(([a, b]) => `<span>${a}×${b}=<b>${a * b}</b></span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="diagnostic-box">
        <h3>🧭 GUIA DE INTERVENÇÃO RÁPIDA PARA OS PAIS:</h3>
        <div class="diag-grid">
          <div class="diag-item">
            <strong>Se a criança erra na Tabuada do 6:</strong>
            <p>Revise a tabuada do 3 e mostre que todo resultado do 6 é exatamente o dobro da resposta do 3 (ex: 3×4=12, logo 6×4=24).</p>
          </div>
          <div class="diag-item">
            <strong>Se a criança erra no 7×8 ou 6×7:</strong>
            <p>Use a rima mnemônica: "5, 6, 7, 8... 56 é 7 vezes 8!" e "6 vezes 7 dá quarenta e dois no foguete!".</p>
          </div>
          <div class="diag-item">
            <strong>Se a criança hesita na Tabuada do 9:</strong>
            <p>Mostre o truque da soma 9: 9×2=18 (1+8=9), 9×3=27 (2+7=9), 9×6=54 (5+4=9), ou a técnica dos dedos abaixados.</p>
          </div>
        </div>
      </div>

      <div class="bottom-page-id">
        <span>Missão Tabuada • Volume 1 • Gabarito dos Desafios Semanais</span>
        <strong>Página 8 de 8</strong>
      </div>
    </div>
  </div>`);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Desafios Semanais de Acompanhamento - Missão Tabuada</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #334155; color: #1E293B; }

    .page {
      width: 210mm; height: 297mm; min-height: 297mm; max-height: 297mm;
      background: #FFFFFF; position: relative; page-break-after: always; break-after: page;
      padding: 10mm 12mm 8mm 12mm; display: flex; flex-direction: column; overflow: hidden;
      margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    @media print { body { background: transparent; } .page { box-shadow: none; margin: 0; } }

    /* COVER */
    .page-cover { padding: 8mm; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); }
    .cover-frame { border: 4px solid #0284C7; border-radius: 16px; height: 100%; padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; background: #FFFFFF; }
    .c-top { text-align: center; }
    .c-tag { display: inline-block; background: #0284C7; color: #FFFFFF; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 8px; }
    .c-title { font-family: 'Fredoka', sans-serif; font-size: 32px; font-weight: 900; color: #0F172A; line-height: 1.15; }
    .c-hl { color: #0284C7; }
    .c-sub { font-size: 11.5px; color: #475569; max-width: 520px; margin: 8px auto 0 auto; line-height: 1.4; font-weight: 600; }

    .c-mascots { display: flex; align-items: center; justify-content: space-around; margin: 10px 0; }
    .cm-img { width: 135px; height: 165px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.15)); }
    .c-center-box { display: flex; flex-direction: column; align-items: center; }
    .c-logo { width: 170px; object-fit: contain; margin-bottom: 12px; }
    .c-pillars { display: flex; flex-direction: column; gap: 5px; }
    .cp-pill { background: #E0F2FE; border: 1.5px solid #0284C7; border-radius: 8px; padding: 5px 12px; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; color: #0369A1; text-align: center; }

    .c-guide-box { background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; }
    .c-guide-box h3 { font-family: 'Fredoka', sans-serif; font-size: 12.5px; font-weight: 800; color: #0F172A; margin-bottom: 8px; text-align: center; }
    .cgb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .cgb-card { background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 8px; text-align: center; }
    .cgb-card strong { display: block; font-family: 'Fredoka', sans-serif; font-size: 11px; color: #0F172A; margin-bottom: 2px; }
    .cgb-card p { font-size: 9.5px; color: #64748B; line-height: 1.3; }

    .c-footer { display: flex; justify-content: space-between; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 8px 14px; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 700; color: #475569; }

    /* TEST PAGES */
    .page-test { display: flex; flex-direction: column; justify-content: space-between; }
    .test-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px; }
    .ttb-left { display: flex; align-items: center; gap: 8px; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; color: #64748B; }
    .ttb-logo { height: 32px; object-fit: contain; }
    .ttb-right { background: #FEF3C7; color: #B45309; font-family: 'Fredoka', sans-serif; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 12px; }

    .test-pair-container { display: flex; flex-direction: column; justify-content: space-between; flex: 1; }
    .desafio-box { border: 2.5px solid #0284C7; border-radius: 10px; overflow: hidden; background: #FFFFFF; display: flex; flex-direction: column; box-shadow: 0 3px 8px rgba(0,0,0,0.06); height: 47%; }

    .d-head { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; color: #FFFFFF; }
    .dh-badge { font-family: 'Fredoka', sans-serif; font-size: 8.5px; font-weight: 800; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 4px; display: inline-block; }
    .dh-title { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 800; }
    .dh-meta { font-size: 9px; opacity: 0.95; }
    .dh-timer-box { background: rgba(0,0,0,0.2); border-radius: 6px; padding: 3px 8px; font-size: 9.5px; display: flex; gap: 8px; font-weight: 700; }

    .d-body { padding: 6px 10px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .d-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .d-eq-card { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 6px; }
    .d-num { font-family: 'Fredoka', sans-serif; font-size: 16px; font-weight: 800; color: #0F172A; }
    .d-op { font-family: 'Fredoka', sans-serif; font-size: 14px; font-weight: 800; color: #0284C7; }
    .d-eq { font-family: 'Fredoka', sans-serif; font-size: 14px; font-weight: 800; color: #64748B; }
    .d-box { width: 42px; height: 28px; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 4px; }

    .d-foot { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; background: #F1F5F9; border-top: 1px solid #E2E8F0; font-size: 9px; }
    .df-score { display: flex; align-items: center; gap: 12px; }
    .df-score b { color: #0284C7; font-family: 'Fredoka', sans-serif; font-size: 11px; }
    .df-rubric { display: flex; gap: 8px; font-family: 'Fredoka', sans-serif; font-size: 8.5px; font-weight: 700; color: #475569; }
    .df-sig { color: #64748B; }

    .test-divider { display: flex; align-items: center; justify-content: center; position: relative; margin: 4px 0; }
    .test-divider::before { content: ''; position: absolute; left: 0; right: 0; border-top: 2px dashed #CBD5E1; z-index: 1; }
    .test-divider span { position: relative; z-index: 2; background: #FFFFFF; padding: 0 10px; font-size: 8.5px; font-weight: 800; color: #64748B; }

    /* GABARITO */
    .page-gabarito { padding: 8mm; background: #F8FAFC; }
    .gab-frame { border: 2.5px solid #CBD5E1; border-radius: 12px; background: #FFFFFF; height: 100%; padding: 12px 16px; display: flex; flex-direction: column; justify-content: space-between; }
    .gab-header { text-align: center; }
    .gab-logo { height: 34px; object-fit: contain; margin-bottom: 2px; }
    .gab-header h2 { font-family: 'Fredoka', sans-serif; font-size: 18px; font-weight: 900; color: #0F172A; }
    .gab-header p { font-size: 10.5px; color: #64748B; font-weight: 600; }

    .gab-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 6px 0; }
    .gab-box { border: 1.5px solid #E2E8F0; border-radius: 6px; padding: 4px 6px; background: #F8FAFC; }
    .gab-box h4 { font-family: 'Fredoka', sans-serif; font-size: 10px; font-weight: 800; margin-bottom: 3px; border-bottom: 1px solid #E2E8F0; padding-bottom: 2px; }
    .gab-answers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; font-size: 8px; color: #475569; font-family: 'Fredoka', sans-serif; }
    .gab-answers b { color: #0F172A; }

    .diagnostic-box { background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 8px 12px; }
    .diagnostic-box h3 { font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; color: #B45309; margin-bottom: 4px; }
    .diag-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .diag-item strong { display: block; font-family: 'Fredoka', sans-serif; font-size: 9.5px; color: #92400E; margin-bottom: 2px; }
    .diag-item p { font-size: 8.5px; color: #78350F; line-height: 1.25; }

    .bottom-page-id { display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8; padding-top: 4px; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  ${pagesHtml.join('\n')}
</body>
</html>`;
}

async function run() {
  const html = generateDesafiosHtml();
  fs.writeFileSync('desafios.html', html);
  console.log('desafios.html written.');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
  const fileUrl = 'file:///' + path.resolve('desafios.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('Desafios_Semanais_Acompanhamento.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('Generated Desafios_Semanais_Acompanhamento.pdf! Size:', fs.statSync(pdfPath).size);
}

run();
