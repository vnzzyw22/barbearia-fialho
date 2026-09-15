import type { Metadata } from "next";
import { Familjen_Grotesk, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "@/components/site/route-transition";

// Fonte de display (ver ANEXO seção 3): serifada forte de peso editorial —
// headlines, números de seção, wordmark da Hero. Fraunces tem esse caráter
// "clássico com atitude" sem competir com o logo real (ainda não recebido,
// ver CLAUDE.md > Pendências).
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
      className={`${fraunces.variable} ${familjenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
