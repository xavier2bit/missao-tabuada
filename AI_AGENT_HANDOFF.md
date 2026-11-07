# 🤖 AI Agent Handoff & Architecture Blueprint
# ⚡ Missão Tabuada & Liga dos Heróis da Matemática

> **Para qualquer IA ou Desenvolvedor:** Este documento é a fonte única da verdade técnica, comercial e de infraestrutura deste repositório. Leia este guia na íntegra antes de realizar qualquer alteração no código, nos entregáveis em PDF, na página de vendas ou na integração com o checkout.

---

## 📌 1. Visão Geral do Projeto

- **Produto:** "Missão Tabuada" e "Liga dos Heróis da Matemática".
- **Nicho:** Educação Infantil / Ensino Fundamental I (crianças de 6 a 10 anos).
- **Público-Alvo:** Mães de 25 a 45 anos, das classes B, C e D no Brasil, que enfrentam batalhas diárias de lição de casa com filhos travando, chorando ou desmotivados na tabuada e na matemática básica.
- **Proposta Única de Valor (UVP):** Método lúdico progressivo de 15 minutos diários com heróis e missões gamificadas que destrava a tabuada e o cálculo mental sem brigas, com PDFs prontos para impressão física ou uso digital.
- **Repositório GitHub:** `https://github.com/xavier2bit/missao-tabuada` (Branch: `main`)
- **Hospedagem Frontend:** GitHub Pages

---

## 🌐 2. Mapa de URLs Oficiais Ativas

| Destino | URL Pública | Finalidade |
| :--- | :--- | :--- |
| **Página de Vendas Oficial** | `https://xavier2bit.github.io/missao-tabuada/tabuada-offer.html` | Página de vendas de alta conversão (Tráfego Direto) |
| **Webapp Gamificado & Central** | `https://xavier2bit.github.io/missao-tabuada/` | Webapp interativo com áudio e download dos 6 PDFs |
| **Checkout R$ 10 (Front-End 1)** | `https://ggcheckout.com/checkout/DJ7r66JatfLqr0LXVPjm17` | Checkout direto do Kit Básico de Multiplicação |
| **Checkout R$ 27 (Front-End 2)** | `https://ggcheckout.com/checkout/p8JH5jQwcxR0SLjkv7kiFN` | Checkout direto do Pacote Completo 4 Operações |

> [!NOTE]
> No ggCheckout, as URLs públicas utilizam rigorosamente o padrão `https://ggcheckout.com/checkout/{publicId}`. A rota legada `/c/{publicId}` retorna 404.

---

## 💳 3. Arquitetura do Funil no ggCheckout

- **Business ID:** `JxqoFLG6dJdztFuabJh7wYTlGOk1`
- **Gateway Ativo:** Mercado Pago (PIX com fallback instantâneo e Cartão de Crédito até 12x).
- **Campos do Formulário:** CPF desativado (`haveCpf: false`) para máxima velocidade de conversão; Nome e WhatsApp obrigatórios.
- **Cupom Ativo:** `HEROIS10` (10% de desconto adicional).

### Catálogo de Produtos Criados no ggCheckout:
1. **Front-End 1 (R$ 10,00):** `Missão Tabuada — Kit Completo de Multiplicação (PDF)`
   - ID: `9f2e52f6-934e-4fa7-831f-4e56a8ee34ad`
   - Checkout UID: `bb925a2b-fe55-45b6-8148-009bb8ae292d` (Public ID: `DJ7r66JatfLqr0LXVPjm17`)
   - Entregável: `Missao_Tabuada_Volume_1.pdf` (9.41 MB) hospedado na Cloudflare R2 com entrega automática após aprovação.
2. **Front-End 2 (R$ 27,00):** `Liga dos Heróis da Matemática — Pacote Completo 4 Operações (PDF)`
   - ID: `3ec19aed-1920-431b-bbc6-e1119d4ed148`
   - Checkout UID: `c717d219-5f02-4d4e-92e1-27f0b03492d8` (Public ID: `p8JH5jQwcxR0SLjkv7kiFN`)
   - Entregável: `Missao_Tabuada_Volume_1.pdf` hospedado na Cloudflare R2 com entrega automática.
