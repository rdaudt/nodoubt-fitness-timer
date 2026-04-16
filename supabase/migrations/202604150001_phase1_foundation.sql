create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.official_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  workout_type text not null check (
    workout_type in ('hiit', 'strength', 'mobility', 'recovery')
  ),
  difficulty text not null check (
    difficulty in ('beginner', 'intermediate', 'advanced')
  ),
  interval_count integer not null check (interval_count > 0),
  total_seconds integer not null check (total_seconds > 0),
  intervals jsonb not null check (jsonb_typeof(intervals) = 'array'),
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.personal_timers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  is_draft boolean not null default true,
  source text not null check (source in ('scratch', 'official-template')),
  source_template_id uuid references public.official_templates (id) on delete set null,
  definition_version integer not null default 1 check (definition_version > 0),
  intervals jsonb not null default '[]'::jsonb check (jsonb_typeof(intervals) = 'array'),
  total_seconds integer not null default 0 check (total_seconds >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists personal_timers_owner_updated_idx
  on public.personal_timers (owner_id, updated_at desc);

create index if not exists personal_timers_owner_draft_idx
  on public.personal_timers (owner_id, is_draft);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists official_templates_set_updated_at on public.official_templates;
create trigger official_templates_set_updated_at
before update on public.official_templates
for each row
execute function public.set_updated_at();

drop trigger if exists personal_timers_set_updated_at on public.personal_timers;
create trigger personal_timers_set_updated_at
before update on public.personal_timers
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

alter table public.official_templates enable row level security;

alter table public.personal_timers enable row level security;
alter table public.personal_timers force row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.official_templates from anon, authenticated;
revoke all on public.personal_timers from anon, authenticated;

grant select on public.official_templates to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.personal_timers to authenticated;

drop policy if exists "official templates are public read only" on public.official_templates;
create policy "official templates are public read only"
on public.official_templates
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "profiles are owner readable" on public.profiles;
create policy "profiles are owner readable"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles are owner insertable" on public.profiles;
create policy "profiles are owner insertable"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles are owner updatable" on public.profiles;
create policy "profiles are owner updatable"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "profiles are owner deletable" on public.profiles;
create policy "profiles are owner deletable"
on public.profiles
for delete
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "personal timers are owner readable" on public.personal_timers;
create policy "personal timers are owner readable"
on public.personal_timers
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "personal timers are owner insertable" on public.personal_timers;
create policy "personal timers are owner insertable"
on public.personal_timers
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "personal timers are owner updatable" on public.personal_timers;
create policy "personal timers are owner updatable"
on public.personal_timers
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "personal timers are owner deletable" on public.personal_timers;
create policy "personal timers are owner deletable"
on public.personal_timers
for delete
to authenticated
using ((select auth.uid()) = owner_id);
