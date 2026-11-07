// generate_pintura_pdf.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const assets = require('./assets_base64.js');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 6 Color-by-Number Artworks with verified math
const artPages = [
  {
    page: 2,
    title: 'Arte 01: O Escudo de Poder dos Heróis',
    tabuada: 'Tabuadas do 2 e 3',
    difficulty: 'Nível Iniciante ⭐',
    palette: [
      { color: '#EF4444', name: 'Vermelho Herói', val: '6', eqs: '2×3, 3×2' },
      { color: '#3B82F6', name: 'Azul Cósmico', val: '12', eqs: '2×6, 3×4' },
      { color: '#FACC15', name: 'Amarelo Estrela', val: '18', eqs: '2×9, 3×6' },
      { color: '#10B981', name: 'Verde Esmeralda', val: '24', eqs: '3×8' },
      { color: '#8B5CF6', name: 'Roxo Místico', val: '27', eqs: '3×9' },
      { color: '#F97316', name: 'Laranja Fogo', val: '30', eqs: '3×10' }
    ],
    // SVG segments
    svg: `
      <svg viewBox="0 0 600 560" class="art-svg">
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.1"/>
          </filter>
        </defs>

        <!-- Outer Crest Contour -->
        <path d="M 300 30 C 430 30 520 60 520 180 C 520 340 300 510 300 530 C 300 510 80 340 80 180 C 80 60 170 30 300 30 Z" 
              fill="#FFFFFF" stroke="#0F172A" stroke-width="4.5" />

        <!-- Outer Rim Segments -->
        <!-- Rim Top Left -->
        <path d="M 300 30 C 230 30 140 45 100 120 L 140 140 C 170 80 230 65 300 65 Z"
              fill="#FAFAFA" stroke="#0F172A" stroke-width="2.5" />
        <text x="195" y="90" class="svg-eq">2 × 3</text>

        <!-- Rim Top Right -->
        <path d="M 300 30 C 370 30 460 45 500 120 L 460 140 C 430 80 370 65 300 65 Z"
              fill="#FAFAFA" stroke="#0F172A" stroke-width="2.5" />
        <text x="405" y="90" class="svg-eq">3 × 2</text>

        <!-- Rim Mid Left -->
        <path d="M 100 120 C 80 160 80 230 115 310 L 155 285 C 130 220 130 170 140 140 Z"
              fill="#FAFAFA" stroke="#0F172A" stroke-width="2.5" />
        <text x="110" y="220" class="svg-eq">2 × 6</text>

        <!-- Rim Mid Right -->
        <path d="M 500 120 C 520 160 520 230 485 310 L 445 285 C 470 220 470 170 460 140 Z"
              fill="#FAFAFA" stroke="#0F172A" stroke-width="2.5" />
        <text x="480" y="220" class="svg-eq">3 × 4</text>

        <!-- Rim Bot Left -->
        <path d="M 115 310 C 160 400 250 480 300 530 L 300 475 C 260 435 190 365 155 285 Z"
              fill="#FAFAFA" stroke="#0F172A" stroke-width="2.5" />
        <text x="210" y="420" class="svg-eq">2 × 9</text>

        <!-- Rim Bot Right -->
        <path d="M 485 310 C 440 400 350 480 300 530 L 300 475 C 340 435 410 365 445 285 Z"
              fill="#FAFAFA" stroke="#0F172A" stroke-width="2.5" />
        <text x="380" y="420" class="svg-eq">3 × 6</text>

        <!-- Inner Shield Border -->
        <path d="M 300 65 C 390 65 450 85 450 180 C 450 310 300 440 300 470 C 300 440 150 310 150 180 C 150 85 210 65 300 65 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />

        <!-- 4 Quadrants -->
        <!-- Top Left Quad -->
        <path d="M 300 65 L 300 240 L 160 240 C 153 210 153 185 155 160 C 180 95 240 70 300 65 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="225" y="150" class="svg-eq">3 × 8</text>

        <!-- Top Right Quad -->
        <path d="M 300 65 L 300 240 L 440 240 C 447 210 447 185 445 160 C 420 95 360 70 300 65 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="370" y="150" class="svg-eq">3 × 9</text>

        <!-- Bot Left Quad -->
        <path d="M 300 240 L 300 470 C 275 440 215 375 180 320 L 160 240 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="235" y="320" class="svg-eq">3 × 10</text>

        <!-- Bot Right Quad -->
        <path d="M 300 240 L 300 470 C 325 440 385 375 420 320 L 440 240 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="360" y="320" class="svg-eq">2 × 3</text>

        <!-- Central Hero Star Emblem -->
        <circle cx="300" cy="240" r="75" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        
        <!-- Big Star Points -->
        <polygon points="300,175 320,220 370,225 332,255 345,302 300,275 255,302 268,255 230,225 280,220"
                 fill="#FAFAFA" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="245" class="svg-eq" font-size="18">2 × 6</text>

        <!-- Star Top Gem -->
        <circle cx="300" cy="190" r="7" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="300" y="170" class="svg-subeq">3×6</text>

        <!-- Banner Ribbon at Bottom -->
        <path d="M 180 490 L 220 470 L 300 500 L 380 470 L 420 490 L 400 520 L 300 545 L 200 520 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="520" class="svg-eq" font-weight="900" font-size="16">3 × 8 = 24 (VERDE)</text>
      </svg>
    `
  },
  {
    page: 3,
    title: 'Arte 02: O Foguete Espacial dos Heróis',
    tabuada: 'Tabuadas do 4 e 5',
    difficulty: 'Nível Intermediário ⭐⭐',
    palette: [
      { color: '#EF4444', name: 'Vermelho Propulsor', val: '20', eqs: '4×5, 5×4' },
      { color: '#F97316', name: 'Laranja Chama', val: '25', eqs: '5×5' },
      { color: '#FACC15', name: 'Amarelo Sol', val: '16', eqs: '4×4' },
      { color: '#3B82F6', name: 'Azul Cósmico', val: '32', eqs: '4×8' },
      { color: '#06B6D4', name: 'Ciano Janela', val: '35', eqs: '5×7' },
      { color: '#8B5CF6', name: 'Roxo Galáxia', val: '40', eqs: '4×10, 5×8' }
    ],
    svg: `
      <svg viewBox="0 0 600 560" class="art-svg">
        <!-- Stars in Background -->
        <polygon points="80,60 88,75 105,75 92,86 96,102 80,92 64,102 68,86 55,75 72,75" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="80" y="120" class="svg-eq">4 × 4</text>

        <polygon points="500,80 507,93 522,93 510,102 514,116 500,107 486,116 490,102 478,93 493,93" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="500" y="135" class="svg-eq">5 × 5</text>

        <polygon points="120,400 126,410 138,410 128,418 132,430 120,422 108,430 112,418 102,410 114,410" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="120" y="450" class="svg-eq">4 × 4</text>

        <!-- Planet on side -->
        <circle cx="500" cy="400" r="45" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <path d="M 440 400 C 470 380 530 380 560 400 C 530 420 470 420 440 400" fill="none" stroke="#0F172A" stroke-width="2.5" />
        <text x="500" y="405" class="svg-eq">5 × 8</text>

        <!-- ROCKET -->
        <!-- Rocket Nose Cone -->
        <path d="M 300 40 C 265 90 250 140 250 170 L 350 170 C 350 140 335 90 300 40 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <text x="300" y="130" class="svg-eq">4 × 5</text>

        <!-- Body Section 1 -->
        <path d="M 250 170 L 350 170 L 350 250 L 250 250 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        
        <!-- Porthole Outer Ring -->
        <circle cx="300" cy="210" r="32" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <!-- Porthole Inner Glass -->
        <circle cx="300" cy="210" r="22" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="215" class="svg-eq">5 × 7</text>

        <!-- Body Section 2 -->
        <path d="M 250 250 L 350 250 L 350 330 L 250 330 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="295" class="svg-eq">4 × 8</text>

        <!-- Body Section 3 (Engine Base) -->
        <path d="M 250 330 L 350 330 L 340 380 L 260 380 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="360" class="svg-eq">5 × 4</text>

        <!-- Left Fin -->
        <path d="M 250 260 L 175 360 C 185 390 220 385 250 365 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="215" y="335" class="svg-eq">4 × 10</text>

        <!-- Right Fin -->
        <path d="M 350 260 L 425 360 C 415 390 380 385 350 365 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="385" y="335" class="svg-eq">5 × 8</text>

        <!-- Center Thruster Nozzle -->
        <polygon points="275,380 325,380 335,405 265,405" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="398" class="svg-subeq">4×5</text>

        <!-- Big Flame Outer -->
        <path d="M 265 405 C 250 460 270 490 280 535 C 295 500 305 500 320 535 C 330 490 350 460 335 405 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="460" class="svg-eq">5 × 5</text>

        <!-- Inner Flame -->
        <path d="M 280 405 C 275 435 290 455 300 480 C 310 455 325 435 320 405 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="435" class="svg-eq" font-size="12">4 × 4</text>
      </svg>
    `
  },
  {
    page: 4,
    title: 'Arte 03: O Robô Campeão da Liga',
    tabuada: 'Tabuadas do 6 e 7',
    difficulty: 'Nível Intermediário ⭐⭐',
    palette: [
      { color: '#0284C7', name: 'Azul Titânio', val: '42', eqs: '6×7, 7×6' },
      { color: '#10B981', name: 'Verde Circuito', val: '48', eqs: '6×8' },
      { color: '#FACC15', name: 'Amarelo Laser', val: '49', eqs: '7×7' },
      { color: '#EF4444', name: 'Vermelho Alerta', val: '54', eqs: '6×9' },
      { color: '#8B5CF6', name: 'Roxo Energia', val: '56', eqs: '7×8' },
      { color: '#64748B', name: 'Cinza Metal', val: '63', eqs: '7×9' }
    ],
    svg: `
      <svg viewBox="0 0 600 560" class="art-svg">
        <!-- Robot Antenna -->
        <line x1="300" y1="40" x2="300" y2="85" stroke="#0F172A" stroke-width="4" />
        <circle cx="300" cy="35" r="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="40" class="svg-eq">6 × 7</text>

        <!-- Robot Ears -->
        <rect x="180" y="115" width="20" height="40" rx="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="190" y="140" class="svg-subeq">49</text>
        <rect x="400" y="115" width="20" height="40" rx="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="410" y="140" class="svg-subeq">49</text>

        <!-- Robot Head -->
        <rect x="200" y="85" width="200" height="110" rx="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        
        <!-- Visor -->
        <rect x="220" y="105" width="160" height="45" rx="10" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <!-- Eyes -->
        <circle cx="260" cy="127" r="14" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="260" y="132" class="svg-subeq">7×7</text>
        <circle cx="340" cy="127" r="14" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="340" y="132" class="svg-subeq">7×7</text>

        <!-- Robot Smile Grille -->
        <rect x="250" y="165" width="100" height="18" rx="5" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="300" y="178" class="svg-subeq">6 × 8</text>

        <!-- Robot Neck -->
        <rect x="275" y="195" width="50" height="20" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />

        <!-- Robot Torso -->
        <rect x="190" y="215" width="220" height="170" rx="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />

        <!-- Chest Meter -->
        <rect x="220" y="235" width="160" height="70" rx="10" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="275" class="svg-eq" font-size="18">7 × 8</text>

        <!-- Chest Gauge Dial -->
        <path d="M 250 280 C 250 255 350 255 350 280" fill="none" stroke="#0F172A" stroke-width="2" stroke-dasharray="4,4" />

        <!-- 3 Buttons Under Meter -->
        <circle cx="240" cy="345" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="240" y="350" class="svg-subeq">6×9</text>

        <circle cx="300" cy="345" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="300" y="350" class="svg-subeq">7×6</text>

        <circle cx="360" cy="345" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="360" y="350" class="svg-subeq">7×9</text>

        <!-- Left Arm -->
        <path d="M 190 235 L 140 270 L 130 330 L 160 330 L 165 285 L 190 265 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="145" y="300" class="svg-eq">6 × 8</text>

        <!-- Right Arm -->
        <path d="M 410 235 L 460 270 L 470 330 L 440 330 L 435 285 L 410 265 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="455" y="300" class="svg-eq">7 × 9</text>

        <!-- Left Leg -->
        <rect x="225" y="385" width="55" height="90" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="252" y="435" class="svg-eq">6 × 9</text>

        <!-- Right Leg -->
        <rect x="320" y="385" width="55" height="90" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="347" y="435" class="svg-eq">7 × 8</text>

        <!-- Boots -->
        <path d="M 210 475 L 285 475 L 285 510 L 200 510 C 200 495 205 480 210 475 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="245" y="497" class="svg-eq">6 × 7</text>

        <path d="M 390 475 L 315 475 L 315 510 L 400 510 C 400 495 395 480 390 475 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="355" y="497" class="svg-eq">7 × 6</text>
      </svg>
    `
  },
  {
    page: 5,
    title: 'Arte 04: A Fortaleza da Vitória',
    tabuada: 'Tabuadas do 8 e 9',
    difficulty: 'Nível Avançado ⭐⭐⭐',
    palette: [
      { color: '#3B82F6', name: 'Azul Escudo', val: '64', eqs: '8×8' },
      { color: '#F59E0B', name: 'Dourado Torre', val: '72', eqs: '8×9, 9×8' },
      { color: '#DC2626', name: 'Rubi Estandarte', val: '81', eqs: '9×9' },
      { color: '#10B981', name: 'Verde Colina', val: '48', eqs: '8×6' },
      { color: '#8B5CF6', name: 'Púrpura Portal', val: '56', eqs: '8×7' },
      { color: '#64748B', name: 'Cinza Muralha', val: '63', eqs: '9×7' }
    ],
    svg: `
      <svg viewBox="0 0 600 560" class="art-svg">
        <!-- Sun in Background -->
        <circle cx="100" cy="110" r="45" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="100" y="115" class="svg-eq">8 × 8</text>

        <!-- Mountain Hills -->
        <path d="M 0 450 Q 150 380 300 450 Q 450 380 600 450 L 600 550 L 0 550 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="150" y="500" class="svg-eq">8 × 6</text>
        <text x="450" y="500" class="svg-eq">8 × 6</text>

        <!-- Central Castle Keep -->
        <rect x="220" y="200" width="160" height="230" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        
        <!-- Castle Main Wall Battlements -->
        <rect x="220" y="175" width="30" height="25" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <rect x="263" y="175" width="30" height="25" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <rect x="306" y="175" width="30" height="25" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <rect x="350" y="175" width="30" height="25" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="240" class="svg-eq">9 × 7</text>

        <!-- Big Castle Gate (Arch) -->
        <path d="M 260 430 L 260 320 C 260 280 340 280 340 320 L 340 430 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="360" class="svg-eq">8 × 7</text>

        <!-- Left Tower -->
        <rect x="120" y="140" width="80" height="290" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <polygon points="110,140 160,50 210,140" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <!-- Left Flag -->
        <path d="M 160 50 L 160 20 L 210 35 L 160 50" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="185" y="38" class="svg-subeq">81</text>
        <text x="160" y="100" class="svg-eq">8 × 9</text>
        <text x="160" y="280" class="svg-eq">8 × 8</text>

        <!-- Right Tower -->
        <rect x="400" y="140" width="80" height="290" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <polygon points="390,140 440,50 490,140" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <!-- Right Flag -->
        <path d="M 440 50 L 440 20 L 490 35 L 440 50" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="465" y="38" class="svg-subeq">81</text>
        <text x="440" y="100" class="svg-eq">9 × 8</text>
        <text x="440" y="280" class="svg-eq">8 × 8</text>

        <!-- Center Grand Banner -->
        <path d="M 270 270 L 330 270 L 330 310 L 300 295 L 270 310 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="300" y="287" class="svg-subeq">9×9</text>
      </svg>
    `
  },
  {
    page: 6,
    title: 'Arte 05: A Derrota do Monstro Trapalhão',
    tabuada: 'Tabuadas do 6, 7, 8 e 9',
    difficulty: 'Nível Épico ⭐⭐⭐',
    palette: [
      { color: '#9333EA', name: 'Roxo Monstro', val: '42', eqs: '6×7' },
      { color: '#C084FC', name: 'Lavanda Mancha', val: '48', eqs: '6×8' },
      { color: '#FACC15', name: 'Amarelo Chifre', val: '54', eqs: '9×6' },
      { color: '#10B981', name: 'Verde Slime', val: '56', eqs: '7×8' },
      { color: '#EF4444', name: 'Vermelho Língua', val: '64', eqs: '8×8' },
      { color: '#38BDF8', name: 'Azul Confete', val: '72', eqs: '8×9' }
    ],
    svg: `
      <svg viewBox="0 0 600 560" class="art-svg">
        <!-- Floating Stars / Confetti -->
        <polygon points="90,80 95,95 110,95 98,105 102,120 90,110 78,120 82,105 70,95 85,95" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="90" y="135" class="svg-eq">8 × 9</text>

        <polygon points="510,80 515,95 530,95 518,105 522,120 510,110 498,120 502,105 490,95 505,95" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="510" y="135" class="svg-eq">8 × 9</text>

        <!-- Monster Body (Furry Oval blob) -->
        <path d="M 300 130 C 440 130 480 200 480 320 C 480 440 430 490 300 490 C 170 490 120 440 120 320 C 120 200 160 130 300 130 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="4" />
        <text x="300" y="320" class="svg-eq" font-size="22">6 × 7</text>

        <!-- Monster Horn Left -->
        <path d="M 220 150 C 200 90 150 70 140 60 C 170 100 180 130 195 165 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="175" y="105" class="svg-eq">9 × 6</text>

        <!-- Monster Horn Right -->
        <path d="M 380 150 C 400 90 450 70 460 60 C 430 100 420 130 405 165 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="425" y="105" class="svg-eq">9 × 6</text>

        <!-- Giant Googly Eyes -->
        <circle cx="240" cy="220" r="42" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <circle cx="240" cy="220" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="240" y="225" class="svg-subeq">6×8</text>

        <circle cx="360" cy="220" r="42" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <circle cx="360" cy="220" r="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="360" y="225" class="svg-subeq">6×8</text>

        <!-- Monster Spots -->
        <circle cx="180" cy="310" r="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="180" y="315" class="svg-subeq">48</text>

        <circle cx="420" cy="310" r="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="420" y="315" class="svg-subeq">48</text>

        <circle cx="230" cy="420" r="20" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="230" y="425" class="svg-subeq">48</text>

        <circle cx="370" cy="420" r="20" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="370" y="425" class="svg-subeq">48</text>

        <!-- Silly Droopy Mouth -->
        <path d="M 230 370 Q 300 440 370 370 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <!-- Tongue -->
        <path d="M 270 395 C 270 445 330 445 330 395 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="420" class="svg-subeq">8×8</text>

        <!-- Monster Stubby Feet -->
        <path d="M 200 480 C 180 535 270 535 260 485 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="230" y="515" class="svg-eq">7 × 8</text>

        <path d="M 340 485 C 330 535 420 535 400 480 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="370" y="515" class="svg-eq">7 × 8</text>
      </svg>
    `
  },
  {
    page: 7,
    title: 'Arte 06: O Grande Troféu da Maestria',
    tabuada: 'Tabuadas do 1 ao 10 Completa',
    difficulty: 'Nível Lendário ⭐⭐⭐⭐',
    palette: [
      { color: '#FACC15', name: 'Ouro Puro', val: '100', eqs: '10×10' },
      { color: '#F97316', name: 'Laranja Ouro', val: '90', eqs: '9×10, 10×9' },
      { color: '#3B82F6', name: 'Azul Diamante', val: '72', eqs: '8×9' },
      { color: '#EF4444', name: 'Rubi Real', val: '81', eqs: '9×9' },
      { color: '#10B981', name: 'Esmeralda', val: '56', eqs: '7×8' },
      { color: '#8B5CF6', name: 'Púrpura Campeão', val: '64', eqs: '8×8' }
    ],
    svg: `
      <svg viewBox="0 0 600 560" class="art-svg">
        <!-- Laurel Wreath Left -->
        <path d="M 170 320 C 120 250 120 140 180 90" fill="none" stroke="#0F172A" stroke-width="3" stroke-dasharray="12,8" />
        <circle cx="130" cy="190" r="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="130" y="195" class="svg-subeq">7×8</text>

        <!-- Laurel Wreath Right -->
        <path d="M 430 320 C 480 250 480 140 420 90" fill="none" stroke="#0F172A" stroke-width="3" stroke-dasharray="12,8" />
        <circle cx="470" cy="190" r="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <text x="470" y="195" class="svg-subeq">7×8</text>

        <!-- Trophy Cup Handles -->
        <!-- Left Handle -->
        <path d="M 210 130 C 110 130 110 260 210 260" fill="none" stroke="#0F172A" stroke-width="6" />
        <path d="M 210 145 C 130 145 130 245 210 245" fill="none" stroke="#0F172A" stroke-width="3" />
        <text x="155" y="200" class="svg-eq">8 × 8</text>

        <!-- Right Handle -->
        <path d="M 390 130 C 490 130 490 260 390 260" fill="none" stroke="#0F172A" stroke-width="6" />
        <path d="M 390 145 C 470 145 470 245 390 245" fill="none" stroke="#0F172A" stroke-width="3" />
        <text x="445" y="200" class="svg-eq">8 × 8</text>

        <!-- Cup Top Rim -->
        <ellipse cx="300" cy="100" rx="100" ry="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <text x="300" y="105" class="svg-eq">9 × 10</text>

        <!-- Cup Main Body -->
        <path d="M 200 100 C 200 240 250 290 280 320 L 320 320 C 350 290 400 240 400 100 Z"
              fill="#FFFFFF" stroke="#0F172A" stroke-width="4" />
        <text x="300" y="190" class="svg-eq" font-size="24">10 × 10</text>

        <!-- Star Badge on Cup -->
        <polygon points="300,210 308,228 328,228 312,240 318,258 300,246 282,258 288,240 272,228 292,228"
                 fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="280" class="svg-eq">9 × 9</text>

        <!-- Trophy Stem -->
        <path d="M 280 320 L 270 380 L 330 380 L 320 320 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        <text x="300" y="355" class="svg-eq">8 × 9</text>

        <!-- Trophy Base Tier 1 -->
        <rect x="230" y="380" width="140" height="30" rx="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" />
        <text x="300" y="400" class="svg-eq">10 × 9</text>

        <!-- Trophy Base Pedestal -->
        <polygon points="210,410 390,410 410,490 190,490" fill="#FFFFFF" stroke="#0F172A" stroke-width="3.5" />
        
        <!-- Golden Plaque on Pedestal -->
        <rect x="220" y="425" width="160" height="50" rx="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
        <text x="300" y="445" class="svg-eq" font-size="14" font-weight="900">NÚMERO 1 DA TABUADA</text>
        <text x="300" y="465" class="svg-subeq" font-size="11">MAESTRIA MATEMÁTICA</text>
      </svg>
    `
  }
];

