@AGENTS.md

# Fialho Barbearia — guia do projeto

Site + agendamento + painel administrativo para a **Fialho Barbearia**
(Avenida Brasil, 4493 — Maringá, PR). Terceiro deployment do template
construído originalmente para o **Lkas Locs** e reaproveitado pelo
**Tesouras Club Barbearia** — código clonado localmente a partir do
Tesouras Club (`Projects/Tesouras-Club-Barbearia`) em 2026-09-14 (robocopy
+ `git init` novo, histórico de commits não herdado). Repositório GitHub
próprio conectado (`github.com/vnzzyw22/barbearia-fialho.git`) — projeto
Supabase adiado a pedido da cliente (ver Pendências), Vercel ainda não
criado.

## Decisões confirmadas

- **Reuso de template:** mesmo modelo "sem multi-tenancy" dos deployments
  anteriores — cada negócio tem seu próprio deploy (Vercel + Supabase), sem
  `business_id` nas tabelas. A Fialho precisa do **seu próprio** projeto
  Supabase, não reaproveitar o do Tesouras Club ou do Lkas Locs.
- **Gerenciador de pacotes:** npm (herdado).
- **Git/deploy:** git local inicializado nesta sessão. Pendências: projeto
  Supabase próprio + migrations aplicadas, repositório GitHub próprio,
  projeto Vercel próprio — todos passos manuais/interativos, fora do
  alcance do agente (ver "Pendências" abaixo).
