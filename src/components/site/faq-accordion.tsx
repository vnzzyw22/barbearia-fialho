"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

interface FaqEntry {
  question: string;
  answer: string;
}

// TODO(conteúdo): placeholder genérico de barbearia, escrito sem input do
// cliente — revisar/substituir pelo conteúdo real da Fialho Barbearia antes
// do lançamento (ver CLAUDE.md > Pendências).
const FAQS: FaqEntry[] = [
  {
    question: "Preciso agendar ou vocês atendem sem hora marcada?",
    answer:
      "O agendamento pelo site garante seu horário e evita espera. Encaixes sem hora marcada dependem da disponibilidade do dia.",
  },
  {
    question: "Quanto tempo dura um Corte + Barba?",
    answer:
      "Em média, cerca de 1h10, variando conforme o serviço escolhido e o movimento do dia.",
  },
  {
    question: "Posso escolher o profissional que vai me atender?",
    answer:
      "Sim — a escolha do profissional é uma etapa do próprio agendamento pelo site, antes de escolher data e horário.",
  },
  {
    question: "Como funciona o cancelamento de um horário?",
    answer:
      "O cliente não cancela direto pelo sistema — avise com antecedência pelo WhatsApp para liberarmos o horário para outra pessoa.",
  },
  {
    question: "O agendamento é confirmado na hora?",
    answer:
      "O pedido fica pendente até a confirmação da barbearia, enviada pelo WhatsApp informado no agendamento.",
  },
  {
    question: "Quais as formas de pagamento aceitas?",
    answer:
      "Aceitamos as principais formas de pagamento no local. Não há cobrança antecipada pelo site.",
  },
];

// Quantidade visível no mobile antes do "Ver todas as perguntas" -- mesmo
// padrão de corte usado em services-section.tsx (CSS puro, `hidden
// sm:block`, sem detectar largura em JS pra evitar mismatch de hidratação).
const MOBILE_VISIBLE_COUNT = 3;

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-4 w-4 shrink-0 items-center justify-center"
    >
      <span className="absolute h-px w-4 bg-brand-red" />
      <span
        className={`absolute h-4 w-px bg-brand-red transition-transform duration-300 motion-reduce:transition-none ${
          open ? "rotate-90 scale-y-0" : "rotate-0 scale-y-100"
        }`}
      />
    </span>
  );
}

function FaqItem({ entry, isOpen, onToggle, hiddenOnMobile }: {
  entry: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
  hiddenOnMobile?: boolean;
}) {
  const panelId = useId();

  return (
    <div
      className={`border-b border-brand-cream/10 ${hiddenOnMobile ? "hidden sm:block" : ""}`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-base font-bold tracking-tight text-brand-cream uppercase transition-colors group-hover:text-brand-red sm:text-lg">
            {entry.question}
          </span>
          <PlusMinusIcon open={isOpen} />
        </button>
      </h3>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="overflow-hidden"
        aria-hidden={!isOpen}
      >
        <p className="max-w-2xl pr-10 pb-6 text-brand-smoke">
          {entry.answer}
        </p>
      </motion.div>
    </div>
  );
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const hasMore = FAQS.length > MOBILE_VISIBLE_COUNT;

  return (
    <div className="mt-8 border-t border-brand-cream/10 sm:mt-14">
      {FAQS.map((entry, i) => (
        <FaqItem
          key={entry.question}
          entry={entry}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
          hiddenOnMobile={i >= MOBILE_VISIBLE_COUNT && !showAll}
        />
      ))}

      {hasMore && (
        <div className="mt-8 flex justify-center sm:hidden">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="font-label text-xs font-medium tracking-widest text-brand-cream uppercase underline decoration-brand-red/40 underline-offset-4 transition-colors hover:text-brand-red"
          >
            {showAll ? "Ver menos" : "Ver todas as perguntas frequentes"}
          </button>
        </div>
      )}
    </div>
  );
}
