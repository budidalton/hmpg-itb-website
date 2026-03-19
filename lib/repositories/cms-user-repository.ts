import { createClient } from "@supabase/supabase-js";

import type { CmsUser, CmsUserRole } from "@/lib/data/types";
import { isDemoMode } from "@/lib/repositories/content-repository";

type CmsUserRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: CmsUserRole;
  created_at: string;
};

type DemoCmsUser = CmsUser & {
  password: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createDefaultDemoUsers(): DemoCmsUser[] {
  return [
    {
      id: "demo-admin",
      email: normalizeEmail(process.env.DEMO_ADMIN_EMAIL ?? "admin@hmpg.local"),
      password: process.env.DEMO_ADMIN_PASSWORD ?? "hmpg-demo",
      role: "admin",
      createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    },
  ];
}

function toPublicUser(user: DemoCmsUser): CmsUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    ...(user.displayName ? { displayName: user.displayName } : {}),
  };
}

function fromSupabaseCmsUserRow(row: CmsUserRow): CmsUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    ...(row.display_name ? { displayName: row.display_name } : {}),
  };
}

function sortUsers<T extends CmsUser>(users: T[]) {
  return [...users].sort((left, right) =>
    left.createdAt === right.createdAt
      ? left.email.localeCompare(right.email)
      : right.createdAt.localeCompare(left.createdAt),
  );
}

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function ensureDemoAdminRemains(userId: string, nextRole?: CmsUserRole) {
  const user = demoUsers.find((entry) => entry.id === userId);
  if (!user || user.role !== "admin" || nextRole === "admin") {
    return;
  }

  const adminCount = demoUsers.filter((entry) => entry.role === "admin").length;
  if (adminCount <= 1) {
    throw new Error("Minimal harus ada satu akun admin di CMS.");
  }
}

async function ensureSupabaseAdminRemains(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  userId: string,
  nextRole?: CmsUserRole,
) {
  const currentResult = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", userId)
    .maybeSingle<{ role: CmsUserRole }>();

  if (currentResult.error) {
    throw currentResult.error;
  }

  if (
    !currentResult.data ||
    currentResult.data.role !== "admin" ||
    nextRole === "admin"
  ) {
    return;
  }

  const adminsResult = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");

  if (adminsResult.error) {
    throw adminsResult.error;
  }

  if ((adminsResult.count ?? 0) <= 1) {
    throw new Error("Minimal harus ada satu akun admin di CMS.");
  }
}

let demoUsers = createDefaultDemoUsers();

export async function authenticateDemoCmsUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = demoUsers.find(
    (entry) => entry.email === normalizedEmail && entry.password === password,
  );

  return user ? toPublicUser(user) : null;
}

export async function getCmsUsers() {
  if (isDemoMode()) {
    return sortUsers(demoUsers.map((user) => toPublicUser(user)));
  }

  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, created_at")
    .order("created_at", { ascending: false });

  if (result.error) {
    throw result.error;
  }

  return ((result.data as CmsUserRow[] | null) ?? []).map((row) =>
    fromSupabaseCmsUserRow(row),
  );
}

export async function getCmsUserById(id: string) {
  if (isDemoMode()) {
    const user = demoUsers.find((entry) => entry.id === id);
    return user ? toPublicUser(user) : null;
  }

  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data ? fromSupabaseCmsUserRow(result.data as CmsUserRow) : null;
}

export async function getCmsUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (isDemoMode()) {
    const user = demoUsers.find((entry) => entry.email === normalizedEmail);
    return user ? toPublicUser(user) : null;
  }

  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data ? fromSupabaseCmsUserRow(result.data as CmsUserRow) : null;
}

export async function createCmsUser(input: {
  email: string;
  password: string;
  role: CmsUserRole;
}) {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  if (isDemoMode()) {
    if (demoUsers.some((entry) => entry.email === email)) {
      throw new Error("Email sudah terdaftar di CMS.");
    }

    const user: DemoCmsUser = {
      id: crypto.randomUUID(),
      email,
      password,
      role: input.role,
      createdAt: new Date().toISOString(),
    };

    demoUsers = sortUsers([user, ...demoUsers]);
    return toPublicUser(user);
  }

  const supabase = getSupabaseAdminClient();
  const authResult = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authResult.error) {
    throw authResult.error;
  }

  const userId = authResult.data.user?.id;
  if (!userId) {
    throw new Error("Supabase tidak mengembalikan user ID.");
  }

  const insertResult = await supabase
    .from("admin_users")
    .insert({
      id: userId,
      email,
      role: input.role,
    })
    .select("id, email, display_name, role, created_at")
    .single();

  if (insertResult.error) {
    await supabase.auth.admin.deleteUser(userId);
    throw insertResult.error;
  }

  return fromSupabaseCmsUserRow(insertResult.data as CmsUserRow);
}

export async function updateCmsUserRole(id: string, role: CmsUserRole) {
  if (isDemoMode()) {
    await ensureDemoAdminRemains(id, role);

    demoUsers = demoUsers.map((entry) =>
      entry.id === id ? { ...entry, role } : entry,
    );

    const user = demoUsers.find((entry) => entry.id === id);
    return user ? toPublicUser(user) : null;
  }

  const supabase = getSupabaseAdminClient();
  await ensureSupabaseAdminRemains(supabase, id, role);

  const result = await supabase
    .from("admin_users")
    .update({ role })
    .eq("id", id)
    .select("id, email, display_name, role, created_at")
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data ? fromSupabaseCmsUserRow(result.data as CmsUserRow) : null;
}

export async function deleteCmsUser(id: string) {
  if (isDemoMode()) {
    await ensureDemoAdminRemains(id);
    demoUsers = demoUsers.filter((entry) => entry.id !== id);
    return;
  }

  const supabase = getSupabaseAdminClient();
  await ensureSupabaseAdminRemains(supabase, id);

  const deleteResult = await supabase.auth.admin.deleteUser(id);
  if (deleteResult.error) {
    throw deleteResult.error;
  }
}
