-- Handover: analytics tracking + weekly report aggregation.
-- Run in the Supabase SQL editor.

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,              -- page_view, login, signup, event_view, card_view, search, trade_request, chatbot_query, content_studio_use
  user_id uuid references auth.users(id) on delete set null,
  page_path text,
  metadata jsonb not null default '{}',
  ip_hash text,                          -- hashed server-side, never raw IP
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_type_date on public.analytics_events (event_type, created_at);
create index if not exists idx_analytics_user on public.analytics_events (user_id);
create index if not exists idx_analytics_created on public.analytics_events (created_at);

-- RLS: clients may INSERT their own events; only admins may read.
alter table public.analytics_events enable row level security;

drop policy if exists "Anyone can record analytics" on public.analytics_events;
create policy "Anyone can record analytics"
  on public.analytics_events for insert with check (true);

drop policy if exists "Admins can read analytics" on public.analytics_events;
create policy "Admins can read analytics"
  on public.analytics_events for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'super_admin')
  ));

-- Weekly rollup (refresh from a cron or the report route).
drop materialized view if exists public.weekly_stats;
create materialized view public.weekly_stats as
select
  date_trunc('week', created_at) as week,
  count(*) filter (where event_type = 'page_view')                          as total_page_views,
  count(distinct ip_hash) filter (where event_type = 'page_view')           as unique_visitors,
  count(*) filter (where event_type = 'login')                              as total_logins,
  count(*) filter (where event_type = 'signup')                             as new_signups,
  count(*) filter (where event_type = 'event_view')                         as event_views,
  count(*) filter (where event_type = 'card_view')                          as card_views,
  count(*) filter (where event_type = 'search')                             as searches,
  count(*) filter (where event_type = 'trade_request')                      as trade_requests,
  count(*) filter (where event_type = 'chatbot_query')                      as chatbot_queries,
  count(distinct user_id)                                                    as active_users
from public.analytics_events
group by date_trunc('week', created_at);

-- Flexible windowed stats for the admin report + weekly email.
create or replace function public.get_period_stats(start_ts timestamptz, end_ts timestamptz)
returns table (
  total_page_views bigint,
  unique_visitors bigint,
  total_logins bigint,
  new_signups bigint,
  event_views bigint,
  card_views bigint,
  searches bigint,
  trade_requests bigint,
  chatbot_queries bigint,
  active_users bigint
)
language sql stable security definer set search_path = public as $$
  select
    count(*) filter (where event_type = 'page_view'),
    count(distinct ip_hash) filter (where event_type = 'page_view'),
    count(*) filter (where event_type = 'login'),
    count(*) filter (where event_type = 'signup'),
    count(*) filter (where event_type = 'event_view'),
    count(*) filter (where event_type = 'card_view'),
    count(*) filter (where event_type = 'search'),
    count(*) filter (where event_type = 'trade_request'),
    count(*) filter (where event_type = 'chatbot_query'),
    count(distinct user_id)
  from public.analytics_events
  where created_at >= start_ts and created_at < end_ts;
$$;

-- Last 7 days convenience wrapper for the weekly email.
create or replace function public.get_weekly_stats()
returns table (
  total_page_views bigint, unique_visitors bigint, total_logins bigint,
  new_signups bigint, event_views bigint, card_views bigint, searches bigint,
  trade_requests bigint, chatbot_queries bigint, active_users bigint
)
language sql stable security definer set search_path = public as $$
  select * from public.get_period_stats(now() - interval '7 days', now());
$$;

-- Top pages for a window (used by the report tables).
create or replace function public.get_top_pages(start_ts timestamptz, end_ts timestamptz, lim int default 10)
returns table (page_path text, views bigint)
language sql stable security definer set search_path = public as $$
  select page_path, count(*) as views
  from public.analytics_events
  where event_type = 'page_view' and created_at >= start_ts and created_at < end_ts
    and page_path is not null
  group by page_path order by views desc limit lim;
$$;
