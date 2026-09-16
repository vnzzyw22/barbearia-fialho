import { FaqAccordion } from "./faq-accordion";
import { Reveal } from "./reveal";

// TODO(conteúdo): perguntas/respostas abaixo (faq-accordion.tsx) são
// placeholder genérico de barbearia, escritas sem input do cliente —
// revisar/substituir pelo conteúdo real antes do lançamento.
export function FaqSection() {
  return (
    <section id="faq" className="bg-brand-paper">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-24">
        <Reveal>
          <div className="flex flex-col items-start gap-4 text-left">
            {/* font-black + contorno na 1ª palavra: alinhado à mesma
                gramática visual das outras seções (Sobre/Serviços/Equipe/
                Galeria) — antes usava font-bold sem contorno, destoando
                sem motivo aparente (ver auditoria Impeccable, 2026-09-16). */}
            <h2 className="font-display text-4xl leading-none font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--color-brand-cream)" }}
              >
                Perguntas
              </span>{" "}
              <span className="text-brand-red">Frequentes</span>
            </h2>
            <span aria-hidden="true" className="h-px w-16 bg-brand-red/60" />
            <p className="max-w-md text-brand-smoke">
              Tem alguma dúvida sobre o atendimento? Talvez a resposta esteja
              aqui.
            </p>
          </div>
        </Reveal>

        <FaqAccordion />

        <p className="mt-8 font-label text-xs text-brand-smoke">
          As respostas acima são informações gerais e não substituem a
          confirmação direta pelo WhatsApp.
        </p>
      </div>
    </section>
  );
}
