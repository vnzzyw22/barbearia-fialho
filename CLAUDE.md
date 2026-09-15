@AGENTS.md

# Fialho Barbearia — guia do projeto

Site + agendamento + painel administrativo para a **Fialho Barbearia**
(Avenida Brasil, 4493 — Maringá, PR). Terceiro deployment do template
construído originalmente para o **Lkas Locs** e reaproveitado pelo
**Tesouras Club Barbearia** — código clonado localmente a partir do
Tesouras Club (`Projects/Tesouras-Club-Barbearia`) em 2026-09-14 (robocopy
+ `git init` novo, histórico de commits não herdado). Nenhum projeto
Supabase/GitHub/Vercel próprio criado ainda.

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
- [ ] Criar projeto Supabase próprio da Fialho (conta a definir — ver nota
  sobre limite de 2 projetos gratuitos por pessoa/organização, registrada
  no histórico do Tesouras Club).
- [ ] Aplicar `supabase/migrations/*.sql` + `supabase/seed.sql` (via SQL
  Editor do painel ou `supabase db push`, dependendo do que o login do CLI
  permitir).
- [ ] Preencher `.env.local` (copiar de `.env.local.example`) com
  `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/
  `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Criar usuário admin (Authentication → Add user) — sugestão:
  `vbcs2009@gmail.com` (mesmo e-mail usado no Tesouras Club), a confirmar.
- [ ] Criar repositório GitHub próprio (ex.: `fialho-barbearia`) e
  configurar como remote deste repo local.
- [ ] Criar projeto Vercel, importar o repositório, configurar as mesmas
  env vars do Supabase.

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
- [ ] Vídeo de fundo da Hero — ainda não chegou (fonte prevista: Reels do
  Instagram @fialhobarbearia_). Entregar exportação bruta em
  `midia-cliente/hero/`; processamento (recorte mobile/desktop, compressão
  H.264 ~3-4MB, grading, poster) fica a cargo do agente — ver
  `public/videos/hero/README.md`. Até lá, a Hero usa a foto real
  `fialho-barbeiro-sobrancelha.jpg` acima como poster (muito melhor que o
  banco de imagens de estoque que eu tinha usado antes dessas 3 fotos
  chegarem).
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
- [ ] Nomes/fotos/funções reais da equipe — seed hoje é
  `Profissional 1`/`Profissional 2` (placeholder óbvio, ver
  `supabase/migrations/20260910120000_staff.sql`), não nomes inventados.
- [ ] Horário de funcionamento — `business_settings.business_hours` está
  `{}` (vazio) de propósito; o bloco correspondente simplesmente não
  aparece no site até ser preenchido pelo painel (Configurações).
- [ ] Depoimentos — nenhuma seção de depoimentos existe no site (o template
  nunca teve uma; não foi adicionada aqui sem conteúdo real pra preencher).
- [x] Preço/duração dos 6 serviços iniciais — **exemplo de mercado**
  (Maringá/PR), marcado como tal em comentário no seed, não os preços reais
  da Fialho — confirmar antes de publicar (ver ANEXO seção 1 e
  `supabase/seed.sql`).
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
