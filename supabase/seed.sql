-- Dados reais da Fialho Barbearia (ver ANEXO seção 1, 2026-09-14).
insert into public.business_settings (id, name, whatsapp, instagram, address, business_hours)
values (
  '00000000-0000-0000-0000-000000000001',
  'Fialho Barbearia',
  '5544998092162',
  'fialhobarbearia_',
  'Avenida Brasil, 4493 — Maringá, PR',
  -- Horário real (passado pela cliente em 2026-09-15). Domingo não foi
  -- mencionado — tratado como fechado (nenhuma barbearia da faixa citou
  -- domingo, e não dá pra assumir "aberto" sem confirmação).
  '{
    "mon": {"open": "09:00", "close": "19:30"},
    "tue": {"open": "09:00", "close": "19:30"},
    "wed": {"open": "09:00", "close": "19:30"},
    "thu": {"open": "09:00", "close": "19:30"},
    "fri": {"open": "09:00", "close": "19:30"},
    "sat": {"open": "08:00", "close": "14:00"},
    "sun": {"closed": true}
  }'::jsonb
);

-- Serviços reais (passados pela cliente em 2026-09-15, direto do sistema de
-- agendamento que ela já usa) — não são mais exemplo de mercado. Os 3
-- serviços "Clube Fialho" (cadastro de clube/assinatura, preço R$ 0,00 na
-- lista original) foram deixados de fora a pedido explícito da cliente
-- ("esses clube não coloca").
insert into public.services (name, description, price, duration_minutes, display_order) values
  ('Cabelo',               null,             65.00,  45, 1),
  ('Barba',                null,             60.00,  45, 2),
  ('Cabelo e Barba',       null,            110.00,  75, 3),
  ('Sobrancelhas',         null,             20.00,  15, 4),
  ('Depilação de Nariz',   null,             25.00,  15, 5),
  ('Depilação de Orelha',  null,             25.00,  15, 6),
  ('Selagem Capilar',      null,            150.00,  90, 7),
  ('Tintura',              'A partir de',     50.00,  30, 8);

-- Equipe real (passada pela cliente em 2026-09-15) — sem foto ainda
-- ("depois vou adicionar fotos deles"). Sem função/especialidade
-- individual informada, por isso "Barbeiro" genérico pra todos.
insert into public.staff (name, role, display_order) values
  ('Allyson',     'Barbeiro', 1),
  ('Elano',       'Barbeiro', 2),
  ('Gótico',      'Barbeiro', 3),
  ('Jean',        'Barbeiro', 4),
  ('John Fialho', 'Barbeiro', 5);

-- Fotos REAIS da Fialho (recebidas em 2026-09-14, direto na pasta do
-- projeto — ver public/imagens/galeria/). Servidas como arquivo estático
-- por enquanto porque ainda não existe projeto Supabase/Storage (ver
-- CLAUDE.md > Pendências); mover para o Storage assim que o projeto
-- Supabase existir é só reenviar pelo painel (/admin/galeria) e apagar
-- estas linhas — o botão de excluir já lida com URLs fora do Storage (ver
-- src/app/admin/(painel)/galeria/actions.ts).
insert into public.gallery_photos (url, category, display_order) values
  ('/imagens/galeria/fialho-barbeiro-sobrancelha.jpg', 'Acabamento', 1),
  ('/imagens/galeria/fialho-atendimento-espelho.jpg', 'Atendimento', 2),
  ('/imagens/galeria/fialho-toalha-logo.jpg', 'Identidade', 3);

-- Banco de imagens temporário (Unsplash, tratado com o duotone da marca) —
-- ver ANEXO seção 2. Só entra pra completar a Galeria enquanto o volume de
-- fotos reais ainda é pequeno (3 acima) — apagar estas linhas assim que
-- houver fotos reais suficientes. Nunca fotos extraídas do Instagram da
-- Fialho fingindo ser fotos dela.
insert into public.gallery_photos (url, category, display_order) values
  ('https://images.unsplash.com/photo-1549271568-e87e07c5406b?auto=format&fit=crop&q=80&w=1200&duotone=121110,B08D57&duotone-alpha=100&sat=-25', 'Ferramentas', 4),
  ('https://images.unsplash.com/photo-1617655719462-c643bc54914c?auto=format&fit=crop&q=80&w=1200&duotone=121110,B08D57&duotone-alpha=100&sat=-25', 'Ambiente', 5),
  ('https://images.unsplash.com/photo-1571987283426-c09bb9213da0?auto=format&fit=crop&q=80&w=1200&duotone=121110,B08D57&duotone-alpha=100&sat=-25', 'Fachada', 6);
