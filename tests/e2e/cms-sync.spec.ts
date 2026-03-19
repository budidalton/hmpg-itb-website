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

async function deleteReportIfExists(page: Page, slug: string) {
  await page.goto("/dashboard/reports");
  const reportLink = page.locator(
    `a[href="/dashboard/reports?report=${slug}"]`,
  );

  if ((await reportLink.count()) === 0) {
    return;
  }

  await reportLink.first().click();
  await page.waitForLoadState("networkidle");

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.getByRole("button", { name: "Hapus Laporan" }).click(),
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

  let initialShortName = "";
  let initialReportsTitle = "";
  let initialPeriodLabel = "";
  let initialLatestTitle = "";
  let initialSocialTitle = "";
  let initialFeaturedSlug = "";
  let initialHeaderLogoSrc = "";
  let createdReport = false;

  await loginAsAdmin(page);

  try {
    await page.goto("/dashboard/content");
    await expect(page.getByText("Activity Highlights")).toHaveCount(0);

    const globalSection = getSection(page, "Global Settings");
    initialShortName = await globalSection
      .locator('input[name="shortName"]')
      .inputValue();
    await globalSection.locator('input[name="shortName"]').fill(shortName);
    await saveSection(globalSection);

    await page.goto("/dashboard/content");
    const homeSection = getSection(page, "Home Page");
    initialReportsTitle = await homeSection
      .locator('input[name="reportsSectionTitle"]')
      .inputValue();
    await homeSection
      .locator('input[name="reportsSectionTitle"]')
      .fill(reportsTitle);
    await saveSection(homeSection);

    await page.goto("/dashboard/content");
    const aboutSection = getSection(page, "About Page");
    initialPeriodLabel = await aboutSection
      .locator('input[name="valuesSectionPeriodLabel"]')
      .inputValue();
    await aboutSection
      .locator('input[name="valuesSectionPeriodLabel"]')
      .fill(periodLabel);
    await saveSection(aboutSection);

    await page.goto("/dashboard/content");
    const reportsSection = getSection(page, "Reports Page");
    initialLatestTitle = await reportsSection
      .locator('input[name="latestSectionTitle"]')
      .inputValue();
    initialFeaturedSlug = await reportsSection
      .locator('input[name="featuredReportSlug"]')
      .inputValue();
    await reportsSection
      .locator('input[name="latestSectionTitle"]')
      .fill(latestTitle);
    await saveSection(reportsSection);

    await page.goto("/dashboard/content");
    const contactSection = getSection(page, "Contact Page");
    initialSocialTitle = await contactSection
      .locator('input[name="socialSectionTitle"]')
      .inputValue();
    await contactSection
      .locator('input[name="socialSectionTitle"]')
      .fill(socialTitle);
    await saveSection(contactSection);

    await page.goto("/");
    await expect(
      page.getByRole("link", { name: new RegExp(shortName) }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: reportsTitle }),
    ).toBeVisible();

    await page.goto("/about-us");
    await expect(page.getByText(periodLabel)).toBeVisible();

    await page.goto("/reports");
    await expect(
      page.getByRole("heading", { name: latestTitle }),
    ).toBeVisible();

    await page.goto("/contact-us");
    await expect(
      page.getByRole("heading", { name: socialTitle }),
    ).toBeVisible();
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
    await page.locator('textarea[name="relatedSlugs"]').fill("");
    await page.locator('[contenteditable="true"]').click();
    await page.keyboard.type("Report sinkronisasi CMS.");

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.getByRole("button", { name: "Buat Laporan" }).click(),
    ]);
    createdReport = true;

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
      /report-detail-hero\.png/,
    );

    await page.goto(`/reports/${reportSlug}`);
    await expect(page).toHaveURL(new RegExp(`/reports/${reportSlug}$`));
    await expect(page.getByText("Report sinkronisasi CMS.")).toBeVisible();

    await page.goto("/dashboard/assets");
    const headerLogoCard = page
      .locator("form")
      .filter({
        has: page.getByRole("heading", { name: "Header logo" }),
      })
      .first();

    initialHeaderLogoSrc =
      (await page
        .locator('img[alt="Header logo"]')
        .first()
        .getAttribute("src")) ?? "/assets/figma/hmpg-logo-mark.png";

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
    expect(headerLogoAfter).toBeTruthy();
  } finally {
    await loginAsAdmin(page);

    await page.goto("/dashboard/content");
    const cleanupGlobalSection = getSection(page, "Global Settings");
    await cleanupGlobalSection
      .locator('input[name="shortName"]')
      .fill(initialShortName);
    await saveSection(cleanupGlobalSection);

    await page.goto("/dashboard/content");
    const cleanupHomeSection = getSection(page, "Home Page");
    await cleanupHomeSection
      .locator('input[name="reportsSectionTitle"]')
      .fill(initialReportsTitle);
    await saveSection(cleanupHomeSection);

    await page.goto("/dashboard/content");
    const cleanupAboutSection = getSection(page, "About Page");
    await cleanupAboutSection
      .locator('input[name="valuesSectionPeriodLabel"]')
      .fill(initialPeriodLabel);
    await saveSection(cleanupAboutSection);

    await page.goto("/dashboard/content");
    const cleanupReportsSection = getSection(page, "Reports Page");
    await cleanupReportsSection
      .locator('input[name="latestSectionTitle"]')
      .fill(initialLatestTitle);
    await cleanupReportsSection
      .locator('input[name="featuredReportSlug"]')
      .fill(initialFeaturedSlug);
    await saveSection(cleanupReportsSection);

    await page.goto("/dashboard/content");
    const cleanupContactSection = getSection(page, "Contact Page");
    await cleanupContactSection
      .locator('input[name="socialSectionTitle"]')
      .fill(initialSocialTitle);
    await saveSection(cleanupContactSection);

    if (createdReport) {
      await deleteReportIfExists(page, reportSlug);
    }

    if (initialHeaderLogoSrc.startsWith("/assets/")) {
      const headerLogoCard = page
        .locator("form")
        .filter({
          has: page.getByRole("heading", { name: "Header logo" }),
        })
        .first();

      await page.goto("/dashboard/assets");
      await headerLogoCard
        .locator('input[name="assetFile"]')
        .setInputFiles(
          path.resolve("public", initialHeaderLogoSrc.replace(/^\//, "")),
        );
      await Promise.all([
        page.waitForLoadState("networkidle"),
        headerLogoCard.getByRole("button", { name: "Upload Asset" }).click(),
      ]);
    }
  }
});
