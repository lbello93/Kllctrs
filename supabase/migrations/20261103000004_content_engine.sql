-- AI Content Engine
-- Adds only the columns the engine needs that the `content` table does not
-- already have. `type`, `status`, `published_at`, `slug`, `meta_description`,
-- `source_links`, `social_drafts`, `event_id` and `source_event_id` already
-- exist and are left untouched.

alter table public.content
  add column if not exists is_ai_generated boolean not null default false,
  add column if not exists ai_prompt_used text,
  add column if not exists excerpt text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists related_event_id uuid references public.events(id) on delete set null,
  add column if not exists related_sponsor_id uuid references public.sponsors(id) on delete set null;

-- Normalise the status/type vocabularies the engine relies on. These are
-- advisory CHECKs guarded so re-running the migration is safe.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'content_status_check'
  ) then
    alter table public.content
      add constraint content_status_check
      check (status is null or status in ('draft', 'review', 'published', 'archived'));
  end if;
end $$;

-- Helpful indexes for the blog and studio list queries.
create index if not exists content_status_published_at_idx
  on public.content (status, published_at desc);
create index if not exists content_type_idx on public.content (type);
create index if not exists content_tags_idx on public.content using gin (tags);
create index if not exists content_related_event_idx on public.content (related_event_id);
create index if not exists content_related_sponsor_idx on public.content (related_sponsor_id);
