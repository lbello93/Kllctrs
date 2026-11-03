-- Remotion video generation for the content engine.
-- Adds video fields to `content` and a public Storage bucket for rendered MP4s.
-- `content.type` already accepts arbitrary strings, so the new 'video' type
-- needs no enum change.

alter table public.content
  add column if not exists video_url text,
  add column if not exists video_type text,
  add column if not exists video_duration integer;

create index if not exists content_video_idx
  on public.content (type)
  where type = 'video';

-- Public storage bucket for rendered videos (idempotent).
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Anyone can read published videos from the bucket.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read videos'
  ) then
    create policy "Public read videos"
      on storage.objects for select
      using (bucket_id = 'videos');
  end if;
end $$;
