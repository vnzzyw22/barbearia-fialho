---
name: Fialho Barbearia
description: Barbearia clássica com atitude urbana em Maringá, PR — preto quente + cobre fosco, sem o clichê preto+dourado do nicho.
colors:
  brand-red (acento, cobre/latão fosco): "#b08d57"
  brand-ink / brand-black / brand-paper (fundo): "#121110"
  brand-cream (texto sobre fundo escuro, branco quebrado): "#ede6dc"
  brand-oxblood (glow de fundo, cobre bem escuro): "#2a2117"
  brand-smoke (texto secundário, bege acinzentado): "#a79a87"
typography:
  display:
    fontFamily: "Fraunces, ui-serif, Georgia"
    note: "serifada editorial — headlines, números de seção, wordmark da Hero. Substitui Oswald/Unbounded herdadas."
  body / nav:
    fontFamily: "Familjen Grotesk, ui-sans-serif, system-ui"
    note: "grotesk com personalidade, não Inter (pedido explícito do ANEXO) — também usada na navbar, sem fonte extra só pra isso."
  label/mono:
    fontFamily: "JetBrains Mono (herdada, sem mudança)"
---

# Fialho Barbearia — design

Direção de arte definida no ANEXO específico do projeto (2026-09-14), não
redescoberta a partir do brief genérico — ver seção 3 do ANEXO pro texto
completo. Este arquivo registra como cada decisão foi aplicada no código.

## Conceito

Barbearia clássica com atitude urbana — tradição de barbeiro (navalha,
ofício) combinada com ambientação mais "street" (tatuagens, letreiro neon
"BARBER SHOP"). Objeto-herói: a navalha reta / o gesto do barbeiro em ação,
com escala forte na Hero (ver `hero.tsx` — poster/vídeo em close, não ícone
pequeno).

## Paleta — deliberadamente fora do clichê "preto + dourado brilhante"

- Preto quente `#121110` como base (não cinza-chumbo, puxado pra marrom).
- Cobre/latão fosco `#b08d57` como único acento — não dourado saturado de
  joia. Variação só por opacidade/textura, sem terceira cor decorativa
  (nada de vermelho/azul de poste clássico — clichê visual do nicho).
- Branco quebrado/pergaminho `#ede6dc` pro texto — nunca branco puro.

Nomes de variável herdados do template (`brand-red`/`-ink`/`-cream`/etc.,
ver `globals.css`) mantidos de propósito — só os VALORES mudaram, pra não
precisar tocar em toda classe Tailwind espalhada pelo código (mesma lógica
já usada no rebrand pro Tesouras Club).

### Contraste — auditado ao repontar `--color-brand-red`

Lição herdada (ver CLAUDE.md > Lições técnicas): trocar a cor de acento sem
auditar contraste pode deixar texto ilegível em botões/estados ativos. Cobre
`#b08d57` é um tom médio (bem diferente do ciano neon do Tesouras Club, que
tinha ~1.5:1 contra branco) — contraste calculado (WCAG relative luminance):

- `bg-brand-red` + `text-brand-black` (botões primários, estados ativos):
  **6.1:1** — passa AA normal e fica perto de AAA.
  Todo lugar que usa `bg-brand-red` já usa `text-brand-black` (convenção
  herdada do template, não precisou trocar nenhum lugar desta vez).
- `text-brand-red` sobre `bg-brand-ink` (links, preços, ícones): **6.1:1**.
- `text-brand-cream` sobre `bg-brand-ink` (corpo de texto): **15.2:1**.
- `text-brand-smoke` sobre `bg-brand-ink` (texto secundário): **6.8:1**.

## Tipografia

- **Display** (`--font-display`, Fraunces): headlines, números de seção,
  wordmark da Hero ("FIALHO" / "BARBEARIA"). Serifada de peso editorial —
  combina com a seriedade do ofício de barbeiro sem competir com um logo
  real (ainda não recebido).