- **Stack:** Next.js 16 (App Router, TypeScript) + Tailwind CSS v4 +
  Supabase (Postgres/Auth/Storage) + Vercel. Painel administrativo com
  tokens de estilo próprios (`src/components/admin/theme.ts`). Animações:
  Framer Motion só — **GSAP foi removido** (ver "Identidade visual +
  motion" abaixo; não sobrou nenhum uso real no código desta vez).
- **Identidade visual (ANEXO específico do projeto, 2026-09-14):** preto
  quente `#121110` + cobre/latão fosco `#b08d57` + branco quebrado
  `#ede6dc`. Tipografia Fraunces (display) + Familjen Grotesk (corpo/nav).
  Tagline fixa real: "Cabelo, barba e bigode como tem que ser!". Ver
  DESIGN.md pro detalhamento completo (paleta, contraste auditado,
  assinaturas visuais, o que foi removido do template anterior e por quê).

## Metodologia de trabalho

1. Analisar antes de alterar.
2. Explicar decisões de arquitetura relevantes antes de aplicá-las.
3. Implementar em etapas pequenas, sem quebrar o que já funciona.
4. Testar.
5. Corrigir problemas.
6. Só então avançar para a próxima etapa.

Não alterar componentes não relacionados sem necessidade.

## Lições técnicas herdadas (não repetir os mesmos erros)

Essas descobertas já foram feitas nos deployments anteriores (Lkas Locs,
Tesouras Club Barbearia) e valem pra qualquer clone deste template:

- **Next.js 16:** `middleware.ts` foi renomeado pra `proxy.ts`/`export
  function proxy` (mesmo comportamento, roda em runtime Node.js). Usar
  `src/proxy.ts`, não `middleware.ts`.
- **RLS + `.select()` em insert público:** tabelas `appointments`/`clients`
  só têm policy de `SELECT` pra `authenticated`. Um `insert().select()` do
  supabase-js falha mesmo com `WITH CHECK` passando, porque o Postgres
  aplica RLS de leitura também sobre a linha retornada do insert. Gerar o
  `id` no servidor (`crypto.randomUUID()`) e inserir sem `.select()`.
- **Vídeo/imagem sob demanda:** um `IntersectionObserver` de carregamento
  sob demanda já quebrou 2x no navegador real de um cliente sem reproduzir
  localmente (Lkas Locs) — se algo assim vier a ser necessário aqui, só
  reintroduzir depois de testar ponta a ponta com Playwright de verdade,
  não confiar em "deveria funcionar". O `<video>` da Hero aqui usa
  `autoPlay`/`loop` nativo, sem observer customizado — ver hero.tsx.
- **Server Actions:** corpo limitado a 1MB por padrão — upload de foto de
  celular passa disso fácil. `next.config.ts` já tem
  `experimental.serverActions.bodySizeLimit: "5mb"` (herdado, mantido).
  Sempre envolver o `await` da Server Action em try/catch/finally no client
  component pra não travar o botão em "Enviando..." silenciosamente.
- **`<Image fill>`** exige um ancestral com `position: relative` — sem isso
  o Next não avisa com erro claro, só o layout quebra silenciosamente.
  Checar sempre o warning do console do navegador antes de investigar CSS.
- **Fuso horário:** fixo `America/Sao_Paulo` (`-03:00`, sem horário de
  verão no Brasil desde 2019) — sem lib de timezone, cálculo manual em
  `src/lib/scheduling.ts`.
- **Trocar cor de marca repontando a variável CSS pode quebrar contraste
  escondido** (aconteceu no Tesouras Club ao trocar vermelho por ciano).
  Auditado desta vez antes de aplicar — ver DESIGN.md > "Contraste". Cobre
  `#b08d57` + texto preto tem 6.1:1, então a convenção herdada
  (`bg-brand-red` sempre com `text-brand-black`) continuou válida sem
  precisar trocar nenhum lugar do código.
- **Middleware rodando em cima de arquivo estático grande (vídeo):**
  achado em 2026-09-15 — o `matcher` do `proxy.ts` já excluía
  `imagens/`/extensões de imagem do middleware, mas `videos/`/`.mp4` não
  estavam na lista. Resultado: cada requisição de pedaço do vídeo (`Range
  request`, é assim que o navegador carrega/dá seek num `<video>`) passava
  pelo middleware e disparava uma chamada de autenticação ao Supabase por
  pedaço. Sem Supabase configurado (modo de pré-visualização local) isso
  não trava, porque o middleware sai cedo — foi só aparecer na Vercel, com
  Supabase real configurado, que o vídeo da Hero parou de carregar (o
  cliente reportou "vídeo não aparece", igual já tinha acontecido antes
  com vídeo/imagem em outro deployment deste template). Corrigido
  excluindo `videos/` e `.mp4`/`.webm`/`.mov` do matcher, mesmo padrão já
  usado pra imagens. **Lição geral: qualquer pasta nova de asset estático
  em `public/` precisa entrar na exclusão do matcher do proxy, não só
  imagens** — checar isso de cara na próxima vez que surgir uma pasta de
  mídia nova.
- **`prefers-reduced-motion`:** ao contrário do Lkas Locs/Tesouras Club
  (que tinham decorações puramente ambientais ignorando essa preferência de
  propósito, ex.: selo giratório), aqui a decisão foi inversa — ver
  globals.css: uma media query global reduz toda `animation`/`transition`
  CSS a ~0 quando a preferência está ativa, e o vídeo da Hero nem tenta
  carregar nesse caso (ver ANEXO seção 4, hero.tsx). Reavaliar se essa
  postura mais estrita faz sentido se novas animações puramente decorativas
  forem adicionadas depois.

## Pendências (bloqueadas em dados/decisões da cliente ou em passos manuais)

### Infraestrutura (manual, fora do alcance do agente — requer login
interativo no navegador)
- [x] **Repositório GitHub conectado** (2026-09-15):
  `github.com/vnzzyw22/barbearia-fialho.git`, branch `main`.
- [ ] Criar projeto Supabase próprio da Fialho — **adiado a pedido da
  cliente** (2026-09-15), não é bloqueante pro trabalho de design/conteúdo.
  Ver "Modo de pré-visualização sem Supabase" abaixo pro que já funciona
  sem ele. Quando for criar: conta a definir (ver nota sobre limite de 2
  projetos gratuitos por pessoa/organização, registrada no histórico do
  Tesouras Club).
- [ ] Aplicar `supabase/migrations/*.sql` + `supabase/seed.sql` (via SQL
  Editor do painel ou `supabase db push`, dependendo do que o login do CLI
  permitir).
- [ ] Preencher `.env.local` (copiar de `.env.local.example`) com
  `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/
  `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Criar usuário admin (Authentication → Add user) — sugestão:
  `vbcs2009@gmail.com` (mesmo e-mail usado no Tesouras Club), a confirmar.
- [x] **Projeto Vercel criado e no ar** (2026-09-15) — a cliente confirmou.
  Não sei se as env vars do Supabase foram configuradas lá (perguntar se
  o Supabase real já está ligado em produção ou se o site ainda roda no
  modo de pré-visualização também na Vercel).

