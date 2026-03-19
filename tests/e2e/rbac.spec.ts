import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, email: string, password: string) {
  await page.goto("/dashboard/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

async function loginAsAdmin(page: Page) {
  await login(page, "admin@hmpg.local", "hmpg-demo");
  await expect(page).toHaveURL(/\/dashboard$/);
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

async function deleteUserIfExists(page: Page, email: string) {
  await page.goto("/dashboard/users");
  const userCard = page
    .locator("div")
    .filter({
      has: page.getByText(email, { exact: true }),
    })
    .filter({
      has: page.getByRole("button", { name: "Hapus User" }),
    })
    .first();

  if ((await userCard.count()) === 0) {
    return;
  }

  await Promise.all([
    page.waitForLoadState("networkidle"),
    userCard.getByRole("button", { name: "Hapus User" }).click(),
  ]);
}

test("admins can provision writers and writers are limited to report management", async ({
  page,
}) => {
  test.setTimeout(120000);

  const suffix = Date.now().toString();
  const writerEmail = `writer.${suffix}@hmpg.local`;
  const writerPassword = `Writer-${suffix}Aa!`;
  const reportTitle = `Writer Report ${suffix}`;
  const reportSlug = `writer-report-${suffix}`;

  await loginAsAdmin(page);

  try {
    await expect(
      page.getByRole("link", { name: "Users", exact: true }),
    ).toBeVisible();
    await page.goto("/dashboard/users");
    await expect(
      page.getByRole("heading", { name: "Kelola akun CMS" }),
    ).toBeVisible();

    const createUserCard = page
      .getByRole("article")
      .filter({ has: page.getByRole("heading", { name: "Tambah user" }) });
    await createUserCard.locator('input[name="email"]').fill(writerEmail);
    await createUserCard.locator('input[name="password"]').fill(writerPassword);
    await createUserCard.locator('select[name="role"]').selectOption("writer");
    await Promise.all([
      page.waitForLoadState("networkidle"),
      createUserCard.getByRole("button", { name: "Buat User" }).click(),
    ]);

    await expect(page.getByText("User baru berhasil dibuat.")).toBeVisible();
    await expect(page.getByText(writerEmail, { exact: true })).toBeVisible();

    await login(page, writerEmail, writerPassword);
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await expect(
      page.getByRole("link", { name: "Reports", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Users", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Content", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Assets", exact: true }),
    ).toHaveCount(0);

    await page.goto("/dashboard/content");
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await page.goto("/dashboard/assets");
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await page.goto("/dashboard/users");
    await expect(page).toHaveURL(/\/dashboard\/reports$/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard\/reports$/);

    await page.goto("/dashboard/reports?new=1");
    await page.locator('input[name="title"]').fill(reportTitle);
    await page.locator('input[name="slug"]').fill(reportSlug);
    await page.locator('input[name="category"]').fill("writer");
    await page.locator('input[name="categoryLabel"]').fill("Writer");
    await page.locator('input[name="editionLabel"]').fill("Writer Edition");
    await page.locator('input[name="periodLabel"]').fill("Maret 2026");
    await page.locator('input[name="year"]').fill("2026");
    await page.locator('input[name="author"]').fill("Writer QA");
    await page
      .locator('textarea[name="excerpt"]')
      .fill("Report created by writer role.");
    await page.locator('select[name="status"]').selectOption("published");
    await page.locator('input[name="featured"]').check();
    await page
      .locator('input[name="coverImageFile"]')
      .setInputFiles(
        path.resolve("public/assets/figma/report-detail-hero.png"),
      );
    await page.locator('[contenteditable="true"]').click();
    await page.keyboard.type("Writer report body with inline image.");
    await page
      .locator('[data-testid="rich-text-image-upload"]')
      .setInputFiles(
        path.resolve("public/assets/figma/reports-card-seminar.png"),
      );
    await expect(page.locator('[contenteditable="true"] img')).toBeVisible();

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.getByRole("button", { name: "Buat Laporan" }).click(),
    ]);

    await expect(
      page.locator(`a[href="/dashboard/reports?report=${reportSlug}"]`),
    ).toBeVisible();
    await expect(page.locator('input[name="featured"]')).toBeChecked();

    await page.goto("/reports");
    await expect(
      page.getByRole("link", { name: new RegExp(reportTitle) }).first(),
    ).toBeVisible();

    await page.goto(`/reports/${reportSlug}`);
    await expect(page).toHaveURL(new RegExp(`/reports/${reportSlug}$`));
    await expect(
      page.getByText("Writer report body with inline image."),
    ).toBeVisible();
    await expect(page.locator(".rich-text img").first()).toHaveAttribute(
      "src",
      /^data:image\//,
    );

    await page.goto(`/dashboard/reports?report=${reportSlug}`);
    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.getByRole("button", { name: "Hapus Laporan" }).click(),
    ]);

    await page.goto("/reports");
    await expect(
      page.getByRole("link", { name: new RegExp(reportTitle) }),
    ).toHaveCount(0);

    await loginAsAdmin(page);
    await deleteUserIfExists(page, writerEmail);
    await expect(page.getByText(writerEmail, { exact: true })).toHaveCount(0);
  } finally {
    await loginAsAdmin(page);
    await deleteReportIfExists(page, reportSlug);
    await deleteUserIfExists(page, writerEmail);
  }
});
