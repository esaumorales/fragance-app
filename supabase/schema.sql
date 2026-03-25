-- ==========================================
-- SCRIPT DE INICIALIZACIÓN PREMIUM: E-COMMERCE AURA
-- Idempotente: Puedes correrlo múltiples veces sin romper nada.
-- ==========================================

-- 1. profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. brands
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 3. categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- 4. products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  gender text check (gender in ('men', 'women', 'unisex')),
  size_ml integer,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. product_images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  is_main boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. addresses
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipient_name text not null,
  phone text,
  line1 text not null,
  line2 text,
  city text not null,
  region text,
  postal_code text,
  country text not null default 'Peru',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. cart_items
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- 8. orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  subtotal numeric(10,2) not null default 0 check (subtotal >= 0),
  shipping_cost numeric(10,2) not null default 0 check (shipping_cost >= 0),
  total numeric(10,2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. order_items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null check (line_total >= 0)
);

-- 10. reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- 11. favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ==========================================
-- TRIGGER DE CREACIÓN AUTOMÁTICA DE PERFIL
-- ==========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    trim(
      coalesce(new.raw_user_meta_data->>'first_name', '') || ' ' || 
      coalesce(new.raw_user_meta_data->>'last_name', '')
    ),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();


-- ==========================================
-- RLS (ROW LEVEL SECURITY) Y POLICIES
-- ==========================================
alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

-- Limpiar policies previas para idempotencia absoluta
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Public can view brands" on public.brands;
drop policy if exists "Public can view categories" on public.categories;

drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

drop policy if exists "Public can view product images" on public.product_images;
drop policy if exists "Admins can insert product images" on public.product_images;
drop policy if exists "Admins can update product images" on public.product_images;
drop policy if exists "Admins can delete product images" on public.product_images;

drop policy if exists "Users can view own addresses" on public.addresses;
drop policy if exists "Users can insert own addresses" on public.addresses;
drop policy if exists "Users can update own addresses" on public.addresses;
drop policy if exists "Users can delete own addresses" on public.addresses;

drop policy if exists "Users can manage own cart" on public.cart_items;

drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Admins can update orders" on public.orders;

drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Admins can view all order items" on public.order_items;

drop policy if exists "Users can manage own favorites" on public.favorites;

drop policy if exists "Public can read reviews" on public.reviews;
drop policy if exists "Users can insert own reviews" on public.reviews;
drop policy if exists "Users can update own reviews" on public.reviews;

-- PROFILES
create policy "Users can view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- BRANDS & CATEGORIES
create policy "Public can view brands" on public.brands for select to anon, authenticated using (true);
create policy "Public can view categories" on public.categories for select to anon, authenticated using (true);

-- PRODUCTS
create policy "Public can view active products" on public.products for select to anon, authenticated using (active = true);
create policy "Admins can insert products" on public.products for insert to authenticated with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Admins can update products" on public.products for update to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')) with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Admins can delete products" on public.products for delete to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- PRODUCT IMAGES
create policy "Public can view product images" on public.product_images for select to anon, authenticated using (true);
create policy "Admins can insert product images" on public.product_images for insert to authenticated with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Admins can update product images" on public.product_images for update to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')) with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Admins can delete product images" on public.product_images for delete to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- ADDRESSES
create policy "Users can view own addresses" on public.addresses for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own addresses" on public.addresses for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own addresses" on public.addresses for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own addresses" on public.addresses for delete to authenticated using (auth.uid() = user_id);

-- CART ITEMS
create policy "Users can manage own cart" on public.cart_items for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ORDERS
create policy "Users can view own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert to authenticated with check (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
create policy "Admins can update orders" on public.orders for update to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')) with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- ORDER ITEMS
create policy "Users can view own order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Admins can view all order items" on public.order_items for select to authenticated using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- FAVORITES
create policy "Users can manage own favorites" on public.favorites for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- REVIEWS
create policy "Public can read reviews" on public.reviews for select to anon, authenticated using (true);
create policy "Users can insert own reviews" on public.reviews for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own reviews" on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;

drop policy if exists "Public Access to product images" on storage.objects;
drop policy if exists "Admin Insert products images" on storage.objects;

create policy "Public Access to product images" on storage.objects for select using ( bucket_id = 'products' );
create policy "Admin Insert products images" on storage.objects for insert with check ( bucket_id = 'products' and exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin') );