### Vídeo da Hero ainda não aparece pra cliente (em aberto, 2026-09-15)
Depois de duas rodadas de investigação (fix do matcher do proxy, camada de
poster independente do `<video>`) e testes reais com Chromium/Playwright
(local e produção) confirmando que o vídeo decodifica e toca normalmente
nos dois ambientes, **a cliente reportou que continua não aparecendo pra
ela**. Ou seja: o servidor está certo, o vídeo funciona num Chromium
automatizado de verdade — mas não no navegador real dela. Combina com o
mesmo padrão já visto no Lkas Locs (ver CLAUDE.md daquele projeto): um bug
que só reproduz no ambiente real do cliente, nunca em teste automatizado.
Retomar amanhã por aqui, nesta ordem (ver runbook salvo na memória):
- [ ] Confirmar se ela testou em aba anônima, sem cache, depois do último
  deploy (commit `8ce5cf8`) — metade dos "ainda quebrado" some nisso.
- [ ] Pedir print/gravação de tela do Hero dela (não só "não aparece") —
  fica preto? Mostra a foto parada? Fica em branco?
- [ ] Pedir o Console do DevTools dela (F12), com foco em erros
  mencionando video/media/autoplay/CSP.
- [ ] Confirmar navegador + dispositivo exatos dela (nunca perguntado
  ainda) — desktop/mobile, Chrome/Safari/Edge, Windows/Android/iOS.
- [ ] Confirmar se "reduzir animação" está ativado no sistema dela (pedido
  2x, sem resposta ainda).
Se nada disso apontar a causa, considerar pedir uma gravação de tela
curta do navegador dela carregando o site, em vez de tentar reproduzir
remotamente de novo.

### Modo de pré-visualização sem Supabase (2026-09-15)
A cliente perguntou se o Supabase é necessário agora — não é, pro que dá
pra ver/ajustar hoje. Implementado `src/lib/supabase/config.ts`
(`isSupabaseConfigured`) + `src/lib/local-fallback-data.ts`: quando não há
`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` no ambiente, `proxy.ts` deixa de
checar sessão (sem isso toda rota dava 500) e as leituras públicas
(`queries.ts`) retornam os dados REAIS já recebidos (horário, serviços,
equipe, galeria — espelhados de `supabase/seed.sql`) em vez de erro/vazio.
Resultado: `npm run dev` mostra a Home e o `/agendar` funcionando de
verdade — inclusive o cálculo de horários disponíveis, que usa o horário
real —, só não grava agendamento nenhum (`createAppointment` retorna erro
claro nesse modo). `/admin` continua quebrado sem Supabase (login/leitura/
escrita real não tem como funcionar sem banco) — não tentei fingir isso.
**Manter `local-fallback-data.ts` sincronizado manualmente com
`seed.sql`** sempre que um dado real mudar (não há fonte única automática
entre os dois).

### Mídia real (ver ANEXO seções 2 e 4 — entrega obrigatória, não opcional)
- [x] **3 fotos reais recebidas em 2026-09-14** — a cliente colocou os
  arquivos direto em `public/imagens/` durante esta mesma sessão (antes
  mesmo de eu pedir), renomeados e organizados em
  `public/imagens/galeria/`: `fialho-barbeiro-sobrancelha.jpg` (barbeiro
  aparando sobrancelha, neon "Clube Fialho" da loja ao fundo — hoje usada
  como poster/fallback da Hero, ver hero.tsx), `fialho-atendimento-espelho.jpg`
  (barbeiro e cliente rindo ao espelho) e `fialho-toalha-logo.jpg`
  (toalha com o logo bordado — ver nota sobre o logo real abaixo). Servidas
  como arquivo estático em vez de Supabase Storage por enquanto (sem
  projeto Supabase ainda) — seed em `supabase/seed.sql` já aponta pra elas;
  migrar pro Storage é só reenviar pelo painel quando o projeto existir.
  Ainda dá pra ampliar o volume: mais fotos reais entram no mesmo padrão
  (`midia-cliente/galeria/` → processo → `public/imagens/galeria/` →
  linha em `gallery_photos`), completando aos poucos os 3 slots que ainda
  usam Unsplash (Ferramentas/Ambiente/Fachada, ver seed.sql).
