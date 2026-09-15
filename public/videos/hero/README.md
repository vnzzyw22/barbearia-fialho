# Vídeo da Hero — pasta de destino

Este diretório é onde os arquivos **finais e já processados** do vídeo de
fundo da Hero devem ficar (ver `src/components/site/hero.tsx` e ANEXO
seção 4). Não é aqui que a Fialho deve jogar o vídeo bruto exportado do
Instagram — isso vai em `midia-cliente/hero/` na raiz do projeto; eu
(o agente) recorto/comprimo/gradeio a partir de lá e deixo o resultado
pronto aqui.

Arquivos esperados, exatamente com esses nomes (o componente já referencia
esses caminhos — assim que existirem, o vídeo aparece sem precisar mexer em
código):

- `hero-desktop.mp4` — recorte panorâmico (16:9 ou próximo), H.264/mp4,
  ~3-4MB no trecho usado.
- `hero-mobile.mp4` — recorte vertical/quadrado, próximo do enquadramento
  original do Reel, mesmo codec/peso-alvo.
- `hero-poster.jpg` — frame estático extraído do próprio vídeo (mesma
  cena/grading), usado como fallback: conexão ruim, `prefers-reduced-motion`
  ativado (nesse caso o `<video>` nem é renderizado, ver hero.tsx) e como
  `poster` do elemento `<video>` antes do primeiro frame carregar.

Enquanto esses 3 arquivos não existem, a Hero usa uma foto de banco
(Unsplash, tratada com o duotone da marca) como poster — ver
`src/lib/placeholder-media.ts`. Nenhum código extra precisa mudar quando os
arquivos reais chegarem: o `<video>` já aponta pra estes caminhos.
