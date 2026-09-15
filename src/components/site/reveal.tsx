"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Entrada ao rolar até a seção (ver ANEXO seção 5: "fade + translateY de
// ~16px, stagger leve entre elementos filhos ~60ms"). O stagger em si vem
// do `delay` que cada chamador passa (ex.: `delay={i * 0.06}` em
// services-section.tsx/team-section.tsx) — este componente só define o
// deslocamento/opacidade/curva compartilhados.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