- [x] **Vídeo de fundo da Hero recebido e processado em 2026-09-14**
  (`fundo-hero-raw.mp4`, exportação de Reel, direto na pasta do projeto) —
  barbeiro trabalhando com navalha reta junto ao rosto do cliente, ótimo
  match com o "objeto-herói" do ANEXO. Processado com ffmpeg (instalado via
  `winget install Gyan.FFmpeg` nesta sessão — não estava disponível antes)
  em `hero-mobile.mp4` (recorte vertical original recomprimido),
  `hero-desktop.mp4` (**ver ressalva abaixo**) e `hero-poster.jpg` (frame
  em 6s). Ver `public/videos/hero/README.md` pro detalhamento e os comandos
  exatos usados.
  - **Ressalva sobre o desktop:** a fonte é só vertical (Reel), sem nenhum
    plano panorâmico disponível — não existe um "recorte mais amplo" de
    verdade pra tirar dali. `hero-desktop.mp4` usa o próprio vídeo
    desfocado/escurecido como fundo 16:9, com o vídeo nítido centralizado
    por cima. Funciona bem visualmente, mas não é literalmente o que o
    ANEXO pediu ("crop mais panorâmico") — se a Fialho gravar/mandar um
    plano horizontal de verdade no futuro, vale reprocessar a partir dele.
- [x] **Logo real recebida em 2026-09-14** — `public/imagens/fialho-logo.jpg`,
  selo circular preto/creme/cobre (bate quase exatamente com a paleta já
  escolhida a partir do ANEXO, nenhum ajuste de cor precisou ser feito). Em
  uso na Navbar, Rodapé, medalhão da seção Sobre e como favicon (ver
  DESIGN.md > "Logo real" pro detalhamento). Só falta um arquivo vetorial
  se algum dia precisar de versão maior sem perda de qualidade — o JPEG
  atual (1080×1080) já cobre todos os usos do site.
- Observação (não uma pendência, só um dado real que apareceu): o neon da
  loja, visível em `fialho-barbeiro-sobrancelha.jpg`, diz **"Clube Fialho"**
  — não necessariamente o mesmo texto da tagline/nome oficial. Vale
  perguntar à cliente se isso é um apelido/identidade interna da loja que
  ela gostaria de refletir em algum canto do site, ou só decoração — não
  assumi nada disso no código sem confirmação.

### Conteúdo — dados que o ANEXO pede explicitamente pra não inventar
- [x] **Nomes reais da equipe recebidos em 2026-09-15**: Allyson, Elano,
  Gótico, Jean, John Fialho — sem foto ainda ("depois vou adicionar fotos
  deles", cliente) e sem função/especialidade individual (todos com role
  genérico "Barbeiro"). Seed em `supabase/seed.sql` e
  `local-fallback-data.ts`; migration `20260910120000_staff.sql` não seeda
  mais nada (evita duplicar com o seed).
- [x] **Horário real recebido em 2026-09-15**: seg-sex 09:00-19:30, sáb
  08:00-14:00, domingo fechado (não mencionado pela cliente — tratado como
  fechado, não como "aberto" por omissão).
- [x] **Preços/durações reais recebidos em 2026-09-15** — direto do sistema
  de agendamento que a cliente já usa, não é mais exemplo de mercado: 8
  serviços (Cabelo, Barba, Cabelo e Barba, Sobrancelhas, Depilação de
  Nariz, Depilação de Orelha, Selagem Capilar, Tintura "a partir de"). Os 3
  serviços "Clube Fialho" (R$ 0,00 na lista original — parecem ser
  cadastro de clube/assinatura, não serviço avulso) ficaram de fora a
  pedido explícito da cliente.
- [ ] Fotos da equipe — pendente, cliente já avisou que vem depois.
- [ ] Depoimentos — nenhuma seção de depoimentos existe no site (o template
  nunca teve uma; não foi adicionada aqui sem conteúdo real pra preencher).
- [ ] Copy da seção "Sobre" e as 6 perguntas do FAQ — placeholder curto e
  neutro (não inventei uma "história da marca" convincente sem ter
  informação real — ver TODOs em about-section.tsx/faq-accordion.tsx).

