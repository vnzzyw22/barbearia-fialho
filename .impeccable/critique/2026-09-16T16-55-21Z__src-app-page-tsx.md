---
target: Hero + fluxo publico da Fialho Barbearia (src/app/page.tsx)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-09-16T16-55-21Z
slug: src-app-page-tsx
---
Method: dual-agent (A: abfb2c7f6f15ce44d · B: a5ae75294cfce3657)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Sem indicação de seção ativa na navbar durante o scroll |
| 2 | Match System / Real World | 3 | Linguagem natural, dados reais |
| 3 | User Control and Freedom | 3 | Carrossel da Galeria sem pausa explícita |
| 4 | Consistency and Standards | 3 | FAQ quebra o padrão de título das outras 4 seções sem razão aparente |
| 5 | Error Prevention | 3 | Estados vazios bem tratados; formulário fora do escopo |
| 6 | Recognition Rather Than Recall | 3 | Navbar fixa ajuda, falta scroll-spy |
| 7 | Flexibility and Efficiency | 3 | Aceleradores reais via query params (`/agendar?servico=`, `?profissional=`) |
| 8 | Aesthetic and Minimalist Design | 2 | Hero passou do minimalismo pro vazio informacional |
| 9 | Error Recovery | 3 | Bom nos estados vazios visíveis |
| 10 | Help and Documentation | 3 | FAQ existe, mas a reasseguração mais importante não está perto do CTA |
| **Total** | | **29/40** | **Good** |

## Design Specificity Verdict

**LLM assessment (A):** o site como um todo (Sobre, Serviços, Equipe, Galeria, Contato) é razoavelmente autoral — paleta cobre/preto/creme aplicada com disciplina, vídeo real, dados reais. Mas a Hero especificamente regrediu para um **vazio**, não uma escolha de marca. A troca "headline de texto → selo" só seria uma escolha forte se o selo cumprisse a mesma função (confirmar nome/cidade/promessa). Comparação direta dos dois arquivos de logo: `fialho-logo.jpg` (navbar/rodapé) é um selo preto com "FIALHO" em creme sólido, sombreado, alto contraste, legível pequeno. `fialho-logo-branca.png` (usado na Hero) é **só o contorno recolorido**, sem preenchimento, sem fundo, sem sombra — as linhas quase somem mesmo sobre fundo branco no visualizador. É uma versão degradada da mesma logo, não uma reinterpretação.

Três elementos que cumpriam função real sumiram da Hero sem substituto: nome do negócio em texto visível (virou `<h1 className="sr-only">`, invisível pra humanos), o eyebrow "Maringá — PR" (a fonte Rye foi construída especificamente pra isso e está sem nenhum uso no código), e a tagline (que continua viva em About/Rodapé, só saiu do lugar de maior visibilidade). Sintoma de remoção sem redesenho.

**Deterministic scan (B):** `node detect.mjs --json src/app/page.tsx src/app/layout.tsx src/components/site` → exit 0, **0 achados** (array vazio). Rodado duas vezes (com stderr capturado na segunda), mesmo resultado. Nenhum arquivo/regra disparou.

**Onde as duas avaliações se cruzam:** o detector mecânico (que procura por "tells" genéricos de IA — clichês de paleta, CTAs com seta, padrões de template) não encontrou nada — e é esperado que não encontrasse, porque os problemas reais aqui não são clichês genéricos de IA, são erros de execução específicos deste site (um asset de logo tecnicamente ruim, conteúdo removido sem substituir sua função). Um scan vazio aqui **não deve ser lido como "design aprovado"** — ele só cobre uma categoria de problema, e os problemas que a cliente está sentindo estão fora dessa categoria.

**Evidência visual:** indisponível nesta sessão — o servidor MCP de navegador (Playwright) falhou ao conectar (CONNECT_TIMEOUT). Não há overlay visível pra te mostrar; a Assessment A compensou isso comparando os dois arquivos de imagem da logo diretamente.

## Overall Impression

O restante do site está numa base sólida (paleta disciplinada, motion cuidadoso, dados reais). O problema está concentrado na Hero: ela virou uma tela quase vazia porque o conteúdo foi removido (a pedido) mas a função que esse conteúdo cumpria — identificar a marca, a cidade, a promessa — não foi realocada pra lugar nenhum. A maior oportunidade única: o selo que devia substituir o headline é, ele mesmo, uma versão pior (sem preenchimento) da logo que já existe e funciona bem na navbar.

## What's Working

- **Rigor de `prefers-reduced-motion`**: o vídeo da Hero nunca é buscado quando a preferência está ativa, a CSS global zera todas as transições, e o carrossel troca a duração da transição condicionalmente. Cuidado acima da média — evita a armadilha comum de só esconder visualmente a animação sem parar o carregamento de mídia pesada.
- **Disciplina de paleta**: um único acento cobre usado sem exceção em toda borda, CTA, hover, numeral e linha divisória — é isso que dá a sensação de "marca com regra", não "template com cor trocada".
- **Progressive disclosure replicado sem gambiarra**: "Ver todos os serviços" e "Ver todas as perguntas" usam a mesma técnica CSS-only (sem JS de largura de tela) nos dois lugares — padrão técnico consciente, evita mismatch de hidratação.

