import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DEMO_SESSION_COOKIE = "hmpg-demo-session";

export interface AdminSession {
  email: string;
  mode: "demo" | "supabase";
}

function encodeSession(value: AdminSession) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeSession(value: string): AdminSession | null {
  try {
    return JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  const rawValue = store.get(DEMO_SESSION_COOKIE)?.value;

  if (!rawValue) {
    return null;
  }

  return decodeSession(rawValue);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return session;
}

export async function createAdminSession(
  email: string,
  mode: AdminSession["mode"],
) {
  const store = await cookies();
  store.set(
    DEMO_SESSION_COOKIE,
    encodeSession({
      email,
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
