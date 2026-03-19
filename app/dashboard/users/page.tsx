import { ShieldCheck, UserPlus, Users2 } from "lucide-react";

import { AdminShell } from "@/components/dashboard/admin-shell";
import {
  DashboardBadge,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import {
  createCmsUserAction,
  deleteCmsUserAction,
  updateCmsUserRoleAction,
} from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { getCmsUsers } from "@/lib/repositories/cms-user-repository";

interface DashboardUsersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardUsersPage({
  searchParams,
}: DashboardUsersPageProps) {
  const session = await requireAdminSession();
  const users = await getCmsUsers();
  const params = await searchParams;
  const message = typeof params.message === "string" ? params.message : null;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <AdminShell pathname="/dashboard/users" session={session}>
      <DashboardPageHeader
        description="Kelola akun CMS, role, dan hak akses pengguna."
        eyebrow="User Management"
        title="Manajemen pengguna"
      />

      {message ? (
        <div className="border-brand-sand/70 rounded-[1.5rem] border bg-[#eef8ef] px-4 py-3 text-sm font-medium text-[#1f5d33]">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="border-brand-sand/70 text-brand-maroon rounded-[1.5rem] border bg-[#fff1ee] px-4 py-3 text-sm font-medium">
          {error}
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <DashboardPanel>
          <DashboardPanelHeader
            description="Tentukan email, password awal, dan role user baru."
            title="Tambah pengguna"
          />
          <form action={createCmsUserAction} className="mt-5 space-y-4">
            <Field label="Email" name="email" required type="email" />
            <Field
              label="Password awal"
              minLength={8}
              name="password"
              required
              type="password"
            />
            <label className="block space-y-2">
              <span className="text-brand-ink text-sm font-semibold">Role</span>
              <select
                className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
                defaultValue="writer"
                name="role"
              >
                <option value="writer">Writer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Button type="submit">
              <UserPlus className="h-4 w-4" />
              Buat User
            </Button>
          </form>
        </DashboardPanel>

        <DashboardPanel>
          <DashboardPanelHeader
            actions={
              <DashboardBadge tone="muted">{users.length} user</DashboardBadge>
            }
            description="Review akses aktif, ubah role, atau hapus akun yang sudah tidak digunakan."
            title="Daftar pengguna"
          />
          <div className="mt-5 space-y-4">
            {users.map((user) => (
              <article
                className="border-brand-sand/70 bg-brand-surface rounded-[1.6rem] border p-5"
                key={user.id}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-epilogue text-brand-ink text-lg font-bold">
                        {user.email}
                      </h3>
                      <DashboardBadge
                        tone={user.role === "admin" ? "accent" : "muted"}
                      >
                        {user.role}
                      </DashboardBadge>
                      {user.id === session.userId ? (
                        <DashboardBadge tone="success">Anda</DashboardBadge>
                      ) : null}
                    </div>
                    <p className="text-brand-body text-sm">
                      Dibuat pada {formatCreatedAt(user.createdAt)}
                    </p>
                  </div>

                  <div className="text-brand-body flex items-center gap-2 text-sm">
                    {user.role === "admin" ? (
                      <ShieldCheck className="text-brand-maroon h-4 w-4" />
                    ) : (
                      <Users2 className="text-brand-maroon h-4 w-4" />
                    )}
                    <span>
                      {user.role === "admin" ? "Akses penuh" : "Reports only"}
                    </span>
                  </div>
                </div>

                <div className="border-brand-sand/70 bg-brand-cream/35 mt-5 rounded-[1.25rem] border p-4">
                  <label className="block space-y-2">
                    <span className="text-brand-ink text-sm font-semibold">
                      Role
                    </span>
                    <select
                      className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
                      defaultValue={user.role}
                      form={`update-role-${user.id}`}
                      name="role"
                    >
                      <option value="writer">Writer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <form
                      action={updateCmsUserRoleAction}
                      className="sm:shrink-0"
                      id={`update-role-${user.id}`}
                    >
                      <input name="id" type="hidden" value={user.id} />
                      <Button
                        className="w-full justify-center sm:min-w-[12rem]"
                        type="submit"
                        variant="secondary"
                      >
                        Simpan Role
                      </Button>
                    </form>

                    <form action={deleteCmsUserAction} className="sm:shrink-0">
                      <input name="id" type="hidden" value={user.id} />
                      <Button
                        className="w-full justify-center sm:min-w-[10rem]"
                        type="submit"
                        variant="outline"
                      >
                        Hapus User
                      </Button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </DashboardPanel>
      </section>
    </AdminShell>
  );
}

function Field({
  label,
  name,
  type,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-brand-ink text-sm font-semibold">{label}</span>
      <input
        className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
        minLength={minLength}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}
