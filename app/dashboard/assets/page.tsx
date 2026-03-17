import { AdminShell } from "@/components/dashboard/admin-shell";
import { Button } from "@/components/ui/button";
import { uploadLogoAction } from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore } from "@/lib/repositories/content-repository";

export default async function DashboardAssetsPage() {
  const session = await requireAdminSession();
  const store = await getStore();

  return (
    <AdminShell pathname="/dashboard/assets" session={session}>
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <h1 className="font-epilogue text-brand-ink text-3xl font-bold">
          Assets
        </h1>
        <p className="font-manrope text-brand-body mt-4 max-w-3xl text-sm leading-7">
          Kelola identitas visual utama HMPG ITB. Pada mode demo, file akan
          disimpan sebagai data URL in-memory. Pada mode Supabase, file akan
          diunggah ke bucket storage.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem,1fr]">
          <div className="bg-brand-shell rounded-[2rem] p-6">
            <p className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
              Current logo
            </p>
            <img
              alt={store.settings.shortName}
              className="mt-6 h-52 w-52 object-contain"
              src={store.settings.logoSrc}
            />
          </div>

          <form
            action={uploadLogoAction}
            className="border-brand-stroke/20 space-y-4 rounded-[2rem] border p-6"
          >
            <label className="block space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Upload logo
              </span>
              <input
                className="border-brand-stroke/20 font-manrope block w-full rounded-2xl border px-4 py-3 text-sm"
                name="logoFile"
                required
                type="file"
              />
            </label>
            <Button type="submit">Upload & Replace Logo</Button>
          </form>
        </div>
      </section>
    </AdminShell>
  );
}
