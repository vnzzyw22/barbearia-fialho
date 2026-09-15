"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import type { BusinessSettings } from "@/lib/supabase/types";

interface HeroProps {
  business: BusinessSettings | null;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

// Entrada com leve blur resolvendo pra nítido (ver ANEXO seção 5) — troca o
// fadeUp genérico do template original por um blur-in, pedido específico
// pra headline da Hero.
const blurIn = {
  hidden: { opacity: 0, y: 16, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

// Poster real (2026-09-14, ver public/videos/hero/README.md) — frame
// extraído do próprio vídeo da Hero (barbeiro com a navalha reta junto ao
// rosto do cliente, o "objeto-herói" pedido no ANEXO seção 3), não mais
// foto de banco/galeria como fallback provisório.
const POSTER_SRC = "/videos/hero/hero-poster.jpg";

// Vídeo de fundo (ver ANEXO seção 4) — recorte vertical original do Reel
// (@fialhobarbearia_, recebido em 2026-09-14), só recomprimido, usado em
// QUALQUER largura de tela. Nada de composição/pillarbox pra desktop
// (v1/v2, removidas em 2026-09-15 a pedido da cliente — o "fundo
// desfocado preenchendo 16:9" lia como vídeo vertical disfarçado, não
// como widescreen de verdade): `object-cover` no <video> cobre 100% da
// Hero em qualquer resolução sem distorcer a proporção, cortando o topo/
// base em telas largas (a largura vira a dimensão limitante) — o próprio
// material já é filmado em closes bem enquadrados (ver
// public/videos/hero/README.md), então esse corte mais agressivo em
// telas largas ainda fica bem enquadrado.
const HERO_VIDEO_SRC = "/videos/hero/hero-background.mp4";

export function Hero({ business }: HeroProps) {
  // useReducedMotion() retorna `null` no primeiro render (servidor e
  // primeiro paint no cliente, antes do próprio hook resolver via
  // matchMedia) — `!reduceMotion` trata `null` como "mostra vídeo", e o
  // hook força um novo render assim que resolve pra `true`/`false`. Nunca
  // chega a iniciar o carregamento do vídeo num cliente com a preferência
  // ativada (ver ANEXO seção 4: "mostrar só a imagem estática, sem tentar
  // carregar o vídeo") porque esse segundo render acontece antes do
  // navegador buscar o `<source>`.
  const reduceMotion = useReducedMotion();
  const showVideo = !reduceMotion;

  return (
    <section
      id="topo"
      // `isolate` é essencial aqui: sem um contexto de empilhamento próprio,
      // o filho `-z-10` abaixo escapa pro contexto de um ancestral externo
      // e é pintado ANTES do próprio bg-brand-ink desta section — ou seja,
      // o fundo sólido da section cobre o vídeo/poster por completo, sempre
      // (causa real do "vídeo preto" em produção, 2026-09-15: confirmado
      // com amostragem de pixel do screenshot, que batia exatamente com
      // #121110 em toda a área da Hero, e reproduzido/revertido ao vivo
      // isolando o z-index desta camada).
      className="relative isolate overflow-x-hidden bg-brand-ink pt-16 text-brand-cream"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-ink">
        {/* Camada de base: SEMPRE renderizada, sem relação nenhuma com o
            estado do <video>. Puro <Image>, visível via CSS puro, sem
            depender de onLoadedData/onCanPlay/play() resolver. */}
        <Image
          src={POSTER_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.85) contrast(0.94) brightness(0.62)" }}
        />
        {/* 2026-09-15: causa real do "vídeo preto" reportado pela cliente
            em produção — sem o atributo `poster`, o navegador pinta o
            <video> como um retângulo preto opaco sempre que ainda não
            decodificou nenhum frame (autoplay adiado silenciosamente por
            economia de dados/bateria no aparelho real dela, sem disparar
            erro nenhum). Esse preto fica por cima da camada de <Image>
            acima, escondendo-a, porque o <video> vem depois no DOM. O
            atributo `poster` resolve isso na própria pintura do elemento —
            é só uma imagem, pintada imediatamente e substituída assim que o
            primeiro frame real do vídeo começa a tocar, sem depender de
            nenhum callback JS (ao contrário do vídeo em si). */}
        {showVideo && (
          <video
            className="hero-zoom absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.85) contrast(0.94) brightness(0.62)" }}
            poster={POSTER_SRC}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        )}
        {/* Vinheta pra garantir contraste do texto sobre qualquer frame do
            vídeo/poster — mais escura embaixo, onde ficam CTAs/indicador. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,17,16,0.55) 0%, rgba(18,17,16,0.35) 45%, rgba(18,17,16,0.85) 100%)",
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 mx-auto flex min-h-[86svh] max-w-4xl flex-col items-center px-6 pt-16 pb-14 text-center sm:pt-20"
      >
        {/* Único "eyebrow" isolado do site de verdade (ver layout.tsx) —
            por isso usa font-eyebrow (Rye) em vez de font-label
            (JetBrains Mono, reservado a dados factuais/CTAs). */}
        <motion.p
          variants={blurIn}
          className="font-eyebrow text-xs tracking-[0.35em] text-brand-cream/70 uppercase"
        >
          Maringá — PR
        </motion.p>

        <motion.h1
          variants={blurIn}
          className="mt-6 font-display leading-[0.88] font-black tracking-tight uppercase"
          style={{ fontSize: "clamp(3rem, 13vw, 8rem)" }}
        >
          <span className="block text-brand-cream">Fialho</span>
          <span className="mt-1 block text-brand-red">Barbearia</span>
        </motion.h1>

        {/* Tagline real da marca (ver ANEXO seção 1) — dado confirmado, não
            placeholder, por isso hardcoded aqui como o resto da identidade
            fixa (não é algo editável pelo painel). */}
        <motion.p
          variants={blurIn}
          className="mt-5 max-w-md font-display text-lg font-medium text-brand-cream/90 italic sm:text-xl"
        >
          &ldquo;Cabelo, barba e bigode como tem que ser!&rdquo;
        </motion.p>

        <motion.p
          variants={blurIn}
          className="mt-4 font-label text-xs tracking-widest text-brand-cream/60 uppercase"
        >
          {business?.address ?? "Avenida Brasil, 4493 — Maringá, PR"}
        </motion.p>

        <motion.div
          variants={blurIn}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/agendar"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-brand-red px-8 py-3.5 font-label text-xs font-bold tracking-widest text-brand-black uppercase transition-all duration-300 ease-in-out hover:brightness-110"
          >
            Agendar horário
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <a
            href="#servicos"
            className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-brand-red bg-transparent px-8 py-3.5 font-label text-xs font-medium tracking-widest text-brand-cream uppercase transition-all duration-300 ease-in-out hover:bg-brand-red hover:text-brand-black"
          >
            Conhecer
          </a>
        </motion.div>

        <motion.a
          variants={blurIn}
          href="#sobre"
          className="mt-auto flex flex-col items-center gap-2 pt-14 font-label text-[10px] tracking-[0.3em] text-brand-cream/60 uppercase"
        >
          Explorar
          <span className="h-10 w-px animate-pulse bg-brand-cream/60" />
        </motion.a>
      </motion.div>

      {/* Zoom-out contínuo do vídeo/poster (ANEXO seção 5): 1.04 → 1.0 em
          ~10s, indo e voltando (`alternate`) pra ficar "loop suave" em vez
          de resetar com um corte seco. `prefers-reduced-motion` já
          desativa isso globalmente (ver globals.css), sem precisar de
          lógica JS extra aqui. */}
      <style jsx global>{`
        @keyframes hero-zoom {
          from {
            transform: scale(1.04);
          }
          to {
            transform: scale(1);
          }
        }
        .hero-zoom {
          animation: hero-zoom 10s var(--ease-signature) infinite alternate;
        }
      `}</style>
    </section>
  );
}
