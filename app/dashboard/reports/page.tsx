import { AdminShell } from "@/components/dashboard/admin-shell";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  reportEditorSections,
  type CmsFieldDefinition,
} from "@/lib/cms/config";
import { deleteReportAction, saveReportAction } from "@/lib/actions/admin";
import { requireReportsSession } from "@/lib/auth/session";
import type { ReportRecord } from "@/lib/data/types";
import { getStore } from "@/lib/repositories/content-repository";

interface DashboardReportsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardReportsPage({
  searchParams,
}: DashboardReportsPageProps) {
  const session = await requireReportsSession();
  const params = await searchParams;
  const store = await getStore();
  const creatingNew = params.new === "1";
  const selectedSlug =
    typeof params.report === "string" ? params.report : store.reports[0]?.slug;
  const selectedReport = creatingNew
    ? undefined
    : (store.reports.find((report) => report.slug === selectedSlug) ??
      store.reports[0]);
  const metadataFields = reportEditorSections[0].fields.filter(
    (field) => field.key !== "status" && field.key !== "featured",
  );
  const contentFields = reportEditorSections[1].fields.filter(
    (field) => field.key !== "bodyHtml" && field.key !== "coverImageSrc",
  );

  return (
    <AdminShell pathname="/dashboard/reports" session={session}>
      <section className="grid gap-6 xl:grid-cols-[0.9fr,1.3fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
              Laporan
            </h2>
            <a href="/dashboard/reports?new=1">
              <Button size="sm" type="button">
                Report Baru
              </Button>
            </a>
          </div>

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
          <form action={saveReportAction} className="mt-6 space-y-6">
            <input name="id" type="hidden" value={selectedReport?.id ?? ""} />

            <ReportFieldGrid
              fields={metadataFields}
              report={selectedReport}
              title={reportEditorSections[0].title}
            />

            <div className="grid gap-5 md:grid-cols-2">
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

              <label className="bg-brand-shell font-manrope text-brand-ink flex items-center gap-3 rounded-2xl px-4 py-3 text-sm md:self-end">
                <input
                  defaultChecked={selectedReport?.featured}
                  name="featured"
                  type="checkbox"
                />
                Jadikan featured report
              </label>
            </div>

            <ReportFieldGrid
              fields={contentFields}
              report={selectedReport}
              title={reportEditorSections[1].title}
            />

            <div className="border-brand-stroke/20 space-y-4 rounded-[1.75rem] border p-5">
              <div className="space-y-2">
                <h3 className="font-epilogue text-brand-ink text-lg font-bold">
                  Preview Image
                </h3>
                <p className="font-manrope text-brand-body text-sm leading-7">
                  Gambar ini dipakai untuk card, archive, dan daftar laporan.
                  Semua gambar di dalam isi report dimasukkan langsung dari
                  toolbar editor di bawah.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr,18rem]">
                <div className="space-y-5">
                  <label className="space-y-2">
                    <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                      Preview image URL
                    </span>
                    <input
                      className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
                      defaultValue={selectedReport?.coverImageSrc ?? ""}
                      name="coverImageSrc"
                      type="text"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                      Upload preview image
                    </span>
                    <input
                      className="border-brand-stroke/20 font-manrope block w-full rounded-2xl border px-4 py-3 text-sm"
                      name="coverImageFile"
                      type="file"
                    />
                  </label>
                </div>

                <div className="bg-brand-shell overflow-hidden rounded-[1.5rem] p-4">
                  {selectedReport?.coverImageSrc ? (
                    <img
                      alt={`${selectedReport.title} preview`}
                      className="h-52 w-full object-cover"
                      src={selectedReport.coverImageSrc}
                    />
                  ) : (
                    <div className="text-brand-body flex h-52 items-center justify-center text-sm">
                      Preview image belum diisi
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                Body Content
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
              <Button type="submit">
                {selectedReport ? "Simpan Laporan" : "Buat Laporan"}
              </Button>
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

function ReportFieldGrid({
  title,
  fields,
  report,
}: {
  title: string;
  fields: readonly CmsFieldDefinition<ReportRecord>[];
  report: ReportRecord | undefined;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-epilogue text-brand-ink text-lg font-bold">
        {title}
      </h3>
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <ReportField field={field} key={String(field.key)} report={report} />
        ))}
      </div>
    </div>
  );
}

function ReportField({
  field,
  report,
}: {
  field: CmsFieldDefinition<ReportRecord>;
  report: ReportRecord | undefined;
}) {
  const value = report?.[field.key];

  if (field.kind === "textarea" || field.kind === "multiline") {
    return (
      <label className="space-y-2 md:col-span-2">
        <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
          {field.label}
        </span>
        <textarea
          className="border-brand-stroke/20 font-manrope min-h-28 w-full rounded-3xl border px-4 py-4 text-sm"
          defaultValue={
            Array.isArray(value) ? value.join("\n") : String(value ?? "")
          }
          name={String(field.key)}
        />
      </label>
    );
  }

  return (
    <label className="space-y-2">
      <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
        {field.label}
      </span>
      <input
        className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
        defaultValue={String(value ?? "")}
        name={String(field.key)}
        type="text"
      />
    </label>
  );
}
