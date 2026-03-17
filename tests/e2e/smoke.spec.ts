import { expect, test } from "@playwright/test";

test("public site navigation and reports archive section work", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Inovasi Pangan/i }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Reports" })
    .click();

  await expect(page).toHaveURL(/\/reports$/);
  await expect(
    page.getByRole("heading", { name: /Portal Kegiatan/i }),
  ).toBeVisible();

  await page.getByRole("link", { name: "HMPG’S Archives" }).click();
  await expect(page.locator("#drive-akademik")).toBeInViewport();
});

test("demo admin login reaches dashboard", async ({ page }) => {
  await page.goto("/dashboard/login");

  await expect(
    page.getByRole("heading", { name: "Masuk ke Dashboard" }),
  ).toBeVisible();

  const isDemoMode = await page
    .getByText("Mode demo aktif")
    .isVisible()
    .catch(() => false);

  if (!isDemoMode) {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Reset Password" }),
    ).toBeVisible();
    return;
  }

  await page.locator('input[name="email"]').fill("admin@hmpg.local");
  await page.locator('input[name="password"]').fill("hmpg-demo");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Content overview" }),
  ).toBeVisible();
});