3. **Order Bump 1 (R$ 9,90):** `Kit Jogos de Tabuleiro & Cartas da Tabuada (Imprimir e Jogar)`
   - ID: `166b2216-9a92-4488-8608-dbc5f06809b6`
   - Inclui: Tabuleiro gigante, Dominó dos Heróis, Baralho de Batalha e Jogo da Memória.
4. **Order Bump 2 (R$ 5,90):** `Guia Rápido para Pais: Matemática sem Brigas + Gabaritos`
   - ID: `43c444f8-a78a-4287-b55a-61bc5c7e919e`
   - Inclui: Técnicas de reforço positivo, desmistificação do 7 e 8, e gabarito ilustrado.
5. **1-Click Upsell Pós-Compra (R$ 29,90):** `Mega Pack 100 Desafios de Raciocínio Lógico dos Heróis`
   - ID do Produto: `636062e7-73ea-4290-87cb-edb9f54ea45c`
   - ID do Upsell: `e2b23b57-768c-4c67-86dd-565a7730890a`
   - Oferta: 50% OFF (De R$ 59,90 por R$ 29,90) com cronômetro de 10 minutos.
6. **Native Downsell (R$ 14,90):** `Versão Pocket: 40 Desafios de Raciocínio Lógico dos Heróis`
   - ID do Produto: `77cf5c97-c1f7-4642-94bc-a66755b7103a`
   - Oferta: 50% OFF (De R$ 29,90 por R$ 14,90) com cronômetro de 5 minutos caso rejeite o Upsell.

---

## 🎨 4. Esquema de Estilização & Correção de Contraste no ggCheckout

> [!WARNING]
> **Atenção Crítica de UI:** O ggCheckout usa Tailwind CSS com `next-themes`. Celulares de clientes em modo escuro herdam a classe `dark` no elemento `<html>`, o que torna títulos herdados brancos (`#FAFAFA`). Como o card do bump tem fundo branco fixo, os títulos tornam-se completamente invisíveis caso não sejam explicitamente sobrescritos na API!

### O Payload Obrigatório no `update_checkout`:
```json
{
  "checkoutId": "<UID>",
  "checkout": {
    "theme": "light",
    "primaryColor": "#2563EB",
    "buttonColor": "#16A34A",
    "buttonTextColor": "#FFFFFF",
    "section": {
      "bgColor": "#F8FAFC",
      "borderColor": "#E2E8F0",
      "orderBumps": {
        "title": "⚡ Aproveite e Adicione ao Pedido:",
        "colorTitle": "#0F172A",
        "bgColor": "#FFFFFF",
        "bgOrderbumpBorder": "#2563EB",
        "buttonText": "+ Adicionar ao Pedido",
        "hideDescription": false,
        "showInstallments": true
      },
      "cardPhotoAndTitle": {
        "colorTitle": "#0F172A",
        "authorTextColor": "#475569"
      },
      "summaryOrder": {
        "summaryBgColor": "#FFFFFF",
        "borderColor": "#E2E8F0",
        "colorTitle": "#0F172A",
        "colorOrderBumpsTitle": "#0F172A",
        "dividerColor": "#E2E8F0"
      },
      "cardPayment": {
        "buttonColor": "#16A34A",
        "buttonTextColor": "#FFFFFF",
        "titleTextColor": "#0F172A"
      }
    }
  }
}
```
* **Mapeamento:** O parâmetro `section.orderBumps.colorTitle: "#0F172A"` força um estilo inline `style="color: #0F172A"` no `<h3>` do componente React, garantindo 100% de contraste em qualquer celular ou tema.

---

## 📱 5. Banners Mobile-First do Checkout

- **Proporção:** 2.2:1 (750x340 px rendered @2x retina).
- **Modelos HTML:**
  - `banner1_mobile.html`: Banner para a Missão Tabuada (Front-End 1).
  - `banner2_mobile.html`: Banner para a Liga dos Heróis (Front-End 2).
- **Como Re-renderizar os Banners:**
  ```bash
  node render_mobile_banners.js
  ```
- **Hospedagem:** Ao fazer `git push origin main`, os arquivos são servidos em `tabuada-assets/banner-checkout-*.png` e sincronizados via `update_checkout` com o parâmetro `bannerUrl`. O ggCheckout faz proxy automático para sua CDN Cloudflare R2 (`/api/r2-proxy/uploads/...avif`).

