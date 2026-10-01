/*
# Paninaro di Sassi — Initial Schema

1. New Tables
- `menu_items`: All food/drink items sold by the food truck.
  - `id` (uuid, PK)
  - `category` (text): one of 'panini', 'contorni', 'salse', 'drinks'
  - `name` (text): display name of the item
  - `price` (numeric, 2 decimals): price in euros
  - `in_stock` (boolean, default true): whether the item is currently available
  - `display_order` (int, default 0): ordering within a category
  - `created_at` (timestamptz)
- `truck_settings`: Single-row table for global settings (location, contact info, rating).
  - `id` (int, PK, always 1)
  - `current_location` (text): where the truck is parked tonight
  - `whatsapp_number` (text): phone number for WhatsApp orders
  - `email` (text): contact email
  - `rating` (numeric, default 4.6): Google Reviews rating
  - `review_count` (int, default 59): number of Google reviews
- `gallery_images`: Photos shown in the website gallery.
  - `id` (uuid, PK)
  - `image_url` (text): URL of the image
  - `caption` (text, nullable): optional caption
  - `display_order` (int, default 0)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all tables.
- Single-tenant app with no sign-in — all policies use `TO anon, authenticated` with `USING (true)` because data is intentionally public/shared.

3. Seed Data
- Inserts all menu items (13 panini, 11 contorni, 7 salse, 8 drinks).
- Inserts a single `truck_settings` row with placeholder contact info.
*/

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('panini', 'contorni', 'salse', 'drinks')),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  in_stock boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_menu_items" ON menu_items;
CREATE POLICY "anon_select_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_menu_items" ON menu_items;
CREATE POLICY "anon_insert_menu_items" ON menu_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menu_items" ON menu_items;
CREATE POLICY "anon_update_menu_items" ON menu_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_items" ON menu_items;
CREATE POLICY "anon_delete_menu_items" ON menu_items FOR DELETE
  TO anon, authenticated USING (true);

-- Truck settings table (single row)
CREATE TABLE IF NOT EXISTS truck_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_location text NOT NULL DEFAULT 'Piazza Vittorio Veneto, Torino',
  whatsapp_number text NOT NULL DEFAULT '+39 333 1234567',
  email text NOT NULL DEFAULT 'paninaro@sassi.it',
  rating numeric(2,1) NOT NULL DEFAULT 4.6,
  review_count int NOT NULL DEFAULT 59
);

ALTER TABLE truck_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_truck_settings" ON truck_settings;
CREATE POLICY "anon_select_truck_settings" ON truck_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_truck_settings" ON truck_settings;
CREATE POLICY "anon_insert_truck_settings" ON truck_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_truck_settings" ON truck_settings;
CREATE POLICY "anon_update_truck_settings" ON truck_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_truck_settings" ON truck_settings;
CREATE POLICY "anon_delete_truck_settings" ON truck_settings FOR DELETE
  TO anon, authenticated USING (true);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery_images" ON gallery_images;
CREATE POLICY "anon_select_gallery_images" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gallery_images" ON gallery_images;
CREATE POLICY "anon_insert_gallery_images" ON gallery_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gallery_images" ON gallery_images;
CREATE POLICY "anon_update_gallery_images" ON gallery_images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gallery_images" ON gallery_images;
CREATE POLICY "anon_delete_gallery_images" ON gallery_images FOR DELETE
  TO anon, authenticated USING (true);

-- Seed: truck settings (single row, idempotent)
INSERT INTO truck_settings (id, current_location, whatsapp_number, email, rating, review_count)
VALUES (1, 'Piazza Vittorio Veneto, Torino', '+39 333 1234567', 'paninaro@sassi.it', 4.6, 59)
ON CONFLICT (id) DO NOTHING;

-- Seed: Panini
INSERT INTO menu_items (category, name, price, display_order) VALUES
  ('panini', 'Kebab', 5.50, 1),
  ('panini', 'Salsiccia', 5.00, 2),
  ('panini', 'Cotoletta', 5.50, 3),
  ('panini', 'Porchetta', 6.00, 4),
  ('panini', 'Hamburger', 6.00, 5),
  ('panini', 'Prosciutto', 4.50, 6),
  ('panini', 'Wurstel', 4.00, 7),
  ('panini', 'Falafel', 5.00, 8),
  ('panini', 'Bacon', 5.50, 9),
  ('panini', 'Valdostano', 6.50, 10),
  ('panini', 'Panino Mido', 7.00, 11),
  ('panini', 'Panino Tonno', 5.50, 12),
  ('panini', 'Panino Bestia', 8.00, 13)
ON CONFLICT DO NOTHING;

-- Seed: Contorni
INSERT INTO menu_items (category, name, price, display_order) VALUES
  ('contorni', 'Insalata', 0.50, 1),
  ('contorni', 'Pomodoro', 0.50, 2),
  ('contorni', 'Cipolla', 0.50, 3),
  ('contorni', 'Peperoni', 0.50, 4),
  ('contorni', 'Crauti', 0.50, 5),
  ('contorni', 'Melanzane', 0.80, 6),
  ('contorni', 'Friarielli', 0.80, 7),
  ('contorni', 'Spinaci', 0.80, 8),
  ('contorni', 'Funghi', 0.80, 9),
  ('contorni', 'Formaggio', 1.00, 10),
  ('contorni', 'Scamorza', 1.20, 11)
ON CONFLICT DO NOTHING;

-- Seed: Salse
INSERT INTO menu_items (category, name, price, display_order) VALUES
  ('salse', 'Maionese', 0.30, 1),
  ('salse', 'Ketchup', 0.30, 2),
  ('salse', 'Senape', 0.30, 3),
  ('salse', 'Salsa Piccante', 0.50, 4),
  ('salse', 'Salsa Barbeque', 0.50, 5),
  ('salse', 'Salsa Bianca', 0.50, 6),
  ('salse', 'Salsa Cheddar', 0.80, 7)
ON CONFLICT DO NOTHING;

-- Seed: Bibite & Birre
INSERT INTO menu_items (category, name, price, display_order) VALUES
  ('drinks', 'Acqua', 1.00, 1),
  ('drinks', 'Caffè', 1.00, 2),
  ('drinks', 'Coca Cola', 2.00, 3),
  ('drinks', 'Fanta', 2.00, 4),
  ('drinks', 'Sprite', 2.00, 5),
  ('drinks', 'Beck''s', 3.00, 6),
  ('drinks', 'Heineken', 3.00, 7),
  ('drinks', 'Corona', 3.50, 8)
ON CONFLICT DO NOTHING;