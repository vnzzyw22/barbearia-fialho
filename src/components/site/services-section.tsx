"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDuration, formatPrice } from "@/lib/format";
import { Reveal } from "./reveal";
import type { Service } from "@/lib/supabase/types";

interface ServicesSectionProps {
  services: Service[];
}

// Quantidade visível no mobile antes do "Ver todos os serviços" -- pedido
// original do cliente (herdado do Lkas Locs) pra reduzir o scroll inicial
// da seção no celular. No desktop (sm:) sempre mostra tudo, independente
// desse número: a classe `hidden sm:block` cuida disso via CSS puro, sem
// precisar saber a largura real da tela em JS (evita mismatch de
// hidratação).
const MOBILE_VISIBLE_COUNT = 4;

// Grade uniforme de cards escuros com bordas sutis em cobre — não depende
// de nenhuma foto real (que ainda não existe pra essa marca, ver
// CLAUDE.md > Pendências).
export function ServicesSection({ services }: ServicesSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const hasMore = services.length > MOBILE_VISIBLE_COUNT;

  return (
    <section id="servicos" className="bg-brand-paper">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-24 lg:max-w-6xl">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-center font-display text-4xl leading-none font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--color-brand-cream)" }}
              >
                Nossos
              </span>{" "}
              <span className="text-brand-red">Serviços</span>
            </h2>
            <span aria-hidden="true" className="h-px w-16 bg-brand-red/60" />
          </div>
        </Reveal>

        {services.length === 0 ? (
          <p className="mt-8 text-center text-brand-smoke">
            Serviços em breve.
          </p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <Reveal
                  key={service.id}
                  delay={Math.min(i, 5) * 0.06}
                  className={
                    i >= MOBILE_VISIBLE_COUNT && !showAll
                      ? "hidden sm:block"
                      : undefined
                  }
                >
                  <article className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-brand-red/25 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-brand-red">
                    <div>
                      {/* Detalhe de hover (ver ANEXO seção 5): o número
                          desliza levemente e a linha embaixo se desenha da
                          esquerda pra direita, como um traço de navalha. */}
                      <div className="mb-3 flex items-baseline gap-3">
                        <span className="font-display text-sm font-bold text-brand-red transition-transform duration-300 ease-[var(--ease-signature)] group-hover:translate-x-1.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-px flex-1 origin-left scale-x-0 bg-brand-red transition-transform duration-300 ease-[var(--ease-signature)] group-hover:scale-x-100"
                        />
                      </div>
                      <h3 className="font-display text-xl font-bold tracking-tight text-brand-cream uppercase lg:text-2xl">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="mt-2 text-sm text-brand-smoke">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="block font-display text-2xl font-bold text-brand-red">
                          {formatPrice(service.price)}
                        </span>
                        <span className="font-label text-xs tracking-widest text-brand-smoke uppercase">
                          {formatDuration(service.duration_minutes)}
                        </span>
                      </div>

                      <Link
                        href={`/agendar?servico=${service.id}`}
                        className="group/cta inline-flex items-center gap-2 font-label text-xs font-medium tracking-widest text-brand-cream uppercase transition-colors hover:text-brand-red"
                      >
                        Agendar
                        <span className="transition-transform duration-300 group-hover/cta:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center sm:hidden">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="font-label text-xs font-medium tracking-widest text-brand-cream uppercase underline decoration-brand-red/40 underline-offset-4 transition-colors hover:text-brand-red"
                >
                  {showAll ? "Ver menos" : "Ver todos os serviços"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
