import type { Metadata } from "next";
import { Bevan, Familjen_Grotesk, JetBrains_Mono, Rye } from "next/font/google";
import "./globals.css";
import { RouteTransition } from "@/components/site/route-transition";

// Fonte de display (revisado 2026-09-15 — trocada a pedido da cliente,
// a Fraunces serifada não conversava com a logo real, que combina
// script ornamentado + slab pesada estilo cartaz antigo): Bevan, mesmo
// peso "cartaz de velho oeste" do "BARBEARIA" da logo. Testada contra
// Alfa Slab One antes de decidir — Alfa Slab One tem um defeito real de
// renderização em letras maiúsculas acentuadas (Á/Ã/Ç ficam com uma
// franja/ghosting visível, confirmado por screenshot comparando as
// duas), inaceitável num site 100% em português. Bevan só existe no
// peso 400 (sem negrito de verdade) — `font-synthesis: none` em
// globals.css evita negrito falso sintetizado pelo navegador nos vários
// `font-black`/`font-bold` já usados junto de `font-display` no código.
const bevan = Bevan({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
  subsets: ["latin"],
  weight: "400",
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
      className={`${bevan.variable} ${familjenGrotesk.variable} ${jetbrainsMono.variable} ${rye.variable} h-full antialiased`}
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
