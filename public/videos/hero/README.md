# Vídeo da Hero — processado (2026-09-14)

Arquivos finais, já referenciados por `src/components/site/hero.tsx`:

- `hero-poster.jpg` — frame extraído do próprio vídeo (barbeiro com a
  navalha reta junto ao rosto do cliente, aos 6s do vídeo bruto). Usado
  como `poster` do `<video>` e como imagem estática quando
  `prefers-reduced-motion` está ativado.
- `hero-mobile.mp4` — recorte vertical original (478×850, mesmo
  enquadramento do Reel), recomprimido em H.264/mp4 sem áudio (~1,2MB).
- `hero-desktop.mp4` — a fonte bruta é só vertical (exportação de Reel, sem
  nenhum plano panorâmico disponível ainda), então este arquivo usa um
  tratamento diferente em vez de um "recorte mais amplo" de verdade: o
  próprio vídeo desfocado/escurecido preenche o quadro 16:9 (1920×1080) de
  fundo, com o vídeo nítido centralizado por cima. Resultado plausível pra
  tela cheia, mas **não é literalmente uma composição desktop mais ampla**
  — se um dia a Fialho gravar/mandar um plano horizontal de verdade (ou um
  Reel gravado já pensando em paisagem), vale reprocessar este arquivo a
  partir dele. H.264/mp4 sem áudio (~3,4MB).

## Fonte bruta

A exportação original do Reel (2144139 bytes, 478×850, 30fps, ~11,4s,
recebida direto na pasta do projeto em 2026-09-14) está guardada em
`midia-cliente/hero/fundo-hero-raw.mp4` — reprocessar a partir dela se
precisar ajustar corte/poster/grading.

## Comandos usados (ffmpeg, via winget `Gyan.FFmpeg`)

```bash
# Poster (frame em 6s)
ffmpeg -ss 6 -i fundo-hero-raw.mp4 -frames:v 1 -q:v 3 hero-poster.jpg

# Mobile (recomprime o recorte vertical original, sem áudio)
ffmpeg -i fundo-hero-raw.mp4 -an -c:v libx264 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart hero-mobile.mp4

# Desktop (fundo desfocado 16:9 + vídeo nítido centralizado)
ffmpeg -i fundo-hero-raw.mp4 -filter_complex "
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=40,eq=brightness=-0.12:saturation=0.65[bg];
[0:v]scale=-2:1080[fg];
[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1[outv]
" -map "[outv]" -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
  -movflags +faststart hero-desktop.mp4
```

O grading de cor da marca (pretos esmagados, tons quentes, baixo
contraste) é aplicado em CSS no próprio `hero.tsx` (`saturate`/`contrast`/
`brightness` + vinheta), não fica gravado no arquivo de vídeo — assim fica
fácil reajustar sem reprocessar os MP4s.
