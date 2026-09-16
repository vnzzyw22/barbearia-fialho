import { BookingForm } from "@/components/booking/booking-form";
import { getActiveServices, getActiveStaff } from "@/lib/supabase/queries";

export default async function AgendarPage(props: PageProps<"/agendar">) {
  const searchParams = await props.searchParams;
  const [services, staff] = await Promise.all([
    getActiveServices(),
    getActiveStaff(),
  ]);

  const preselectedParam = searchParams.servico;
  const preselectedServiceId = Array.isArray(preselectedParam)
    ? preselectedParam[0]
    : preselectedParam;

  const preselectedStaffParam = searchParams.profissional;
  const preselectedStaffId = Array.isArray(preselectedStaffParam)
    ? preselectedStaffParam[0]
    : preselectedStaffParam;

  return (
    <div className="flex flex-1 flex-col bg-brand-ink">
      <main
        id="conteudo"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12"
      >
        <div className="mb-10 text-center">
          <p className="font-label text-xs tracking-[0.3em] text-brand-smoke uppercase">
            Fialho Barbearia
          </p>
          <h1 className="mt-3 font-display leading-[0.9] font-black text-white uppercase"
            style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
          >
            Agende <span className="text-brand-red">seu horário</span>
          </h1>
          {/* Reasseguração explícita logo na primeira tela do fluxo — antes
              a única frase que deixava claro que o pedido fica PENDENTE até
              confirmação (não confirmado na hora) estava isolada na FAQ da
              home, longe de quem chega direto nesta página pelo botão
              "Agendar horário" (ver auditoria Impeccable, 2026-09-16).
              Texto alinhado com a resposta da FAQ (faq-accordion.tsx). */}
          <p className="mt-3 text-sm text-brand-smoke">
            Escolha o serviço, o profissional, a data e o horário. Seu pedido
            fica pendente até a confirmação da barbearia, enviada pelo
            WhatsApp informado no agendamento.
          </p>
        </div>

        <BookingForm
          services={services}
          staff={staff}
          preselectedServiceId={preselectedServiceId}
          preselectedStaffId={preselectedStaffId}
        />
      </main>
    </div>
  );
}