## Priority Issues

**[P0] Selo da Hero é funcionalmente ilegível**
- **Why it matters**: é a ÚNICA peça de identidade textual que sobrou na Hero. Se ela não lê — e a versão usada é só contorno fino, sem preenchimento nem sombra, mesmo sobre fundo claro no visualizador — a Hero não comunica nada de marca nos primeiros segundos, que é exatamente o momento mais crítico da primeira impressão.
- **Fix**: recolorir preservando preenchimento sólido (como em `fialho-logo.jpg`) em vez de só o traçado, ou adicionar uma base/scrim atrás do selo, ou engrossar o traço — testar no tamanho real (224px mobile) sobre frames reais do vídeo antes de aprovar.
- **Suggested command**: `/impeccable typeset` ou `/impeccable polish`

**[P0] Conteúdo removido sem substituir sua função**
- **Why it matters**: nome do negócio (virou invisível, só `sr-only`), cidade "Maringá — PR" e tagline sumiram do primeiro fold sem nada assumir o papel deles. Prejudica SEO (H1 real invisível a olho humano) e conversão (visitante sem confirmação imediata de "é essa barbearia, é nessa cidade").
- **Fix**: reintroduzir pelo menos uma linha discreta de localidade — a fonte Rye já foi construída exatamente pra isso (`layout.tsx`) e está sem uso nenhum. Se o problema real era "bloco de texto grande", a solução não precisa ser "texto zero".
- **Suggested command**: `/impeccable layout`

**[P1] Fórmula de título idêntica em 4 seções seguidas**
- **Why it matters**: About, Serviços, Equipe e Galeria usam exatamente o mesmo tratamento (contorno + palavra sólida cobre + traço embaixo), e a FAQ quebra o padrão sem razão aparente. Isso faz o site parecer montado por fórmula, e rouba da Hero a chance de se diferenciar visualmente do resto da página.
- **Fix**: variar escala/alinhamento/tratamento em pelo menos 2 dos 4 títulos repetidos, e alinhar a FAQ ao mesmo padrão (ou justificar a diferença).
- **Suggested command**: `/impeccable typeset`

**[P1] Nenhuma reasseguração perto do CTA de maior risco**
- **Why it matters**: a única frase que avisa que o agendamento fica pendente até confirmação via WhatsApp está isolada na FAQ, longe do botão "Agendar horário" que a maioria vai clicar direto da Hero.
- **Fix**: uma linha curta de reasseguração perto do CTA principal, ou como primeira tela do wizard `/agendar`.
- **Suggested command**: `/impeccable clarify`

**[P2] Carrossel da Galeria sem controle de pausa acessível**
- **Why it matters**: auto-avança a cada 5s, só pausa em hover/touch — sem alternativa por teclado/leitor de tela, falhando o critério WCAG 2.2.2 (Pause/Stop/Hide).
- **Fix**: botão de pausa/play visível, ou pausar ao receber foco de teclado.
- **Suggested command**: `/impeccable audit`

## Persona Red Flags

**Jordan (confuso, primeira visita)**: chega e vê vídeo + marca circular difícil de ler + dois botões — pode não confirmar em segundos "que negócio é esse" sem subir o olhar até a navbar (36px de logo + texto pequeno), que hoje é a única instância de contraste normal do nome da marca em toda a primeira tela.

**Casey (mobile, distraída)**: pior cenário pro selo — tela pequena (224px), atenção curta, fundo em vídeo em movimento, traço fino. Maior chance de rolar a página inteira sem nunca "ler" a marca de fato.

**Dona da barbearia vendo o resultado**: pediu pra tirar "poluição" (títulos/informações), e o que ela provavelmente está vendo é a ausência do nome, da cidade e da tagline que ela mesma usa pra descrever o negócio — pode interpretar como "cadê minha identidade", não "ficou limpo". Vale mostrar a ela lado a lado a logo original (preenchida) vs. o selo atual da Hero (contorno fino) antes de assumir que o problema é sobre texto e não sobre a própria imagem do selo.

## Minor Observations

- Fonte Rye foi construída especificamente pro eyebrow "Maringá — PR" e está sem nenhum uso no código — peso morto de carregamento sem benefício visual atual.
- `📍` como emoji cru em `contact-section.tsx` e `footer.tsx` — não confiável pra leitores de tela, não uniforme entre plataformas.
- "100% Agendamento online" é um slogan disfarçado de número, ao lado de dois números reais contados do banco — inconsistente com a própria regra do projeto de "só números reais".
- PNG do selo (~300KB, `unoptimized`, `priority`) concorre por banda com poster + vídeo, ambos também `priority` — vale checar impacto real em LCP.

## Questions to Consider

- Se a intenção era "menos poluição", por que o selo escolhido pra substituir o texto é a versão MENOS legível da logo, em vez da versão que a cliente já reconhece e aprovou?
- O nome, a cidade e a tagline sumiram da Hero por um plano deliberado de redistribuição de hierarquia, ou foi só um corte sem replanejar o que ficava no lugar?
- Faz sentido repetir a mesma fórmula de título nas quatro seções seguintes, ou isso rouba força do momento em que a Hero mais precisa se diferenciar do resto da página?
