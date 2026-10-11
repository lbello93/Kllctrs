create table if not exists public.brand_engagements (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  event_ids uuid[] not null default '{}',
  collecting_categories text[] not null default '{}',
  product_interests text[] not null default '{}',
  purchase_frequency text,
  preferred_channels text[] not null default '{}',
  region text,
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint brand_engagements_region_length check (region is null or char_length(region) <= 80)
);

alter table public.brand_engagements enable row level security;

create policy "Visitors can submit consented brand interests"
  on public.brand_engagements for insert to anon, authenticated
  with check (consented_at is not null);

create index if not exists brand_engagements_sponsor_created_idx
  on public.brand_engagements (sponsor_id, created_at desc);

alter table public.sponsors
  add column if not exists tagline text,
  add column if not exists offerings text[] not null default '{}',
  add column if not exists product_categories text[] not null default '{}',
  add column if not exists target_audience text[] not null default '{}',
  add column if not exists service_area text,
  add column if not exists info_source_url text,
  add column if not exists info_verified_at timestamptz;