- **Corpo + navbar** (`--font-body`/`--font-nav`, Familjen Grotesk): grotesk
  neutra com personalidade — pedido explícito do ANEXO foi evitar Inter.
  Mapeada também em `--font-nav` (globals.css) pra não introduzir uma
  terceira família só pro menu (o Tesouras Club usava Montserrat separado
  pra isso; aqui simplificado).
- **Label/mono** (`--font-label`, JetBrains Mono): legendas, preço,
  duração, horário — herdada sem mudança, gênero neutro que não compete com
  as outras duas famílias.
- Fonte script do logo: não aplicável ainda (sem logo real, ver
  Pendências) — quando chegar, usar só em elementos pontuais de marca,
  nunca no corpo de texto (regra explícita do ANEXO).

## Assinaturas visuais (ANEXO seção 3)

1. **Divisor diagonal em cobre** (`.signature-divider`, globals.css) — linha
   fina, leve `skewY`, opacidade 0.5. Usada entre seções principais
   (`src/app/page.tsx`) e, em maior escala/opacidade total, como a varredura
   de transição entre rotas (`route-transition.tsx`).
2. **Moldura em cobre na Galeria** — `gallery-carousel.tsx` usa borda sólida
   + respiro interno (`border border-brand-red/70 p-2`) em vez de
   card/shadow genérico.
3. **Glow neon pontual** — ainda não aplicado a nenhum elemento específico
   (ver Pendências); reservado pra um detalhe tipográfico único quando o
   conteúdo real (Hero/logo) estiver definido, pra não virar decoração
   genérica espalhada pelo site.

## Sem elementos herdados que não se aplicam aqui

- **Medalhão de logo + selo giratório** (`rotating-seal.tsx`,
  `about-section.tsx` no Tesouras Club) — removidos. Eram uma referência
  estrutural específica de outro projeto (club23barber.com.br), autorizada
  só pra aquele cliente; não têm base equivalente pra Fialho. A seção
  "Sobre" ficou só com tipografia + números reais.
- **CTA fixo de WhatsApp** (`whatsapp-fab.tsx`) — removido. O ANEXO (seção
  6) é explícito: WhatsApp só entra como canal de confirmação depois que o
  agendamento é concluído no site, nunca como CTA alternativo de
  agendamento.

## Logo real (recebida em 2026-09-14)

`public/imagens/fialho-logo.jpg` — selo circular: fundo preto, anel
creme/pergaminho, "FIALHO" em script/flourish + "BARBEARIA" em serifada
caixa-alta pequena, navalha reta no topo, linhas finas concêntricas em
cobre. Bate quase exatamente com a paleta já escolhida a partir do ANEXO
antes mesmo dessa logo chegar (preto/creme/cobre) — nenhum ajuste de cor
foi necessário. Em uso em: `navbar.tsx`, `footer.tsx` (36-40px, circular,
anel fino em cobre) e `about-section.tsx` (medalhão maior, 80-96px, moldura
em cobre — mesma assinatura visual da moldura da Galeria) e como favicon
(`src/app/icon.jpg`). Fonte script do logo ainda não usada em nenhum lugar
do corpo de texto (regra do ANEXO) — só a Fraunces (display) reproduz um
pouco do caráter editorial da logo sem tentar imitar o flourish.

## Pendente (bloqueado na cliente ou fora do escopo desta sessão)

- Vídeo real da Hero — ver `midia-cliente/README.md`. 3 fotos reais já
  chegaram (2026-09-14, ver CLAUDE.md > Pendências) e já substituíram o
  banco de imagens de estoque como poster da Hero e em metade da Galeria.
- Nomes/fotos reais da equipe, horário de funcionamento real, depoimentos —
  ver CLAUDE.md > Pendências (dados que o ANEXO explicitamente pede pra não
  inventar).
- Detalhe de glow neon pontual (assinatura visual #3) — reservado até ter
  conteúdo real pra aplicar.
