"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canAccessDashboardPath,
  getDefaultDashboardPathForRole,
} from "@/lib/auth/rbac";
import { clearAdminSession, createAdminSession } from "@/lib/auth/session";
import {
  authenticateDemoCmsUser,
  getCmsUserById,
} from "@/lib/repositories/cms-user-repository";

function getSupabaseAuthClient() {
  if (process.env.CMS_FORCE_DEMO_MODE === "1") {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function redirectToDashboard(target: string) {
  redirect(target as never);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "");
  const supabase = getSupabaseAuthClient();

  if (supabase) {
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      redirect(
        `/dashboard/login?error=${encodeURIComponent(result.error.message)}`,
      );
    }

    const authUser = result.data.user;
    if (!authUser?.id) {
      redirect(
        "/dashboard/login?error=Login%20berhasil%2C%20tetapi%20profil%20user%20tidak%20ditemukan.",
      );
    }

    const cmsUser = await getCmsUserById(authUser.id);
    if (!cmsUser) {
      redirect(
        "/dashboard/login?error=Akun%20ini%20belum%20memiliki%20akses%20CMS.",
      );
    }

    await createAdminSession(
      cmsUser.id,
      cmsUser.email,
      cmsUser.role,
      "supabase",
    );
    redirectToDashboard(
      nextPath && canAccessDashboardPath(cmsUser.role, nextPath)
        ? nextPath
        : getDefaultDashboardPathForRole(cmsUser.role),
    );
  }

  const demoUser = await authenticateDemoCmsUser(email, password);
  if (!demoUser) {
    redirect("/dashboard/login?error=Email%20atau%20password%20tidak%20valid");
  }

  await createAdminSession(demoUser.id, demoUser.email, demoUser.role, "demo");
  redirectToDashboard(
    nextPath && canAccessDashboardPath(demoUser.role, nextPath)
      ? nextPath
      : getDefaultDashboardPathForRole(demoUser.role),
  );
}

export async function resetPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = getSupabaseAuthClient();

  if (!supabase) {
    redirect(
      `/dashboard/reset-password?message=${encodeURIComponent(
        "Mode demo aktif. Hubungkan Supabase untuk mengirim email reset password.",
      )}`,
    );
  }

  const result = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/reset-password/complete`,
  });

  if (result.error) {
    redirect(
      `/dashboard/reset-password?error=${encodeURIComponent(result.error.message)}`,
    );
  }

  redirect(
    `/dashboard/reset-password?message=${encodeURIComponent(
      "Tautan reset password telah dikirim ke email Anda.",
    )}`,
  );
}

export async function logoutAction() {
  await clearAdminSession();
  revalidatePath("/dashboard");
  redirect("/dashboard/login");
}
