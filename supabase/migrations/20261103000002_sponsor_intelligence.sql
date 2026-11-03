-- Sponsor Intelligence: enforce one review per user per event, and expose a
-- sponsor analytics view for the tracking tool.

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'event_reviews_event_user_unique'
  ) then
    alter table public.event_reviews
      add constraint event_reviews_event_user_unique unique (event_id, user_id);
  end if;
end $$;

-- NOTE: the events date column is `date_start` (not `start_date`), and it is
-- cast to date so the year comparison works whether it is stored as date or text.
create or replace view public.sponsor_analytics as
select
  s.id as sponsor_id,
  s.name,
  s.category,
  count(distinct es.event_id) as total_events_sponsored,
  count(distinct case
    when (e.date_start)::date >= date_trunc('year', current_date)::date
    then es.event_id
  end) as events_this_year,
  array_agg(distinct e.state) filter (where e.state is not null) as states_present_in,
  count(distinct case
    when es.tier in ('title', 'gold') then es.event_id
  end) as top_tier_count
from public.sponsors s
left join public.event_sponsors es on s.id = es.sponsor_id
left join public.events e on es.event_id = e.id
group by s.id, s.name, s.category;

grant select on public.sponsor_analytics to anon, authenticated, service_role;
