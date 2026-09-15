import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login — Fialho Barbearia Admin",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brand-ink px-6">
      <h1 className="flex items-baseline gap-2 text-white">
        <span className="font-script text-3xl">Fialho</span>
        <span className="font-display text-sm font-bold tracking-widest text-brand-red uppercase">
          Barbearia
        </span>
        <span className="font-display text-sm font-bold uppercase">— Admin</span>
      </h1>
      <LoginForm />
    </main>
  );
}
