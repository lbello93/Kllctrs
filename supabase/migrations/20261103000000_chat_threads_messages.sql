-- Chat assistant persistence: per-user conversation threads and their messages.
-- Leaves the legacy flat chat_conversations table untouched.

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_threads_user_id_updated_at_idx
  on public.chat_threads (user_id, updated_at desc);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_thread_id_created_at_idx
  on public.chat_messages (thread_id, created_at asc);

-- Row Level Security: a user can only see and write their own threads/messages.
-- The API writes with the service role (which bypasses RLS); these policies
-- protect any direct client access via the anon/authenticated keys.
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_threads owner" on public.chat_threads;
create policy "chat_threads owner" on public.chat_threads
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chat_messages owner" on public.chat_messages;
create policy "chat_messages owner" on public.chat_messages
  for all
  using (
    exists (
      select 1 from public.chat_threads t
      where t.id = chat_messages.thread_id and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chat_threads t
      where t.id = chat_messages.thread_id and t.user_id = auth.uid()
    )
  );
