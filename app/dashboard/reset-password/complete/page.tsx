import { DashboardAuthLayout } from "@/components/dashboard/auth-shell";
import { ResetPasswordCompleteForm } from "@/components/dashboard/reset-password-complete-form";

export default function ResetPasswordCompletePage() {
  return (
    <DashboardAuthLayout
      description="Tautan berhasil diverifikasi. Masukkan password baru untuk menyelesaikan pemulihan akun CMS Anda."
      eyebrow="Internal CMS"
      leftDescription="Akses CMS HMPG ITB tetap memakai identitas visual yang sama agar proses login dan pemulihan akun terasa konsisten."
      leftTitle="HMPG ITB CMS"
      titleLines={["Atur", "Password"]}
    >
      <ResetPasswordCompleteForm />
    </DashboardAuthLayout>
  );
}
