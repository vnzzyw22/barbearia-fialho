"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Reveal } from "./reveal";

// Conteúdo real fornecido pela cliente em 2026-09-16 (copy do próprio
// material de divulgação do Clube Fialho Premium) — não inventar nada além
// disso. Os prefixos numéricos do texto original ("2 - Barba") são ids
// internos do sistema dela, omitidos aqui (só o nome do serviço importa).
const PREMIUM_TAGLINE =
  "O Clube ideal para quem entende o poder da imagem, sempre alinhado!";

const PREMIUM_DESCRIPTION =
  "O Clube Fialho Premium é o plano mais exclusivo da barbearia. Nele, " +
  "você tem acesso ilimitado a todos os serviços que a Fialho oferece: " +
  "cabelo, barba, sobrancelha, hidratações, tratamentos e muito mais.";

const PREMIUM_ITEMS = [
  "Ajustes finos",
  "Barba",
  "Cabelo",
  "Cabelo e Barba",
  "Corte simples",
  "Depilação de Nariz",
  "Depilação de Orelha",
  "Hidratação Capilar",
  "Black Mask",
  "Relaxamento Capilar",
  "Selagem Capilar",
  "Sobrancelhas",
  "Tintura",
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 10"
      className="h-2.5 w-3 shrink-0 fill-none stroke-current text-brand-red"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 5l3.5 3.5L11 1.5" />
    </svg>
  );
}

// "Respiração" lenta e contínua no glow do card (pedido explícito da
// cliente: "que prendesse o cliente na tela") — ciclo longo (3.2s) e
// variação pequena de opacidade de propósito, pra ficar constante sem
// virar gimmick tipo brilho girando/sparkle. Some por completo com
// prefers-reduced-motion; o card mantém o glow estático via `shadow` no
// elemento pai, só perde a pulsação.
function PremiumCardGlow() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px rounded-2xl"
      style={{ boxShadow: "0 0 60px -15px rgba(176,141,87,0.5)" }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3.2, ease: EASE, repeat: Infinity }}
    />
  );
}

// Card de destaque do Clube Fialho — deliberadamente diferente dos cards
// de serviço normais (border/25 fina + fundo quase transparente): borda
// grossa sólida, gradiente sutil, glow externo e selo no canto. Mesma cor
// da marca (`--color-brand-red`, cobre `#b08d57`) com tratamento mais
// rico, sem introduzir um dourado vibrante novo — decisão confirmada com
// a cliente (a marca evita de propósito o clichê "preto + dourado" de
// barbearia).
export function PremiumClubSection() {
  return (
    <section id="clube" className="bg-brand-ink">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-24 lg:max-w-6xl">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-center font-display text-4xl leading-none font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
              <span className="text-brand-red">Clube</span>{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--color-brand-cream)" }}
              >
                Fialho
              </span>
            </h2>
            <span aria-hidden="true" className="h-px w-16 bg-brand-red/60" />
            <p className="max-w-2xl text-center text-brand-smoke">
              {PREMIUM_TAGLINE}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="relative mx-auto max-w-3xl rounded-2xl border-2 border-brand-red bg-gradient-to-br from-brand-red/[0.08] via-transparent to-brand-red/[0.03] p-8 sm:p-12">
            <PremiumCardGlow />

            <span className="absolute top-0 right-0 rounded-tr-2xl rounded-bl-xl bg-brand-red px-4 py-1.5 font-label text-xs font-bold tracking-widest text-brand-black uppercase">
              Clube Fialho Premium
            </span>

            <p className="max-w-xl font-light text-brand-cream">
              {PREMIUM_DESCRIPTION}
            </p>

            <p className="mt-8 font-label text-xs font-bold tracking-widest text-brand-red uppercase">
              Todos os itens abaixo: 100% de desconto · disponível todos os
              dias de funcionamento
            </p>

            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {PREMIUM_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-brand-cream"
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/agendar"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-4 font-label text-sm font-bold tracking-widest text-brand-black uppercase transition hover:opacity-90 sm:w-auto"
            >
              Quero fazer parte do Clube
            </Link>
            <p className="mt-3 text-xs text-brand-smoke">
              Fale com a Fialho para saber como assinar — sem custo pra
              conhecer.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
