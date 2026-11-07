// generate_cronograma_pdf.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const assets = require('./assets_base64.js');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const cronogramaHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Cronograma Mestre de 12 Semanas - Missão Tabuada</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Cinzel:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #64748B; color: #1E293B; }
    .page {
      width: 210mm; height: 297mm; min-height: 297mm; max-height: 297mm;
      background: #FFFFFF; position: relative; page-break-after: always; break-after: page;
      padding: 11mm 13mm 10mm 13mm; display: flex; flex-direction: column; overflow: hidden;
      margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    @media print { body { background: transparent; } .page { box-shadow: none; margin: 0; } }

    /* Top Bar */
    .top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 8px; }
    .top-left { display: flex; align-items: center; gap: 10px; }
    .top-logo { height: 42px; object-fit: contain; }
    .top-titles h2 { font-family: 'Fredoka', sans-serif; font-size: 15px; font-weight: 800; color: #0284C7; }
    .top-titles p { font-size: 10px; color: #64748B; font-weight: 700; }
    .top-badge { background: #FEF3C7; border: 1.5px solid #F59E0B; color: #B45309; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 12px; }

    /* Main Header */
    .hero-header { background: linear-gradient(135deg, #0284C7, #0369A1); color: #FFFFFF; border-radius: 12px; padding: 10px 16px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
    .hero-header h1 { font-family: 'Fredoka', sans-serif; font-size: 22px; font-weight: 800; }
    .hero-header p { font-size: 11px; opacity: 0.95; }
    .hero-tag { background: #F59E0B; color: #0F172A; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }

    /* Grid of Weeks */
    .weeks-container { display: flex; flex-direction: column; gap: 8px; flex: 1; justify-content: space-between; }
    .week-card { border: 2px solid #E2E8F0; border-radius: 10px; overflow: hidden; background: #F8FAFC; display: flex; }
    .week-badge-col { width: 90px; background: #0284C7; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; text-align: center; }
    .wb-num { font-family: 'Fredoka', sans-serif; font-size: 18px; font-weight: 800; }
    .wb-phase { font-size: 8px; font-weight: 800; letter-spacing: 0.5px; opacity: 0.9; text-transform: uppercase; }
    .wb-icon { font-size: 18px; margin-top: 2px; }

    .week-content-col { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; justify-content: space-between; }
    .wc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .wc-title { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 800; color: #0F172A; }
    .wc-target { font-size: 10px; font-weight: 700; color: #D97706; background: #FEF3C7; padding: 2px 6px; border-radius: 4px; }
    .wc-desc { font-size: 10px; color: #475569; line-height: 1.35; margin-bottom: 4px; }

    .wc-days-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
    .day-pill { background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 5px; padding: 3px 5px; font-size: 8.5px; display: flex; flex-direction: column; }
    .dp-name { font-weight: 800; color: #0284C7; }
    .dp-task { color: #334155; }

    /* Footer Meta */
    .page-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1.5px solid #E2E8F0; font-size: 10px; color: #64748B; margin-top: 6px; }
    .page-footer strong { color: #0284C7; }

    /* Planner Table (Page 6) */
    .planner-table { width: 100%; border-collapse: collapse; margin-top: 4px; flex: 1; }
    .planner-table th { background: #0F172A; color: #FFFFFF; font-family: 'Fredoka', sans-serif; font-size: 10px; font-weight: 700; padding: 6px; border: 1px solid #334155; text-align: center; }
    .planner-table td { border: 1px solid #CBD5E1; padding: 5px 6px; font-size: 9.5px; text-align: center; }
    .planner-table tr:nth-child(even) { background: #F8FAFC; }
    .col-week { font-family: 'Fredoka', sans-serif; font-weight: 800; color: #0284C7; text-align: left !important; }
    .col-goal { text-align: left !important; font-weight: 600; color: #334155; }
    .chk-box { width: 14px; height: 14px; border: 1.5px solid #94A3B8; border-radius: 3px; display: inline-block; }
  </style>
</head>
<body>

  <!-- PÁGINA 1: CAPA & VISÃO GERAL -->
  <div class="page">
    <div class="top-bar">
      <div class="top-left">
        <img src="${assets.logo}" class="top-logo" alt="Logo" />
        <div class="top-titles">
          <h2>MISSÃO TABUADA • CRONOGRAMA MESTRE</h2>
          <p>O Método Definitivo dos Campeões da Multiplicação</p>
        </div>
      </div>
      <div class="top-badge">🗓️ 12 SEMANAS DE SUCESSO</div>
    </div>

    <div class="hero-header" style="background: linear-gradient(135deg, #0284C7, #1E40AF);">
      <div>
        <h1>CRONOGRAMA MESTRE DE 12 SEMANAS</h1>
        <p>15 Minutos Diários de Treinamento Lúdico • O Caminho da Vitória</p>
      </div>
      <div class="hero-tag">PLANO COMPLETO</div>
    </div>

    <div style="display: flex; gap: 14px; align-items: center; background: #EFF6FF; border: 2px solid #93C5FD; border-radius: 12px; padding: 10px 14px; margin-bottom: 10px;">
      <img src="${assets.lapisHeroi}" style="height: 85px; object-fit: contain;" alt="Lápis Herói" />
      <div style="flex: 1; font-size: 11px; color: #1E3A8A; line-height: 1.4;">
        <strong style="font-family: 'Fredoka', sans-serif; font-size: 13px; color: #1E40AF; display: block; margin-bottom: 2px;">Como Utilizar este Cronograma:</strong>
        Dividimos a memorização da tabuada em <strong>4 fases evolutivas de 3 semanas</strong>. Com apenas <strong>15 minutos por dia (Segunda a Sexta)</strong>, seu cérebro cria conexões sólidas e permanentes, garantindo resposta automática em menos de 3 segundos para qualquer cálculo do 1 ao 10!
      </div>
      <img src="${assets.heroiMenino}" style="height: 75px; object-fit: contain;" alt="Herói Menino" />
    </div>

    <div class="weeks-container">
      <div class="week-card" style="border-color: #38BDF8;">
        <div class="week-badge-col" style="background: #0284C7;">
          <span class="wb-phase">Fase 1 • Bronze</span>
          <span class="wb-num">Sem. 1-3</span>
          <span class="wb-icon">🥉</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Fundamentos & Primeiros Passos (Tabuadas 1, 2 e 3)</span>
            <span class="wc-target">Meta: Dobros e Padrões Básicos</span>
          </div>
          <p class="wc-desc">Descoberta do superpoder da multiplicação como atalho da adição. Domínio imediato dos números pares e saltos de 3 em 3.</p>
        </div>
      </div>

      <div class="week-card" style="border-color: #34D399;">
        <div class="week-badge-col" style="background: #059669;">
          <span class="wb-phase">Fase 2 • Prata</span>
          <span class="wb-num">Sem. 4-6</span>
          <span class="wb-icon">🥈</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Aceleração & O Salto dos Titãs (Tabuadas 4, 5 e 6)</span>
            <span class="wc-target">Meta: Truques do 5 e o Dobro do 3</span>
          </div>
          <p class="wc-desc">Estratégia do "Dobro do Dobro" (4), magia das dezenas e metades (5) e entrada no território avançado com a tabuada do 6.</p>
        </div>
      </div>

      <div class="week-card" style="border-color: #FBBF24;">
        <div class="week-badge-col" style="background: #D97706;">
          <span class="wb-phase">Fase 3 • Ouro</span>
          <span class="wb-num">Sem. 7-9</span>
          <span class="wb-icon">🥇</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Os Grandes Mestres (Tabuadas 7, 8 e 9)</span>
            <span class="wc-target">Meta: Domínio das Mais Temidas</span>
          </div>
          <p class="wc-desc">Desmistificando o 7 com decomposição (5+2), o poder do triplo dobro no 8 e os truques mágicos dos dedos e algarismos no 9.</p>
        </div>
      </div>

      <div class="week-card" style="border-color: #A78BFA;">
        <div class="week-badge-col" style="background: #7C3AED;">
          <span class="wb-phase">Fase 4 • Diamante</span>
          <span class="wb-num">Sem. 10-12</span>
          <span class="wb-icon">💎</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Integração, Jogos & Prova Épica (Tabuada do 10 + Revisão Geral)</span>
            <span class="wc-target">Meta: Velocidade Máxima & Diploma</span>
          </div>
          <p class="wc-desc">Batalhas de velocidade, jogos em família (Trilha, Bingo e Dominó), derrota do Monstro Gigante e outorga do Certificado de Herói!</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Missão Tabuada • Cronograma Pedagógico Oficial</span>
      <strong>Página 1 de 6</strong>
    </div>
  </div>

  <!-- PÁGINA 2: SEMANAS 1 A 3 (FASE BRONZE) -->
  <div class="page">
    <div class="top-bar">
      <div class="top-left">
        <img src="${assets.logo}" class="top-logo" alt="Logo" />
        <div class="top-titles">
          <h2>FASE 1: OS FUNDAMENTOS • SEMANAS 1 A 3</h2>
          <p>Construindo a Base Sagrada da Multiplicação</p>
        </div>
      </div>
      <div class="top-badge">🥉 FASE BRONZE</div>
    </div>

    <div class="weeks-container">
      <!-- Semana 1 -->
      <div class="week-card" style="border-left: 6px solid #0284C7;">
        <div class="week-badge-col" style="background: #0284C7;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">1</span>
          <span class="wb-icon">🛡️</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 1: A Descoberta do Poder (Tabuadas do 1 e 2)</span>
            <span class="wc-target">Alvo: Menos de 1 min na Página C</span>
          </div>
          <p class="wc-desc">Compreender a multiplicação como atalho da adição repetida. Dominar os dobros sem hesitação.</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 1 (Pág A)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 1 (Pág B e C)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Tab. 2 (Pág A)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Tab. 2 (Pág B e C)</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Escudo 1 e 2!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 2 -->
      <div class="week-card" style="border-left: 6px solid #16A34A;">
        <div class="week-badge-col" style="background: #16A34A;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">2</span>
          <span class="wb-icon">⚡</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 2: O Passo Triplo (Tabuada do 3)</span>
            <span class="wc-target">Alvo: Pulos de 3 em 3</span>
          </div>
          <p class="wc-desc">Rítmica dos triplos (3, 6, 9, 12, 15...). Associação com objetos de 3 pontas (triângulos, semáforos).</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 3 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 3 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 3 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Ficha de Treino 3</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 3!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 3 -->
      <div class="week-card" style="border-left: 6px solid #9333EA;">
        <div class="week-badge-col" style="background: #9333EA;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">3</span>
          <span class="wb-icon">🚗</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 3: O Quadrado de Força (Tabuada do 4)</span>
            <span class="wc-target">Alvo: Técnica do Dobro do Dobro</span>
          </div>
          <p class="wc-desc">Técnica mestre: multiplicar por 4 é dobrar duas vezes! (ex: 6x4 -> dobro de 6 é 12, dobro de 12 é 24!).</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 4 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 4 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 4 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Desafio Semanal 1</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 4!</span></div>
          </div>
        </div>
      </div>
    </div>

    <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 6px 12px; margin-top: 8px; font-size: 10px; color: #78350F; display: flex; align-items: center; gap: 8px;">
      <span>💡</span>
      <p><strong>Dica de Ouro da Fase Bronze:</strong> Se a criança hesitar no 4, pergunte sempre: "Qual é o dobro? E o dobro do dobro?" Isso desenvolve raciocínio lógico em vez de decoreba mecânica!</p>
    </div>

    <div class="page-footer">
      <span>Missão Tabuada • Cronograma Pedagógico Oficial</span>
      <strong>Página 2 de 6</strong>
    </div>
  </div>

  <!-- PÁGINA 3: SEMANAS 4 A 6 (FASE PRATA) -->
  <div class="page">
    <div class="top-bar">
      <div class="top-left">
        <img src="${assets.logo}" class="top-logo" alt="Logo" />
        <div class="top-titles">
          <h2>FASE 2: A ACELERAÇÃO • SEMANAS 4 A 6</h2>
          <p>Cruzando o Território dos Números Maiores</p>
        </div>
      </div>
      <div class="top-badge">🥈 FASE PRATA</div>
    </div>

    <div class="weeks-container">
      <!-- Semana 4 -->
      <div class="week-card" style="border-left: 6px solid #E11D48;">
        <div class="week-badge-col" style="background: #E11D48;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">4</span>
          <span class="wb-icon">🖐️</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 4: O Relógio e as Mãos (Tabuada do 5) + Revisão 1 a 5</span>
            <span class="wc-target">Alvo: Finaliza em 0 ou 5</span>
          </div>
          <p class="wc-desc">Padrão visual do ponteiro dos minutos. Conexão com as duas mãos. Consolidação total da primeira metade da tabuada!</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 5 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 5 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 5 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Pág 34: Mega Bat. 1</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 5!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 5 -->
      <div class="week-card" style="border-left: 6px solid #0D9488;">
        <div class="week-badge-col" style="background: #0D9488;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">5</span>
          <span class="wb-icon">🌉</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 5: A Ponte dos Titãs (Tabuada do 6)</span>
            <span class="wc-target">Alvo: O Dobro do 3</span>
          </div>
          <p class="wc-desc">A tabuada do 6 é apenas o dobro da tabuada do 3! (ex: 6x7 = dobro de 3x7 = dobro de 21 = 42). Isso traz segurança imediata.</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 6 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 6 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 6 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Ficha de Treino 6</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 6!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 6 -->
      <div class="week-card" style="border-left: 6px solid #D97706;">
        <div class="week-badge-col" style="background: #D97706;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">6</span>
          <span class="wb-icon">⚔️</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 6: O Território do 7 (A Tabuada Lendária)</span>
            <span class="wc-target">Alvo: Decomposição 5 + 2</span>
          </div>
          <p class="wc-desc">O temido 7 fica fácil: multiplique por 5 e adicione o dobro! (ex: 7x6 = (5x6) + (2x6) = 30 + 12 = 42!). Foco especial no 7x7=49 e 7x8=56.</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 7 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 7 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 7 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Jogo de Dominó 7</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 7!</span></div>
          </div>
        </div>
      </div>
    </div>

    <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 6px 12px; margin-top: 8px; font-size: 10px; color: #78350F; display: flex; align-items: center; gap: 8px;">
      <span>💡</span>
      <p><strong>Comemoração de Meio de Curso:</strong> Ao final da Semana 6, a criança já derrotou mais da metade dos Chefões! Recompense com um elogio caloroso e um descanso divertido no final de semana!</p>
    </div>

    <div class="page-footer">
      <span>Missão Tabuada • Cronograma Pedagógico Oficial</span>
      <strong>Página 3 de 6</strong>
    </div>
  </div>

  <!-- PÁGINA 4: SEMANAS 7 A 9 (FASE OURO) -->
  <div class="page">
    <div class="top-bar">
      <div class="top-left">
        <img src="${assets.logo}" class="top-logo" alt="Logo" />
        <div class="top-titles">
          <h2>FASE 3: OS GRANDES MESTRES • SEMANAS 7 A 9</h2>
          <p>Conquistando as Mais Poderosas Tabuadas</p>
        </div>
      </div>
      <div class="top-badge">🥇 FASE OURO</div>
    </div>

    <div class="weeks-container">
      <!-- Semana 7 -->
      <div class="week-card" style="border-left: 6px solid #4F46E5;">
        <div class="week-badge-col" style="background: #4F46E5;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">7</span>
          <span class="wb-icon">🐙</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 7: A Fortaleza do 8 (O Triplo Dobro)</span>
            <span class="wc-target">Alvo: Dobro do 4</span>
          </div>
          <p class="wc-desc">Multiplicar por 8 é apenas dobrar o resultado da tabuada do 4! (ex: 4x7=28 -> 8x7=56). Ou dobre 3 vezes seguidas.</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 8 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 8 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 8 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Ficha de Treino 8</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 8!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 8 -->
      <div class="week-card" style="border-left: 6px solid #C026D3;">
        <div class="week-badge-col" style="background: #C026D3;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">8</span>
          <span class="wb-icon">🪄</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 8: A Magia Ninja do 9 (Dígitos e Dedos)</span>
            <span class="wc-target">Alvo: Soma dos Dígitos = 9</span>
          </div>
          <p class="wc-desc">A mágica mais divertida da matemática: no 9, a soma dos dois algarismos SEMPRE dá 9! (18->1+8=9, 27->2+7=9, 36->3+6=9...). A criança adora!</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 9 (Pág A: 1-5)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Tab. 9 (Pág B: 6-10)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Chefão do 9 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Truque dos Dedos 9</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Pintar Escudo 9!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 9 -->
      <div class="week-card" style="border-left: 6px solid #2563EB;">
        <div class="week-badge-col" style="background: #2563EB;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">9</span>
          <span class="wb-icon">👑</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 9: O Rei das Dezenas (Tabuada do 10) + Revisão 6 a 10</span>
            <span class="wc-target">Alvo: Pág 35: Mega Bat. 2</span>
          </div>
          <p class="wc-desc">Basta acrescentar o zero! Vencer o Chefão do 10 completa todos os 10 Escudos de Poder do Mapa de Conquistas!</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Tab. 10 (Pág A e B)</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Chefão 10 (Pág C)</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Pintar Escudo 10!</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Pág 35: Mega Bat. 2</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Festa dos 10 Escudos!</span></div>
          </div>
        </div>
      </div>
    </div>

    <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 6px 12px; margin-top: 8px; font-size: 10px; color: #78350F; display: flex; align-items: center; gap: 8px;">
      <span>🏆</span>
      <p><strong>Conquista Desbloqueada:</strong> Todos os 10 escudos da Página 3 agora estão pintados! Restam as 3 semanas finais de consolidação, jogos e coroação!</p>
    </div>

    <div class="page-footer">
      <span>Missão Tabuada • Cronograma Pedagógico Oficial</span>
      <strong>Página 4 de 6</strong>
    </div>
  </div>

  <!-- PÁGINA 5: SEMANAS 10 A 12 (FASE DIAMANTE & VITÓRIA) -->
  <div class="page">
    <div class="top-bar">
      <div class="top-left">
        <img src="${assets.logo}" class="top-logo" alt="Logo" />
        <div class="top-titles">
          <h2>FASE 4: O CAMPEONATO & GRADUAÇÃO • SEMANAS 10 A 12</h2>
          <p>Treino de Velocidade, Jogos em Família e Diploma Oficial</p>
        </div>
      </div>
      <div class="top-badge">💎 FASE DIAMANTE</div>
    </div>

    <div class="weeks-container">
      <!-- Semana 10 -->
      <div class="week-card" style="border-left: 6px solid #D97706;">
        <div class="week-badge-col" style="background: #D97706;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">10</span>
          <span class="wb-icon">🏎️</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 10: O Circuito de Alta Velocidade</span>
            <span class="wc-target">Alvo: Resposta em menos de 3 seg</span>
          </div>
          <p class="wc-desc">Treinamento com o cronômetro para bater recordes pessoais. Resolver fichas de contas misturadas com leveza e diversão.</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Ficha Vel. 1</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Ficha Vel. 2</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Desafio Rápido</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Revisão Chefões</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Recorde Batido!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 11 -->
      <div class="week-card" style="border-left: 6px solid #10B981;">
        <div class="week-badge-col" style="background: #10B981;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">11</span>
          <span class="wb-icon">🎲</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 11: O Campeonato dos Heróis (Jogos em Família)</span>
            <span class="wc-target">Alvo: Fixação com Risadas e Jogos</span>
          </div>
          <p class="wc-desc">Jogar os Jogos de Tabuada: O Tabuleiro da Grande Trilha, o Bingo da Tabuada e o Dominó das Equações com pais e amigos!</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Jogo da Trilha</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Dominó de Contas</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Bingo Tabuada</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Duelo Relâmpago</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">Mesa Campeã!</span></div>
          </div>
        </div>
      </div>

      <!-- Semana 12 -->
      <div class="week-card" style="border-left: 6px solid #7C3AED;">
        <div class="week-badge-col" style="background: #7C3AED;">
          <span class="wb-phase">Semana</span>
          <span class="wb-num">12</span>
          <span class="wb-icon">🎓</span>
        </div>
        <div class="week-content-col">
          <div class="wc-header">
            <span class="wc-title">Semana 12: A Batalha Épica Final & Cerimônia de Graduação</span>
            <span class="wc-target">Alvo: Página 36 & Certificado Pág 43</span>
          </div>
          <p class="wc-desc">Vencer a Batalha Épica do Monstro Gigante (Pág 36), assinar solenemente o Diploma Oficial de Herói e comemorar a vitória!</p>
          <div class="wc-days-grid">
            <div class="day-pill"><span class="dp-name">SEG</span><span class="dp-task">Aquec. Geral</span></div>
            <div class="day-pill"><span class="dp-name">TER</span><span class="dp-task">Pág 36: Batalha!</span></div>
            <div class="day-pill"><span class="dp-name">QUA</span><span class="dp-task">Autocorreção Gab.</span></div>
            <div class="day-pill"><span class="dp-name">QUI</span><span class="dp-task">Preencher Cert.</span></div>
            <div class="day-pill"><span class="dp-name">SEX</span><span class="dp-task">FORMATURA! 👑</span></div>
          </div>
        </div>
      </div>
    </div>

    <div style="background: #EFF6FF; border: 2px dashed #93C5FD; border-radius: 8px; padding: 8px 14px; margin-top: 8px; text-align: center; color: #1E40AF; font-size: 11px;">
      <strong style="font-family: 'Fredoka', sans-serif; font-size: 13px;">🎉 Rumo à Liga dos Heróis da Matemática (Volume 2)!</strong><br>
      Ao completar o cronograma, a criança não apenas dominou a tabuada: ela adquiriu disciplina de estudo, autonomia e autoconfiança para a vida toda!
    </div>

    <div class="page-footer">
      <span>Missão Tabuada • Cronograma Pedagógico Oficial</span>
      <strong>Página 5 de 6</strong>
    </div>
  </div>

  <!-- PÁGINA 6: TABELA PLANNER DE GELADEIRA (CHECKLIST DIÁRIO) -->
  <div class="page">
    <div class="top-bar">
      <div class="top-left">
        <img src="${assets.logo}" class="top-logo" alt="Logo" />
        <div class="top-titles">
          <h2>MURAL DO CAMPEÃO: PLANNER DE GELADEIRA</h2>
          <p>Prenda na Geladeira ou Mural de Estudos e Marque Cada Dia Concluído!</p>
        </div>
      </div>
      <div class="top-badge">📋 PLANNER 12 SEMANAS</div>
    </div>

    <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 6px 12px; margin-bottom: 6px; font-size: 10px; color: #78350F; display: flex; justify-content: space-between; align-items: center;">
      <span><strong>Aluno(a) Herói:</strong> _________________________________________</span>
      <span><strong>Início:</strong> ___/___/2026</span>
      <span><strong>Guardião:</strong> _________________________</span>
    </div>

    <table class="planner-table">
      <thead>
        <tr>
          <th style="width: 75px;">Semana</th>
          <th style="width: 170px;">Meta da Semana</th>
          <th style="width: 32px;">SEG</th>
          <th style="width: 32px;">TER</th>
          <th style="width: 32px;">QUA</th>
          <th style="width: 32px;">QUI</th>
          <th style="width: 32px;">SEX</th>
          <th style="width: 65px;">Melhor Tempo</th>
          <th style="width: 65px;">Visto Guardião</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="col-week">Semana 1</td><td class="col-goal">Tabuadas do 1 e 2 (Dobros)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 2</td><td class="col-goal">Tabuada do 3 (Triplos)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 3</td><td class="col-goal">Tabuada do 4 (Dobro do Dobro)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 4</td><td class="col-goal">Tabuada do 5 + Mega Batalha 1</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 5</td><td class="col-goal">Tabuada do 6 (Dobro do 3)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 6</td><td class="col-goal">Tabuada do 7 (Desafio Titã)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 7</td><td class="col-goal">Tabuada do 8 (Dobro do 4)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 8</td><td class="col-goal">Tabuada do 9 (Mágica dos Dedos)</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 9</td><td class="col-goal">Tabuada do 10 + Mega Batalha 2</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 10</td><td class="col-goal">Circuito de Velocidade & Recordes</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 11</td><td class="col-goal">Campeonato dos Jogos em Família</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
        <tr><td class="col-week">Semana 12</td><td class="col-goal">Batalha Épica Final & DIPLOMA!</td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td><span class="chk-box"></span></td><td>___:___</td><td>[ &nbsp; &nbsp; &nbsp; ]</td></tr>
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 6px 12px; margin-top: 6px;">
      <span style="font-size: 9.5px; color: #475569;">⭐ Marque com um "X" ou adesivo colorido cada dia que completar seus 15 minutos!</span>
      <span style="font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; color: #0284C7;">Missão Cumprida! 🏆</span>
    </div>

    <div class="page-footer">
      <span>Missão Tabuada • Cronograma Pedagógico Oficial</span>
      <strong>Página 6 de 6</strong>
    </div>
  </div>

</body>
</html>`;

async function generatePdf() {
  fs.writeFileSync('cronograma.html', cronogramaHtml);
  console.log('cronograma.html written.');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
  const fileUrl = 'file:///' + path.resolve('cronograma.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('Cronograma_Mestre_12_Semanas.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('Generated Cronograma_Mestre_12_Semanas.pdf! Size:', fs.statSync(pdfPath).size);
}

generatePdf();
