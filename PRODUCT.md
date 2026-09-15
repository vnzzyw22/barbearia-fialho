# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primário: clientes da barbearia visitando o site pra conhecer serviços,
equipe e portfólio, e agendar horário com o profissional de preferência.
Secundário: o proprietário da Fialho Barbearia, usando o painel
administrativo (`/admin`) pra gerenciar agenda, equipe, clientes, serviços,
galeria e financeiro — único usuário admin/login (sem tabela de papéis),
mesmo com vários barbeiros cadastrados como profissionais bookáveis (ver
CLAUDE.md > Equipe de barbeiros — "equipe" é um catálogo, não contas de
usuário separadas).

## Product Purpose

Site institucional + agendamento online + painel administrativo para a
Fialho Barbearia. O cliente escolhe um serviço, um profissional, vê
disponibilidade real (calculada a partir da agenda e do horário de
funcionamento) e envia o pedido pelo site; o agendamento fica pendente até
o profissional confirmar pelo painel — o WhatsApp só entra depois, como
canal de confirmação, nunca como atalho pra agendar por fora do site (ver
ANEXO seção 6). Sucesso = agendamentos reais entrando pelo site sem
fricção e sem conflito de horário.

## Positioning

Terceiro deployment do template construído originalmente para o Lkas Locs e
reaproveitado pelo Tesouras Club Barbearia (mesmo código-base, sem
multi-tenancy — dados da marca isolados em `business_settings`, nunca
hardcoded). Diferencial de posicionamento visual (ANEXO específico do
projeto, 2026-09-14): barbearia clássica com atitude urbana — tradição de
barbeiro (navalha) + ambientação street (tatuagens, neon), preto quente +
cobre fosco, deliberadamente fora do clichê "preto + dourado" do nicho. Bem
diferente do posicionamento "premium/urbano jovem, preto + ciano neon" do
Tesouras Club — cada deployment deste template tem sua própria identidade,
não é um mesmo visual reaproveitado.

## Operating Context

- Fluxo público: Navbar → Hero (vídeo de fundo) → Sobre → Serviços → Equipe
  → Galeria → FAQ → Contato (com mapa incorporado) (landing de seção
  única), mais a página dedicada `/agendar` (wizard: serviço →
  profissional → data → horário → dados do cliente → confirmação).
- Painel administrativo (`/admin`, autenticado via Supabase Auth, único
  papel "admin"): Dashboard, Agenda (confirmar/cancelar, bloquear horários
  — com filtro por profissional), Equipe (CRUD de barbeiros + foto),
  Clientes, Serviços, Galeria (upload no Supabase Storage), Financeiro,
  Configurações (dados da marca e horário de funcionamento).
- Sem pagamento antecipado. Cliente não cancela pelo sistema — só o
  proprietário, pelo painel. Status de agendamento: Pendente, Confirmado,
  Cancelado.

## Capabilities and Constraints

- Stack já definida (não greenfield, herdada do Lkas Locs via Tesouras Club):
  Next.js 16 (App Router, TypeScript) + Tailwind CSS v4 + Supabase
  (Postgres/Auth/Storage) + Vercel. Projeto Supabase próprio, repositório
  GitHub e projeto Vercel ainda não criados (ver CLAUDE.md > Pendências —
  são passos manuais/interativos, fora do alcance do agente).
- Preço e duração dos 6 serviços iniciais (Corte, Barba, Corte + Barba,
  Corte degradê, Sobrancelha, Corte + Barba + Sobrancelha) são EXEMPLO —
  pesquisa de mercado de barbearias em Maringá/PR, não os preços reais da
  Fialho (ver ANEXO seção 1) — 100% editáveis pelo painel, nunca hardcoded.
- Vários profissionais por deployment (a Fialho confirmou ter mais de um
  barbeiro atendendo, mas não nomes/quantidade exata) — cada um tem a
  própria agenda; agendamento exige escolher um. Seed hoje: 2 placeholders
  óbvios ("Profissional 1"/"2"), não nomes inventados.
- Fuso fixo `America/Sao_Paulo` (sem horário de verão no Brasil desde 2019).

## Brand Commitments

Dados confirmados pela cliente (ANEXO específico do projeto, 2026-09-14) —
única fonte confiável, ver ANEXO seção 1 pro texto completo:

- Nome: Fialho Barbearia. Endereço: Avenida Brasil, 4493 — Maringá/PR.
  Telefone/WhatsApp: (44) 99809-2162. Instagram: @fialhobarbearia_.
- Tagline fixa usada pela marca: "Cabelo, barba e bigode como tem que ser!"
  (Hero + rodapé — dado real, não placeholder).
- Paleta: preto quente `#121110` + cobre/latão fosco `#b08d57` + branco
  quebrado `#ede6dc`. Tipografia: Fraunces (display) + Familjen Grotesk
  (corpo/nav). Ver DESIGN.md pro detalhamento completo.
- Vídeo de fundo na Hero é requisito confirmado da entrega final (fonte:
  Reels do Instagram @fialhobarbearia_), não um "extra" condicional — ver
  ANEXO seção 4 e `public/videos/hero/README.md`.
- Fotos reais da galeria também são entrega obrigatória, ainda não
  recebidas — ver `midia-cliente/README.md`.
- Logo real e 3 fotos de portfólio já recebidas (2026-09-14) e em uso no
  site — ver CLAUDE.md > Pendências. Ainda pendente/bloqueado na cliente:
  vídeo da Hero, nomes/fotos da equipe, horário de funcionamento real,
  depoimentos, preços/durações reais dos serviços (os 6 do seed são só
  faixa de mercado, marcados como exemplo). Ver lista completa em
  CLAUDE.md > Pendências.

## Evidence on Hand

- Schema de dados herdado do template (`business_settings`, `services`,
  `staff`, `clients`, `appointments`, `blocked_slots`, `gallery_photos`,
  `transactions`, com RLS por tabela) — migrations ainda não aplicadas em
  nenhum projeto Supabase real (nenhum projeto Supabase da Fialho existe
  ainda, ver CLAUDE.md > Pendências).
- 3 fotos reais da Fialho recebidas em 2026-09-14 (ver
  `public/imagens/galeria/` e CLAUDE.md > Pendências) — já em uso na
  Galeria e como poster/fallback da Hero. Vídeo real da Hero e logo real
  ainda não chegaram; Galeria ainda completa 3 dos 6 slots com banco de
  imagens temporário (Unsplash, tratado com o duotone da marca).

## Product Principles

- Dados da marca nunca hardcoded — sempre lidos de `business_settings` /
  `services` / `staff` / `gallery_photos` (modelo de template clonado por
  cliente).
- Preço de serviço tem faixa de mercado real e verificável, então pode ser
  populado com exemplo plausível (marcado como tal). Nome de pessoa
  (equipe), horário de funcionamento e depoimento não têm equivalente
  confiável — inventar isso seria passar informação falsa como real, de um
  jeito que o preço de exemplo não é (distinção explícita do ANEXO seção
  1). Cada fase implementada e testada antes de avançar — não quebrar o
  que já funciona.

## Accessibility & Inclusion

Nenhum requisito específico confirmado ainda além dos padrões gerais.
`prefers-reduced-motion` é respeitado globalmente (ver globals.css) e,
pontualmente, no vídeo da Hero (mostra só a imagem estática, sem tentar
carregar o vídeo — ver ANEXO seção 4 e `hero.tsx`).
