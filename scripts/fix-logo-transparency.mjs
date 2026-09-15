import sharp from "sharp";

const SRC = "public/imagens/fialho-logo-borda-branca.jpg";
const OUT = "public/imagens/fialho-logo-borda-branca.png";

// v2: a v1 usava uma cor de fundo média fixa (191.5) — deixava um
// resíduo visível do próprio xadrez (as duas células ~184/~199 nunca
// cancelavam exatamente contra uma constante única, ~7 de erro que
// aparecia como fantasma do xadrez sobre qualquer fundo não-liso, ex.:
// o vídeo da Hero). Fix: filtro de mediana (raio bem menor que a célula
// do xadrez, ~25.6px, mas maior que a espessura do traço do logo,
// ~2-4px) estima o fundo real PIXEL A PIXEL — remove o traço fino (é
// minoria dentro da janela) preservando o valor exato da célula do
// xadrez embaixo dele.
const INK = [40, 35, 21]; // tom escuro amostrado do próprio traço do logo
const inkLum = (INK[0] + INK[1] + INK[2]) / 3;

const raw = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = raw.info;

const bgRaw = await sharp(SRC).median(9).raw().toBuffer({ resolveWithObject: true });

const data = raw.data;
const bg = bgRaw.data;
const out = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const o = (y * width + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const bgR = bg[i], bgG = bg[i + 1], bgB = bg[i + 2];
    const lum = (r + g + b) / 3;
    const bgLum = (bgR + bgG + bgB) / 3;

    let alpha = (bgLum - lum) / (bgLum - inkLum);
    alpha = Math.max(0, Math.min(1, alpha));

    // Marca d'água do Gemini (canto inferior direito) — apagar de vez.
    if (x > 896 && y > 896) alpha = 0;

    if (alpha < 0.02) {
      out[o] = 0; out[o + 1] = 0; out[o + 2] = 0; out[o + 3] = 0;
    } else {
      const denom = Math.max(alpha, 0.05);
      out[o] = Math.max(0, Math.min(255, Math.round((r - (1 - alpha) * bgR) / denom)));
      out[o + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - alpha) * bgG) / denom)));
      out[o + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - alpha) * bgB) / denom)));
      out[o + 3] = Math.round(alpha * 255);
    }
  }
}

await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT);
console.log("gerado:", OUT);
