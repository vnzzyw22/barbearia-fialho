"use client";

import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
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
// elemento pai, só perde a pulsação. Fica FORA de qualquer wrapper com
// overflow-hidden (ver ShimmerSweep) — é um glow que sangra pra fora do
// card de propósito, cortar isso destruiria o efeito.
function PremiumCardGlow({ reduceMotion }: { reduceMotion: boolean | null }) {
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

// Passagem de brilho periódica pela superfície do card (2026-09-17, a
// pedido da cliente: "mais premium e chamativo, com movimentos") — como um
// reflexo de luz passando devagar sobre metal escovado. Precisa do próprio
// wrapper com overflow-hidden (diferente do card em si, que fica sem
// clipping de propósito pro glow externo sangrar pra fora).
function ShimmerSweep({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
    >
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-brand-cream/10 to-transparent"
        style={{ transform: "skewX(-20deg)" }}
        animate={{ x: ["-140%", "260%"] }}
        transition={{
          duration: 2.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 3.4,
        }}
      />
    </div>
  );
}

// Número que conta até `value` assim que entra na tela — pequeno toque de
// "isso é valioso" comum em seções de plano/assinatura premium. Só conta
// uma vez (`viewport once`); com reduced-motion pula direto pro valor
// final, sem animação de contagem.
function AnimatedCount({
  value,
  reduceMotion,
}: {
  value: number;
  reduceMotion: boolean | null;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = count.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsubscribe();
  }, [count]);

  return (
    <motion.span
      viewport={{ once: true, amount: 0.6 }}
      onViewportEnter={() => {
        if (reduceMotion) {
          count.set(value);
          return;
        }
        animate(count, value, { duration: 1.1, ease: EASE });
      }}
    >
      {display}
    </motion.span>
  );
}

// Tilt 3D discreto seguindo o mouse — o card inteiro (borda, glow, brilho,
// conteúdo) inclina como um objeto físico sendo observado de ângulos
// diferentes. Some por completo com reduced-motion (o card fica plano,
// sem os listeners de mouse). Valores pequenos de propósito (±6deg): é um
// "objeto premium sendo examinado", não um efeito de jogo/cyberpunk.
function useCardTilt(reduceMotion: boolean | null) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function onMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

// Lista de serviços inclusos — vira um ticker horizontal contínuo (dois
// conjuntos duplicados, loop de -50% pra ficar imperceptível), em vez da
// grade estática anterior ("ficou muito simples", feedback da cliente em
// 2026-09-17). Com reduced-motion volta a ser uma lista estática — mesmo
// conteúdo, sem depender de esperar o loop passar pra ler tudo.
function ServicesMarquee({
  items,
  reduceMotion,
}: {
  items: string[];
  reduceMotion: boolean | null;
}) {
  if (reduceMotion) {
    return (
      <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-brand-cream">
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const loopItems = [...items, ...items];

  return (
    <div
      className="relative mt-5 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {loopItems.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-brand-red/30 bg-white/[0.03] px-4 py-2 text-sm whitespace-nowrap text-brand-cream"
          >
            <CheckIcon />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Card de destaque do Clube Fialho — deliberadamente diferente dos cards
// de serviço normais (border/25 fina + fundo quase transparente): borda
// grossa sólida, gradiente sutil, glow externo, brilho periódico, tilt 3D
// no mouse e selo no canto. Mesma cor da marca (`--color-brand-red`, cobre
// `#b08d57`) com tratamento mais rico, sem introduzir um dourado vibrante
// novo — decisão confirmada com a cliente (a marca evita de propósito o
// clichê "preto + dourado" de barbearia).
export function PremiumClubSection() {
  const reduceMotion = useReducedMotion();
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useCardTilt(reduceMotion);

  const tiltStyle = reduceMotion
    ? undefined
    : ({ rotateX, rotateY, transformPerspective: 1000 } as {
        rotateX: MotionValue<number>;
        rotateY: MotionValue<number>;
        transformPerspective: number;
      });

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
          <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={tiltStyle}
            className="relative mx-auto max-w-3xl rounded-2xl border-2 border-brand-red bg-gradient-to-br from-brand-red/[0.08] via-transparent to-brand-red/[0.03] p-8 sm:p-12"
          >
            <PremiumCardGlow reduceMotion={reduceMotion} />
            <ShimmerSweep reduceMotion={reduceMotion} />

            <span className="absolute top-0 right-0 rounded-tr-2xl rounded-bl-xl bg-brand-red px-4 py-1.5 font-label text-xs font-bold tracking-widest text-brand-black uppercase">
              Clube Fialho Premium
            </span>

            <p className="max-w-xl font-light text-brand-cream">
              {PREMIUM_DESCRIPTION}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-brand-red/20 py-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-black text-brand-red">
                  <AnimatedCount value={PREMIUM_ITEMS.length} reduceMotion={reduceMotion} />
                </span>
                <span className="font-label text-xs tracking-widest text-brand-smoke uppercase">
                  Serviços
                  <br />
                  inclusos
                </span>
              </div>
              <span className="font-label text-xs font-bold tracking-widest text-brand-red uppercase">
                100% de desconto · disponível todos os dias de funcionamento
              </span>
            </div>

            <ServicesMarquee items={PREMIUM_ITEMS} reduceMotion={reduceMotion} />

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
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
