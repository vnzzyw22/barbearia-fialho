# Fialho Barbearia

Site + agendamento + painel administrativo para a Fialho Barbearia
(Avenida Brasil, 4493 — Maringá, PR). Terceiro deployment do template
construído originalmente para o Lkas Locs e reaproveitado pelo Tesouras
Club Barbearia — código clonado localmente a partir do Tesouras Club em
2026-09-14. Consulte `CLAUDE.md` para o guia completo do projeto, decisões
de arquitetura e progresso por fase; `PRODUCT.md` e `DESIGN.md` para o
detalhamento de produto e identidade visual.

Projeto [Next.js](https://nextjs.org) (App Router, TypeScript) +
[Tailwind CSS v4](https://tailwindcss.com) + [Supabase](https://supabase.com)
(Postgres/Auth/Storage).

## Getting Started

Instale as dependências e rode o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Antes de rodar contra dados reais, copie `.env.local.example` para
`.env.local` e preencha as variáveis do Supabase (ver CLAUDE.md >
Pendências — o projeto Supabase da Fialho ainda não foi criado).

## Mídia da cliente

Fotos e vídeo reais da Fialho ainda não foram recebidos — ver
`midia-cliente/README.md` pra onde entregar os arquivos brutos, e ANEXO
seções 2 e 4 pro que se espera de cada um. Enquanto isso, Hero e Galeria
usam um banco de imagens temporário (ver `src/lib/placeholder-media.ts`).

## Deploy

Deploy planejado na [Vercel](https://vercel.com) — projeto ainda não criado
(ver CLAUDE.md > Pendências).
