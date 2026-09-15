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
  fundo, com o vídeo nítido centralizado por cima. **Não é literalmente uma
  composição desktop mais ampla** — se um dia a Fialho gravar/mandar um
  plano horizontal de verdade (ou um Reel gravado já pensando em
  paisagem), vale reprocessar este arquivo a partir dele. H.264/mp4 sem
  áudio (~3,1MB).
  - **v2 (2026-09-15):** cliente relatou que a faixa nítida parecia "em
    pé" (o corte reto entre nítido/desfocado da v1 lia como vídeo vertical
    colado no meio da tela, não como composição widescreen intencional).
    Frames do bruto checados (1s/3s/6s/9s) confirmam que é um Reel bem
    fechado — mão/rosto/navalha preenchem o quadro de ponta a ponta na
    maioria dos momentos, sem sobra pra cortar sem perder conteúdo real.
    Ajuste aplicado foi só cosmético, sem cortar nenhum frame do vídeo
    nítido: fundo mais desfocado/escurecido (`gblur sigma=40→55`,
    `brightness=-0.12→-0.18`, `saturation=0.65→0.55`, mais recuo/
    profundidade) + transição em gradiente nas bordas verticais da faixa
    nítida (`geq` de alpha, 12% da largura de cada lado, via
    `format=yuva420p`) em vez do corte reto anterior — lê como vinheta
    intencional, não como retângulo colado. 100% do conteúdo original
    preservado.

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

# Desktop v1 (fundo desfocado 16:9 + vídeo nítido centralizado, corte reto)
ffmpeg -i fundo-hero-raw.mp4 -filter_complex "
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=40,eq=brightness=-0.12:saturation=0.65[bg];
[0:v]scale=-2:1080[fg];
[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1[outv]
" -map "[outv]" -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
  -movflags +faststart hero-desktop.mp4

# Desktop v2 (2026-09-15, em uso): mesmo princípio, fundo mais recuado +
# bordas da faixa nítida com gradiente de transparência (feather) em vez
# de corte reto — zero conteúdo cortado, só polimento visual.
ffmpeg -i fundo-hero-raw.mp4 -filter_complex "
[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=55,eq=brightness=-0.18:saturation=0.55[bg];
[0:v]scale=-2:1080,format=yuva420p,geq=lum='p(X,Y)':a='if(lt(X,W*0.12),255*(X/(W*0.12)),if(gt(X,W*(1-0.12)),255*((W-X)/(W*0.12)),255))'[fg];
[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1[outv]
" -map "[outv]" -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
  -movflags +faststart hero-desktop.mp4
```

O grading de cor da marca (pretos esmagados, tons quentes, baixo
contraste) é aplicado em CSS no próprio `hero.tsx` (`saturate`/`contrast`/
`brightness` + vinheta), não fica gravado no arquivo de vídeo — assim fica
fácil reajustar sem reprocessar os MP4s.
