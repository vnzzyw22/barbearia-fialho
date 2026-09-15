import { formatBusinessHours } from "@/lib/business-hours";
import { getWhatsappLink } from "@/lib/whatsapp";
import { Reveal } from "./reveal";
import type { BusinessSettings } from "@/lib/supabase/types";

interface ContactSectionProps {
  business: BusinessSettings | null;
}

export function ContactSection({ business }: ContactSectionProps) {
  // Link de WhatsApp aqui é só canal de contato geral (dúvidas, etc.) —
  // nunca um atalho pra agendar por fora do fluxo nativo (ver ANEXO seção
  // 6: WhatsApp só entra como confirmação depois que o agendamento já foi
  // concluído no site, nunca como CTA alternativo).
  const whatsappLink = business
    ? getWhatsappLink(
        business.whatsapp,
        "Olá! Vim pelo site da Fialho Barbearia e tenho uma dúvida.",
      )
    : null;

  const hours = business ? formatBusinessHours(business.business_hours) : [];

  // Embed do Google Maps sem chave de API (formato clássico
  // google.com/maps?q=...&output=embed) — suficiente pra mostrar um pino no
  // endereço, sem precisar de Google Maps Platform/billing configurado.
  const mapSrc = business?.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`
    : null;

  return (
    <section id="contato" className="bg-brand-ink">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-2 sm:py-24">
      <Reveal>
        <h2 className="font-display text-2xl font-bold text-brand-cream sm:text-3xl">
          Contato
        </h2>

        <ul className="mt-6 flex flex-col gap-3 text-brand-smoke">
          {business?.address && <li>📍 {business.address}</li>}

          {whatsappLink && (
            <li>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-red hover:underline"
              >
                Contato pelo WhatsApp
              </a>
            </li>
          )}

          {business?.instagram && (
            <li>
              <a
                href={`https://instagram.com/${business.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-red hover:underline"
              >
                @{business.instagram.replace(/^@/, "")}
              </a>
            </li>
          )}
        </ul>

        {hours.length > 0 && (
          <>
            <h3 className="mt-8 font-display font-semibold text-brand-cream">
              Horário de funcionamento
            </h3>
            <dl className="mt-4 flex flex-col gap-1 font-label text-sm text-brand-smoke">
              {hours.map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </Reveal>

      {mapSrc && (
        <Reveal delay={0.1}>
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 sm:aspect-auto sm:h-full">
            {/* Truque padrão de "dark mode" pra embed do Google Maps sem
                precisar da Maps JavaScript API (que exigiria chave/billing):
                inverter as cores e girar o matiz 180° pra desfazer o
                inverso em quase todos os tons, deixando só claro/escuro
                trocados. */}
            <iframe
              src={mapSrc}
              title={`Mapa de localização — ${business?.name ?? "Fialho Barbearia"}`}
              loading="lazy"
              className="h-full min-h-64 w-full"
              style={{ filter: "invert(90%) hue-rotate(180deg)" }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      )}
      </div>
    </section>
  );
}
