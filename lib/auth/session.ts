import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  canManageReports,
  getDefaultDashboardPathForRole,
} from "@/lib/auth/rbac";
import type { CmsUserRole } from "@/lib/data/types";

const DEMO_SESSION_COOKIE = "hmpg-demo-session";

export interface CmsSession {
  userId: string;
  email: string;
  role: CmsUserRole;
  mode: "demo" | "supabase";
}

export type AdminSession = CmsSession;

function encodeSession(value: CmsSession) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeSession(value: string): CmsSession | null {
  try {
    return JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as CmsSession;
  } catch {
    return null;
  }
}

export async function getCmsSession() {
  const store = await cookies();
  const rawValue = store.get(DEMO_SESSION_COOKIE)?.value;

  if (!rawValue) {
    return null;
  }

  return decodeSession(rawValue);
}

export async function requireCmsSession() {
  const session = await getCmsSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireCmsSession();

  if (session.role !== "admin") {
    redirect(getDefaultDashboardPathForRole(session.role));
  }

  return session;
}

export async function requireReportsSession() {
  const session = await requireCmsSession();

  if (!canManageReports(session.role)) {
    redirect(getDefaultDashboardPathForRole(session.role));
  }

  return session;
}

export async function createAdminSession(
  userId: string,
  email: string,
  role: CmsUserRole,
  mode: CmsSession["mode"],
) {
  const store = await cookies();
  store.set(
    DEMO_SESSION_COOKIE,
    encodeSession({
      userId,
      email,
      role,
      mode,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  );
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(DEMO_SESSION_COOKIE);
}

export const adminSessionCookieName = DEMO_SESSION_COOKIE;
