# ⚡ Heróis da Multiplicação & Missão Tabuada

> Projeto educacional completo para o ensino lúdico e progressivo da tabuada no Ensino Fundamental I (rotina de 15 minutos diários). Inclui aplicação web interativa com cronômetro e sintetizador de som, conjunto completo de 6 livros/cadernos em PDF formato A4 para imprimir e preencher, landing page comercial de alta conversão e funil de vendas 100% integrado ao ggCheckout.

> [!TIP]
> 🤖 **Trabalhando com IA (Claude, Cursor, Copilot, Antigravity)?**  
> Consulte o guia mestre de arquitetura em [**`AI_AGENT_HANDOFF.md`**](file:///c:/Users/Admin/Downloads/Criativos/AI_AGENT_HANDOFF.md) para todos os detalhes de integração, IDs de produtos, schemas do ggCheckout e regras de tráfego direto.

---

## 🌐 Links Online (GitHub Pages & Checkouts)

- 🛒 **Página de Vendas Oficial (Oferta R$ 10 / R$ 27):**  
  [https://xavier2bit.github.io/missao-tabuada/tabuada-offer.html](https://xavier2bit.github.io/missao-tabuada/tabuada-offer.html)

- 🎮 **Webapp Interativo Oficial (Volume 1 + Central de Materiais):**  
  [https://xavier2bit.github.io/missao-tabuada/](https://xavier2bit.github.io/missao-tabuada/)

- 💳 **Checkout R$ 10 (Missão Tabuada):**  
  [https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17](https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17)

- 💳 **Checkout R$ 27 (Liga dos Heróis 4 Operações):**  
  [https://ggcheckout.com/checkout/p8JH5jQwcxR0SLjkv7kiFN](https://ggcheckout.com/checkout/p8JH5jQwcxR0SLjkv7kiFN)

---

## 🛒 Funil Comercial & Integração ggCheckout

O funil foi desenhado segundo os princípios de Tráfego Direto Low-Ticket para maximizar o Ticket Médio (AOV):

1. **Front-End 1:** Missão Tabuada — Kit Completo de Multiplicação (PDF) — R$ 10,00
2. **Front-End 2:** Liga dos Heróis da Matemática — Pacote Completo 4 Operações (PDF) — R$ 27,00
3. **Order Bump 1:** Kit Jogos de Tabuleiro & Cartas da Tabuada (Imprimir e Jogar) — R$ 9,90
4. **Order Bump 2:** Guia Rápido para Pais: Matemática sem Brigas + Gabaritos — R$ 5,90
5. **1-Click Upsell:** Mega Pack 100 Desafios de Raciocínio Lógico dos Heróis — R$ 29,90 (50% OFF)
6. **Native Downsell:** Versão Pocket 40 Desafios — R$ 14,90 (50% OFF)
7. **Cupom de Desconto:** `HEROIS10` (10% OFF)
8. **Entrega Automática:** Entregável PDF vinculado diretamente na Cloudflare R2 do ggCheckout.
9. **Rastreamento:** Meta Pixel com eventos `PageView`, `ViewContent` e `InitiateCheckout` dinâmico, além de motor UTM persistente no `localStorage`.
10. **Banners Mobile-First:** Banners 750x340 px (@2x retina) com alto contraste para smartphones.

---

## 📚 Kit Completo de Materiais em PDF (Formato A4 para Imprimir)

O projeto conta com 6 entregáveis completos em PDF de altíssima resolução gráfica (300 DPI), prontos para impressão física ou preenchimento digital via formulários interativos (AcroForms):

| Arquivo PDF | Descrição & Estrutura | Páginas | Recursos |
| :--- | :--- | :---: | :--- |
| **`Missao_Tabuada_Volume_1.pdf`** | **Livro Oficial Mestre (Volume 1)**<br>Ciclo de 3 páginas por número (Início, Força, Chefão), Mega Batalhas e Gabarito Secreto. | **43 págs** | 944 campos preenchíveis digitais (AcroForms), 828 contas verificadas, Certificado de Herói. |
| **`Cronograma_Mestre_12_Semanas.pdf`** | **Cronograma Mestre de 12 Semanas**<br>Planejamento pedagógico detalhado semana a semana para os pais e guardiões. | **6 págs** | Roteiro diário de 15 min, micro-passos, checklists semanais e diário de bordo. |
| **`Caderno_de_Atividades_Fichas_Diarias.pdf`** | **Caderno de Atividades & Fichas Diárias**<br>20 fichas diárias destacáveis (2 fichas por página A4 com linhas de corte). | **10 págs** | 360 contas rápidas, cronômetro de herói, visto do guardião e escala de esforço ⭐. |
| **`Caderno_de_Pintura_Multiplicacao.pdf`** | **Caderno de Pintura por Multiplicação**<br>Atividades lúdicas "Color by Multiplication" para fixação visual das contas. | **8 págs** | 6 obras de arte (Escudo, Foguete, Robô, Castelo, Monstro e Troféu), legenda de cores e galeria. |
| **`Desafios_Semanais_Acompanhamento.pdf`** | **Desafios Semanais de Acompanhamento**<br>12 testes de progresso contínuo para avaliação das 12 semanas do cronograma. | **8 págs** | 192 contas cronometradas, rubrica de maestria, gabarito e guia de intervenção para os pais. |
| **`Jogos_da_Tabuada_Trilha_Domino_Bingo.pdf`** | **Kit de Jogos: Trilha, Dominó e Bingo**<br>Jogos de tabuleiro familiares para transformar o treino em diversão em grupo. | **8 págs** | Tabuleiro da Trilha, 4 peões 3D, dado montável, 28 pedras de dominó e 8 cartelas de bingo + sorteador. |

---

## 📂 Estrutura do Repositório

### 1. 🎮 Webapp & Aplicação Interativa
- **`index.html`**: Webapp interativo gamificado com cronômetro funcional, sintetizador de áudio Web Audio API (sons de acerto, erro e vitória), animação física de confetes, desbloqueio interativo de escudos e **Central de Downloads dos 6 PDFs**.
- **`book.html`** / **`book_styles.css`**: Estrutura visual e diagramação tipográfica profissional das 43 páginas do livro.
- **`assets/`** & **`assets_base64.js`**: Mascotes (Herói Menino, Heroína Menina, Monstro Roxo, Lápis Herói, Logo) com fundo transparente e autocrop perfeito.

### 2. 🛍️ Landing Page Comercial & Checkout
- **`tabuada-offer.html`**: Página de vendas de alta conversão responsiva com mockups 3D, seção de prova social/UGC de famílias reais, FAQ interativo e integração direta com o **ggCheckout** com preservação de parâmetros UTM.
- **`tabuada-assets/`**: Imagens comerciais, mockups e assets da página de oferta.
- **`banner1_mobile.html`** / **`banner2_mobile.html`**: Templates HTML dos banners mobile de checkout.
- **`render_mobile_banners.js`**: Script de renderização dos banners para PNG retina (750x340 px).

### 3. 🛠️ Scripts Geradores de PDF (Puppeteer & Chrome Headless)
- **`build_interactive_pdf.js`**: Gera o livro principal de 43 páginas com AcroForms interativos via Puppeteer e pdf-lib.
- **`generate_cronograma_pdf.js`**: Gera o PDF do Cronograma Mestre de 12 Semanas (6 páginas).
- **`generate_fichas_pdf.js`**: Gera o Caderno de Atividades e Fichas Diárias (10 páginas).
- **`generate_pintura_pdf.js`**: Gera o Caderno de Pintura por Multiplicação (8 páginas).
- **`generate_desafios_pdf.js`**: Gera o Caderno de Desafios Semanais de Acompanhamento (8 páginas).
- **`generate_jogos_pdf.js`**: Gera o Kit de Jogos da Tabuada (8 páginas).
- **`build_interactive_webapp.js`**: Compila e atualiza o `index.html` com o livro, áudios e modal de downloads.

---

## 💻 Como Executar e Gerar os Materiais Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/xavier2bit/missao-tabuada.git
cd missao-tabuada

# 2. Instale as dependências
npm install

# 3. Gerar qualquer um dos PDFs:
node generate_cronograma_pdf.js
node generate_fichas_pdf.js
node generate_pintura_pdf.js
node generate_desafios_pdf.js
node generate_jogos_pdf.js
node build_interactive_pdf.js

# 4. Atualizar o webapp interativo:
node build_interactive_webapp.js

# 5. Re-renderizar os banners mobile de checkout:
node render_mobile_banners.js
```
