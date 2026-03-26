import { DashboardAuthLayout } from "@/components/dashboard/auth-shell";
import { ResetPasswordCompleteForm } from "@/components/dashboard/reset-password-complete-form";
import { getStore } from "@/lib/repositories/content-repository";

export default async function ResetPasswordCompletePage() {
  const store = await getStore();

  return (
    <DashboardAuthLayout
      description="Verifikasi tautan reset password dan atur password baru untuk menyelesaikan pemulihan akun CMS Anda."
      eyebrow="Internal CMS"
      leftImageSrc={store.pages.home.heroImageSrc}
      leftDescription="Akses CMS HMPG ITB tetap memakai identitas visual yang sama agar proses login dan pemulihan akun terasa konsisten."
      leftTitle="HMPG ITB CMS"
      titleLines={["Atur", "Password"]}
    >
      <ResetPasswordCompleteForm />
    </DashboardAuthLayout>
  );
}
