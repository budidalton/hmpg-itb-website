import { AdminShell } from "@/components/dashboard/admin-shell";
import { Button } from "@/components/ui/button";
import {
  cmsSocialPlatforms,
  getSocialFieldName,
  pageContentSections,
  siteSettingsSections,
  type CmsFieldDefinition,
} from "@/lib/cms/config";
import {
  saveAboutContentAction,
  saveContactContentAction,
  saveHomeContentAction,
  saveReportsContentAction,
  saveSettingsAction,
} from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore } from "@/lib/repositories/content-repository";

export default async function DashboardContentPage() {
  const session = await requireAdminSession();
  const store = await getStore();

  return (
    <AdminShell pathname="/dashboard/content" session={session}>
      <SectionCard
        action={saveSettingsAction}
        description="Kelola identitas singkat organisasi, kontak utama, footer, dan tautan sosial yang tampil di website publik."
        title="Global Settings"
      >
        {siteSettingsSections.map((section) => (
          <SectionFields
            fields={section.fields}
            key={section.title}
            title={section.title}
            value={store.settings}
          />
        ))}

        <div className="space-y-4">
          <div>
            <h3 className="font-epilogue text-brand-ink text-lg font-bold">
              Social Links
            </h3>
            <p className="font-manrope text-brand-body mt-2 text-sm leading-7">
              Setiap platform mengikuti struktur yang dipakai footer dan halaman
              Contact Us.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {cmsSocialPlatforms.map((platformDef) => {
              const currentLink = store.settings.socialLinks.find(
                (link) => link.platform === platformDef.platform,
              );

              if (!currentLink) {
                return null;
              }

              return (
                <div
                  className="border-brand-stroke/20 space-y-4 rounded-3xl border p-4"
                  key={platformDef.platform}
                >
                  <p className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
                    {platformDef.label}
                  </p>
                  <Field
                    label="Label"
                    name={getSocialFieldName(platformDef.platform, "label")}
                    value={currentLink.label}
                  />
                  <Field
                    label="URL"
                    name={getSocialFieldName(platformDef.platform, "href")}
                    value={currentLink.href}
                  />
                  <Field
                    label="Handle"
                    name={getSocialFieldName(platformDef.platform, "handle")}
                    value={currentLink.handle}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        action={saveHomeContentAction}
        description="Edit hero copy, ringkasan utama, dan heading section report di beranda."
        title="Home Page"
      >
        {pageContentSections.home.map((section) => (
          <SectionFields
            fields={section.fields}
            key={section.title}
            title={section.title}
            value={store.pages.home}
          />
        ))}
      </SectionCard>

      <SectionCard
        action={saveAboutContentAction}
        description="Edit struktur konten, narasi periodik, dan visual utama halaman Tentang Kami."
        title="About Page"
      >
        {pageContentSections.about.map((section) => (
          <SectionFields
            fields={section.fields}
            key={section.title}
            title={section.title}
            value={store.pages.about}
          />
        ))}
      </SectionCard>

      <SectionCard
        action={saveReportsContentAction}
        description="Atur hero, archive banner, featured report, dan heading section laporan."
        title="Reports Page"
      >
        {pageContentSections.reports.map((section) => (
          <SectionFields
            fields={section.fields}
            key={section.title}
            title={section.title}
            value={store.pages.reports}
          />
        ))}
      </SectionCard>

      <SectionCard
        action={saveContactContentAction}
        description="Kelola headline, detail sekretariat, section sosial, dan showcase visual halaman kontak."
        title="Contact Page"
      >
        {pageContentSections.contact.map((section) => (
          <SectionFields
            fields={section.fields}
            key={section.title}
            title={section.title}
            value={store.pages.contact}
          />
        ))}
      </SectionCard>
    </AdminShell>
  );
}

function SectionCard({
  action,
  title,
  description,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
      <h2 className="font-epilogue text-brand-ink text-2xl font-bold">
        {title}
      </h2>
      <p className="font-manrope text-brand-body mt-3 max-w-3xl text-sm leading-7">
        {description}
      </p>
      <form action={action} className="mt-6 space-y-6">
        {children}
        <Button type="submit">Simpan</Button>
      </form>
    </section>
  );
}

function SectionFields<T extends object>({
  title,
  fields,
  value,
}: {
  title: string;
  fields: readonly CmsFieldDefinition<T>[];
  value: T;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-epilogue text-brand-ink text-lg font-bold">
          {title}
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <FieldByType field={field} key={String(field.key)} value={value} />
        ))}
      </div>
    </div>
  );
}

function FieldByType<T extends object>({
  field,
  value,
}: {
  field: CmsFieldDefinition<T>;
  value: T;
}) {
  const fieldValue = value[field.key];
  const name = String(field.key);

  if (field.kind === "multiline" || field.kind === "textarea") {
    return (
      <div
        className={
          field.kind === "textarea" ? "md:col-span-2" : "md:col-span-2"
        }
      >
        <TextareaField
          label={field.label}
          name={name}
          value={
            Array.isArray(fieldValue)
              ? fieldValue.join("\n")
              : String(fieldValue ?? "")
          }
        />
      </div>
    );
  }

  return (
    <Field label={field.label} name={name} value={String(fieldValue ?? "")} />
  );
}

function Field({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
        {label}
      </span>
      <input
        className="border-brand-stroke/20 font-manrope h-12 w-full rounded-2xl border px-4 text-sm"
        defaultValue={value}
        name={name}
        type="text"
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
        {label}
      </span>
      <textarea
        className="border-brand-stroke/20 font-manrope min-h-28 w-full rounded-3xl border px-4 py-4 text-sm"
        defaultValue={value}
        name={name}
      />
    </label>
  );
}
