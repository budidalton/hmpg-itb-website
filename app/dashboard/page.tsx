import { ArrowRight, FileText, Images, PencilRuler, Users } from "lucide-react";

import { AdminShell } from "@/components/dashboard/admin-shell";
import {
  DashboardLinkCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
  DashboardStatCard,
} from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore, isDemoMode } from "@/lib/repositories/content-repository";

export default async function DashboardPage() {
  const session = await requireAdminSession();
  const store = await getStore();
  const publishedReports = store.reports.filter(
    (item) => item.status === "published",
  ).length;
  const draftReports = store.reports.filter(
    (item) => item.status === "draft",
  ).length;

  return (
    <AdminShell pathname="/dashboard" session={session}>
      <DashboardPageHeader
        actions={
          <a href="/dashboard/reports?new=1">
            <Button size="sm">
              Tulis Laporan Baru
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        }
        description={
          isDemoMode()
            ? "Mode demo. Perubahan disimpan ke adapter lokal untuk pengujian."
            : "Mode produksi. Perubahan disimpan ke database, autentikasi, dan storage."
        }
        eyebrow="Overview"
        title="Ringkasan CMS"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          hint="Siap ditampilkan di halaman publik."
          label="Published Reports"
          tone="accent"
          value={publishedReports}
        />
        <DashboardStatCard
          hint="Butuh review atau finalisasi sebelum tayang."
          label="Draft Reports"
          value={draftReports}
        />
        <DashboardStatCard
          hint="Highlight aktivitas yang tampil di beranda."
          label="Activity Highlights"
          value={store.activities.length}
        />
        <DashboardStatCard
          hint="Tautan sosial yang aktif di situs publik."
          label="Social Channels"
          value={store.settings.socialLinks.length}
        />
      </section>

      <DashboardPanel>
        <DashboardPanelHeader
          description="Akses cepat ke area administrasi utama."
          title="Akses Cepat"
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          <DashboardLinkCard
            badge="Reports"
            description="Buat, edit, preview, dan publikasikan laporan."
            href="/dashboard/reports"
            title="Manajemen laporan"
          />
          <DashboardLinkCard
            badge="Content"
            description="Perbarui konten publik per halaman."
            href="/dashboard/content"
            title="Manajemen konten"
          />
          <DashboardLinkCard
            badge="Assets"
            description="Kelola asset visual yang digunakan di situs publik."
            href="/dashboard/assets"
            title="Manajemen asset"
          />
          <DashboardLinkCard
            badge="Users"
            description="Kelola akun CMS, role, dan hak akses."
            href="/dashboard/users"
            title="Manajemen pengguna"
          />
        </div>
      </DashboardPanel>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardPanel>
          <DashboardPanelHeader
            description="Status ringkas untuk area yang perlu ditinjau."
            title="Status Operasional"
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              {
                icon: FileText,
                title: "Laporan",
                description:
                  draftReports > 0
                    ? `${draftReports} draft menunggu review atau publikasi.`
                    : "Seluruh laporan saat ini sudah dipublikasikan.",
              },
              {
                icon: PencilRuler,
                title: "Copy Publik",
                description:
                  "Konten publik dikelola per halaman untuk menjaga konteks edit.",
              },
              {
                icon: Images,
                title: "Assets",
                description:
                  "Logo, hero, dan visual utama dikelola dari satu halaman asset.",
              },
              {
                icon: Users,
                title: "Akses Tim",
                description:
                  "Pastikan hak akses sesuai peran masing-masing pengguna.",
              },
            ].map((item) => (
              <div
                className="border-brand-sand/70 bg-brand-surface rounded-[1.5rem] border p-5"
                key={item.title}
              >
                <item.icon className="text-brand-maroon h-5 w-5" />
                <h3 className="font-epilogue text-brand-ink mt-4 text-lg font-bold">
                  {item.title}
                </h3>
                <p className="text-brand-body mt-2 text-sm leading-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel className="bg-brand-wine text-white">
          <DashboardPanelHeader
            description="Struktur administrasi dirancang agar operasional lebih konsisten dan mudah dirawat."
            tone="inverse"
            title="Prinsip Pengelolaan"
          />
          <div className="mt-5 space-y-4 text-sm leading-7 text-white/85">
            <p>Form laporan dipusatkan pada field yang relevan untuk editor.</p>
            <p>
              Konten situs dipisah per halaman agar perubahan lebih terkontrol.
            </p>
            <p>
              Asset dan akses pengguna dikelola dari modul terpisah dengan alur
              yang lebih jelas.
            </p>
          </div>
        </DashboardPanel>
      </section>
    </AdminShell>
  );
}
