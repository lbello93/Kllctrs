create or replace function public.increment_sponsor_click(sponsor_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.sponsors
  set website_clicks = coalesce(website_clicks, 0) + 1
  where id = sponsor_id;
$$;

create or replace function public.increment_sponsor_view(sponsor_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.sponsors
  set profile_views = coalesce(profile_views, 0) + 1
  where id = sponsor_id;
$$;

revoke all on function public.increment_sponsor_click(uuid) from public, anon, authenticated;
revoke all on function public.increment_sponsor_view(uuid) from public, anon, authenticated;
grant execute on function public.increment_sponsor_click(uuid) to service_role;
grant execute on function public.increment_sponsor_view(uuid) to service_role;