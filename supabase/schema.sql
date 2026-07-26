-- ============================================================
-- HithaLink Database Schema (Supabase / PostgreSQL)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (extends auth.users, one row per Invitater)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. INVITATIONS (created by the Invitater, one per Invitationer)
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  invitater_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,               -- e.g. "for-amaya-x7f2"
  invitationer_name text not null,
  cover_photo_url text,
  intro_message text,                      -- shown on page 1
  music_url text,                          -- lofi/acoustic track
  vibe_options jsonb default '["Sunset & Beach Walk","Cozy Cafe","Fine Dining","Street Food & Movie Night"]'::jsonb,
  date_spot_presets jsonb default '[]'::jsonb, -- chosen Sri Lankan preset spots
  secret_message text,                     -- love letter from invitater
  memory_photos jsonb default '[]'::jsonb, -- 2-3 photo urls
  status text not null default 'sent' check (status in ('sent','opened','accepted')),
  opened_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists invitations_invitater_idx on public.invitations(invitater_id);
create unique index if not exists invitations_slug_idx on public.invitations(slug);

alter table public.invitations enable row level security;

-- Invitater manages only their own invitations
create policy "Invitater can CRUD own invitations"
  on public.invitations for all
  using (auth.uid() = invitater_id)
  with check (auth.uid() = invitater_id);

-- Anyone holding the link (anon) can read one invitation by slug
-- (the app queries by exact slug only, never lists all rows)
create policy "Public can view invitation by slug"
  on public.invitations for select
  using (true);

-- Anonymous recipients are allowed to mark an invite "opened"
create policy "Public can mark invitation opened"
  on public.invitations for update
  using (true)
  with check (status in ('opened','accepted'));


-- 3. INVITATION RESPONSES (submitted by the Invitationer)
create table if not exists public.invitation_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade unique,
  accepted boolean not null default true,
  selected_date date,
  selected_time text,
  chosen_vibe text,
  chosen_date_spot text,
  favorite_food text,
  reply_message text,
  responded_at timestamptz default now()
);

alter table public.invitation_responses enable row level security;

-- Invitater can view responses to their own invitations
create policy "Invitater can view responses to own invitations"
  on public.invitation_responses for select
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_id and i.invitater_id = auth.uid()
    )
  );

-- Anonymous Invitationer can insert exactly one response per invitation
create policy "Public can submit a response"
  on public.invitation_responses for insert
  with check (true);


-- 4. Helper view for the Invitater dashboard
create or replace view public.invitation_dashboard as
select
  i.id,
  i.invitater_id,
  i.slug,
  i.invitationer_name,
  i.status,
  i.created_at,
  i.opened_at,
  r.accepted,
  r.selected_date,
  r.selected_time,
  r.chosen_vibe,
  r.chosen_date_spot,
  r.favorite_food,
  r.reply_message,
  r.responded_at
from public.invitations i
left join public.invitation_responses r on r.invitation_id = i.id;

-- ============================================================
-- Done. Remember to enable "Confirm email" off (or magic link)
-- in Supabase Auth settings for the one-click login flow.
-- ============================================================
