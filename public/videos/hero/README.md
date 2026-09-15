# Vídeo da Hero — processado (2026-09-14, revisado 2026-09-15)

Arquivos finais, já referenciados por `src/components/site/hero.tsx`:

- `hero-poster.jpg` — frame extraído do próprio vídeo (barbeiro com a
  navalha reta junto ao rosto do cliente, aos 6s do vídeo bruto). Usado
  como `poster` do `<video>` e como imagem estática quando
  `prefers-reduced-motion` está ativado.
- `hero-background.mp4` — recorte vertical original (478×850, mesmo
  enquadramento do Reel), recomprimido em H.264/mp4 sem áudio (~1,2MB).
  Único arquivo de vídeo da Hero, usado em **qualquer** largura de tela —
  `object-cover` no `<video>` cobre 100% da seção em qualquer resolução,
  cortando simetricamente as bordas sem distorcer a proporção.

## Histórico: por que não existe mais um arquivo "desktop" separado

A fonte bruta é só vertical (exportação de Reel, sem nenhum plano
panorâmico disponível). Duas versões anteriores tentaram simular uma
composição widescreen pra desktop (`hero-desktop.mp4`, removido em
2026-09-15):

- **v1:** fundo desfocado/escurecido do próprio vídeo preenchendo um
  quadro 16:9, com o vídeo nítido centralizado por cima, corte reto entre
  as duas camadas.
- **v2:** mesmo princípio, com fundo mais recuado e transição em
  gradiente (feather) nas bordas da faixa nítida, tentando disfarçar o
  corte reto da v1.

**Descartado a pedido da cliente (2026-09-15):** mesmo com o polimento da
v2, a faixa nítida ainda lia como "vídeo vertical no meio da tela", não
como widescreen de verdade — o efeito de disfarce nas bordas incomodava
mais do que ajudava. Decisão final: usar `object-fit: cover` puro (sem
nenhuma composição/blur), deixando o navegador cortar o vídeo vertical
pra cobrir 100% da Hero em qualquer resolução. Verificado que o material
já é filmado em closes bem enquadrados (mão/rosto/navalha preenchendo o
quadro), então o corte mais agressivo em telas largas ainda fica bem
enquadrado — sem esse corte não tem como um vídeo vertical "parecer"
widescreen sem inventar conteúdo (ver seção 4 do ANEXO: nada de mídia
sintética).

## Fonte bruta

A exportação original do Reel (2144139 bytes, 478×850, 30fps, ~11,4s,
recebida direto na pasta do projeto em 2026-09-14) está guardada em
`midia-cliente/hero/fundo-hero-raw.mp4` — reprocessar a partir dela se
precisar ajustar corte/poster/grading.

## Comandos usados (ffmpeg, via winget `Gyan.FFmpeg`)

```bash
# Poster (frame em 6s)
ffmpeg -ss 6 -i fundo-hero-raw.mp4 -frames:v 1 -q:v 3 hero-poster.jpg

# Vídeo único (recomprime o recorte vertical original, sem áudio) —
# usado em qualquer largura de tela via object-cover no CSS.
ffmpeg -i fundo-hero-raw.mp4 -an -c:v libx264 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart hero-background.mp4
```

O grading de cor da marca (pretos esmagados, tons quentes, baixo
contraste) é aplicado em CSS no próprio `hero.tsx` (`saturate`/`contrast`/
`brightness` + vinheta), não fica gravado no arquivo de vídeo — assim fica
fácil reajustar sem reprocessar o MP4.
