import { GalleryCarousel } from "./gallery-carousel";
import { Reveal } from "./reveal";
import type { GalleryPhoto } from "@/lib/supabase/types";

interface GallerySectionProps {
  photos: GalleryPhoto[];
}

export function GallerySection({ photos }: GallerySectionProps) {
  return (
    <section id="galeria" className="bg-brand-paper">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-24 lg:max-w-6xl">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            {/* Empilhado em duas linhas (não lado a lado) — variação
                estrutural deliberada em relação a Serviços/Equipe, pra não
                repetir a mesma fórmula em 3 seções seguidas (ver auditoria
                Impeccable, 2026-09-16). */}
            <h2 className="text-center font-display text-4xl leading-[0.92] font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
              <span
                className="block text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--color-brand-cream)" }}
              >
                Nossa
              </span>
              <span className="block text-brand-red">Galeria</span>
            </h2>
            <span aria-hidden="true" className="h-px w-16 bg-brand-red/60" />
          </div>
        </Reveal>

        {photos.length === 0 ? (
          <p className="mt-8 text-center text-brand-smoke">
            Fotos em breve.
          </p>
        ) : (
          <GalleryCarousel photos={photos} />
        )}
      </div>
    </section>
  );
}