---

## 🎯 6. Rastreamento, Meta Pixel e Motor UTM Persistente

Na página [`tabuada-offer.html`](file:///c:/Users/Admin/Downloads/Criativos/tabuada-offer.html):

### 1. Meta Pixel Integrado:
- Inicializado com rastreamento de `PageView`.
- Dispara `ViewContent` com o nome da oferta e moeda `BRL`.
- Dispara `InitiateCheckout` dinâmico ao clicar nos botões de CTA, enviando o valor correto (R$ 10,00 ou R$ 27,00):
  ```javascript
  fbq('track', 'InitiateCheckout', {
    content_name: planTitle,
    value: planValue,
    currency: 'BRL'
  });
  ```
> **Para ativar o Pixel real:** Substitua a string `PIXEL_ID_PLACEHOLDER` no topo do arquivo pelo ID numérico da conta de anúncios do cliente.

### 2. Motor de Preservação de UTMs (Local Storage Engine):
A página captura automaticamente todos os parâmetros de tráfego da URL de entrada:
`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `src`, `fbclid`, `gclid`, `ttclid`.
- Salva no `localStorage` do navegador para que a mãe possa navegar, rolar a página ou fechar e abrir novamente sem perder o rastreamento.
- Ao clicar em qualquer botão de compra, os parâmetros são concatenados dinamicamente na URL de checkout do ggCheckout.

---

## 📚 7. Entregáveis em PDF & Pipeline de Geração

O repositório possui 6 PDFs gerados via código usando Puppeteer e `pdf-lib`:

1. `Missao_Tabuada_Volume_1.pdf` (43 págs) — Livro interativo com 944 AcroForms digitais e gabarito.
2. `Cronograma_Mestre_12_Semanas.pdf` (6 págs) — Roteiro de 15 minutos semana a semana para pais.
3. `Caderno_de_Atividades_Fichas_Diarias.pdf` (10 págs) — 20 fichas destacáveis de treino.
4. `Caderno_de_Pintura_Multiplicacao.pdf` (8 págs) — Atividades de "Color by Number" da tabuada.
5. `Desafios_Semanais_Acompanhamento.pdf` (8 págs) — 12 provas de progresso para os pais acompanharem.
6. `Jogos_da_Tabuada_Trilha_Domino_Bingo.pdf` (8 págs) — Tabuleiro, dominó, cartas e bingo para recortar e jogar.

### Comandos de Compilação Local:
```bash
# Instalação das dependências
npm install

# Compilar PDFs individuais:
node generate_cronograma_pdf.js
node generate_fichas_pdf.js
node generate_pintura_pdf.js
node generate_desafios_pdf.js
node generate_jogos_pdf.js
node build_interactive_pdf.js

# Atualizar o webapp interativo:
node build_interactive_webapp.js
```

---

## 📈 8. Economia Unitária & Estratégia de Mídia (Meta Ads)

Conforme documentado no framework [direct-response-lowticket](file:///c:/Users/Admin/Downloads/Criativos/.agents/skills/direct-response-lowticket/SKILL.md):

- **Meta de CPA / CAC:** R$ 7,00 a R$ 12,00.
- **Ticket Médio (AOV Projetado):** R$ 23,00 a R$ 28,00 através da tração dos Order Bumps (40% de adesão a R$ 9,90 e R$ 5,90) e Upsell (15% de adesão a R$ 29,90).
- **ROAS Esperado:** 2.2x a 3.0x no front-end.
- **Segmentação no Gerenciador de Anúncios:**
  - Mulheres, 25 a 45 anos, Brasil.
  - Interesses (ou Aberto/Advantage+): Educação Infantil, Ensino Fundamental, Alfabetização, Maternidade, Jogos Educativos.
- **Ganchos Emocionais Vencedores:**
  - *Gancho 1 (Dor & Culpa):* "Seu filho trava e chora toda vez que chega na tabuada do 7 e do 8?"
  - *Gancho 2 (Economia de Tempo):* "15 minutos por dia: como destravar a matemática do seu filho antes da próxima prova sem precisar pagar professor particular."
  - *Gancho 3 (Telas vs Papel):* "Tire seu filho das telas com brincadeiras que ensinam a tabuada brincando."
