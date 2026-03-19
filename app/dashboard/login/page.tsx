import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { loginAction } from "@/lib/actions/auth";
import { isDemoMode } from "@/lib/repositories/content-repository";

import {
  DashboardAuthLayout,
  DashboardAuthNotice,
} from "@/components/dashboard/auth-shell";
import { AuthRecoveryRedirect } from "@/components/dashboard/auth-recovery-redirect";
import {
  DashboardAuthInput,
  DashboardAuthPasswordInput,
} from "@/components/dashboard/auth-fields";

interface DashboardLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardLoginPage({
  searchParams,
}: DashboardLoginPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const message = typeof params.message === "string" ? params.message : null;
  const next = typeof params.next === "string" ? params.next : "";

  return (
    <DashboardAuthLayout
      description="Masuk ke CMS internal untuk mengelola laporan, konten publik, dan akses dashboard sesuai role Anda."
      eyebrow="Internal CMS"
      leftDescription="Gunakan akun CMS untuk mengelola laporan atau seluruh konten publik HMPG ITB sesuai role Anda."
      leftTitle="HMPG ITB CMS"
      titleLines={["Login", "Dashboard"]}
    >
      <AuthRecoveryRedirect />

      <div className="space-y-5">
        {message ? (
          <DashboardAuthNotice tone="success">{message}</DashboardAuthNotice>
        ) : null}
        {error ? (
          <DashboardAuthNotice tone="danger">{error}</DashboardAuthNotice>
        ) : null}
        {isDemoMode() ? (
          <DashboardAuthNotice>
            <p className="font-bold text-[#1f1b10]">Mode demo aktif</p>
            <p>Email: {process.env.DEMO_ADMIN_EMAIL ?? "admin@hmpg.local"}</p>
            <p>Password: {process.env.DEMO_ADMIN_PASSWORD ?? "hmpg-demo"}</p>
          </DashboardAuthNotice>
        ) : null}
      </div>

      <form action={loginAction} className="space-y-8">
        <input name="next" type="hidden" value={next} />

        <div className="space-y-6">
          <DashboardAuthInput
            autoComplete="email"
            icon="mail"
            label="Email"
            name="email"
            placeholder="email@domain.com"
            required
            type="email"
          />

          <DashboardAuthPasswordInput
            autoComplete="current-password"
            label="Password"
            name="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-7">
          <div className="flex justify-end">
            <Link
              className="text-[10px] font-bold tracking-[0.04em] text-[#831618] uppercase transition-opacity hover:opacity-70"
              href="/dashboard/reset-password"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            className="flex h-14 w-full items-center justify-center gap-3 bg-[#831618] px-6 text-sm font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#6f1113] active:bg-[#5a0f11]"
            type="submit"
          >
            <span>Login ke Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </DashboardAuthLayout>
  );
}
