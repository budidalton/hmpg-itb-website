alter table public.admin_users
add column if not exists role text;

update public.admin_users
set role = 'admin'
where role is null;

alter table public.admin_users
alter column role set default 'admin';

alter table public.admin_users
alter column role set not null;

alter table public.admin_users
drop constraint if exists admin_users_role_check;

alter table public.admin_users
add constraint admin_users_role_check
check (role in ('admin', 'writer'));

create or replace function public.is_cms_user()
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

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.can_manage_reports()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role in ('admin', 'writer')
  );
$$;

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

drop policy if exists "Admins manage reports" on public.reports;
create policy "Admins manage reports"
on public.reports
for all
using (public.can_manage_reports())
with check (public.can_manage_reports());

drop policy if exists "Admins manage report bodies" on public.report_bodies;
create policy "Admins manage report bodies"
on public.report_bodies
for all
using (public.can_manage_reports())
with check (public.can_manage_reports());

drop policy if exists "Admins manage report media" on storage.objects;
create policy "Admins manage report media"
on storage.objects
for all
using (bucket_id = 'report-media' and public.can_manage_reports())
with check (bucket_id = 'report-media' and public.can_manage_reports());
