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
  (Postgres/Auth/Storage) + Vercel. Repositório GitHub próprio conectado
  (`github.com/vnzzyw22/barbearia-fialho.git`); projeto Supabase adiado a
  pedido da cliente (2026-09-15) e projeto Vercel ainda não criado — o
  site roda em modo de pré-visualização sem Supabase enquanto isso (ver
  CLAUDE.md > "Modo de pré-visualização sem Supabase").
- Preço e duração dos 8 serviços (Cabelo, Barba, Cabelo e Barba,
  Sobrancelhas, Depilação de Nariz, Depilação de Orelha, Selagem Capilar,
  Tintura) são dados REAIS, recebidos da cliente em 2026-09-15 — não mais
  exemplo de mercado. 100% editáveis pelo painel, nunca hardcoded.
- Vários profissionais por deployment — nomes reais recebidos em
  2026-09-15 (Elano, Gótico, Jean, John Fialho; Allyson removido pela
  cliente em 2026-09-16, não faz parte da equipe), cada um com a própria
  agenda; agendamento exige escolher um. Fotos de Gótico e John Fialho
  recebidas em 2026-09-16; Elano e Jean ainda sem foto/função individual.
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
- Vídeo de fundo na Hero, logo real, 3 fotos de portfólio, horário de
  funcionamento, preços/durações reais e nomes da equipe já recebidos
  (2026-09-14/15) e em uso no site — ver CLAUDE.md > Pendências. O recorte
  desktop do vídeo usa um tratamento de fundo desfocado por enquanto (a
  fonte recebida é só vertical, sem plano panorâmico disponível ainda).
  Ainda pendente/bloqueado na cliente: fotos da equipe, depoimentos, mais
  fotos de portfólio (a Galeria ainda completa 3 dos 6 slots com banco de
  imagens temporário).

## Evidence on Hand

- Schema de dados herdado do template (`business_settings`, `services`,
  `staff`, `clients`, `appointments`, `blocked_slots`, `gallery_photos`,
  `transactions`, com RLS por tabela) — migrations ainda não aplicadas em
  nenhum projeto Supabase real (adiado a pedido da cliente, ver CLAUDE.md >
  Pendências); os mesmos dados reais já existem em `supabase/seed.sql` e
  espelhados em `src/lib/local-fallback-data.ts` pro modo de
  pré-visualização sem banco.
- Logo real, 3 fotos de portfólio, horário, serviços e nomes da equipe
  recebidos em 2026-09-14/15 (ver `public/imagens/` e CLAUDE.md >
  Pendências) — já em uso no site. Vídeo real da Hero e fotos da equipe
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
