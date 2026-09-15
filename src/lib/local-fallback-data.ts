import type { BusinessSettings, GalleryPhoto, Service, Staff } from "./supabase/types";

// Espelha supabase/seed.sql — usado só quando não há Supabase configurado
// (ver src/lib/supabase/config.ts), pra pré-visualizar o site público com
// os dados reais da Fialho antes do projeto Supabase existir. Sem lógica
// própria (agenda/disponibilidade real, formulário de agendamento) — só os
// dados de leitura que aparecem na Home/Agendar.
//
// ATENÇÃO: mantenha isto em sincronia manual com supabase/seed.sql sempre
// que um dado real mudar — não há fonte única automática entre SQL e TS.
export const FALLBACK_BUSINESS: BusinessSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Fialho Barbearia",
  whatsapp: "5544998092162",
  instagram: "fialhobarbearia_",
  address: "Avenida Brasil, 4493 — Maringá, PR",
  business_hours: {
    mon: { open: "09:00", close: "19:30" },
    tue: { open: "09:00", close: "19:30" },
    wed: { open: "09:00", close: "19:30" },
    thu: { open: "09:00", close: "19:30" },
    fri: { open: "09:00", close: "19:30" },
    sat: { open: "08:00", close: "14:00" },
    sun: { closed: true },
  },
};

export const FALLBACK_SERVICES: Service[] = [
  { id: "fallback-1", name: "Cabelo", description: null, price: 65, duration_minutes: 45, image_url: null },
  { id: "fallback-2", name: "Barba", description: null, price: 60, duration_minutes: 45, image_url: null },
  { id: "fallback-3", name: "Cabelo e Barba", description: null, price: 110, duration_minutes: 75, image_url: null },
  { id: "fallback-4", name: "Sobrancelhas", description: null, price: 20, duration_minutes: 15, image_url: null },
  { id: "fallback-5", name: "Depilação de Nariz", description: null, price: 25, duration_minutes: 15, image_url: null },
  { id: "fallback-6", name: "Depilação de Orelha", description: null, price: 25, duration_minutes: 15, image_url: null },
  { id: "fallback-7", name: "Selagem Capilar", description: null, price: 150, duration_minutes: 90, image_url: null },
  { id: "fallback-8", name: "Tintura", description: "A partir de", price: 50, duration_minutes: 30, image_url: null },
];

export const FALLBACK_STAFF: Staff[] = [
  { id: "fallback-staff-1", name: "Allyson", role: "Barbeiro", photo_url: null, instagram: null },
  { id: "fallback-staff-2", name: "Elano", role: "Barbeiro", photo_url: null, instagram: null },
  { id: "fallback-staff-3", name: "Gótico", role: "Barbeiro", photo_url: null, instagram: null },
  { id: "fallback-staff-4", name: "Jean", role: "Barbeiro", photo_url: null, instagram: null },
  { id: "fallback-staff-5", name: "John Fialho", role: "Barbeiro", photo_url: null, instagram: null },
];

export const FALLBACK_GALLERY: GalleryPhoto[] = [
  { id: "fallback-photo-1", url: "/imagens/galeria/fialho-barbeiro-sobrancelha.jpg", category: "Acabamento" },
  { id: "fallback-photo-2", url: "/imagens/galeria/fialho-atendimento-espelho.jpg", category: "Atendimento" },
  { id: "fallback-photo-3", url: "/imagens/galeria/fialho-toalha-logo.jpg", category: "Identidade" },
];
