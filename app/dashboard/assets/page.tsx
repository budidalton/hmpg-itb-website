import { AdminShell } from "@/components/dashboard/admin-shell";
import { Button } from "@/components/ui/button";
import { uploadCmsAssetAction } from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { reportAssetSlots, siteAssetSlots } from "@/lib/cms/config";
import { getStore } from "@/lib/repositories/content-repository";

interface DashboardAssetsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardAssetsPage({
  searchParams,
}: DashboardAssetsPageProps) {
  const session = await requireAdminSession();
  const store = await getStore();
  const params = await searchParams;
  const selectedReportSlug =
    typeof params.report === "string" ? params.report : store.reports[0]?.slug;
  const selectedReport =
    store.reports.find((report) => report.slug === selectedReportSlug) ??
    store.reports[0];

  return (
    <AdminShell pathname="/dashboard/assets" session={session}>
      <section className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <h1 className="font-epilogue text-brand-ink text-3xl font-bold">
          Assets
        </h1>
        <p className="font-manrope text-brand-body mt-4 max-w-3xl text-sm leading-7">
          Kelola media utama yang memang dipakai public site. Decorative assets
          seperti tekstur, badge, dan icon tetap dikunci di codebase.
        </p>

        <div className="mt-8 space-y-10">
          <div className="space-y-4">
            <div>
              <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
                Brand & Page Media
              </h2>
              <p className="font-manrope text-brand-body mt-2 text-sm leading-7">
                Upload logo dan gambar utama yang dipakai langsung di halaman
                publik.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {siteAssetSlots.map((slot) => {
                const currentSrc = getSiteAssetSrc(store, slot);

                return (
                  <AssetCard
                    currentSrc={String(currentSrc ?? "")}
                    description={slot.description}
                    folder={slot.folder}
                    key={slot.id}
                    label={slot.label}
                    targetKey={slot.targetKey}
                    targetType={slot.targetType}
                    {...(slot.targetType === "page"
                      ? { pageKey: slot.pageKey }
                      : {})}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
                  Report Media
                </h2>
                <p className="font-manrope text-brand-body mt-2 text-sm leading-7">
                  Kelola cover image dan card image report tanpa harus masuk ke
                  editor konten.
                </p>
              </div>

              {selectedReport ? (
                <div className="flex flex-wrap gap-3">
                  {store.reports.map((report) => (
                    <a
                      className={`rounded-full border px-4 py-2 text-xs font-bold uppercase transition ${
                        report.id === selectedReport.id
                          ? "border-brand-maroon bg-brand-maroon text-white"
                          : "border-brand-stroke/20 text-brand-body hover:border-brand-maroon hover:text-brand-maroon"
                      }`}
                      href={`/dashboard/assets?report=${report.slug}`}
                      key={report.id}
                    >
                      {report.title}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            {selectedReport ? (
              <div className="grid gap-6 xl:grid-cols-2">
                {reportAssetSlots.map((slot) => (
                  <AssetCard
                    currentSrc={String(selectedReport[slot.key] ?? "")}
                    description={`${slot.description} Report aktif: ${selectedReport.title}`}
                    folder={slot.folder}
                    key={slot.key}
                    label={slot.label}
                    reportId={selectedReport.id}
                    targetKey={slot.key}
                    targetType="report"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}

function getSiteAssetSrc(
  store: Awaited<ReturnType<typeof getStore>>,
  slot: (typeof siteAssetSlots)[number],
) {
  if (slot.targetType === "settings") {
    return store.settings[slot.targetKey];
  }

  switch (slot.pageKey) {
    case "home":
      return store.pages.home[slot.targetKey];
    case "about":
      return store.pages.about[slot.targetKey];
    case "reports":
      return store.pages.reports[slot.targetKey];
    case "contact":
      return store.pages.contact[slot.targetKey];
    default:
      return "";
  }
}

function AssetCard({
  label,
  description,
  currentSrc,
  targetType,
  targetKey,
  folder,
  pageKey,
  reportId,
}: {
  label: string;
  description: string;
  currentSrc: string;
  targetType: "settings" | "page" | "report";
  targetKey: string;
  folder: string;
  pageKey?: string;
  reportId?: string;
}) {
  return (
    <div className="border-brand-stroke/20 grid gap-6 rounded-[2rem] border p-6 lg:grid-cols-[14rem,1fr]">
      <div className="bg-brand-shell overflow-hidden rounded-[1.5rem] p-4">
        {currentSrc ? (
          <img
            alt={label}
            className="h-52 w-full object-contain"
            src={currentSrc}
          />
        ) : (
          <div className="text-brand-body flex h-52 items-center justify-center text-sm">
            Belum ada asset
          </div>
        )}
      </div>

      <form action={uploadCmsAssetAction} className="space-y-4">
        <input name="folder" type="hidden" value={folder} />
        <input name="targetType" type="hidden" value={targetType} />
        <input name="targetKey" type="hidden" value={targetKey} />
        {pageKey ? (
          <input name="pageKey" type="hidden" value={pageKey} />
        ) : null}
        {reportId ? (
          <input name="reportId" type="hidden" value={reportId} />
        ) : null}

        <div>
          <h3 className="font-epilogue text-brand-ink text-xl font-bold">
            {label}
          </h3>
          <p className="font-manrope text-brand-body mt-2 text-sm leading-7">
            {description}
          </p>
        </div>

        <label className="block space-y-2">
          <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
            Upload file
          </span>
          <input
            className="border-brand-stroke/20 font-manrope block w-full rounded-2xl border px-4 py-3 text-sm"
            name="assetFile"
            required
            type="file"
          />
        </label>

        <Button type="submit">Upload Asset</Button>
      </form>
    </div>
  );
}
