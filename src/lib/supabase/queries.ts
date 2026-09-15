import type { BusyRange } from "@/lib/scheduling";
import { createClient } from "./server";
import type { BusinessSettings, GalleryPhoto, Service, Staff } from "./types";

// Leituras públicas do site (RLS: anon só vê o que é destinado ao público).
// Usadas em Server Components — sem cache manual, o Next já cuida do request.

export async function getBusinessSettings(): Promise<BusinessSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("business_settings")
    .select("id, name, whatsapp, instagram, address, business_hours")
    .single();

  if (error) {
    console.error("Erro ao buscar business_settings:", error.message);
    return null;
  }

  return data;
}

export async function getActiveServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration_minutes, image_url")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar services:", error.message);
    return [];
  }

  return data;
}

export async function getActiveServiceById(
  id: string,
): Promise<Service | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration_minutes, image_url")
    .eq("active", true)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar service por id:", error.message);
    return null;
  }

  return data;
}

// Só staff_id/starts_at/ends_at (ver
// supabase/migrations/20260910120000_staff.sql) — nenhum dado do
// cliente/agendamento é exposto aqui. Filtra pelo profissional escolhido OU
// bloqueios da loja inteira (staff_id null, ver migration) — esses últimos
// valem pra qualquer barbeiro.
export async function getBusySlots(
  staffId: string,
  fromISO: string,
  toISO: string,
): Promise<BusyRange[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("busy_slots")
    .select("starts_at, ends_at")
    .or(`staff_id.eq.${staffId},staff_id.is.null`)
    .lt("starts_at", toISO)
    .gt("ends_at", fromISO);

  if (error) {
    console.error("Erro ao buscar busy_slots:", error.message);
    return [];
  }

  return data.map((row) => ({ startsAt: row.starts_at, endsAt: row.ends_at }));
}

export async function getActiveStaff(): Promise<Staff[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("id, name, role, photo_url, instagram")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar staff:", error.message);
    return [];
  }

  return data;
}

export async function getActiveStaffById(id: string): Promise<Staff | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("id, name, role, photo_url, instagram")
    .eq("active", true)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar staff por id:", error.message);
    return null;
  }

  return data;
}

// Todas as fotos publicadas. A distinção "hero"/galeria do Lkas Locs foi
// removida (2026-09-10) junto com o deque de fotos da Hero — sem consumidor
// pra categoria "hero", manter o toggle no admin só ia confundir (foto
// marcada "Principal" não apareceria em lugar nenhum).
export async function getPublicGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, url, category")
    .eq("published", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar gallery_photos (galeria):", error.message);
    return [];
  }

  return data;
}