### Motion (ver ANEXO seção 5) — o que ficou pra depois
Implementado nesta sessão: curva de easing única (`src/lib/motion.ts` +
`--ease-signature`, usada em todo Framer Motion do site), transição de
rota com varredura diagonal em cobre (`route-transition.tsx`), zoom
contínuo + blur-in na Hero, scroll reveal ajustado (16px/stagger ~60ms,
`reveal.tsx`), hover de navalha nos números de serviço
(`services-section.tsx`).

**Não implementado ainda** (mudança estrutural maior, não só estilo — ver
DESIGN.md > Pendente):
- [ ] Galeria como shared-element transition (miniatura crescendo até tela
  cheia com a moldura acompanhando) — hoje a Galeria é um carrossel de uma
  foto por vez (`gallery-carousel.tsx`), não uma grade de miniaturas com
  lightbox. Precisa de um redesenho da seção, não só CSS/motion.
- [ ] Passos do agendamento deslizando horizontalmente com barra de
  progresso — hoje `booking-form.tsx` revela campos progressivamente num
  formulário contínuo, não em steps discretos com transição de slide.

## Equipe de barbeiros (herdado, ver CLAUDE.md do Tesouras Club pro
histórico original da mudança de schema)

A Fialho confirmou ter mais de um profissional atendendo (ver ANEXO seção
1), então a mesma arquitetura multi-profissional do Tesouras Club se
aplica aqui sem mudança estrutural — tabela `staff`, `appointments.staff_id`
obrigatório, constraint de conflito de horário por profissional
(`exclude using gist (staff_id with =, ...)`, precisa de `btree_gist`),
`blocked_slots.staff_id` opcional (null = loja inteira), fluxo de
agendamento público com passo "Profissional", painel admin com seção
Equipe. Ver `supabase/migrations/20260910120000_staff.sql` pro schema
completo — só o seed placeholder foi ajustado (`Profissional 1`/`2` em vez
de nomes de outra marca).

## Fases

- **Fase 0 — Fundação:** ✅ concluída (2026-09-14). Código clonado do
  Tesouras Club Barbearia, git local reinicializado, referências de
  nome/wordmark trocadas para "Fialho Barbearia". Faltam: criar
  contas/projetos Supabase e Vercel (interativo, fora do alcance do agente)
  e o repositório GitHub.
- **Fases 1–6** (backend, site público, agendamento, painel admin,
  performance/acessibilidade): arquitetura já pronta e testada nos
  deployments anteriores, reaproveitada sem mudança estrutural (exceto
  multi-profissional, já herdado do Tesouras Club). Nunca testada ponta a
  ponta com um projeto Supabase real da Fialho — fazer isso assim que o
  projeto Supabase existir (ver Pendências).
- **Fase 7 — Identidade visual + motion (ANEXO específico):** ✅ parcial
  (2026-09-14). Paleta, tipografia, tagline real, remoção de elementos que
  não se aplicavam (medalhão/selo, CTA fixo de WhatsApp), Hero reconstruída
  pra vídeo de fundo, curva de motion única + transição de rota + hover de
  navalha aplicados. Faltam: os dois pontos maiores de motion (Galeria
  shared-element, steps do agendamento) e todo o conteúdo/mídia real
  bloqueado na cliente — ver "Pendências" acima.

## Regras de negócio a lembrar (herdadas, válidas aqui também)

- Sem pagamento antecipado no MVP.
- Cliente não cancela pelo sistema — só o proprietário, pelo painel.
- **WhatsApp é só canal de confirmação/notificação pós-agendamento** (ANEXO
  seção 6) — nunca um CTA alternativo nem substitui etapa do fluxo nativo.
  Na prática: `createAppointment` já grava o agendamento como "pending" no
  banco antes de qualquer link de WhatsApp aparecer (ver booking-form.tsx);
  o CTA fixo de WhatsApp do template anterior foi removido por competir com
  essa regra; os links de WhatsApp que sobraram no Contato/Rodapé são só
  contato geral, com copy ajustada pra não soar como atalho de agendamento.
- Status de agendamento: Pendente, Confirmado, Cancelado.
- Múltiplos profissionais — cada barbeiro tem a própria agenda; o cliente
  escolhe quem vai atendê-lo no fluxo de agendamento (ver "Equipe de
  barbeiros" acima).
