-- Advanced event calendar: classification/flags on events + a tiered
-- event<->sponsor junction. lat/lng already exist on events, so they are not
-- re-added here.

alter table public.events
  add column if not exists event_type text
    check (event_type in ('card_show', 'convention', 'auction', 'meetup', 'online')),
  add column if not exists is_featured boolean not null default false,
  add column if not exists is_verified boolean not null default false,
  add column if not exists source_url text;

create index if not exists events_event_type_idx on public.events (event_type);
create index if not exists events_is_featured_idx on public.events (is_featured) where is_featured;

create table if not exists public.event_sponsors (
  event_id uuid not null references public.events (id) on delete cascade,
  sponsor_id uuid not null references public.sponsors (id) on delete cascade,
  tier text not null default 'exhibitor'
    check (tier in ('title', 'gold', 'silver', 'exhibitor')),
  created_at timestamptz not null default now(),
  primary key (event_id, sponsor_id)
);

create index if not exists event_sponsors_event_id_idx on public.event_sponsors (event_id);
create index if not exists event_sponsors_sponsor_id_idx on public.event_sponsors (sponsor_id);

-- Public read (the directory is public); writes go through the service role.
alter table public.event_sponsors enable row level security;

drop policy if exists "event_sponsors public read" on public.event_sponsors;
create policy "event_sponsors public read" on public.event_sponsors
  for select
  using (true);
