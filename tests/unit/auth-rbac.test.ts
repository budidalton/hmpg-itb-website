import {
  canAccessDashboardPath,
  canManageAssets,
  canManageReports,
  canManageSiteContent,
  canManageUsers,
  getDefaultDashboardPathForRole,
} from "@/lib/auth/rbac";

describe("CMS RBAC", () => {
  it("gives admins full dashboard access", () => {
    expect(getDefaultDashboardPathForRole("admin")).toBe("/dashboard");
    expect(canManageReports("admin")).toBe(true);
    expect(canManageSiteContent("admin")).toBe(true);
    expect(canManageAssets("admin")).toBe(true);
    expect(canManageUsers("admin")).toBe(true);
    expect(canAccessDashboardPath("admin", "/dashboard")).toBe(true);
    expect(canAccessDashboardPath("admin", "/dashboard/content")).toBe(true);
    expect(canAccessDashboardPath("admin", "/dashboard/assets")).toBe(true);
    expect(canAccessDashboardPath("admin", "/dashboard/users")).toBe(true);
    expect(canAccessDashboardPath("admin", "/dashboard/reports")).toBe(true);
  });

  it("limits writers to the reports area", () => {
    expect(getDefaultDashboardPathForRole("writer")).toBe("/dashboard/reports");
    expect(canManageReports("writer")).toBe(true);
    expect(canManageSiteContent("writer")).toBe(false);
    expect(canManageAssets("writer")).toBe(false);
    expect(canManageUsers("writer")).toBe(false);
    expect(canAccessDashboardPath("writer", "/dashboard")).toBe(false);
    expect(canAccessDashboardPath("writer", "/dashboard/content")).toBe(false);
    expect(canAccessDashboardPath("writer", "/dashboard/assets")).toBe(false);
    expect(canAccessDashboardPath("writer", "/dashboard/users")).toBe(false);
    expect(canAccessDashboardPath("writer", "/dashboard/reports")).toBe(true);
  });
});