function generateCoverHtml() {
  return `
  <div class="page page-cover">
    <div class="cover-border-frame">
      <div class="c-header">
        <span class="c-super-badge">🎨 COLEÇÃO OFICIAL • BÔNUS EXCLUSIVO</span>
        <h1 class="c-title">CADERNO DE PINTURA<br><span class="c-hl">POR MULTIPLICAÇÃO</span></h1>
        <p class="c-subtitle">Aprenda a tabuada se divertindo! Resolva cada conta, descubra o código secreto de cores e dê vida aos Heróis da Matemática.</p>
      </div>

      <div class="c-mascots-row">
        <div class="c-mascot-card">
          <img src="${assets.heroi_menino}" alt="Herói Menino" class="c-mascot-img" />
          <span class="cm-name">Herói da Multiplicação</span>
        </div>
        <div class="c-center-shield">
          <img src="${assets.logo}" alt="Logo Missão Tabuada" class="c-logo-big" />
          <div class="c-rule-pill">
            <span>✨ 6 GRANDES OBRAS DE ARTE</span>
            <span>🎯 DO BÁSICO AO AVANÇADO</span>
            <span>🖨️ FORMATO A4 PARA COLORIR</span>
          </div>
        </div>
        <div class="c-mascot-card">
          <img src="${assets.heroi_menina}" alt="Heroína Menina" class="c-mascot-img" />
          <span class="cm-name">Guardiã dos Cálculos</span>
        </div>
      </div>

      <div class="c-how-to-box">
        <h3 class="htb-title">🖍️ COMO FUNCIONA O CADERNO DE PINTURA:</h3>
        <div class="htb-steps">
          <div class="step-card">
            <span class="sc-num">1</span>
            <strong>Olhe a Legenda</strong>
            <p>Cada cor tem um número que é o resultado de uma multiplicação.</p>
          </div>
          <div class="step-card">
            <span class="sc-num">2</span>
            <strong>Calcule a Região</strong>
            <p>Faça a continha da área do desenho (ex: 3 × 4 = 12).</p>
          </div>
          <div class="step-card">
            <span class="sc-num">3</span>
            <strong>Pinte & Se Divirta</strong>
            <p>Use lápis de cor, giz de cera ou canetinha para colorir!</p>
          </div>
        </div>
      </div>

      <div class="c-footer">
        <div class="cf-left">
          <span>Nome do Artista Herói: ____________________________________</span>
        </div>
        <div class="cf-right">
          <span>Data: ____/____/________</span>
        </div>
      </div>
    </div>
  </div>`;
}

