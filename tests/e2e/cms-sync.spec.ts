import path from "node:path";

import { expect, test, type Locator, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page) {
  await page.goto("/dashboard/login");
  await page.locator('input[name="email"]').fill("admin@hmpg.local");
  await page.locator('input[name="password"]').fill("hmpg-demo");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

function getSection(page: Page, title: string) {
  return page.locator("section").filter({
    has: page.getByRole("heading", { name: title }),
  });
}

async function saveSection(section: Locator) {
  await Promise.all([
    section.page().waitForLoadState("networkidle"),
    section.getByRole("button", { name: "Simpan" }).click(),
  ]);
}

test("CMS-owned content stays in sync with dashboard and public site", async ({
  page,
}) => {
  test.setTimeout(120000);
  const suffix = `sync-${Date.now()}`;
  const shortName = `HMPG ${suffix}`;
  const reportsTitle = `Archive ${suffix}`;
  const latestTitle = `Latest ${suffix}`;
  const socialTitle = `Social ${suffix}`;
  const periodLabel = `Cabinet ${suffix}`;
  const reportTitle = `CMS Report ${suffix}`;
  const reportSlug = `cms-report-${suffix}`;
  const publishedAt = new Date(Date.now() + 60_000).toISOString();

  await loginAsAdmin(page);

  await page.goto("/dashboard/content");
  await expect(page.getByText("Activity Highlights")).toHaveCount(0);

  const globalSection = getSection(page, "Global Settings");
  await globalSection.locator('input[name="shortName"]').fill(shortName);
  await saveSection(globalSection);
  await page.goto("/dashboard/content");

  const homeSection = getSection(page, "Home Page");
  await homeSection
    .locator('input[name="reportsSectionTitle"]')
    .fill(reportsTitle);
  await saveSection(homeSection);
  await page.goto("/dashboard/content");

  const aboutSection = getSection(page, "About Page");
  await aboutSection
    .locator('input[name="valuesSectionPeriodLabel"]')
    .fill(periodLabel);
  await saveSection(aboutSection);
  await page.goto("/dashboard/content");

  const reportsSection = getSection(page, "Reports Page");
  await reportsSection
    .locator('input[name="latestSectionTitle"]')
    .fill(latestTitle);
  await saveSection(reportsSection);
  await page.goto("/dashboard/content");

  const contactSection = getSection(page, "Contact Page");
  await contactSection
    .locator('input[name="socialSectionTitle"]')
    .fill(socialTitle);
  await saveSection(contactSection);

  await page.goto("/");
  await expect(
    page.getByRole("link", { name: new RegExp(shortName) }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: reportsTitle })).toBeVisible();

  await page.goto("/about-us");
  await expect(page.getByText(periodLabel)).toBeVisible();

  await page.goto("/reports");
  await expect(page.getByRole("heading", { name: latestTitle })).toBeVisible();

  await page.goto("/contact-us");
  await expect(page.getByRole("heading", { name: socialTitle })).toBeVisible();
  await expect(page.getByText(shortName).first()).toBeVisible();

  await page.goto("/dashboard/reports?new=1");
  await page.locator('input[name="title"]').fill(reportTitle);
  await page.locator('input[name="slug"]').fill(reportSlug);
  await page.locator('input[name="category"]').fill("sync");
  await page.locator('input[name="categoryLabel"]').fill("Sync");
  await page.locator('input[name="editionLabel"]').fill("Sync Edition");
  await page.locator('input[name="periodLabel"]').fill("Maret 2026");
  await page.locator('input[name="year"]').fill("2026");
  await page.locator('input[name="author"]').fill("QA Automation");
  await page.locator('input[name="publishedAt"]').fill(publishedAt);
  await page.locator('select[name="status"]').selectOption("published");
  await page
    .locator('textarea[name="excerpt"]')
    .fill("Report sinkronisasi CMS.");
  await page
    .locator('input[name="coverImageSrc"]')
    .fill("/assets/figma/report-detail-hero.png");
  await page
    .locator('input[name="cardImageSrc"]')
    .fill("/assets/figma/reports-card-seminar.png");
  await page.locator('input[name="coverCaption"]').fill("Caption sync");
  await page.locator('textarea[name="relatedSlugs"]').fill("");

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.getByRole("button", { name: "Buat Laporan" }).click(),
  ]);

  await page.goto("/dashboard/content");
  const reportsSectionForFeature = getSection(page, "Reports Page");
  await reportsSectionForFeature
    .locator('input[name="featuredReportSlug"]')
    .fill(reportSlug);
  await saveSection(reportsSectionForFeature);

  await page.goto("/reports");
  const reportLink = page
    .getByRole("link", { name: new RegExp(reportTitle) })
    .first();
  await expect(reportLink).toBeVisible();
  await expect(reportLink.locator("img").first()).toHaveAttribute(
    "src",
    /reports-card-seminar\.png/,
  );

  await page.goto(`/reports/${reportSlug}`);
  await expect(page).toHaveURL(new RegExp(`/reports/${reportSlug}$`));
  await expect(
    page.locator('img[alt="' + reportTitle + '"]').first(),
  ).toHaveAttribute("src", /report-detail-hero\.png/);

  await page.goto("/dashboard/assets");
  const headerLogoCard = page
    .locator("form")
    .filter({
      has: page.getByRole("heading", { name: "Header logo" }),
    })
    .first();
  const headerLogoBefore = await page
    .locator('img[alt="Header logo"]')
    .first()
    .getAttribute("src");

  await headerLogoCard
    .locator('input[name="assetFile"]')
    .setInputFiles(path.resolve("public/assets/figma/hmpg-logo-mark.png"));
  await Promise.all([
    page.waitForLoadState("networkidle"),
    headerLogoCard.getByRole("button", { name: "Upload Asset" }).click(),
  ]);

  await page.goto("/");
  const headerLogoAfter = await page
    .locator(`img[alt="${shortName} logo"]`)
    .getAttribute("src");
  expect(headerLogoAfter).not.toBe(headerLogoBefore);
});
