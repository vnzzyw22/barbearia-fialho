import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";
import type { Staff } from "@/lib/supabase/types";

interface TeamSectionProps {
  staff: Staff[];
}

export function TeamSection({ staff }: TeamSectionProps) {
  if (staff.length === 0) return null;

  return (
    <section id="equipe" className="bg-brand-paper">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-24 lg:max-w-6xl">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-center font-display text-4xl leading-none font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--color-brand-cream)" }}
              >
                Nossa
              </span>{" "}
              <span className="text-brand-red">Equipe</span>
            </h2>
            <span aria-hidden="true" className="h-px w-16 bg-brand-red/60" />
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-14 sm:grid-cols-3 lg:grid-cols-4">
          {staff.map((person, i) => (
            <Reveal key={person.id} delay={Math.min(i, 5) * 0.06}>
              <article className="group flex flex-col overflow-hidden rounded-xl border border-brand-red/25 bg-white/[0.02] transition-colors duration-300 hover:border-brand-red">
                <div className="relative aspect-square w-full bg-white/[0.04]">
                  {person.photo_url ? (
                    <Image
                      src={person.photo_url}
                      alt={person.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-label text-xs tracking-widest text-brand-smoke uppercase">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="font-display text-base font-bold tracking-tight text-brand-cream uppercase">
                    {person.name}
                  </h3>
                  {person.role && (
                    <p className="font-label text-xs tracking-widest text-brand-smoke uppercase">
                      {person.role}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      href={`/agendar?profissional=${person.id}`}
                      className="group/cta inline-flex items-center gap-2 font-label text-xs font-medium tracking-widest text-brand-cream uppercase transition-colors hover:text-brand-red"
                    >
                      Agendar
                      <span className="transition-transform duration-300 group-hover/cta:translate-x-1">
                        →
                      </span>
                    </Link>
                    {person.instagram && (
                      <a
                        href={`https://instagram.com/${person.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-xs tracking-widest text-brand-smoke uppercase transition-colors hover:text-brand-red"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