function generateArtPageHtml(item) {
  const palettePills = item.palette.map(p => `
    <div class="pal-pill">
      <span class="pp-circle" style="background-color: ${p.color};"></span>
      <div class="pp-info">
        <strong class="pp-name" style="color: ${p.color};">${p.name}</strong>
        <span class="pp-val">Resultado: <b>${p.val}</b></span>
        <span class="pp-eqs">(${p.eqs})</span>
      </div>
    </div>
  `).join('');

  return `
  <div class="page page-art">
    <div class="art-top-bar">
      <div class="atb-left">
        <img src="${assets.logo}" class="atb-logo" alt="Logo" />
        <div>
          <span class="atb-tag">${item.tabuada.toUpperCase()} • ${item.difficulty}</span>
          <h2 class="atb-title">${item.title}</h2>
        </div>
      </div>
      <div class="atb-right">
        <span>Nome: _________________</span>
        <span>Data: ___/___</span>
      </div>
    </div>

    <div class="art-palette-bar">
      <div class="apb-header">
        <span class="apb-badge">🎨 LEGENDA DE CORES</span>
        <span class="apb-tip">Encontre a conta dentro do desenho e pinte com a cor correspondente!</span>
      </div>
      <div class="apb-grid">
        ${palettePills}
      </div>
    </div>

    <div class="art-canvas-container">
      ${item.svg}
    </div>

    <div class="art-bottom-bar">
      <div class="abb-left">
        <span>⭐ Avaliação do Artista:</span>
        <span class="abb-stars">( ) Muito Fácil  ( ) Na Medida  ( ) Desafio Épico!</span>
      </div>
      <div class="abb-right">
        <span>Missão Tabuada • Caderno de Pintura • Página ${item.page} de 8</span>
      </div>
    </div>
  </div>`;
}

