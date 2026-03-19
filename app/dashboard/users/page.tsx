import { AdminShell } from "@/components/dashboard/admin-shell";
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
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <p className="font-manrope text-brand-maroon text-xs font-bold tracking-[0.24em] uppercase">
          User Management
        </p>
        <h1 className="font-epilogue text-brand-ink mt-4 text-3xl font-bold">
          Kelola akun CMS
        </h1>
        <p className="font-manrope text-brand-body mt-4 max-w-3xl text-sm leading-7">
          Admin dapat membuat kredensial baru, mengubah role user, dan menghapus
          akses CMS langsung dari dashboard.
        </p>

        {message ? (
          <p className="bg-brand-shell font-manrope text-brand-body mt-6 rounded-2xl px-4 py-3 text-sm">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="bg-brand-blush font-manrope text-brand-maroon mt-6 rounded-2xl px-4 py-3 text-sm">
            {error}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr,1.25fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
            Tambah user
          </h2>
          <p className="font-manrope text-brand-body mt-3 text-sm leading-7">
            Tentukan email, password awal, dan role akses untuk user baru.
          </p>

          <form action={createCmsUserAction} className="mt-6 space-y-5">
            <label className="block space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Email
              </span>
              <input
                className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
                name="email"
                required
                type="email"
              />
            </label>

            <label className="block space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Password awal
              </span>
              <input
                className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>

            <label className="block space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Role
              </span>
              <select
                className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
                defaultValue="writer"
                name="role"
              >
                <option value="writer">Writer</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <Button type="submit">Buat User</Button>
          </form>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
                CMS users
              </h2>
              <p className="font-manrope text-brand-body mt-2 text-sm leading-7">
                Total {users.length} user terdaftar untuk akses dashboard.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {users.map((user) => (
              <div
                className="border-brand-stroke/20 rounded-3xl border p-5"
                key={user.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-epilogue text-brand-ink text-lg font-bold">
                      {user.email}
                    </p>
                    <p className="font-manrope text-brand-body mt-2 text-sm">
                      Dibuat pada {formatCreatedAt(user.createdAt)}
                      {user.id === session.userId ? " • Anda" : ""}
                    </p>
                  </div>
                  <span className="bg-brand-shell font-manrope text-brand-maroon rounded-full px-4 py-2 text-xs font-bold tracking-[0.18em] uppercase">
                    {user.role}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <form
                    action={updateCmsUserRoleAction}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <input name="id" type="hidden" value={user.id} />
                    <label className="space-y-2">
                      <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                        Role
                      </span>
                      <select
                        className="border-brand-stroke/20 font-manrope h-12 rounded-2xl border px-4 text-sm"
                        defaultValue={user.role}
                        name="role"
                      >
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                    <Button type="submit" variant="outline">
                      Simpan Role
                    </Button>
                  </form>

                  <form action={deleteCmsUserAction}>
                    <input name="id" type="hidden" value={user.id} />
                    <Button type="submit" variant="outline">
                      Hapus User
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
