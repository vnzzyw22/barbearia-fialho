interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

// Barras finas em vez de círculos numerados — combina com a linguagem
// visual já estabelecida no site (linhas finas em cobre: signature-divider,
// hover "navalha" dos serviços) em vez de introduzir um padrão de "wizard
// genérico". `role="progressbar"` com aria-valuenow/aria-valuetext cobre o
// anúncio de progresso pra leitor de tela.
export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={currentStep + 1}
      aria-valuetext={`Passo ${currentStep + 1} de ${steps.length}: ${steps[currentStep]}`}
      className="mb-8 flex items-center gap-2"
    >
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col gap-2">
          <span
            aria-hidden="true"
            className={`h-1 w-full rounded-full transition-colors duration-300 ${
              i <= currentStep ? "bg-brand-red" : "bg-white/[0.08]"
            }`}
          />
          <span
            className={`font-label text-[10px] tracking-widest uppercase ${
              i === currentStep ? "text-brand-cream" : "text-brand-smoke"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
