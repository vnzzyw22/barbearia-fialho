import type { Metadata } from "next";
import { Familjen_Grotesk, JetBrains_Mono, Oswald, Rye } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "@/components/site/route-transition";

// Fonte de display (revisado 2026-09-15 novamente — pedido da cliente
// inspirado numa referência de barbearia "clássica, premium e imponente":
// condensada, extra-negrito, caixa-alta, aplicada no restante do site —
// a Hero em si ficou só com o selo da logo, sem headline em texto, então
// esta fonte não precisa mais conversar com o traço vintage da logo como
// a Bevan precisava). Testada Oswald vs Antonio com acentos em PT-BR
// antes de decidir — as duas renderizam limpo (nenhuma tem o defeito que
// a Alfa Slab One teve). Oswald escolhida por ser mais consolidada/
// testada e ter um peso mais "clássico" que a Antonio, mais "esportiva".
// NENHUMA das duas tem itálico de verdade no Google Fonts (`styles:
// ["normal"]` nos metadados do next/font) — ver `font-synthesis: style`
// em globals.css pro itálico sintético do único uso real (about-section
// tagline).
const oswald = Oswald({
  variable: "--font-display",
  // `latin-ext`, não só `latin`: a Oswald separa caracteres estendidos
  // (Ç, entre outros) nesse subset — sem ele o Ç renderiza sem cedilha
  // (vira "C" puro), achado ao revisar o screenshot de "SERVIÇOS"
  // ampliado (nunca confiar só na leitura visual normal pra isso).
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

// Fonte de eyebrow/label decorativo (2026-09-15) — só pro único texto
// realmente "eyebrow" isolado do site (o "Maringá — PR" da Hero, ver
// hero.tsx). NÃO usada em --font-label (que continua JetBrains Mono):
// --font-label serve preço/duração/dados do painel admin/CTAs, onde uma
// fonte decorativa estilo placa prejudicaria legibilidade de dados reais.
// Rye escolhida sobre Sancreek por legibilidade ligeiramente melhor no
// tamanho real de uso (12px, tracking largo) — ambas testadas antes de
// decidir.
const rye = Rye({
  variable: "--font-eyebrow",
  // latin-ext incluído por precaução (ver comentário da Oswald acima —
  // mesmo risco de caractere acentuado faltando existe em qualquer fonte
  // do Google Fonts que separe os dois subsets).
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

// Texto corrido + navbar: grotesk neutra com personalidade, não Inter (pedido
// explícito do ANEXO). Familjen Grotesk tem traços levemente incomuns
// (terminações angulares em algumas letras) sem perder legibilidade em
// parágrafo — mapeada tanto em --font-body quanto em --font-nav (globals.css)
// pra não introduzir uma terceira família só pro menu.
const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

// Fonte mono pra legendas/labels/dados factuais (preço, duração, horário) —
// mantida do template original, gênero neutro que não compete com a
// serifada de display nem com o corpo de texto.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Fialho Barbearia",
  description:
    "Fialho Barbearia — Maringá, PR. Cabelo, barba e bigode como tem que ser! Agendamento online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${oswald.variable} ${familjenGrotesk.variable} ${jetbrainsMono.variable} ${rye.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-black"
        >
          Pular para o conteúdo
        </a>
        <RouteTransition />
        {children}
      </body>
    </html>
  );
}
