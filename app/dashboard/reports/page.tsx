import { AdminShell } from "@/components/dashboard/admin-shell";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { Button } from "@/components/ui/button";
import { deleteReportAction, saveReportAction } from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore } from "@/lib/repositories/content-repository";

interface DashboardReportsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardReportsPage({
  searchParams,
}: DashboardReportsPageProps) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const store = await getStore();
  const selectedSlug =
    typeof params.report === "string" ? params.report : store.reports[0]?.slug;
  const selectedReport =
    store.reports.find((report) => report.slug === selectedSlug) ??
    store.reports[0];

  return (
    <AdminShell pathname="/dashboard/reports" session={session}>
      <section className="grid gap-6 xl:grid-cols-[0.9fr,1.3fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
            Laporan
          </h2>
          <div className="mt-6 space-y-4">
            {store.reports.map((report) => (
              <a
                className={`block rounded-3xl border px-5 py-4 ${
                  report.id === selectedReport?.id
                    ? "border-brand-maroon bg-brand-shell"
                    : "border-brand-stroke/20"
                }`}
                href={`/dashboard/reports?report=${report.slug}`}
                key={report.id}
              >
                <p className="font-manrope text-brand-maroon text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  {report.categoryLabel}
                </p>
                <h3 className="font-epilogue text-brand-ink mt-2 text-lg font-bold">
                  {report.title}
                </h3>
                <p className="font-manrope text-brand-body mt-2 text-sm">
                  {report.status}
                </p>
              </a>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
            {selectedReport ? "Edit laporan" : "Buat laporan baru"}
          </h2>
          <form action={saveReportAction} className="mt-6 space-y-5">
            <input name="id" type="hidden" value={selectedReport?.id ?? ""} />
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                defaultValue={selectedReport?.title}
                label="Title"
                name="title"
              />
              <FormField
                defaultValue={selectedReport?.slug}
                label="Slug"
                name="slug"
              />
              <FormField
                defaultValue={selectedReport?.category}
                label="Category key"
                name="category"
              />
              <FormField
                defaultValue={selectedReport?.categoryLabel}
                label="Category label"
                name="categoryLabel"
              />
              <FormField
                defaultValue={selectedReport?.editionLabel}
                label="Edition label"
                name="editionLabel"
              />
              <FormField
                defaultValue={selectedReport?.periodLabel}
                label="Period label"
                name="periodLabel"
              />
              <FormField
                defaultValue={selectedReport?.year}
                label="Year"
                name="year"
              />
              <FormField
                defaultValue={selectedReport?.author}
                label="Author"
                name="author"
              />
              <FormField
                defaultValue={selectedReport?.publishedAt}
                label="Published at"
                name="publishedAt"
              />
              <label className="space-y-2">
                <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                  Status
                </span>
                <select
                  className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
                  defaultValue={selectedReport?.status ?? "draft"}
                  name="status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Excerpt
              </span>
              <textarea
                className="border-brand-stroke/20 font-manrope min-h-28 w-full rounded-3xl border px-4 py-4 text-sm"
                defaultValue={selectedReport?.excerpt ?? ""}
                name="excerpt"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                defaultValue={selectedReport?.coverImageSrc}
                label="Cover image URL"
                name="coverImageSrc"
              />
              <label className="space-y-2">
                <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                  Upload cover image
                </span>
                <input
                  className="border-brand-stroke/20 font-manrope block w-full rounded-2xl border px-4 py-3 text-sm"
                  name="coverImageFile"
                  type="file"
                />
              </label>
            </div>

            <FormField
              defaultValue={selectedReport?.coverCaption}
              label="Cover caption"
              name="coverCaption"
            />

            <label className="bg-brand-shell font-manrope text-brand-ink flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
              <input
                defaultChecked={selectedReport?.featured}
                name="featured"
                type="checkbox"
              />
              Jadikan featured report
            </label>

            <label className="block space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Related slugs
              </span>
              <textarea
                className="border-brand-stroke/20 font-manrope min-h-24 w-full rounded-3xl border px-4 py-4 text-sm"
                defaultValue={selectedReport?.relatedSlugs.join("\n") ?? ""}
                name="relatedSlugs"
              />
            </label>

            <div className="space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Body HTML
              </span>
              <RichTextEditor
                initialValue={
                  selectedReport?.bodyHtml ??
                  "<section><h2>Draft</h2><p>Mulai isi laporan di sini.</p></section>"
                }
                name="bodyHtml"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Simpan Laporan</Button>
            </div>
          </form>

          {selectedReport ? (
            <form action={deleteReportAction} className="mt-4">
              <input name="id" type="hidden" value={selectedReport.id} />
              <Button type="submit" variant="outline">
                Hapus Laporan
              </Button>
            </form>
          ) : null}
        </article>
      </section>
    </AdminShell>
  );
}

function FormField({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string | undefined;
  label: string;
  name: string;
}) {
  return (
    <label className="space-y-2">
      <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
        {label}
      </span>
      <input
        className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
        defaultValue={defaultValue ?? ""}
        name={name}
        type="text"
      />
    </label>
  );
}
