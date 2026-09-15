import Image from "next/image";
import Link from "next/link";
import { getWhatsappLink } from "@/lib/whatsapp";
import type { BusinessSettings, Service } from "@/lib/supabase/types";

interface FooterProps {
  business: BusinessSettings | null;
  services: Service[];
}

const NAV_LINKS = [
  { href: "#topo", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
  { href: "#galeria", label: "Galeria" },
  { href: "/agendar", label: "Agendamento" },
  { href: "#faq", label: "FAQ" },
];

// Serviços em destaque no rodapé — nomes do seed (ver supabase/seed.sql),
// casados com os dados vindos do banco pra pegar o id de cada um. Se um
// nome não existir mais no banco, o link simplesmente não aparece (nunca
// inventa um serviço ou aponta pra um id que não existe).
const FOOTER_SERVICE_NAMES = ["Corte", "Barba", "Corte + Barba", "Corte degradê", "Sobrancelha"];

// Fundo escuro (`bg-brand-ink`, mesmo token da Hero) fecha o "sanduíche" da
// página (Hero escura abre, Rodapé escuro fecha). Dados de contato vêm só
// de `business_settings` — nunca hardcoded (WhatsApp/Instagram somem quando
// não estão cadastrados, em vez de mostrar um link falso).
export function Footer({ business, services }: FooterProps) {
  const whatsappLink = business
    ? getWhatsappLink(
        business.whatsapp,
        "Olá! Vim pelo site e gostaria de saber mais sobre a Fialho Barbearia.",
      )
    : null;

  const instagramHandle = business?.instagram?.replace(/^@/, "") ?? null;

  const footerServices = FOOTER_SERVICE_NAMES.map((name) =>
    services.find((service) => service.name === name),
  ).filter((service): service is Service => Boolean(service));

  return (
    <footer className="bg-brand-ink px-6 pt-12 pb-8 sm:pt-20">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Link href="#topo" className="flex items-center gap-2.5">
            <Image
              src="/imagens/fialho-logo.jpg"
              alt="Fialho Barbearia"
              width={40}
              height={40}
              className="rounded-full ring-1 ring-brand-red/40"
            />
            <span className="flex items-baseline gap-1.5">
              <span className="font-script text-2xl text-brand-cream normal-case">Fialho</span>
              <span className="font-display text-xs font-bold tracking-widest text-brand-red uppercase">
                Barbearia
              </span>
            </span>
          </Link>
          <p className="max-w-xs text-sm text-brand-smoke">
            Cabelo, barba e bigode como tem que ser.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-label text-xs tracking-widest text-brand-cream/60 uppercase">
            Contato
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-brand-smoke">
            {business?.address && <li>📍 {business.address}</li>}
            {whatsappLink && (
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-red"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {instagramHandle && (
              <li>
                <a
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-red"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-label text-xs tracking-widest text-brand-cream/60 uppercase">
            Navegação
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-brand-smoke">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-brand-red"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerServices.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="font-label text-xs tracking-widest text-brand-cream/60 uppercase">
              Serviços
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-brand-smoke">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/agendar?servico=${service.id}`}
                    className="transition-colors hover:text-brand-red"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-brand-cream/10 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-label text-xs tracking-widest text-brand-smoke uppercase">
          Fialho Barbearia <span className="text-brand-cream/40">·</span> ©{" "}
          {new Date().getFullYear()} — Todos os direitos reservados.
        </p>
        <div className="flex gap-6 font-label text-xs tracking-widest text-brand-smoke uppercase">
          <Link
            href="/politica-de-privacidade"
            className="transition-colors hover:text-brand-red"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/termos-de-uso"
            className="transition-colors hover:text-brand-red"
          >
            Termos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
}
