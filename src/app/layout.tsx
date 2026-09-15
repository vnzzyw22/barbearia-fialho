import type { Metadata } from "next";
import { Berkshire_Swash, Familjen_Grotesk, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "@/components/site/route-transition";

// Fonte de destaque (2026-09-15) — logo real recebida (ver
// public/imagens/fialho-logo.jpg): "FIALHO" em script/flourish vintage.
// Berkshire Swash é a aproximação mais próxima disso disponível no Google
// Fonts (swash bold, clima de selo/tatuagem vintage) — usada só nos
// wordmarks/títulos grandes (Hero, título de cada seção), nunca em texto
// menor/denso (nome de serviço no card, preço, pergunta do FAQ etc. — ali
// ilegível em script). Continua valendo a regra do ANEXO seção 3: "não usar
// a fonte script do logo em corpo de texto, só em elementos pontuais de
// marca" — só que agora com uma fonte de verdade em vez de placeholder.
const berkshireSwash = Berkshire_Swash({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

// Fonte de display secundária: serifada, ecoa o "BARBEARIA" em caixa-alta
// pequena da logo — usada em títulos menores, nome de serviço/profissional,
// preço etc., onde o script ficaria ilegível.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

// Texto corrido + navbar: grotesk neutra com personalidade, não Inter (pedido
// explícito do ANEXO). Familjen Grotesk tem traços levemente incomuns
// (terminações angulares em algumas letras) sem perder legibilidade em
// parágrafo — mapeada tanto em --font-body quanto em --font-nav (globals.css)
// pra não introduzir uma terceira família só pro menu.
const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Fonte mono pra legendas/labels/dados factuais (preço, duração, horário) —
// mantida do template original, gênero neutro que não compete com a
// serifada de display nem com o corpo de texto.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin"],
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
      className={`${berkshireSwash.variable} ${fraunces.variable} ${familjenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
