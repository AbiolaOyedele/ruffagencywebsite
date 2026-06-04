-- ─────────────────────────────────────────────────────────────
-- The Ruff Agency — full schema
-- ─────────────────────────────────────────────────────────────

-- Settings (key/value CMS store)
create table if not exists ruff_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Projects
create table if not exists ruff_projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  client      text not null default '',
  description text,
  bg_color    text not null default '#ffffff',
  image_url   text,
  href        text,
  categories  text[] not null default '{}',
  is_featured boolean not null default false,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Testimonials
create table if not exists ruff_testimonials (
  id         uuid primary key default gen_random_uuid(),
  quote      text not null,
  credit     text not null default '',
  sort_order integer not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Client logos (marquee strip)
create table if not exists ruff_client_logos (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  image_url  text not null,
  sort_order integer not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Scoops (jobs + news)
create table if not exists ruff_scoops (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  type        text not null default 'news' check (type in ('job', 'news')),
  category    text,
  description text,
  href        text,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS: enable on all tables (local dev — policies allow all)
alter table ruff_settings      enable row level security;
alter table ruff_projects      enable row level security;
alter table ruff_testimonials  enable row level security;
alter table ruff_client_logos  enable row level security;
alter table ruff_scoops        enable row level security;

-- Allow all operations locally (no auth enforcement in dev)
create policy "allow all" on ruff_settings      for all using (true) with check (true);
create policy "allow all" on ruff_projects      for all using (true) with check (true);
create policy "allow all" on ruff_testimonials  for all using (true) with check (true);
create policy "allow all" on ruff_client_logos  for all using (true) with check (true);
create policy "allow all" on ruff_scoops        for all using (true) with check (true);
