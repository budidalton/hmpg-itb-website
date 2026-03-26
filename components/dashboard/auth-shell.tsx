import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardAuthLayoutProps {
  children: ReactNode;
  description: string;
  eyebrow: string;
  leftImageSrc: string;
  leftDescription: string;
  leftTitle: string;
  titleLines: string[];
}

export function DashboardAuthLayout({
  children,
  description,
  eyebrow,
  leftImageSrc,
  leftDescription,
  leftTitle,
  titleLines,
}: DashboardAuthLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#fff8f0]">
      <div className="min-h-screen lg:grid lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#831618] lg:flex lg:min-h-screen lg:items-center lg:px-12 lg:py-12 xl:px-16">
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.24)_0,rgba(255,255,255,0)_44%)] opacity-10" />
          <div className="absolute -top-24 -left-24 h-72 w-72 bg-[#a42f2c] opacity-50 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 bg-[#c3a957] opacity-20 blur-3xl" />

          <div className="relative z-10 mx-auto flex w-full max-w-[32rem] flex-col gap-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe2d0] shadow-[0_0_0_8px_#831618,0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <img
                alt=""
                className="h-full w-full object-cover object-[95%_center]"
                src={leftImageSrc}
              />
            </div>

            <div className="space-y-3 text-white">
              <h2 className="font-epilogue text-4xl leading-none font-bold uppercase">
                {leftTitle}
              </h2>
              <p className="max-w-[28rem] text-lg leading-8 text-[#ffb3ad]">
                {leftDescription}
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-start justify-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-0 lg:items-center lg:px-16 lg:py-20 xl:px-24">
          <div className="absolute right-12 bottom-12 hidden h-24 w-24 rounded-xl border border-[#dfbfbc] opacity-30 lg:block" />
          <div className="absolute right-[4.6rem] bottom-[4.6rem] hidden h-8 w-8 rotate-45 bg-[#fde089] opacity-60 lg:block" />

          <div className="w-full max-w-[28rem] space-y-8 sm:space-y-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-[3px] w-8 bg-[#831618]" />
                <span className="text-[10px] font-bold tracking-[0.1em] text-[#5b5b81] uppercase">
                  {eyebrow}
                </span>
              </div>
              <div className="font-epilogue text-[#1f1b10] uppercase">
                {titleLines.map((line) => (
                  <h1
                    className="text-[2.35rem] leading-[0.95] font-extrabold tracking-[-0.05em] sm:text-[3rem]"
                    key={line}
                  >
                    {line}
                  </h1>
                ))}
              </div>
              <p className="max-w-[26rem] text-[15px] leading-7 text-[#5b5b81] sm:text-base">
                {description}
              </p>
            </div>

            {children}

            <div className="border-t border-[rgba(223,191,188,0.35)] pt-6">
              <p className="text-center text-[10px] leading-4 tracking-[-0.03em] text-[rgba(91,91,129,0.6)]">
                © {currentYear} Himpunan Mahasiswa Teknik Pangan ITB. All rights
                reserved.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function DashboardAuthNotice({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "danger";
}) {
  return (
    <div
      className={cn(
        "border px-4 py-3 text-sm leading-6",
        tone === "neutral" &&
          "border-[rgba(223,191,188,0.6)] bg-[rgba(255,255,255,0.45)] text-[#5b5b81]",
        tone === "success" &&
          "border-[rgba(77,138,87,0.35)] bg-[rgba(238,248,239,0.75)] text-[#20552b]",
        tone === "danger" &&
          "border-[rgba(131,22,24,0.2)] bg-[rgba(131,22,24,0.06)] text-[#831618]",
      )}
    >
      {children}
    </div>
  );
}
