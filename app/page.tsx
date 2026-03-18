import type { Route } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getStore } from "@/lib/repositories/content-repository";

export default async function HomePage() {
  const store = await getStore();
  const [featureActivity, verticalActivity, wideActivity] = store.activities;
  const home = store.pages.home;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fff8f0]">
      <SiteHeader activeHref={"/" as Route} settings={store.settings} />

      <main>
        <section className="relative h-[698px] overflow-hidden bg-[#e2d9c7]">
          <img
            alt={home.heroTitleLine1}
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-60"
            src={home.heroImageSrc}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff8f0_0%,rgba(255,248,240,0.6)_50%,rgba(255,248,240,0)_100%)]" />

          <div className="relative mx-auto flex h-full max-w-[1280px] items-center px-6 sm:px-8 lg:px-12">
            <div className="w-full max-w-[768px] space-y-4">
              <div className="inline-flex bg-[rgba(255,218,214,0.3)] px-3 py-1">
                <p className="font-manrope text-[12px] font-bold tracking-[0.2em] text-[#831618] uppercase">
                  {home.heroEyebrow}
                </p>
              </div>

              <div className="font-epilogue text-[56px] leading-[0.95] font-extrabold tracking-[-0.03em] text-[#1f1b10] md:text-[72px] md:leading-[72px]">
                <h1>{home.heroTitleLine1}</h1>
                <p className="text-[#a42f2c]">{home.heroTitleLine2}</p>
              </div>

              <div className="pt-3">
                <Link
                  className="group inline-flex items-center gap-2 rounded-[2px] bg-[#831618] px-10 pt-[16.5px] pb-[17px] text-white transition duration-300 hover:bg-[#712224]"
                  href="/about-us"
                >
                  <span className="font-manrope text-[14px] font-bold tracking-[0.05em] text-white">
                    {home.heroCtaLabel}
                  </span>
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-[9.33px] w-[9.33px] object-contain transition duration-300 group-hover:translate-x-0.5"
                    src="/assets/figma/icon-arrow-cream.svg"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#fff8f0] py-12 sm:py-16 lg:h-[400px] lg:py-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-[-60%_-14%] translate-y-[-12%] scale-[0.8] -rotate-[2.33deg] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${home.summaryTextureSrc})` }}
            />
            <div className="absolute inset-0 bg-[rgba(113,34,36,0.65)]" />
          </div>

          <div className="relative mx-auto flex max-w-[1280px] justify-center px-6 sm:px-8 lg:px-12 lg:pt-[140px]">
            <div className="max-w-[948px] space-y-6 text-justify">
              {home.summaryParagraphs.map((paragraph) => (
                <p
                  className="font-manrope text-[15px] leading-8 font-bold text-white sm:text-[16px] md:text-[20px]"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fcf3e0] py-[112px]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-6 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between gap-8">
              <div className="space-y-2">
                <p className="font-manrope text-[12px] font-bold tracking-[0.1em] text-[#831618] uppercase">
                  kegiatan
                </p>
                <h2 className="font-epilogue text-[36px] leading-10 font-bold tracking-[-0.025em] text-[#1f1b10]">
                  HMPG Reports
                </h2>
              </div>

              <Link
                className="font-manrope hidden items-center gap-2 border-b border-[rgba(91,91,129,0.3)] pb-[5px] text-[12px] font-bold tracking-[0.1em] text-[#5b5b81] transition duration-300 hover:border-[#831618] hover:text-[#831618] md:inline-flex"
                href="/reports"
              >
                <span className="text-[#5b5b81]">LIHAT SELENGKAPNYA</span>
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-[10.5px] w-[10.5px] object-contain"
                  src="/assets/figma/icon-arrow-muted.svg"
                />
              </Link>
            </div>

            {wideActivity ? (
              <article className="relative grid overflow-hidden bg-[#712224] md:grid-cols-2">
                {wideActivity.badge ? (
                  <span className="font-manrope absolute top-6 left-6 z-10 bg-[#fcf3e0] px-4 py-1 text-[10px] font-bold tracking-[0.1em] text-[#1f1b10] uppercase">
                    {wideActivity.badge}
                  </span>
                ) : null}

                <div
                  className={[
                    "flex flex-col justify-center gap-4 px-8 pb-12 md:px-12 md:py-12",
                    wideActivity.badge ? "pt-20 md:pt-12" : "pt-12",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <p className="font-manrope text-[10px] font-bold tracking-[0.1em] text-[#fde089] uppercase">
                    {wideActivity.category}
                  </p>
                  <h3 className="font-epilogue max-w-[496px] text-[30px] leading-[36px] font-bold text-[#f9f0de]">
                    {wideActivity.title}
                  </h3>
                  <p className="font-manrope max-w-[496px] pt-[6.75px] text-[14px] leading-[22.75px] text-[#dfbfbc]">
                    {wideActivity.description}
                  </p>
                </div>

                <div className="relative min-h-[420px] overflow-hidden md:min-h-[592px]">
                  <img
                    alt={wideActivity.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={wideActivity.imageSrc}
                  />
                </div>
              </article>
            ) : null}

            <div className="grid gap-8 lg:grid-cols-12">
              {featureActivity ? (
                <article className="overflow-hidden bg-[#712224] lg:col-span-8">
                  <div className="relative h-[437.98px] overflow-hidden">
                    <img
                      alt={featureActivity.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={featureActivity.imageSrc}
                    />
                  </div>

                  <div className="space-y-2 px-8 py-12">
                    <p className="font-manrope text-[10px] font-bold tracking-[0.1em] text-[#fcf3e0] uppercase">
                      {featureActivity.category}
                    </p>
                    <h3 className="font-epilogue text-[24px] leading-8 font-bold text-[#f9f0de]">
                      {featureActivity.title}
                    </h3>
                    <p className="font-manrope text-[14px] leading-5 text-[#dfbfbc]">
                      {featureActivity.description}
                    </p>
                  </div>
                </article>
              ) : null}

              {verticalActivity ? (
                <article className="bg-[#712224] p-1 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:col-span-4">
                  <div className="relative h-[435px] overflow-hidden">
                    <img
                      alt={verticalActivity.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={verticalActivity.imageSrc}
                    />
                  </div>

                  <div className="space-y-2 p-6">
                    <p className="font-manrope text-[10px] font-bold tracking-[0.1em] text-[#fcf3e0] uppercase">
                      {verticalActivity.category}
                    </p>
                    <h3 className="font-epilogue text-[24px] leading-[25px] font-bold text-[#f9f0de]">
                      {verticalActivity.title}
                    </h3>
                    <p className="font-manrope pt-2 text-[14px] leading-5 text-[#dfbfbc]">
                      {verticalActivity.description}
                    </p>
                  </div>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}
