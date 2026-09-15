-- Dados reais da Fialho Barbearia (ver ANEXO seção 1, 2026-09-14).
insert into public.business_settings (id, name, whatsapp, instagram, address, business_hours)
values (
  '00000000-0000-0000-0000-000000000001',
  'Fialho Barbearia',
  '5544998092162',
  'fialhobarbearia_',
  'Avenida Brasil, 4493 — Maringá, PR',
  -- Horário de funcionamento NÃO informado pela cliente — deixado vazio de
  -- propósito (ver ANEXO seção 1: "não inventar"). Preencher pelo painel em
  -- Configurações assim que a Fialho confirmar. Enquanto vazio, o bloco
  -- "Horário de funcionamento" simplesmente não aparece no site
  -- (ver formatBusinessHours em src/lib/business-hours.ts).
  '{}'::jsonb
);

-- Preços/durações abaixo são EXEMPLO — pesquisa de mercado de barbearias em
-- Maringá/PR, não são os preços reais da Fialho (ver ANEXO seção 1). 100%
-- editável depois pelo painel administrativo (Serviços). Confirmar com a
-- cliente antes de publicar.
insert into public.services (name, price, duration_minutes, display_order) values
  ('Corte',                          50.00,  45, 1),
  ('Barba',                          40.00,  30, 2),
  ('Corte + Barba',                  85.00,  70, 3),
  ('Corte degradê',                  60.00,  50, 4),
  ('Sobrancelha',                    20.00,  15, 5),
  ('Corte + Barba + Sobrancelha',   100.00,  90, 6);

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
