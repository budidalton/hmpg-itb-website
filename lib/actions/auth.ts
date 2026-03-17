"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearAdminSession, createAdminSession } from "@/lib/auth/session";

function getSupabaseAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = getSupabaseAuthClient();

  if (supabase) {
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      redirect(
        `/dashboard/login?error=${encodeURIComponent(result.error.message)}`,
      );
    }

    await createAdminSession(email, "supabase");
    redirect("/dashboard");
  }

  const demoEmail = process.env.DEMO_ADMIN_EMAIL ?? "admin@hmpg.local";
  const demoPassword = process.env.DEMO_ADMIN_PASSWORD ?? "hmpg-demo";

  if (email !== demoEmail || password !== demoPassword) {
    redirect("/dashboard/login?error=Email%20atau%20password%20tidak%20valid");
  }

  await createAdminSession(email, "demo");
  redirect("/dashboard");
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
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard/login`,
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
