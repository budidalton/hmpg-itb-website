create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id bigint primary key default 1 check (id = 1),
  organization_name text not null,
  short_name text not null,
  tagline text not null,
  logo_src text not null,
  footer_logo_src text not null,
  address_lines text[] not null default '{}',
  footer_address_lines text[] not null default '{}',
  email text not null,
  phone text not null,
  drive_akademik_url text not null,
  footer_copyright text not null,
  social_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_content (
  key text primary key check (key in ('home', 'about', 'reports', 'contact')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_highlights (
  id text primary key,
  badge text,
  category text not null,
  title text not null,
  description text not null,
  image_src text not null,
  variant text not null check (variant in ('wide', 'feature', 'vertical')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  category text not null,
  category_label text not null,
  cover_image_src text not null,
  card_image_src text,
  cover_caption text,
  published_at timestamptz not null default now(),
  year text not null,
  period_label text not null,
  edition_label text not null,
  author text not null,
  status text not null check (status in ('draft', 'published')) default 'draft',
  featured boolean not null default false,
  summary_label text,
  body_html text not null default '',
  related_slugs text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_bodies (
  report_id text primary key references public.reports(id) on delete cascade,
  source_json jsonb not null default '{}'::jsonb,
  rendered_html text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_page_content_updated_at on public.page_content;
create trigger set_page_content_updated_at
before update on public.page_content
for each row
execute function public.set_updated_at();

drop trigger if exists set_activity_highlights_updated_at on public.activity_highlights;
create trigger set_activity_highlights_updated_at
before update on public.activity_highlights
for each row
execute function public.set_updated_at();

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at
before update on public.reports
for each row
execute function public.set_updated_at();

drop trigger if exists set_report_bodies_updated_at on public.report_bodies;
create trigger set_report_bodies_updated_at
before update on public.report_bodies
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.activity_highlights enable row level security;
alter table public.reports enable row level security;
alter table public.report_bodies enable row level security;

drop policy if exists "Admins can read admin_users" on public.admin_users;
create policy "Admins can read admin_users"
on public.admin_users
for select
using (public.is_admin());

drop policy if exists "Admins manage admin_users" on public.admin_users;
create policy "Admins manage admin_users"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
on public.site_settings
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read page content" on public.page_content;
create policy "Public can read page content"
on public.page_content
for select
using (true);

drop policy if exists "Admins manage page content" on public.page_content;
create policy "Admins manage page content"
on public.page_content
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read activity highlights" on public.activity_highlights;
create policy "Public can read activity highlights"
on public.activity_highlights
for select
using (true);

drop policy if exists "Admins manage activity highlights" on public.activity_highlights;
create policy "Admins manage activity highlights"
on public.activity_highlights
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published reports" on public.reports;
create policy "Public can read published reports"
on public.reports
for select
using (status = 'published');

drop policy if exists "Admins manage reports" on public.reports;
create policy "Admins manage reports"
on public.reports
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published report bodies" on public.report_bodies;
create policy "Public can read published report bodies"
on public.report_bodies
for select
using (
  exists (
    select 1
    from public.reports
    where reports.id = report_bodies.report_id
      and reports.status = 'published'
  )
);

drop policy if exists "Admins manage report bodies" on public.report_bodies;
create policy "Admins manage report bodies"
on public.report_bodies
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('report-media', 'report-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can read site assets" on storage.objects;
create policy "Public can read site assets"
on storage.objects
for select
using (bucket_id = 'site-assets');

drop policy if exists "Admins manage site assets" on storage.objects;
create policy "Admins manage site assets"
on storage.objects
for all
using (bucket_id = 'site-assets' and public.is_admin())
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Public can read report media" on storage.objects;
create policy "Public can read report media"
on storage.objects
for select
using (bucket_id = 'report-media');

drop policy if exists "Admins manage report media" on storage.objects;
create policy "Admins manage report media"
on storage.objects
for all
using (bucket_id = 'report-media' and public.is_admin())
with check (bucket_id = 'report-media' and public.is_admin());
