-- Handover: FAQ knowledge base for the chatbot (zero-token answers).
-- Run in the Supabase SQL editor.

create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  keywords text[] not null default '{}',   -- simple match terms
  created_at timestamptz not null default now()
);

-- Full-text search over the question for the chatbot short-circuit.
create index if not exists idx_faq_question_fts
  on public.faq using gin (to_tsvector('english', question));

alter table public.faq enable row level security;

drop policy if exists "FAQ is publicly readable" on public.faq;
create policy "FAQ is publicly readable" on public.faq for select using (true);

-- Seed common questions (edit freely in the dashboard).
insert into public.faq (question, answer, keywords) values
  ('How do I find card shows near me?',
   'Open the Events map at /maps — it shows upcoming card shows near your location. You can filter by date and city.',
   array['events','card show','near me','map','find']),
  ('How do I add a card shop?',
   'Go to /shops/submit and fill in the shop details. Submissions are reviewed before they appear on the map.',
   array['shop','add','submit','store']),
  ('How do I sign up?',
   'Click Sign up, enter your email, password and display name, then confirm the verification email we send you.',
   array['sign up','signup','register','account','create']),
  ('How do I reset my password?',
   'On the sign-in screen choose "Forgot password", enter your email, and follow the reset link we send you.',
   array['password','reset','forgot','login']),
  ('Is KLLCTRS free?',
   'Yes — browsing events, shops and sponsors is free. See /pricing for any premium features.',
   array['free','price','pricing','cost','subscription'])
on conflict do nothing;
