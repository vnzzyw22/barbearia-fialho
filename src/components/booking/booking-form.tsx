"use client";

import { useEffect, useReducer, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createAppointment, getAvailableSlots } from "@/app/agendar/actions";
import { EASE } from "@/lib/motion";
import { todayISO } from "@/lib/date";
import { formatDuration, formatPrice } from "@/lib/format";
import { ServiceSelect } from "./service-select";
import { StaffSelect } from "./staff-select";
import {
  bookingFormReducer,
  initialBookingFormState,
  isStepValid,
  LAST_STEP,
  STEP_LABELS,
  type BookingFormData,
} from "./booking-form-state";
import { StepProgress } from "./step-progress";
import type { Service, Staff } from "@/lib/supabase/types";

interface BookingFormProps {
  services: Service[];
  staff: Staff[];
  preselectedServiceId?: string;
  preselectedStaffId?: string;
}

interface SlotPickerProps {
  serviceId: string;
  staffId: string;
  dateISO: string;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

// Estilo compartilhado dos campos "Serviço"/"Data" (2026-09-03, redesign
// pedido pelo cliente para a identidade escura/premium da marca) — cinza
// bem escuro sobre o fundo preto da página, sem borda visível em repouso,
// borda vermelha só no foco. `[color-scheme:dark]` faz o Chrome/Firefox
// desenharem o ícone nativo do calendário (input date) e a lista do
// select em tema escuro — sem isso o ícone do calendário sai escuro
// sobre fundo escuro, quase invisível.
const fieldClass =
  "rounded-lg border border-transparent bg-white/[0.06] px-3 py-2.5 text-sm text-white [color-scheme:dark] transition-colors duration-200 outline-none focus:border-brand-red";

const labelClass =
  "font-label text-xs font-bold tracking-widest text-white uppercase";

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      className="h-2.5 w-2.5 shrink-0 fill-none stroke-current"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 1L2 5l4 4" />
    </svg>
  );
}

