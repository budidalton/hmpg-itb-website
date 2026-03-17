"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";

import type {
  AboutPageContent,
  ActivityHighlight,
  ContactPageContent,
  HomePageContent,
  ReportsPageContent,
  SiteSettings,
} from "@/lib/data/types";
import {
  deleteReport,
  getStore,
  saveActivities,
  savePageContent,
  saveReport,
  saveSettings,
  uploadAsset,
} from "@/lib/repositories/content-repository";

function parseMultiline(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveSettingsAction(formData: FormData) {
  const store = await getStore();
  const nextSettings: SiteSettings = {
    ...store.settings,
    email: String(formData.get("email") ?? store.settings.email),
    phone: String(formData.get("phone") ?? store.settings.phone),
    driveAkademikUrl: String(
      formData.get("driveAkademikUrl") ?? store.settings.driveAkademikUrl,
    ),
    addressLines: parseMultiline(formData.get("addressLines")),
    footerAddressLines: parseMultiline(formData.get("footerAddressLines")),
  };

  await saveSettings(nextSettings);
  revalidatePath("/", "layout");
}

export async function saveHomeContentAction(formData: FormData) {
  const store = await getStore();
  const nextHome: HomePageContent = {
    ...store.pages.home,
    heroEyebrow: String(
      formData.get("heroEyebrow") ?? store.pages.home.heroEyebrow,
    ),
    heroTitleLine1: String(
      formData.get("heroTitleLine1") ?? store.pages.home.heroTitleLine1,
    ),
    heroTitleLine2: String(
      formData.get("heroTitleLine2") ?? store.pages.home.heroTitleLine2,
    ),
    heroDescription: String(
      formData.get("heroDescription") ?? store.pages.home.heroDescription,
    ),
    heroCtaLabel: String(
      formData.get("heroCtaLabel") ?? store.pages.home.heroCtaLabel,
    ),
    heroImageSrc: String(
      formData.get("heroImageSrc") ?? store.pages.home.heroImageSrc,
    ),
    summaryTextureSrc: String(
      formData.get("summaryTextureSrc") ?? store.pages.home.summaryTextureSrc,
    ),
    summaryParagraphs: parseMultiline(formData.get("summaryParagraphs")),
  };

  await savePageContent("home", nextHome);
  revalidatePath("/");
}

export async function saveActivitiesAction(formData: FormData) {
  const ids = formData.getAll("activityId");
  const categories = formData.getAll("activityCategory");
  const titles = formData.getAll("activityTitle");
  const descriptions = formData.getAll("activityDescription");
  const imageSrcs = formData.getAll("activityImageSrc");
  const variants = formData.getAll("activityVariant");
  const badges = formData.getAll("activityBadge");

  const activities: ActivityHighlight[] = ids.map((id, index) => {
    const badge = String(badges[index] ?? "").trim();

    return {
      id: String(id),
      category: String(categories[index] ?? ""),
      title: String(titles[index] ?? ""),
      description: String(descriptions[index] ?? ""),
      imageSrc: String(imageSrcs[index] ?? ""),
      variant: (variants[index] as ActivityHighlight["variant"]) ?? "feature",
      ...(badge ? { badge } : {}),
    };
  });

  await saveActivities(activities);
  revalidatePath("/");
}

export async function saveAboutContentAction(formData: FormData) {
  const store = await getStore();
  const nextAbout: AboutPageContent = {
    ...store.pages.about,
    heroTitle: String(formData.get("heroTitle") ?? store.pages.about.heroTitle),
    heroDescription: String(
      formData.get("heroDescription") ?? store.pages.about.heroDescription,
    ),
    historyEyebrow: String(
      formData.get("historyEyebrow") ?? store.pages.about.historyEyebrow,
    ),
    historyTitle: String(
      formData.get("historyTitle") ?? store.pages.about.historyTitle,
    ),
    historyParagraphs: parseMultiline(formData.get("historyParagraphs")),
    vision: String(formData.get("vision") ?? store.pages.about.vision),
    missions: parseMultiline(formData.get("missions")),
    values: parseMultiline(formData.get("values")),
    motto: String(formData.get("motto") ?? store.pages.about.motto),
    logoMeaningTitle: String(
      formData.get("logoMeaningTitle") ?? store.pages.about.logoMeaningTitle,
    ),
    logoMeaningDescription: String(
      formData.get("logoMeaningDescription") ??
        store.pages.about.logoMeaningDescription,
    ),
    heroImageSrc: String(
      formData.get("heroImageSrc") ?? store.pages.about.heroImageSrc,
    ),
    historyImageSrc: String(
      formData.get("historyImageSrc") ?? store.pages.about.historyImageSrc,
    ),
    logoShowcaseSrc: String(
      formData.get("logoShowcaseSrc") ?? store.pages.about.logoShowcaseSrc,
    ),
    identityTextureSrc: String(
      formData.get("identityTextureSrc") ??
        store.pages.about.identityTextureSrc,
    ),
  };

  await savePageContent("about", nextAbout);
  revalidatePath("/about-us");
}

export async function saveReportsContentAction(formData: FormData) {
  const store = await getStore();
  const nextReports: ReportsPageContent = {
    ...store.pages.reports,
    heroTitle: String(
      formData.get("heroTitle") ?? store.pages.reports.heroTitle,
    ),
    heroDescription: String(
      formData.get("heroDescription") ?? store.pages.reports.heroDescription,
    ),
    heroImageSrc: String(
      formData.get("heroImageSrc") ?? store.pages.reports.heroImageSrc,
    ),
    driveTitle: String(
      formData.get("driveTitle") ?? store.pages.reports.driveTitle,
    ),
    driveDescription: String(
      formData.get("driveDescription") ?? store.pages.reports.driveDescription,
    ),
    driveCtaLabel: String(
      formData.get("driveCtaLabel") ?? store.pages.reports.driveCtaLabel,
    ),
    featuredReportSlug: String(
      formData.get("featuredReportSlug") ??
        store.pages.reports.featuredReportSlug,
    ),
  };

  await savePageContent("reports", nextReports);
  revalidatePath("/reports");
}

export async function saveContactContentAction(formData: FormData) {
  const store = await getStore();
  const nextContact: ContactPageContent = {
    ...store.pages.contact,
    heroEyebrow: String(
      formData.get("heroEyebrow") ?? store.pages.contact.heroEyebrow,
    ),
    heroTitle: String(
      formData.get("heroTitle") ?? store.pages.contact.heroTitle,
    ),
    heroDescription: String(
      formData.get("heroDescription") ?? store.pages.contact.heroDescription,
    ),
    officeTitle: String(
      formData.get("officeTitle") ?? store.pages.contact.officeTitle,
    ),
    officeAddress: String(
      formData.get("officeAddress") ?? store.pages.contact.officeAddress,
    ),
    showcaseImageSrc: String(
      formData.get("showcaseImageSrc") ?? store.pages.contact.showcaseImageSrc,
    ),
  };

  await savePageContent("contact", nextContact);
  revalidatePath("/contact-us");
}

export async function saveReportAction(formData: FormData) {
  const coverFile = formData.get("coverImageFile");
  let coverImageSrc = String(formData.get("coverImageSrc") ?? "");

  if (coverFile instanceof File && coverFile.size > 0) {
    coverImageSrc = await uploadAsset(coverFile, "report-media");
  }

  await saveReport({
    ...(String(formData.get("id") ?? "").trim()
      ? { id: String(formData.get("id") ?? "").trim() }
      : {}),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    category: String(formData.get("category") ?? ""),
    categoryLabel: String(formData.get("categoryLabel") ?? ""),
    coverImageSrc,
    coverCaption: String(formData.get("coverCaption") ?? ""),
    publishedAt: String(formData.get("publishedAt") ?? ""),
    year: String(formData.get("year") ?? ""),
    periodLabel: String(formData.get("periodLabel") ?? ""),
    editionLabel: String(formData.get("editionLabel") ?? ""),
    author: String(formData.get("author") ?? ""),
    status: String(formData.get("status") ?? "draft") as "draft" | "published",
    featured: formData.get("featured") === "on",
    relatedSlugs: parseMultiline(formData.get("relatedSlugs")),
    bodyHtml: DOMPurify.sanitize(String(formData.get("bodyHtml") ?? "")),
  });

  revalidatePath("/dashboard/reports");
  revalidatePath("/reports");
}

export async function deleteReportAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteReport(id);
  revalidatePath("/dashboard/reports");
  revalidatePath("/reports");
}

export async function uploadLogoAction(formData: FormData) {
  const file = formData.get("logoFile");
  if (!(file instanceof File) || file.size === 0) return;

  const nextLogoSrc = await uploadAsset(file, "site-assets");
  const store = await getStore();

  await saveSettings({
    ...store.settings,
    logoSrc: nextLogoSrc,
    footerLogoSrc: nextLogoSrc,
  });

  revalidatePath("/", "layout");
}
