import type { CmsUserRole } from "@/lib/data/types";

export function isAdminRole(role: CmsUserRole) {
  return role === "admin";
}

export function canManageReports(role: CmsUserRole) {
  return role === "admin" || role === "writer";
}

export function canManageSiteContent(role: CmsUserRole) {
  return isAdminRole(role);
}

export function canManageAssets(role: CmsUserRole) {
  return isAdminRole(role);
}

export function canManageUsers(role: CmsUserRole) {
  return isAdminRole(role);
}

export function getDefaultDashboardPathForRole(role: CmsUserRole) {
  return isAdminRole(role) ? "/dashboard" : "/dashboard/reports";
}

export function canAccessDashboardPath(role: CmsUserRole, pathname: string) {
  if (
    pathname === "/dashboard/reports" ||
    pathname.startsWith("/dashboard/reports/")
  ) {
    return canManageReports(role);
  }

  if (pathname === "/dashboard") {
    return isAdminRole(role);
  }

  if (
    pathname === "/dashboard/content" ||
    pathname.startsWith("/dashboard/content/") ||
    pathname === "/dashboard/assets" ||
    pathname.startsWith("/dashboard/assets/") ||
    pathname === "/dashboard/users" ||
    pathname.startsWith("/dashboard/users/")
  ) {
    return isAdminRole(role);
  }

  return isAdminRole(role);
}
