-- Card Shop Finder: classification/verification columns on shops + reviews.
-- zip_code, phone, hours, google_place_id, source, lat, lng already exist, so
-- they are not re-added.

alter table public.shops
  add column if not exists email text,
  add column if not exists description text,
  add column if not exists category text
    check (category in ('sports_cards', 'pokemon', 'magic_tcg', 'yugioh', 'comics', 'memorabilia', 'multi')),
  add column if not exists is_verified boolean not null default false,
  add column if not exists is_claimed boolean not null default false,
  add column if not exists review_count integer not null default 0;

create index if not exists shops_lat_lng_idx on public.shops (lat, lng);
create index if not exists shops_category_idx on public.shops (category);

create table if not exists public.shop_reviews (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  content text,
  created_at timestamptz not null default now(),
  unique (shop_id, user_id)
);

create index if not exists shop_reviews_shop_id_idx on public.shop_reviews (shop_id);

alter table public.shop_reviews enable row level security;

drop policy if exists "shop_reviews public read" on public.shop_reviews;
create policy "shop_reviews public read" on public.shop_reviews
  for select using (true);

drop policy if exists "shop_reviews owner write" on public.shop_reviews;
create policy "shop_reviews owner write" on public.shop_reviews
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