function SlotPicker({
  serviceId,
  staffId,
  dateISO,
  selectedTime,
  onSelect,
}: SlotPickerProps) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAvailableSlots(serviceId, staffId, dateISO).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if ("error" in result) setError(result.error);
      else setSlots(result.slots);
    });

    return () => {
      cancelled = true;
    };
  }, [serviceId, staffId, dateISO]);

  if (loading) return <p className="text-sm text-brand-smoke">Carregando horários...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!slots || slots.length === 0) {
    return (
      <p className="text-sm text-brand-smoke">
        Nenhum horário disponível nessa data. Tente outro dia.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          aria-pressed={selectedTime === slot}
          onClick={() => onSelect(slot)}
          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            selectedTime === slot
              ? "border-brand-red bg-brand-red text-brand-black"
              : "border-transparent bg-white/[0.06] text-brand-smoke hover:border-brand-red hover:text-white hover:shadow-[0_0_12px_rgba(176,141,87,0.35)]"
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}

// Slide horizontal entre steps — deslocamento pequeno (48px, não 100%) pra
// nunca arriscar overflow visível antes do `overflow-hidden` do wrapper
// cortar, já que a página é max-w-2xl de coluna única. `direction` vem do
// reducer (1 = avançando, -1 = voltando) via prop `custom` do
// AnimatePresence/motion.div.
const slideVariants = {
  enter: (direction: 1 | -1) => ({ x: direction === 1 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({ x: direction === 1 ? -48 : 48, opacity: 0 }),
};

export function BookingForm({
  services,
  staff,
  preselectedServiceId,
  preselectedStaffId,
}: BookingFormProps) {
  const validServiceId =
    preselectedServiceId && services.some((s) => s.id === preselectedServiceId)
      ? preselectedServiceId
      : "";
  const validStaffId =
    preselectedStaffId && staff.some((s) => s.id === preselectedStaffId)
      ? preselectedStaffId
      : "";

  const [state, dispatch] = useReducer(
    bookingFormReducer,
    undefined,
    () => initialBookingFormState(validServiceId, validStaffId),
  );
  const reduceMotion = useReducedMotion();

  // Move o foco pro heading do step assim que ele monta — pra leitor de
  // tela acompanhar em qual passo o usuário está, em vez de só anunciar
  // campos soltos sem contexto. Precisa ser um ref callback (não
  // useEffect+useRef): com AnimatePresence mode="wait", o heading do novo
  // step só entra no DOM depois que a saída do anterior termina, então um
  // useEffect disparado por `state.step` rodava cedo demais (o ref ainda
  // apontava pro nó antigo/nulo) e o foco nunca se movia de verdade.
  function focusStepHeading(node: HTMLHeadingElement | null) {
    node?.focus();
  }

  function setField(field: keyof BookingFormData, value: string | null) {
    dispatch({ type: "SET_FIELD", field, value });
  }

  const canGoNext = isStepValid(state.step, state.data);

  async function submitAppointment() {
    dispatch({ type: "SUBMIT_START" });
    try {
      const result = await createAppointment({
        serviceId: state.data.serviceId,
        staffId: state.data.staffId,
        dateISO: state.data.dateISO,
        time: state.data.time as string,
        name: state.data.name,
        whatsapp: state.data.whatsapp,
        notes: state.data.notes,
      });

      if (result.ok) {
        dispatch({ type: "SUBMIT_SUCCESS", whatsappLink: result.whatsappLink });
      } else {
        dispatch({ type: "SUBMIT_ERROR", error: result.error });
      }
    } catch {
      // Lição já documentada no CLAUDE.md: sem try/catch aqui, uma falha de
      // rede deixava o botão travado em "Enviando..." pra sempre.
      dispatch({
        type: "SUBMIT_ERROR",
        error: "Não foi possível enviar. Verifique sua conexão e tente novamente.",
      });
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canGoNext) return;
    if (state.step < LAST_STEP) {
      dispatch({ type: "GO_NEXT" });
      return;
    }
    await submitAppointment();
  }

  if (state.success) {
    return (
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.4, ease: EASE }}
        className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center"
      >
        <h2 className="font-display text-lg font-bold text-white uppercase">
          Agendamento enviado!
        </h2>
        <p className="text-sm text-brand-smoke">
          Seu horário foi registrado e fica pendente até a confirmação da
          Fialho Barbearia. Toque abaixo para confirmar pelo WhatsApp e
          agilizar o retorno.
        </p>
        {state.success.whatsappLink && (
          <a
            href={state.success.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-red px-6 py-3 text-sm font-bold tracking-wide text-brand-black uppercase transition hover:opacity-90"
          >
            Confirmar no WhatsApp
          </a>
        )}
      </motion.div>
    );
  }

  const selectedService = services.find((s) => s.id === state.data.serviceId);

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6" noValidate>
      <StepProgress steps={STEP_LABELS} currentStep={state.step} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={state.direction} initial={false}>
          <motion.div
            key={state.step}
            custom={state.direction}
            variants={reduceMotion ? undefined : slideVariants}
            initial={reduceMotion ? undefined : "enter"}
            animate={reduceMotion ? undefined : "center"}
            exit={reduceMotion ? undefined : "exit"}
            transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: EASE }}
            className="flex flex-col gap-6"
          >
            <h2
              ref={focusStepHeading}
              tabIndex={-1}
              className="font-display text-lg font-bold text-white uppercase outline-none"
            >
              {STEP_LABELS[state.step]}
            </h2>

            {state.step === 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <span id="servico-label" className={labelClass}>
                    Serviço
                  </span>
                  <ServiceSelect
                    services={services}
                    value={state.data.serviceId}
                    onChange={(id) => setField("serviceId", id)}
                    buttonId="servico"
                    labelId="servico-label"
                    listboxId="servico-listbox"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span id="profissional-label" className={labelClass}>
                    Profissional
                  </span>
                  <StaffSelect
                    staff={staff}
                    value={state.data.staffId}
                    onChange={(id) => setField("staffId", id)}
                    buttonId="profissional"
                    labelId="profissional-label"
                    listboxId="profissional-listbox"
                  />
                </div>
              </>
            )}

            {state.step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="data" className={labelClass}>
                    Data
                  </label>
                  <input
                    id="data"
                    type="date"
                    required
                    min={todayISO()}
                    value={state.data.dateISO}
                    onChange={(e) => setField("dateISO", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                {state.data.dateISO && (
                  <div className="flex flex-col gap-2">
                    <span className={labelClass}>Horário</span>
                    <SlotPicker
                      key={`${state.data.serviceId}-${state.data.staffId}-${state.data.dateISO}`}
                      serviceId={state.data.serviceId}
                      staffId={state.data.staffId}
                      dateISO={state.data.dateISO}
                      selectedTime={state.data.time}
                      onSelect={(time) => setField("time", time)}
                    />
                  </div>
                )}
              </>
            )}

            {state.step === 2 && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="nome" className={labelClass}>
                    Seu nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    required
                    value={state.data.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="whatsapp" className={labelClass}>
                    WhatsApp (com DDD)
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="(44) 90000-0000"
                    value={state.data.whatsapp}
                    onChange={(e) => setField("whatsapp", e.target.value)}
                    className={`${fieldClass} placeholder:text-brand-smoke/50`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="observacao" className={labelClass}>
                    Observação (opcional)
                  </label>
                  <textarea
                    id="observacao"
                    rows={3}
                    value={state.data.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    className={fieldClass}
                  />
                </div>

                {selectedService && (
                  <p className="text-sm text-brand-smoke">
                    Resumo: {selectedService.name} —{" "}
                    {formatPrice(selectedService.price)} (
                    {formatDuration(selectedService.duration_minutes)}) às{" "}
                    {state.data.time}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {state.submitError && <p className="text-sm text-red-400">{state.submitError}</p>}

      <div className="flex items-center gap-4">
        {state.step > 0 && (
          <button
            type="button"
            onClick={() => dispatch({ type: "GO_BACK" })}
            className="inline-flex shrink-0 items-center gap-2 font-label text-xs font-bold tracking-widest text-brand-smoke uppercase transition-colors hover:text-brand-red"
          >
            <BackIcon />
            Voltar
          </button>
        )}
        <button
          type="submit"
          disabled={!canGoNext || state.submitting}
          className="flex-1 rounded-full bg-brand-red px-6 py-4 text-sm font-bold tracking-widest text-brand-black uppercase transition hover:opacity-90 disabled:opacity-50"
        >
          {state.step < LAST_STEP
            ? "Próximo"
            : state.submitting
              ? "Enviando..."
              : "Agendar"}
        </button>
      </div>
    </form>
  );
}