function generateGalleryHtml() {
  return `
  <div class="page page-gallery">
    <div class="gallery-frame">
      <div class="gt-header">
        <img src="${assets.logo}" class="gt-logo" alt="Logo" />
        <h2 class="gt-title">🏆 GALERIA DE ARTE DOS HERÓIS & GABARITO</h2>
        <p class="gt-desc">Parabéns por completar todas as 6 obras de arte matemáticas! Confira aqui o resumo das suas conquistas.</p>
      </div>

      <div class="gallery-grid">
        <div class="g-card">
          <div class="gc-badge">ARTE 01</div>
          <h4>O Escudo de Poder</h4>
          <span class="gc-tab">Tabuadas do 2 e 3</span>
          <div class="gc-check-box">
            <span>[ ] Concluído</span>
            <span>Data: ___/___</span>
          </div>
        </div>

        <div class="g-card">
          <div class="gc-badge">ARTE 02</div>
          <h4>O Foguete Espacial</h4>
          <span class="gc-tab">Tabuadas do 4 e 5</span>
          <div class="gc-check-box">
            <span>[ ] Concluído</span>
            <span>Data: ___/___</span>
          </div>
        </div>

        <div class="g-card">
          <div class="gc-badge">ARTE 03</div>
          <h4>O Robô Campeão</h4>
          <span class="gc-tab">Tabuadas do 6 e 7</span>
          <div class="gc-check-box">
            <span>[ ] Concluído</span>
            <span>Data: ___/___</span>
          </div>
        </div>

        <div class="g-card">
          <div class="gc-badge">ARTE 04</div>
          <h4>A Fortaleza da Vitória</h4>
          <span class="gc-tab">Tabuadas do 8 e 9</span>
          <div class="gc-check-box">
            <span>[ ] Concluído</span>
            <span>Data: ___/___</span>
          </div>
        </div>

        <div class="g-card">
          <div class="gc-badge">ARTE 05</div>
          <h4>O Monstro Trapalhão</h4>
          <span class="gc-tab">Tabuadas do 6 ao 9</span>
          <div class="gc-check-box">
            <span>[ ] Concluído</span>
            <span>Data: ___/___</span>
          </div>
        </div>

        <div class="g-card">
          <div class="gc-badge">ARTE 06</div>
          <h4>O Grande Troféu</h4>
          <span class="gc-tab">Tabuada Completa 1-10</span>
          <div class="gc-check-box">
            <span>[ ] Concluído</span>
            <span>Data: ___/___</span>
          </div>
        </div>
      </div>

      <div class="diploma-mini-box">
        <img src="${assets.lapis_trans}" class="dmb-lapis" alt="Lápis Herói" />
        <div class="dmb-content">
          <h3>🎖️ SELO DE ARTISTA MATEMÁTICO SUPREMO</h3>
          <p>Certifico que o(a) pequeno(a) artista concluiu com maestria todas as folhas de pintura por multiplicação, desenvolvendo foco, paciência, criatividade e domínio pleno da tabuada!</p>
          <div class="dmb-sig-row">
            <div>
              <span>________________________________________</span>
              <small>Assinatura do Artista</small>
            </div>
            <div>
              <span>________________________________________</span>
              <small>Assinatura do Guardião (Pai/Mãe)</small>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-page-id">
        <span>Missão Tabuada • Volume 1 • Caderno Oficial de Pintura</span>
        <strong>Página 8 de 8</strong>
      </div>
    </div>
  </div>`;
}

