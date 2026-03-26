import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { resetPasswordAction } from "@/lib/actions/auth";
import { getStore } from "@/lib/repositories/content-repository";

import {
  DashboardAuthLayout,
  DashboardAuthNotice,
} from "@/components/dashboard/auth-shell";
import { DashboardAuthInput } from "@/components/dashboard/auth-fields";

interface ResetPasswordPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const store = await getStore();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const message = typeof params.message === "string" ? params.message : null;

  return (
    <DashboardAuthLayout
      description="Masukkan email CMS Anda, lalu kami akan mengirim tautan untuk mengatur ulang password."
      eyebrow="Internal CMS"
      leftImageSrc={store.pages.home.heroImageSrc}
      leftDescription="Akses CMS HMPG ITB tetap memakai identitas visual yang sama agar proses login dan pemulihan akun terasa konsisten."
      leftTitle="HMPG ITB CMS"
      titleLines={["Lupa", "Password"]}
    >
      <div className="space-y-5">
        {message ? (
          <DashboardAuthNotice tone="success">{message}</DashboardAuthNotice>
        ) : null}
        {error ? (
          <DashboardAuthNotice tone="danger">{error}</DashboardAuthNotice>
        ) : null}
      </div>

      <form action={resetPasswordAction} className="space-y-8">
        <DashboardAuthInput
          autoComplete="email"
          icon="mail"
          label="Email"
          name="email"
          placeholder="email@domain.com"
          required
          type="email"
        />

        <div className="space-y-5">
          <button
            className="flex h-14 w-full items-center justify-center gap-3 bg-[#831618] px-6 text-sm font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#6f1113] active:bg-[#5a0f11]"
            type="submit"
          >
            <span>Kirim Reset Link</span>
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
    </DashboardAuthLayout>
  );
}
