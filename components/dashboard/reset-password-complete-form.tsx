"use client";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { DashboardAuthNotice } from "@/components/dashboard/auth-shell";
import { DashboardAuthPasswordInput } from "@/components/dashboard/auth-fields";

type RecoveryState = "verifying" | "ready" | "error";

function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function cleanupRecoveryUrl(url: URL) {
  url.hash = "";
  [
    "code",
    "type",
    "token_hash",
    "access_token",
    "refresh_token",
    "expires_at",
    "expires_in",
    "token_type",
  ].forEach((key) => url.searchParams.delete(key));

  window.history.replaceState({}, "", `${url.pathname}${url.search}`);
}

export function ResetPasswordCompleteForm() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [state, setState] = useState<RecoveryState>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function prepareRecoverySession() {
      if (!supabase) {
        if (!isMounted) return;
        setState("error");
        setError("Konfigurasi Supabase tidak tersedia untuk reset password.");
        return;
      }

      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const recoveryType = hashParams.get("type");
        const code = url.searchParams.get("code");
        const tokenHash = url.searchParams.get("token_hash");
        const queryType = url.searchParams.get("type");

        if (accessToken && refreshToken && recoveryType === "recovery") {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw sessionError;
          }

          cleanupRecoveryUrl(url);

          if (!isMounted) return;
          setState("ready");
          return;
        }

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          cleanupRecoveryUrl(url);

          if (!isMounted) return;
          setState("ready");
          return;
        }

        if (tokenHash && queryType === "recovery") {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (verifyError) {
            throw verifyError;
          }

          cleanupRecoveryUrl(url);

          if (!isMounted) return;
          setState("ready");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          if (!isMounted) return;
          setState("ready");
          return;
        }

        if (!isMounted) return;
        setState("error");
        setError("Tautan reset password tidak valid atau sudah kedaluwarsa.");
      } catch (caughtError) {
        if (!isMounted) return;
        setState("error");
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Gagal memverifikasi tautan reset password.",
        );
      }
    }

    void prepareRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Konfigurasi Supabase tidak tersedia untuk reset password.");
      return;
    }

    if (password.length < 8) {
      setError("Password baru minimal harus terdiri dari 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password belum sama.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setIsSubmitting(false);
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    window.location.replace(
      "/dashboard/login?message=Password%20berhasil%20diperbarui.%20Silakan%20login%20dengan%20password%20baru.",
    );
  }

  if (state === "verifying") {
    return (
      <DashboardAuthNotice>
        Memverifikasi tautan reset password. Mohon tunggu sebentar.
      </DashboardAuthNotice>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-5">
        <DashboardAuthNotice tone="danger">
          {error ?? "Tautan reset password tidak dapat digunakan."}
        </DashboardAuthNotice>
        <Link
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#831618] uppercase transition-opacity hover:opacity-70"
          href="/dashboard/reset-password"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kirim link baru</span>
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {error ? (
        <DashboardAuthNotice tone="danger">{error}</DashboardAuthNotice>
      ) : null}

      <div className="space-y-6">
        <DashboardAuthPasswordInput
          autoComplete="new-password"
          label="Password baru"
          name="new-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimal 8 karakter"
          required
          value={password}
        />

        <DashboardAuthPasswordInput
          autoComplete="new-password"
          label="Konfirmasi password"
          name="confirm-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Ulangi password baru"
          required
          value={confirmPassword}
        />
      </div>

      <div className="space-y-5">
        <button
          className="flex h-14 w-full items-center justify-center gap-3 bg-[#831618] px-6 text-sm font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#6f1113] active:bg-[#5a0f11]"
          disabled={isSubmitting}
          type="submit"
        >
          <span>{isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <Link
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#831618] uppercase transition-opacity hover:opacity-70"
          href="/dashboard/login"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Login</span>
        </Link>
      </div>
    </form>
  );
}
