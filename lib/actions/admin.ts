"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";

import { reportAssetSlots, siteAssetSlots } from "@/lib/cms/config";
import {
  buildPageContentFromForm,
  buildReportInputFromForm,
  buildSettingsFromForm,
} from "@/lib/cms/form-values";
import type { ActivityHighlight } from "@/lib/data/types";
import {
  deleteReport,
  getStore,
  saveActivities,
  savePageContent,
  saveReport,
  saveSettings,
  uploadAsset,
} from "@/lib/repositories/content-repository";

export async function saveSettingsAction(formData: FormData) {
  const store = await getStore();
  const nextSettings = buildSettingsFromForm(formData, store.settings);

  await saveSettings(nextSettings);
  revalidatePath("/", "layout");
  revalidatePath("/contact-us");
}

export async function saveHomeContentAction(formData: FormData) {
  const store = await getStore();
  const nextHome = buildPageContentFromForm("home", formData, store.pages.home);

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
  const nextAbout = buildPageContentFromForm(
    "about",
    formData,
    store.pages.about,
  );

  await savePageContent("about", nextAbout);
  revalidatePath("/about-us");
}

export async function saveReportsContentAction(formData: FormData) {
  const store = await getStore();
  const nextReports = buildPageContentFromForm(
    "reports",
    formData,
    store.pages.reports,
  );

  await savePageContent("reports", nextReports);
  revalidatePath("/reports");
  revalidatePath("/");
}

export async function saveContactContentAction(formData: FormData) {
  const store = await getStore();
  const nextContact = buildPageContentFromForm(
    "contact",
    formData,
    store.pages.contact,
  );

  await savePageContent("contact", nextContact);
  revalidatePath("/contact-us");
}

export async function saveReportAction(formData: FormData) {
  const store = await getStore();
  const reportId = String(formData.get("id") ?? "").trim();
  const currentReport = reportId
    ? store.reports.find((report) => report.id === reportId)
    : undefined;
  const coverFile = formData.get("coverImageFile");
  const cardFile = formData.get("cardImageFile");
  let coverImageSrc = String(formData.get("coverImageSrc") ?? "");
  let cardImageSrc = String(formData.get("cardImageSrc") ?? "");

  if (coverFile instanceof File && coverFile.size > 0) {
    coverImageSrc = await uploadAsset(coverFile, "report-media");
  }

  if (cardFile instanceof File && cardFile.size > 0) {
    cardImageSrc = await uploadAsset(cardFile, "report-media");
  }

  const nextReport = buildReportInputFromForm(formData, currentReport);

  await saveReport({
    ...nextReport,
    coverImageSrc,
    cardImageSrc,
    bodyHtml: DOMPurify.sanitize(nextReport.bodyHtml),
  });

  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard/assets");
  revalidatePath("/reports");
  revalidatePath("/");
  if (nextReport.slug) {
    revalidatePath(`/reports/${nextReport.slug}`);
  }
}

export async function deleteReportAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteReport(id);
  revalidatePath("/dashboard/reports");
  revalidatePath("/reports");
}

export async function uploadCmsAssetAction(formData: FormData) {
  const file = formData.get("assetFile");
  if (!(file instanceof File) || file.size === 0) return;

  const folder = String(formData.get("folder") ?? "site-assets");
  const nextAssetSrc = await uploadAsset(file, folder);
  const store = await getStore();
  const targetType = String(formData.get("targetType") ?? "");
  const targetKey = String(formData.get("targetKey") ?? "");

  if (targetType === "settings") {
    const allowedSlot = siteAssetSlots.find(
      (slot) => slot.targetType === "settings" && slot.targetKey === targetKey,
    );

    if (!allowedSlot) {
      return;
    }

    await saveSettings({
      ...store.settings,
      [allowedSlot.targetKey]: nextAssetSrc,
    });

    revalidatePath("/", "layout");
    revalidatePath("/contact-us");
    revalidatePath("/dashboard/assets");
    return;
  }

  if (targetType === "page") {
    const pageKey = String(formData.get("pageKey") ?? "");
    const allowedSlot = siteAssetSlots.find(
      (slot) =>
        slot.targetType === "page" &&
        slot.pageKey === pageKey &&
        slot.targetKey === targetKey,
    );

    if (
      pageKey !== "home" &&
      pageKey !== "about" &&
      pageKey !== "reports" &&
      pageKey !== "contact"
    ) {
      return;
    }

    if (!allowedSlot) {
      return;
    }

    await savePageContent(pageKey, {
      ...store.pages[pageKey],
      [allowedSlot.targetKey]: nextAssetSrc,
    });

    const pathMap = {
      home: "/",
      about: "/about-us",
      reports: "/reports",
      contact: "/contact-us",
    } as const;

    revalidatePath(pathMap[pageKey]);
    if (pageKey === "reports") {
      revalidatePath("/");
    }
    revalidatePath("/dashboard/assets");
    return;
  }

  if (targetType === "report") {
    const reportId = String(formData.get("reportId") ?? "");
    const allowedKey = reportAssetSlots.find((slot) => slot.key === targetKey);
    const report = store.reports.find((entry) => entry.id === reportId);

    if (!allowedKey || !report) {
      return;
    }

    await saveReport({
      id: report.id,
      title: report.title,
      [allowedKey.key]: nextAssetSrc,
    });

    revalidatePath("/");
    revalidatePath("/reports");
    revalidatePath(`/reports/${report.slug}`);
    revalidatePath("/dashboard/reports");
    revalidatePath("/dashboard/assets");
  }
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
