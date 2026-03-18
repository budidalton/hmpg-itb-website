import { AdminShell } from "@/components/dashboard/admin-shell";
import { Button } from "@/components/ui/button";
import {
  saveAboutContentAction,
  saveActivitiesAction,
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
        description="Kelola data kontak utama, alamat footer, dan tautan Drive Akademik."
        title="Global Settings"
      >
        <Field label="Email" name="email" value={store.settings.email} />
        <Field label="Phone" name="phone" value={store.settings.phone} />
        <Field
          label="Drive Akademik URL"
          name="driveAkademikUrl"
          value={store.settings.driveAkademikUrl}
        />
        <TextareaField
          label="Address lines"
          name="addressLines"
          value={store.settings.addressLines.join("\n")}
        />
        <TextareaField
          label="Footer address lines"
          name="footerAddressLines"
          value={store.settings.footerAddressLines.join("\n")}
        />
      </SectionCard>

      <SectionCard
        action={saveHomeContentAction}
        description="Edit hero copy dan ringkasan utama halaman beranda."
        title="Home Page"
      >
        <Field
          label="Hero eyebrow"
          name="heroEyebrow"
          value={store.pages.home.heroEyebrow}
        />
        <Field
          label="Hero title line 1"
          name="heroTitleLine1"
          value={store.pages.home.heroTitleLine1}
        />
        <Field
          label="Hero title line 2"
          name="heroTitleLine2"
          value={store.pages.home.heroTitleLine2}
        />
        <TextareaField
          label="Hero description"
          name="heroDescription"
          value={store.pages.home.heroDescription}
        />
        <Field
          label="Hero CTA label"
          name="heroCtaLabel"
          value={store.pages.home.heroCtaLabel}
        />
        <Field
          label="Hero image URL"
          name="heroImageSrc"
          value={store.pages.home.heroImageSrc}
        />
        <Field
          label="Summary texture URL"
          name="summaryTextureSrc"
          value={store.pages.home.summaryTextureSrc}
        />
        <TextareaField
          label="Summary paragraphs"
          name="summaryParagraphs"
          value={store.pages.home.summaryParagraphs.join("\n")}
        />
      </SectionCard>

      <SectionCard
        action={saveActivitiesAction}
        description="Kelola tiga highlight utama pada beranda."
        title="Activity Highlights"
      >
        {store.activities.map((activity) => (
          <div
            className="border-brand-stroke/20 space-y-3 rounded-3xl border p-4"
            key={activity.id}
          >
            <input name="activityId" type="hidden" value={activity.id} />
            <input
              name="activityVariant"
              type="hidden"
              value={activity.variant}
            />
            <Field
              label="Category"
              name="activityCategory"
              value={activity.category}
            />
            <Field label="Title" name="activityTitle" value={activity.title} />
            <TextareaField
              label="Description"
              name="activityDescription"
              value={activity.description}
            />
            <Field
              label="Image URL"
              name="activityImageSrc"
              value={activity.imageSrc}
            />
            <Field
              label="Badge"
              name="activityBadge"
              value={activity.badge ?? ""}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard
        action={saveAboutContentAction}
        description="Edit struktur konten dan narasi halaman Tentang Kami."
        title="About Page"
      >
        <Field
          label="Hero title"
          name="heroTitle"
          value={store.pages.about.heroTitle}
        />
        <TextareaField
          label="Hero description"
          name="heroDescription"
          value={store.pages.about.heroDescription}
        />
        <Field
          label="History eyebrow"
          name="historyEyebrow"
          value={store.pages.about.historyEyebrow}
        />
        <Field
          label="History title"
          name="historyTitle"
          value={store.pages.about.historyTitle}
        />
        <TextareaField
          label="History paragraphs"
          name="historyParagraphs"
          value={store.pages.about.historyParagraphs.join("\n")}
        />
        <TextareaField
          label="Vision"
          name="vision"
          value={store.pages.about.vision}
        />
        <TextareaField
          label="Missions"
          name="missions"
          value={store.pages.about.missions.join("\n")}
        />
        <TextareaField
          label="Values"
          name="values"
          value={store.pages.about.values.join("\n")}
        />
        <Field
          label="Logo meaning title"
          name="logoMeaningTitle"
          value={store.pages.about.logoMeaningTitle}
        />
        <TextareaField
          label="Logo meaning description"
          name="logoMeaningDescription"
          value={store.pages.about.logoMeaningDescription}
        />
        <Field
          label="Hero image URL"
          name="heroImageSrc"
          value={store.pages.about.heroImageSrc}
        />
        <Field
          label="History image URL"
          name="historyImageSrc"
          value={store.pages.about.historyImageSrc}
        />
        <Field
          label="Logo image URL"
          name="logoShowcaseSrc"
          value={store.pages.about.logoShowcaseSrc}
        />
        <Field
          label="Identity texture URL"
          name="identityTextureSrc"
          value={store.pages.about.identityTextureSrc}
        />
      </SectionCard>

      <SectionCard
        action={saveReportsContentAction}
        description="Atur hero, banner Drive Akademik, dan featured report di halaman reports."
        title="Reports Page"
      >
        <Field
          label="Hero title"
          name="heroTitle"
          value={store.pages.reports.heroTitle}
        />
        <TextareaField
          label="Hero description"
          name="heroDescription"
          value={store.pages.reports.heroDescription}
        />
        <Field
          label="Hero image URL"
          name="heroImageSrc"
          value={store.pages.reports.heroImageSrc}
        />
        <Field
          label="Drive title"
          name="driveTitle"
          value={store.pages.reports.driveTitle}
        />
        <TextareaField
          label="Drive description"
          name="driveDescription"
          value={store.pages.reports.driveDescription}
        />
        <Field
          label="Drive CTA label"
          name="driveCtaLabel"
          value={store.pages.reports.driveCtaLabel}
        />
        <Field
          label="Featured report slug"
          name="featuredReportSlug"
          value={store.pages.reports.featuredReportSlug}
        />
      </SectionCard>

      <SectionCard
        action={saveContactContentAction}
        description="Kelola headline, detail sekretariat, dan showcase visual kontak."
        title="Contact Page"
      >
        <Field
          label="Hero eyebrow"
          name="heroEyebrow"
          value={store.pages.contact.heroEyebrow}
        />
        <Field
          label="Hero title"
          name="heroTitle"
          value={store.pages.contact.heroTitle}
        />
        <TextareaField
          label="Hero description"
          name="heroDescription"
          value={store.pages.contact.heroDescription}
        />
        <Field
          label="Office title"
          name="officeTitle"
          value={store.pages.contact.officeTitle}
        />
        <TextareaField
          label="Office address"
          name="officeAddress"
          value={store.pages.contact.officeAddress}
        />
        <Field
          label="Showcase image URL"
          name="showcaseImageSrc"
          value={store.pages.contact.showcaseImageSrc}
        />
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
      <form action={action} className="mt-6 space-y-4">
        {children}
        <Button type="submit">Simpan</Button>
      </form>
    </section>
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
