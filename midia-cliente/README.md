# Mídia da cliente — pasta de recebimento

Esta pasta é só um ponto de entrega: coloque aqui os arquivos **brutos**
que a Fialho for mandando, e a partir daqui eu processo e coloco cada um
no lugar certo do projeto (ver ANEXO seções 2 e 4). Nada aqui é servido
pelo site diretamente.

- `midia-cliente/hero/` — exportação bruta do Reel do Instagram
  (@fialhobarbearia_) que vira o vídeo de fundo da Hero. A partir daqui eu
  recorto (desktop + mobile), comprimo (H.264, ~3-4MB) e extraio o poster,
  deixando o resultado em `public/videos/hero/` (ver README lá). **Já
  recebido e processado em 2026-09-14** (`fundo-hero-raw.mp4`) — mais
  vídeos/reels que cheguem depois seguem o mesmo fluxo.
- `midia-cliente/galeria/` — fotos reais de portfólio para a Galeria. A
  partir daqui eu faço o upload pelo painel administrativo (Supabase
  Storage, `/admin/galeria`) — ou insiro diretamente se o projeto Supabase
  ainda não estiver criado (ver CLAUDE.md > Pendências).
- `midia-cliente/logo/` — logo real da marca (navalha, ver ANEXO seção 3),
  quando disponível. Hoje o site não usa nenhum logo — só o wordmark
  tipográfico (Fraunces) — enquanto este arquivo não chega.

Essas subpastas ainda não existem porque nenhum arquivo chegou ainda —
crie a subpasta correspondente ao adicionar o primeiro arquivo de cada
tipo.
