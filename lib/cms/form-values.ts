import type {
  PageContent,
  PageContentKey,
  ReportRecord,
  SiteSettings,
} from "@/lib/data/types";

import {
  getFieldsFromSections,
  getSocialFieldName,
  pageContentSections,
  reportEditorSections,
  siteSettingsSections,
} from "@/lib/cms/config";

function parseMultiline(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readText(
  formData: FormData,
  key: string,
  fallback: string,
  multiline = false,
) {
  const value = formData.get(key);

  if (value === null) {
    return fallback;
  }

  const normalized = String(value);

  if (!multiline) {
    return normalized;
  }

  return normalized;
}

function applyFieldSections<T extends object>(
  sections: readonly { fields: readonly { key: string; kind: string }[] }[],
  formData: FormData,
  currentValue: T,
) {
  const nextValue = { ...currentValue } as T;
  const nextValueRecord = nextValue as Record<string, unknown>;
  const currentValueRecord = currentValue as Record<string, unknown>;

  for (const field of sections.flatMap((section) => section.fields)) {
    if (field.kind === "checkbox") {
      nextValueRecord[field.key] = formData.get(String(field.key)) === "on";
      continue;
    }

    if (field.kind === "multiline") {
      nextValueRecord[field.key] = parseMultiline(
        formData.get(String(field.key)),
      );
      continue;
    }

    nextValueRecord[field.key] = readText(
      formData,
      String(field.key),
      String(currentValueRecord[field.key] ?? ""),
      field.kind === "textarea",
    );
  }

  return nextValue;
}

export function buildSettingsFromForm(
  formData: FormData,
  currentValue: SiteSettings,
) {
  const nextSettings = applyFieldSections(
    siteSettingsSections,
    formData,
    currentValue,
  );

  nextSettings.socialLinks = currentValue.socialLinks.map((link) => ({
    ...link,
    label: readText(
      formData,
      getSocialFieldName(link.platform, "label"),
      link.label,
    ),
    href: readText(
      formData,
      getSocialFieldName(link.platform, "href"),
      link.href,
    ),
    handle: readText(
      formData,
      getSocialFieldName(link.platform, "handle"),
      link.handle,
    ),
  }));

  return nextSettings;
}

export function buildPageContentFromForm<Key extends PageContentKey>(
  key: Key,
  formData: FormData,
  currentValue: PageContent<Key>,
) {
  switch (key) {
    case "home":
      return applyFieldSections(
        pageContentSections.home,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    case "about":
      return applyFieldSections(
        pageContentSections.about,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    case "reports":
      return applyFieldSections(
        pageContentSections.reports,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    case "contact":
      return applyFieldSections(
        pageContentSections.contact,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    default:
      return currentValue;
  }
}

export function buildReportInputFromForm(
  formData: FormData,
  currentValue?: ReportRecord,
) {
  const baseValue = applyFieldSections(reportEditorSections, formData, {
    id: currentValue?.id ?? "",
    slug: currentValue?.slug ?? "",
    title: currentValue?.title ?? "",
    excerpt: currentValue?.excerpt ?? "",
    category: currentValue?.category ?? "",
    categoryLabel: currentValue?.categoryLabel ?? "",
    coverImageSrc: currentValue?.coverImageSrc ?? "",
    publishedAt: currentValue?.publishedAt ?? "",
    year: currentValue?.year ?? "",
    periodLabel: currentValue?.periodLabel ?? "",
    editionLabel: currentValue?.editionLabel ?? "",
    author: currentValue?.author ?? "",
    status: currentValue?.status ?? "draft",
    featured: currentValue?.featured ?? false,
    summaryLabel: currentValue?.summaryLabel ?? "",
    bodyHtml: currentValue?.bodyHtml ?? "",
    relatedSlugs: currentValue?.relatedSlugs ?? [],
  } satisfies ReportRecord);

  const id = String(formData.get("id") ?? "").trim();

  return {
    ...(id ? { id } : {}),
    title: String(baseValue.title),
    slug: String(baseValue.slug),
    excerpt: String(baseValue.excerpt),
    category: String(baseValue.category),
    categoryLabel: String(baseValue.categoryLabel),
    coverImageSrc: String(baseValue.coverImageSrc),
    publishedAt: String(baseValue.publishedAt),
    year: String(baseValue.year),
    periodLabel: String(baseValue.periodLabel),
    editionLabel: String(baseValue.editionLabel),
    author: String(baseValue.author),
    status: baseValue.status as ReportRecord["status"],
    featured: Boolean(baseValue.featured),
    relatedSlugs: Array.isArray(baseValue.relatedSlugs)
      ? baseValue.relatedSlugs.map((slug) => String(slug))
      : [],
    bodyHtml: String(baseValue.bodyHtml),
  };
}

export function getSeedCoverageSnapshot() {
  return {
    settings: getFieldsFromSections(siteSettingsSections).map((field) =>
      String(field.key),
    ),
    pages: {
      home: getFieldsFromSections(pageContentSections.home).map((field) =>
        String(field.key),
      ),
      about: getFieldsFromSections(pageContentSections.about).map((field) =>
        String(field.key),
      ),
      reports: getFieldsFromSections(pageContentSections.reports).map((field) =>
        String(field.key),
      ),
      contact: getFieldsFromSections(pageContentSections.contact).map((field) =>
        String(field.key),
      ),
    },
    reports: getFieldsFromSections(reportEditorSections).map((field) =>
      String(field.key),
    ),
  };
}
