// build_interactive_webapp.js
// Generates index.html: The standalone animated interactive web app version
const fs = require('fs');
const path = require('path');
const curriculum = require('./curriculum.json');
const assets = require('./assets_base64.js');

const bookHtmlRaw = fs.readFileSync('book.html', 'utf8');

// We can create an interactive wrapper with top toolbar, sound synthesizer, confetti canvas, page router
const webappHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Missão Tabuada (1 ao 10) • Livro Animado e Interativo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Cinzel:wght@700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="book_styles.css">
  <style>
    /* Interactive App Chrome */
    :root {
      --app-bg: #0F172A;
      --app-panel: #1E293B;
      --hero-blue: #0284C7;
      --hero-amber: #F59E0B;
      --hero-emerald: #10B981;
      --hero-rose: #E11D48;
    }

    body {
      background-color: var(--app-bg);
      color: #F8FAFC;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow-x: hidden;
    }

    /* Fixed Top Control Bar */
    .app-navbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 2px solid #334155;
      z-index: 1000;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-logo {
      height: 42px;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    .nav-title-wrap h2 {
      font-family: 'Fredoka', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: 0.3px;
    }

    .nav-title-wrap p {
      font-size: 11px;
      color: #94A3B8;
      margin: 0;
    }

    /* Interactive Stopwatch Widget */
    .nav-stopwatch-widget {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1E293B;
      border: 2px solid #38BDF8;
      border-radius: 30px;
      padding: 4px 14px;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
    }

    .sw-label {
      font-family: 'Fredoka', sans-serif;
      font-size: 11px;
      font-weight: 800;
      color: #38BDF8;
      letter-spacing: 0.5px;
    }

    .sw-display {
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #F8FAFC;
      letter-spacing: 1px;
      min-width: 65px;
      text-align: center;
    }

    .sw-btn {
      background: #0284C7;
      color: #FFFFFF;
      border: none;
      border-radius: 20px;
      padding: 4px 10px;
      font-family: 'Fredoka', sans-serif;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sw-btn:hover {
      transform: scale(1.05);
      background: #0369A1;
    }

    .sw-btn.reset {
      background: #475569;
    }

    /* Page Navigation Selector */
    .nav-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-select {
      background: #1E293B;
      color: #F8FAFC;
      border: 1.5px solid #475569;
      border-radius: 8px;
      padding: 6px 12px;
      font-family: 'Fredoka', sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      outline: none;
    }

    .nav-btn-action {
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 7px 14px;
      font-family: 'Fredoka', sans-serif;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .nav-btn-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.5);
    }

    .nav-btn-print {
      background: #3B82F6;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 7px 12px;
      font-family: 'Fredoka', sans-serif;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s;
    }

    .nav-btn-print:hover {
      background: #2563EB;
    }

    /* Main Book Display Container */
    .book-container {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    /* Interactive Inputs on the Screen */
    .eq-box, .inv-box, .boss-box, .bat-box {
      cursor: text;
      position: relative;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .eq-box input, .inv-box input, .boss-box input, .bat-box input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      text-align: center;
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
    }

    .eq-box.correct, .inv-box.correct, .boss-box.correct, .bat-box.correct {
      background: #DCFCE7 !important;
      border-color: #16A34A !important;
      color: #15803D !important;
      box-shadow: 0 0 10px rgba(22, 163, 74, 0.4);
      transform: scale(1.05);
    }

    .eq-box.wrong, .inv-box.wrong, .boss-box.wrong, .bat-box.wrong {
      background: #FEE2E2 !important;
      border-color: #EF4444 !important;
      color: #B91C1C !important;
      animation: shake 0.3s;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-4px); }
      40%, 80% { transform: translateX(4px); }
    }

    /* Interactive Shields */
    .tracker-shield-card {
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tracker-shield-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    .tracker-shield-card.unlocked .shield-svg path:first-child {
      fill: #FEF08A !important;
      stroke: #EAB308 !important;
    }

    .tracker-shield-card.unlocked .shield-star-badge {
      animation: starPop 0.5s ease-out;
      transform: scale(1.3);
    }

    @keyframes starPop {
      0% { transform: scale(0.5) rotate(-30deg); }
      50% { transform: scale(1.6) rotate(15deg); }
      100% { transform: scale(1.3) rotate(0deg); }
    }

    /* Confetti Canvas Overlay */
    #confettiCanvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    }

    /* Sound FX Toggle */
    .audio-toggle-btn {
      background: #334155;
      color: #F8FAFC;
      border: none;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
    }

    /* Interactive Victory Toast */
    .victory-toast {
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%) translateY(150px);
      background: linear-gradient(135deg, #10B981, #059669);
      color: #FFFFFF;
      padding: 14px 28px;
      border-radius: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Fredoka', sans-serif;
      font-size: 17px;
      font-weight: 800;
      z-index: 2000;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .victory-toast.active {
      transform: translateX(-50%) translateY(0);
    }

    /* Materials & Bonus Modal */
    .nav-btn-bonus {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #FFFFFF;
      border: none;
      font-family: 'Fredoka', sans-serif;
      font-size: 13px;
      font-weight: 800;
      padding: 7px 14px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
      transition: all 0.2s ease;
    }
    .nav-btn-bonus:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(245, 158, 11, 0.5);
    }

    /* Top Quick Banner */
    .materials-quick-banner {
      width: 100%;
      background: linear-gradient(90deg, #1E3A8A 0%, #0284C7 50%, #0D9488 100%);
      border-bottom: 2px solid #38BDF8;
      padding: 10px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .mqb-content {
      max-width: 1200px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 16px;
      flex-wrap: wrap;
    }
    .mqb-badge {
      background: #FEF08A;
      color: #854D0E;
      font-family: 'Fredoka', sans-serif;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      display: inline-block;
    }
    .mqb-text {
      font-size: 12.5px;
      color: #FFFFFF;
      font-weight: 600;
      flex: 1;
      min-width: 280px;
    }
    .mqb-btn {
      background: #FFFFFF;
      color: #0369A1;
      border: 2px solid #FFFFFF;
      font-family: 'Fredoka', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .mqb-btn:hover {
      background: #E0F2FE;
      transform: scale(1.04);
    }

    /* Modal Overlay & Card */
    .bonus-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      z-index: 4000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .bonus-modal-overlay.active {
      display: flex;
      animation: modalFadeIn 0.25s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    .bonus-modal-card {
      background: #0F172A;
      border: 3px solid #F59E0B;
      border-radius: 20px;
      width: 100%;
      max-width: 980px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      color: #F8FAFC;
    }
    .bm-header {
      padding: 16px 24px;
      background: #1E293B;
      border-bottom: 2px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .bmh-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #F59E0B;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bm-close-btn {
      background: #334155;
      border: none;
      color: #F8FAFC;
      font-size: 18px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .bm-close-btn:hover { background: #EF4444; }
    .bm-body {
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .bm-subtitle {
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.4;
    }
    .bm-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
    }
    .bm-item {
      background: #1E293B;
      border: 2px solid #334155;
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s;
    }
    .bm-item:hover {
      border-color: #38BDF8;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    .bmi-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .bmi-badge {
      font-family: 'Fredoka', sans-serif;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      color: #FFFFFF;
    }
    .bmi-pages {
      font-size: 11px;
      color: #94A3B8;
      font-weight: 700;
    }
    .bmi-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 15px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 4px;
      line-height: 1.25;
    }
    .bmi-desc {
      font-size: 11.5px;
      color: #94A3B8;
      line-height: 1.35;
      margin-bottom: 12px;
      flex: 1;
    }
    .bmi-download-btn {
      background: #0284C7;
      color: #FFFFFF;
      text-decoration: none;
      font-family: 'Fredoka', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      padding: 8px 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .bmi-download-btn:hover {
      background: #0369A1;
    }
  </style>
</head>
<body>

  <!-- Confetti Canvas -->
  <canvas id="confettiCanvas"></canvas>

  <!-- Interactive App Bar -->
  <nav class="app-navbar">
    <div class="nav-brand">
      <img src="${assets.logo}" class="nav-logo" alt="Heróis da Multiplicação" />
      <div class="nav-title-wrap">
        <h2>MISSÃO TABUADA • VOL. 1</h2>
        <p>A Tabuada Completa do 1 ao 10 • Edição Interativa</p>
      </div>
    </div>

    <!-- Live Superhero Stopwatch -->
    <div class="nav-stopwatch-widget">
      <span class="sw-label">⚡ CRONÔMETRO</span>
      <span class="sw-display" id="swDisplay">00:00</span>
      <button class="sw-btn" id="swStartBtn">INICIAR</button>
      <button class="sw-btn reset" id="swResetBtn">ZERAR</button>
    </div>

    <!-- Quick Navigation & Export -->
    <div class="nav-controls">
      <select class="nav-select" id="pageSelect">
        <option value="1">Pág 1: Capa Oficial</option>
        <option value="2">Pág 2: Manual do Guardião</option>
        <option value="3">Pág 3: Mapa de Conquistas (Tracker)</option>
        <option value="4">Pág 4: Tabuada do 1 (Início 1 ao 5)</option>
        <option value="5">Pág 5: Tabuada do 1 (Força 6 ao 10)</option>
        <option value="6">Pág 6: Chefão do 1 (Batalha Final)</option>
        <option value="7">Pág 7: Tabuada do 2 (Início 1 ao 5)</option>
        <option value="8">Pág 8: Tabuada do 2 (Força 6 ao 10)</option>
        <option value="9">Pág 9: Chefão do 2 (Batalha Final)</option>
        <option value="10">Pág 10: Tabuada do 3 (Início 1 ao 5)</option>
        <option value="11">Pág 11: Tabuada do 3 (Força 6 ao 10)</option>
        <option value="12">Pág 12: Chefão do 3 (Batalha Final)</option>
        <option value="13">Pág 13: Tabuada do 4 (Início 1 ao 5)</option>
        <option value="14">Pág 14: Tabuada do 4 (Força 6 ao 10)</option>
        <option value="15">Pág 15: Chefão do 4 (Batalha Final)</option>
        <option value="16">Pág 16: Tabuada do 5 (Início 1 ao 5)</option>
        <option value="17">Pág 17: Tabuada do 5 (Força 6 ao 10)</option>
        <option value="18">Pág 18: Chefão do 5 (Batalha Final)</option>
        <option value="19">Pág 19: Tabuada do 6 (Início 1 ao 5)</option>
        <option value="20">Pág 20: Tabuada do 6 (Força 6 ao 10)</option>
        <option value="21">Pág 21: Chefão do 6 (Batalha Final)</option>
        <option value="22">Pág 22: Tabuada do 7 (Início 1 ao 5)</option>
        <option value="23">Pág 23: Tabuada do 7 (Força 6 ao 10)</option>
        <option value="24">Pág 24: Chefão do 7 (Batalha Final)</option>
        <option value="25">Pág 25: Tabuada do 8 (Início 1 ao 5)</option>
        <option value="26">Pág 26: Tabuada do 8 (Força 6 ao 10)</option>
        <option value="27">Pág 27: Chefão do 8 (Batalha Final)</option>
        <option value="28">Pág 28: Tabuada do 9 (Início 1 ao 5)</option>
        <option value="29">Pág 29: Tabuada do 9 (Força 6 ao 10)</option>
        <option value="30">Pág 30: Chefão do 9 (Batalha Final)</option>
        <option value="31">Pág 31: Tabuada do 10 (Início 1 ao 5)</option>
        <option value="32">Pág 32: Tabuada do 10 (Força 6 ao 10)</option>
        <option value="33">Pág 33: Chefão do 10 (Batalha Final)</option>
        <option value="34">Pág 34: Mega Batalha 1 (Fase Ouro)</option>
        <option value="35">Pág 35: Mega Batalha 2 (Fase Diamante)</option>
        <option value="36">Pág 36: A Batalha Épica (Monstro Gigante)</option>
        <option value="37">Pág 37: Gabarito Tabuadas 1 e 2</option>
        <option value="38">Pág 38: Gabarito Tabuadas 3 e 4</option>
        <option value="39">Pág 39: Gabarito Tabuadas 5 e 6</option>
        <option value="40">Pág 40: Gabarito Tabuadas 7 e 8</option>
        <option value="41">Pág 41: Gabarito Tabuadas 9 e 10</option>
        <option value="42">Pág 42: Gabarito Grandes Batalhas</option>
        <option value="43">Pág 43: Certificado Oficial</option>
      </select>

      <button class="audio-toggle-btn" id="audioToggle" title="Ativar/Desativar Sons">🔊</button>
      <button class="nav-btn-print" onclick="window.print()">🖨️ Imprimir</button>
      <button class="nav-btn-bonus" onclick="openBonusModal()">🎁 Materiais A4 (6 PDFs)</button>
      <a href="Missao_Tabuada_Volume_1.pdf" download="Missao_Tabuada_Volume_1.pdf" class="nav-btn-action">
        📥 Baixar PDF Oficial (43 Págs)
      </a>
    </div>
  </nav>

  <!-- Quick Access Top Banner for All Bonus PDFs -->
  <div class="materials-quick-banner">
    <div class="mqb-content">
      <span class="mqb-badge">✨ PACOTE COMPLETO DE MATERIAIS PARA IMPRIMIR</span>
      <span class="mqb-text">Acesse os 6 PDFs oficiais: Livro Completo, Cronograma 12 Semanas, Fichas Diárias, Caderno de Pintura, Desafios e Jogos!</span>
      <button class="mqb-btn" onclick="openBonusModal()">Abrir Central de Downloads (6 PDFs) 📥</button>
    </div>
  </div>

  <!-- Book Container with 43 Pages -->
  <main class="book-container" id="bookContainer">
    ${bookHtmlRaw.split('<body>')[1].split('</body>')[0]}
  </main>

  <!-- Bonus & Materials Modal (6 PDFs) -->
  <div class="bonus-modal-overlay" id="bonusModal" onclick="handleModalBackdropClick(event)">
    <div class="bonus-modal-card">
      <div class="bm-header">
        <h3 class="bmh-title">🎁 CENTRAL DE MATERIAIS & BÔNUS A4</h3>
        <button class="bm-close-btn" onclick="closeBonusModal()" title="Fechar">✕</button>
      </div>
      <div class="bm-body">
        <p class="bm-subtitle">Todos os materiais foram desenvolvidos sob rigoroso padrão pedagógico e formatados em A4 de alta resolução, prontos para impressão em casa ou na gráfica. Clique no botão de cada material para fazer o download imediato:</p>

        <div class="bm-grid">
          <!-- Item 1: Livro Oficial -->
          <div class="bm-item">
            <div class="bmi-head">
              <span class="bmi-badge" style="background: #0284C7;">LIVRO OFICIAL</span>
              <span class="bmi-pages">43 Páginas • A4</span>
            </div>
            <h4 class="bmi-title">Missão Tabuada: Volume 1 (1 ao 10)</h4>
            <p class="bmi-desc">O livro completo com 828 contas verificadas, AcroForms interativos para preenchimento no computador ou tablet, Mascotes em alta definição, Tracker dos Escudos e Certificado Oficial.</p>
            <a href="Missao_Tabuada_Volume_1.pdf" download="Missao_Tabuada_Volume_1.pdf" class="bmi-download-btn">
              📥 Baixar Livro Oficial (PDF)
            </a>
          </div>

          <!-- Item 2: Cronograma Mestre -->
          <div class="bm-item">
            <div class="bmi-head">
              <span class="bmi-badge" style="background: #D97706;">PLANEJAMENTO</span>
              <span class="bmi-pages">6 Páginas • A4</span>
            </div>
            <h4 class="bmi-title">Cronograma Mestre de 12 Semanas</h4>
            <p class="bmi-desc">Guia passo a passo de 15 minutos por dia para pais e professores. Roteiro diário de segunda a sexta, metodologia dos micro-passos, sem estresse e com foco na retenção de longo prazo.</p>
            <a href="Cronograma_Mestre_12_Semanas.pdf" download="Cronograma_Mestre_12_Semanas.pdf" class="bmi-download-btn" style="background: #D97706;">
              📥 Baixar Cronograma (PDF)
            </a>
          </div>

          <!-- Item 3: Fichas Diárias -->
          <div class="bm-item">
            <div class="bmi-head">
              <span class="bmi-badge" style="background: #16A34A;">TREINO RÁPIDO</span>
              <span class="bmi-pages">10 Páginas • A4</span>
            </div>
            <h4 class="bmi-title">Caderno de Atividades & Fichas Diárias</h4>
            <p class="bmi-desc">20 fichas diárias em formato de cartão destacável (2 por folha). Ideal para levar em viagens, treinar no café da manhã e manter o hábito ativo sem sobrecarregar a criança.</p>
            <a href="Caderno_de_Atividades_Fichas_Diarias.pdf" download="Caderno_de_Atividades_Fichas_Diarias.pdf" class="bmi-download-btn" style="background: #16A34A;">
              📥 Baixar Fichas Diárias (PDF)
            </a>
          </div>

          <!-- Item 4: Caderno de Pintura -->
          <div class="bm-item">
            <div class="bmi-head">
              <span class="bmi-badge" style="background: #EA580C;">ARTE & LÚDICO</span>
              <span class="bmi-pages">8 Páginas • A4</span>
            </div>
            <h4 class="bmi-title">Caderno de Pintura por Multiplicação</h4>
            <p class="bmi-desc">6 grandes obras de arte matemáticas no formato "Color by Number". A criança calcula a região e descobre a cor correspondente (Escudo, Foguete, Robô, Castelo, Monstro e Troféu).</p>
            <a href="Caderno_de_Pintura_Multiplicacao.pdf" download="Caderno_de_Pintura_Multiplicacao.pdf" class="bmi-download-btn" style="background: #EA580C;">
              📥 Baixar Caderno de Pintura (PDF)
            </a>
          </div>

          <!-- Item 5: Desafios Semanais -->
          <div class="bm-item">
            <div class="bmi-head">
              <span class="bmi-badge" style="background: #9333EA;">AVALIAÇÃO</span>
              <span class="bmi-pages">8 Páginas • A4</span>
            </div>
            <h4 class="bmi-title">Desafios Semanais de Acompanhamento</h4>
            <p class="bmi-desc">12 testes semanais cronometrados correspondentes às 12 semanas do cronograma, com rubrica de avaliação, carimbo do Guardião, gabarito e guia de intervenção pedagógica para os pais.</p>
            <a href="Desafios_Semanais_Acompanhamento.pdf" download="Desafios_Semanais_Acompanhamento.pdf" class="bmi-download-btn" style="background: #9333EA;">
              📥 Baixar Desafios Semanais (PDF)
            </a>
          </div>

          <!-- Item 6: Jogos de Tabuada -->
          <div class="bm-item">
            <div class="bmi-head">
              <span class="bmi-badge" style="background: #E11D48;">JOGOS EM FAMÍLIA</span>
              <span class="bmi-pages">8 Páginas • A4</span>
            </div>
            <h4 class="bmi-title">Kit de Jogos: Trilha, Dominó & Bingo</h4>
            <p class="bmi-desc">Tabuleiro completo da Trilha dos Heróis com peões 3D e dado montável, jogo completo de 28 pedras de Dominó da Multiplicação e Bingo com 8 cartelas coloridas + 36 fichas de sorteio.</p>
            <a href="Jogos_da_Tabuada_Trilha_Domino_Bingo.pdf" download="Jogos_da_Tabuada_Trilha_Domino_Bingo.pdf" class="bmi-download-btn" style="background: #E11D48;">
              📥 Baixar Jogos da Tabuada (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Interactive Victory Toast -->
  <div class="victory-toast" id="victoryToast">
    <span>🏆</span>
    <span id="toastMsg">CHEFÃO DERROTADO COM SUCESSO!</span>
  </div>

  <script>
    // ---------------- AUDIO SYNTHESIZER (Web Audio API) ----------------
    let audioEnabled = true;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function getAudioCtx() {
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playSound(type) {
      if (!audioEnabled) return;
      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'correct') {
          // Cheerful chime (E5 -> B5)
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(659.25, now);
          osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'wrong') {
          // Low gentle buzz
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(140, now + 0.18);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === 'victory') {
          // Victory Trumpet Fanfare
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, idx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, now + idx * 0.1);
            g.gain.setValueAtTime(0.3, now + idx * 0.1);
            g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now + idx * 0.1);
            o.stop(now + idx * 0.1 + 0.35);
          });
        }
      } catch(e) {}
    }

    document.getElementById('audioToggle').addEventListener('click', (e) => {
      audioEnabled = !audioEnabled;
      e.target.textContent = audioEnabled ? '🔊' : '🔇';
    });

    // ---------------- SUPERHERO STOPWATCH ----------------
    let timerRunning = false;
    let timerSeconds = 0;
    let timerInterval = null;

    const swDisplay = document.getElementById('swDisplay');
    const swStartBtn = document.getElementById('swStartBtn');
    const swResetBtn = document.getElementById('swResetBtn');

    function updateSwDisplay() {
      const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
      const secs = (timerSeconds % 60).toString().padStart(2, '0');
      swDisplay.textContent = mins + ':' + secs;
    }

    swStartBtn.addEventListener('click', () => {
      if (!timerRunning) {
        timerRunning = true;
        swStartBtn.textContent = 'PAUSAR';
        swStartBtn.style.background = '#EA580C';
        timerInterval = setInterval(() => {
          timerSeconds++;
          updateSwDisplay();
        }, 1000);
      } else {
        timerRunning = false;
        swStartBtn.textContent = 'CONTINUAR';
        swStartBtn.style.background = '#0284C7';
        clearInterval(timerInterval);
      }
    });

    swResetBtn.addEventListener('click', () => {
      timerRunning = false;
      clearInterval(timerInterval);
      timerSeconds = 0;
      updateSwDisplay();
      swStartBtn.textContent = 'INICIAR';
      swStartBtn.style.background = '#0284C7';
    });

    // ---------------- PAGE SELECTOR NAVIGATION ----------------
    const pageSelect = document.getElementById('pageSelect');
    pageSelect.addEventListener('change', (e) => {
      const pageNum = parseInt(e.target.value);
      const pages = document.querySelectorAll('.page');
      if (pages[pageNum - 1]) {
        pages[pageNum - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // ---------------- INTERACTIVE INPUTS ON THE CARDS ----------------
    const allBoxes = document.querySelectorAll('.eq-box, .inv-box, .boss-box, .bat-box');
    allBoxes.forEach(box => {
      const expected = box.getAttribute('data-ans');
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 3;
      input.inputMode = 'numeric';
      box.appendChild(input);

      input.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (!val) {
          box.classList.remove('correct', 'wrong');
          return;
        }
        if (val === expected) {
          box.classList.add('correct');
          box.classList.remove('wrong');
          playSound('correct');
          spawnMiniConfetti(box);
          checkPageCompletion(box.closest('.page'));
        } else if (val.length >= expected.length) {
          box.classList.add('wrong');
          box.classList.remove('correct');
          playSound('wrong');
        }
      });
    });

    // ---------------- TRACKER SHIELD INTERACTION ----------------
    const trackerCards = document.querySelectorAll('.tracker-shield-card');
    trackerCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('unlocked');
        if (card.classList.contains('unlocked')) {
          playSound('victory');
          triggerGrandConfetti();
          showToast('⭐ ESCUDO DESBLOQUEADO COM GLÓRIA!');
        }
      });
    });

    // ---------------- CHECK PAGE COMPLETION ----------------
    function checkPageCompletion(page) {
      if (!page) return;
      const boxes = page.querySelectorAll('.eq-box, .inv-box, .boss-box, .bat-box');
      if (boxes.length === 0) return;
      const allDone = Array.from(boxes).every(b => b.classList.contains('correct'));
      if (allDone) {
        playSound('victory');
        triggerGrandConfetti();
        const pageTitle = page.querySelector('.page-title') ? page.querySelector('.page-title').textContent : 'Missão';
        showToast('🎉 PARABÉNS! VOCÊ COMPLETOU ' + pageTitle.toUpperCase() + '!');
      }
    }

    // ---------------- VICTORY TOAST ----------------
    function showToast(msg) {
      const toast = document.getElementById('victoryToast');
      document.getElementById('toastMsg').textContent = msg;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3500);
    }

    // ---------------- CONFETTI ANIMATIONS ----------------
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function spawnMiniConfetti(element) {
      const rect = element.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const colors = ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#A855F7'];

      for (let i = 0; i < 15; i++) {
        particles.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 3,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    }

    function triggerGrandConfetti() {
      const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
      for (let i = 0; i < 120; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 5,
          vy: Math.random() * 5 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          alpha: 1,
          decay: Math.random() * 0.01 + 0.005
        });
      }
    }

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(renderConfetti);
    }
    renderConfetti();

    // ---------------- BONUS MODAL CONTROLS ----------------
    function openBonusModal() {
      const modal = document.getElementById('bonusModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeBonusModal() {
      const modal = document.getElementById('bonusModal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    function handleModalBackdropClick(e) {
      if (e.target && e.target.id === 'bonusModal') {
        closeBonusModal();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeBonusModal();
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', webappHtml);
console.log(`Successfully generated index.html (${webappHtml.length} chars)!`);
