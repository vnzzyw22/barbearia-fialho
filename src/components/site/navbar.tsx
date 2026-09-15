"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "#topo", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#equipe", label: "Equipe" },
  { href: "#galeria", label: "Galeria" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

const navLinkClass =
  "font-nav text-xs font-bold tracking-[1px] uppercase transition-colors duration-200 hover:text-brand-red";

// Logo real recebida em 2026-09-14 (ver public/imagens/fialho-logo.jpg) —
// selo circular preto/cobre/creme que bate quase exatamente com a paleta já
// escolhida a partir do ANEXO (ver DESIGN.md). Acompanhado do wordmark em
// texto pra legibilidade em tamanho pequeno (o selo já traz "FIALHO
// BARBEARIA" bordado, mas ilegível a 36px).
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-ink/35 shadow-lg shadow-black/20 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="#topo" className="flex items-center gap-2.5">
          <Image
            src="/imagens/fialho-logo.jpg"
            alt="Fialho Barbearia"
            width={36}
            height={36}
            className="rounded-full ring-1 ring-brand-red/40"
          />
          <span className="font-display text-sm font-bold tracking-wide text-brand-cream uppercase">
            Fialho <span className="text-brand-red">Barbearia</span>
          </span>
        </Link>

        <ul className={`hidden items-center gap-7 text-brand-smoke md:flex`}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Link
          href="/agendar"
          className="hidden rounded-md bg-brand-red px-5 py-2 font-label text-xs font-bold tracking-widest text-brand-black uppercase transition-all duration-300 ease-in-out hover:brightness-110 md:inline-block"
        >
          Agendar
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-brand-cream" />
            <span className="h-0.5 w-5 bg-brand-cream" />
            <span className="h-0.5 w-5 bg-brand-cream" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-white/10 bg-brand-ink/60 px-6 py-3 text-brand-smoke backdrop-blur-xl backdrop-saturate-150 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block py-2 ${navLinkClass}`}
            >
              {link.label}
            </a>
          ))}

          <Link
            href="/agendar"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-brand-red px-4 py-2 text-center font-label text-xs font-medium tracking-widest text-brand-black normal-case"
          >
            Agendar horário
          </Link>
        </div>
      )}
    </header>
  );
}