function generatePinturaHtml() {
  const pages = [
    generateCoverHtml(),
    ...artPages.map(generateArtPageHtml),
    generateGalleryHtml()
  ];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Caderno de Pintura por Multiplicação - Missão Tabuada</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4 portrait; margin: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #475569; color: #1E293B; }
    
    .page {
      width: 210mm; height: 297mm; min-height: 297mm; max-height: 297mm;
      background: #FFFFFF; position: relative; page-break-after: always; break-after: page;
      padding: 10mm 12mm 8mm 12mm; display: flex; flex-direction: column; overflow: hidden;
      margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    @media print { body { background: transparent; } .page { box-shadow: none; margin: 0; } }

    /* COVER */
    .page-cover { padding: 8mm; background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); }
    .cover-border-frame {
      border: 4px solid #D97706; border-radius: 16px; height: 100%; padding: 16px 20px;
      display: flex; flex-direction: column; justify-content: space-between; background: #FFFFFF;
      box-shadow: inset 0 0 20px rgba(217, 119, 6, 0.15);
    }
    .c-header { text-align: center; }
    .c-super-badge { display: inline-block; background: #D97706; color: #FFFFFF; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 1px; margin-bottom: 8px; }
    .c-title { font-family: 'Fredoka', sans-serif; font-size: 32px; font-weight: 900; color: #0F172A; line-height: 1.15; }
    .c-hl { color: #EA580C; background: -webkit-linear-gradient(45deg, #EA580C, #D97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .c-subtitle { font-size: 12px; color: #475569; max-width: 520px; margin: 8px auto 0 auto; line-height: 1.4; font-weight: 600; }

    .c-mascots-row { display: flex; align-items: center; justify-content: space-around; margin: 10px 0; }
    .c-mascot-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .c-mascot-img { width: 140px; height: 170px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.15)); }
    .cm-name { font-family: 'Fredoka', sans-serif; font-size: 10px; font-weight: 800; color: #64748B; margin-top: 4px; }
    .c-center-shield { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .c-logo-big { width: 170px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.15)); }
    .c-rule-pill { display: flex; flex-direction: column; gap: 4px; background: #FEF3C7; border: 2px dashed #D97706; padding: 8px 14px; border-radius: 12px; font-family: 'Fredoka', sans-serif; font-size: 10.5px; font-weight: 800; color: #B45309; }

    .c-how-to-box { background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; }
    .htb-title { font-family: 'Fredoka', sans-serif; font-size: 12.5px; font-weight: 800; color: #0F172A; margin-bottom: 8px; text-align: center; }
    .htb-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; }
    .step-card { background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 8px; }
    .sc-num { display: inline-flex; width: 22px; height: 22px; background: #0284C7; color: #FFFFFF; border-radius: 50%; align-items: center; justify-content: center; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 800; margin-bottom: 4px; }
    .step-card strong { display: block; font-family: 'Fredoka', sans-serif; font-size: 11px; color: #0F172A; margin-bottom: 2px; }
    .step-card p { font-size: 9.5px; color: #64748B; line-height: 1.25; }

    .c-footer { display: flex; justify-content: space-between; align-items: center; background: #F1F5F9; border-radius: 8px; padding: 8px 14px; font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 700; color: #475569; }

    /* ART PAGES */
    .page-art { display: flex; flex-direction: column; justify-content: space-between; }
    .art-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px; }
    .atb-left { display: flex; align-items: center; gap: 10px; }
    .atb-logo { height: 36px; object-fit: contain; }
    .atb-tag { display: inline-block; background: #E0F2FE; color: #0284C7; font-family: 'Fredoka', sans-serif; font-size: 9.5px; font-weight: 800; padding: 1px 8px; border-radius: 8px; margin-bottom: 2px; }
    .atb-title { font-family: 'Fredoka', sans-serif; font-size: 16px; font-weight: 900; color: #0F172A; }
    .atb-right { font-family: 'Fredoka', sans-serif; font-size: 10.5px; color: #64748B; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }

    .art-palette-bar { background: #F8FAFC; border: 2px solid #CBD5E1; border-radius: 10px; padding: 6px 10px; margin: 6px 0; }
    .apb-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .apb-badge { font-family: 'Fredoka', sans-serif; font-size: 10px; font-weight: 800; background: #0F172A; color: #FFFFFF; padding: 2px 8px; border-radius: 6px; }
    .apb-tip { font-size: 9.5px; color: #64748B; font-weight: 600; }
    .apb-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
    .pal-pill { background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 4px 6px; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .pp-circle { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #0F172A; flex-shrink: 0; }
    .pp-info { display: flex; flex-direction: column; overflow: hidden; }
    .pp-name { font-family: 'Fredoka', sans-serif; font-size: 8.5px; font-weight: 800; line-height: 1.1; white-space: nowrap; text-overflow: ellipsis; }
    .pp-val { font-size: 9px; color: #0F172A; font-weight: 700; line-height: 1.1; }
    .pp-val b { font-family: 'Fredoka', sans-serif; font-size: 11px; }
    .pp-eqs { font-size: 7.5px; color: #64748B; white-space: nowrap; }

    .art-canvas-container {
      flex: 1; border: 2.5px solid #0F172A; border-radius: 12px; background: #FFFFFF;
      display: flex; align-items: center; justify-content: center; padding: 8px;
      box-shadow: inset 0 0 15px rgba(0,0,0,0.03);
    }
    .art-svg { width: 100%; height: 100%; max-height: 200mm; }

    .svg-eq { font-family: 'Fredoka', sans-serif; font-size: 15px; font-weight: 800; fill: #0F172A; text-anchor: middle; dominant-baseline: central; }
    .svg-subeq { font-family: 'Fredoka', sans-serif; font-size: 11px; font-weight: 700; fill: #334155; text-anchor: middle; dominant-baseline: central; }

    .art-bottom-bar { display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8; padding-top: 4px; border-top: 1.5px solid #E2E8F0; }
    .abb-left { color: #475569; font-weight: 600; display: flex; gap: 8px; }
    .abb-stars { font-family: 'Fredoka', sans-serif; font-weight: 700; color: #0284C7; }

    /* GALLERY */
    .page-gallery { padding: 10mm; background: #FFFBEB; }
    .gallery-frame { border: 3px solid #F59E0B; border-radius: 14px; background: #FFFFFF; height: 100%; padding: 14px 18px; display: flex; flex-direction: column; justify-content: space-between; }
    .gt-header { text-align: center; }
    .gt-logo { height: 42px; object-fit: contain; margin-bottom: 4px; }
    .gt-title { font-family: 'Fredoka', sans-serif; font-size: 20px; font-weight: 900; color: #0F172A; }
    .gt-desc { font-size: 11px; color: #64748B; max-width: 500px; margin: 4px auto 0 auto; font-weight: 600; }

    .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 12px 0; }
    .g-card { border: 2px solid #E2E8F0; border-radius: 10px; padding: 10px; background: #F8FAFC; text-align: center; }
    .gc-badge { font-family: 'Fredoka', sans-serif; font-size: 9px; font-weight: 800; background: #0284C7; color: #FFFFFF; padding: 2px 8px; border-radius: 6px; display: inline-block; margin-bottom: 4px; }
    .g-card h4 { font-family: 'Fredoka', sans-serif; font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 2px; }
    .gc-tab { font-size: 10px; color: #D97706; font-weight: 700; display: block; margin-bottom: 8px; }
    .gc-check-box { background: #FFFFFF; border: 1.5px dashed #CBD5E1; border-radius: 6px; padding: 6px; font-family: 'Fredoka', sans-serif; font-size: 10px; color: #64748B; display: flex; justify-content: space-between; font-weight: 700; }

    .diploma-mini-box { display: flex; align-items: center; gap: 16px; background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 12px 18px; }
    .dmb-lapis { width: 75px; height: 95px; object-fit: contain; }
    .dmb-content { flex: 1; }
    .dmb-content h3 { font-family: 'Fredoka', sans-serif; font-size: 14px; font-weight: 900; color: #B45309; margin-bottom: 4px; }
    .dmb-content p { font-size: 10px; color: #78350F; line-height: 1.35; margin-bottom: 8px; font-weight: 600; }
    .dmb-sig-row { display: flex; justify-content: space-between; gap: 16px; }
    .dmb-sig-row div { display: flex; flex-direction: column; text-align: center; }
    .dmb-sig-row span { font-size: 11px; color: #B45309; }
    .dmb-sig-row small { font-size: 8.5px; color: #78350F; font-weight: 700; }

    .bottom-page-id { display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8; padding-top: 4px; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  ${pages.join('\n')}
</body>
</html>`;
}

async function run() {
  const html = generatePinturaHtml();
  fs.writeFileSync('pintura.html', html);
  console.log('pintura.html written.');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
  const fileUrl = 'file:///' + path.resolve('pintura.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('Caderno_de_Pintura_Multiplicacao.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('Generated Caderno_de_Pintura_Multiplicacao.pdf! Size:', fs.statSync(pdfPath).size);
}

run();
