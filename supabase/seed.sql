-- ==========================================
-- SEED DE DATOS DE PRUEBA (Para pruebas locales o desarrollo)
-- Copia y corre esto en el SQL Editor para tener perfumes de prueba.
-- ==========================================

-- 1. Insertar Marcas
INSERT INTO public.brands (name, slug) VALUES 
('AURA Exclusive', 'aura-exclusive'),
('Maison Blanc', 'maison-blanc'),
('Chanel', 'chanel'),
('Tom Ford', 'tom-ford')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insertar Categorías
INSERT INTO public.categories (name, slug) VALUES 
('Amaderado', 'amaderado'),
('Floral', 'floral'),
('Cítrico', 'citrico'),
('Oriental', 'oriental')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insertar Productos (obteniendo IDs de marcas y categorías)
DO $$
DECLARE
  aura_id uuid;
  maison_id uuid;
  tomford_id uuid;

  amaderado_id uuid;
  floral_id uuid;
  oriental_id uuid;

  p1 uuid; p2 uuid; p3 uuid;
BEGIN
  SELECT id INTO aura_id FROM public.brands WHERE slug = 'aura-exclusive';
  SELECT id INTO maison_id FROM public.brands WHERE slug = 'maison-blanc';
  SELECT id INTO tomford_id FROM public.brands WHERE slug = 'tom-ford';

  SELECT id INTO amaderado_id FROM public.categories WHERE slug = 'amaderado';
  SELECT id INTO floral_id FROM public.categories WHERE slug = 'floral';
  SELECT id INTO oriental_id FROM public.categories WHERE slug = 'oriental';

  -- Producto 1
  INSERT INTO public.products (brand_id, category_id, name, slug, description, price, stock, gender, size_ml, featured, active)
  VALUES (aura_id, oriental_id, 'Noir Absolu', 'noir-absolu', 'Perfecto para citas y noches elegantes. Un aroma misterioso que deja huella en quienes te rodean sin decir una sola palabra.', 120.00, 50, 'men', 100, true, true)
  RETURNING id INTO p1;

  INSERT INTO public.product_images (product_id, image_url, is_main)
  VALUES (p1, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80', true);

  -- Producto 2
  INSERT INTO public.products (brand_id, category_id, name, slug, description, price, stock, gender, size_ml, featured, active)
  VALUES (maison_id, floral_id, 'Velvet Rose', 'velvet-rose', 'La delicadeza de las rosas al amanecer. Una fragancia que transmite pureza, paz y feminidad romántica.', 95.00, 30, 'women', 50, true, true)
  RETURNING id INTO p2;

  INSERT INTO public.product_images (product_id, image_url, is_main)
  VALUES (p2, 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80', true);

  -- Producto 3
  INSERT INTO public.products (brand_id, category_id, name, slug, description, price, stock, gender, size_ml, featured, active)
  VALUES (tomford_id, amaderado_id, 'Oud Wood Intense', 'oud-wood-intense', 'Fuerte, imponente e inolvidable. Madera de oud ahumada perfecta para marcar territorio.', 250.00, 10, 'unisex', 100, true, true)
  RETURNING id INTO p3;

  INSERT INTO public.product_images (product_id, image_url, is_main)
  VALUES (p3, 'https://images.unsplash.com/photo-1595425970377-c9703c4865f4?auto=format&fit=crop&q=80', true);

END $$;
