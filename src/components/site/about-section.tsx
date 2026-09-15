import Image from "next/image";
import { Reveal } from "./reveal";

interface AboutSectionProps {
  staffCount: number;
  servicesCount: number;
}

// Medalhão com a logo real (recebida em 2026-09-14, ver
// public/imagens/fialho-logo.jpg) — diferente do template anterior (onde
// esse elemento tinha sido removido por usar a logo de outro negócio, ver
// git log), aqui já é a logo de verdade da Fialho, então faz sentido
// reintroduzir o tratamento: "é a seção que fala sobre ela, então cabe
// aparecer a logo". Moldura em cobre reaproveita a mesma assinatura visual
// da Galeria (`border-brand-red`, ver gallery-carousel.tsx) em vez de um
// selo giratório com texto ao redor — aquele efeito era uma composição
// específica de outro projeto, não uma assinatura visual desta marca.
//
// Cards de estatística: só números REAIS derivados do banco (quantidade de
// profissionais/serviços cadastrados) em vez de inventar métricas de
// negócio (ex.: "+500 clientes") que não há como confirmar.
export function AboutSection({ staffCount, servicesCount }: AboutSectionProps) {
  return (
    <section
      id="sobre"
      className="relative overflow-hidden bg-brand-ink px-6 py-14 sm:py-24 lg:py-32"
    >
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
        <Reveal className="flex flex-col items-start gap-6 lg:col-span-5">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-brand-red/70 p-1 sm:h-24 sm:w-24">
            <Image
              src="/imagens/fialho-logo.jpg"
              alt="Fialho Barbearia"
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h2 className="font-display text-4xl leading-[0.92] font-black uppercase sm:text-5xl lg:text-6xl">
            <span
              className="block text-transparent"
              style={{ WebkitTextStroke: "1px var(--color-brand-cream)" }}
            >
              Sobre a
            </span>
            <span className="block font-script text-brand-red normal-case">Fialho</span>
          </h2>
          <span aria-hidden="true" className="block h-px w-16 bg-brand-red/60" />
        </Reveal>

        <Reveal
          delay={0.1}
          className="flex flex-col gap-6 border-brand-cream/15 lg:col-span-6 lg:col-start-7 lg:border-l lg:pl-10"
        >
          {/* TODO(conteúdo real): copy provisória — a Fialho ainda não
              passou a história/tom de voz da marca (ver CLAUDE.md >
              Pendências). Texto curto e neutro de propósito, pra não soar
              como copy final escrita sem input do cliente. */}
          <p className="max-w-md font-display text-xl font-medium text-brand-cream/90 italic sm:text-2xl">
            Cabelo, barba e bigode como tem que ser.
          </p>
          <p className="max-w-md font-light text-brand-smoke">
            A Fialho Barbearia atende na Avenida Brasil, em Maringá — corte,
            barba e bigode com o cuidado de quem trabalha com navalha e
            tesoura todos os dias.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:mt-24 sm:grid-cols-3">
          {[
            { value: staffCount, label: "Profissionais na equipe" },
            { value: servicesCount, label: "Serviços disponíveis" },
            { value: "100%", label: "Agendamento online" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-brand-red/25 bg-white/[0.02] p-8 text-center"
            >
              <span className="block font-display text-5xl font-black text-brand-red">
                {stat.value}
              </span>
              <span className="mt-2 block font-label text-xs tracking-widest text-brand-smoke uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
