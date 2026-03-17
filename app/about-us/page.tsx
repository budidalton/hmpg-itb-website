import type { Route } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getStore } from "@/lib/repositories/content-repository";

const valueIconMap = {
  Integritas: "/assets/figma/about-value-integritas.svg",
  Sinergi: "/assets/figma/about-value-sinergi.svg",
  Inovasi: "/assets/figma/about-value-inovasi.svg",
  Kreatif: "/assets/figma/about-value-kreatif.svg",
} as const;

const valueIconClassMap = {
  Integritas: "h-[21px] w-[22px]",
  Sinergi: "h-4 w-[22px]",
  Inovasi: "h-5 w-[15px]",
  Kreatif: "h-5 w-5",
} as const;

const colorSwatches = [
  { color: "#831618", label: "Burgundy", bordered: false },
  { color: "#fde089", label: "Gold", bordered: true },
  { color: "#18183a", label: "Navy", bordered: false },
] as const;

export default async function AboutPage() {
  const store = await getStore();
  const about = store.pages.about;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fff8f0]">
      <SiteHeader activeHref={"/about-us" as Route} settings={store.settings} />

      <main>
        <section className="relative h-[409px] overflow-hidden bg-[#712224]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt={about.heroTitle}
              className="absolute top-[-47.43%] left-[-0.04%] h-[208.8%] w-[100.08%] max-w-none object-cover"
              src={about.heroImageSrc}
            />
          </div>
          <div className="absolute inset-0 bg-[rgba(113,34,36,0.6)]" />

          <div className="relative h-full w-full px-6 pt-[112px] sm:px-8 lg:px-12">
            <div className="max-w-[744px] text-white">
              <h1 className="font-epilogue w-full max-w-[505px] text-[3.5rem] leading-[0.95] font-extrabold md:text-[72px] md:leading-[96px]">
                {about.heroTitle}
              </h1>
              <p className="font-manrope mt-4 w-full max-w-[707px] text-lg leading-8 text-white/90 md:text-[24px] md:leading-8">
                {about.heroDescription}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fff8f0] px-6 py-[90px] sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1232px] gap-10 lg:grid-cols-[456px_664px] lg:gap-16">
            <div className="relative overflow-hidden bg-[#fcf3e0]">
              <div className="relative h-full min-h-[595px] w-full">
                <img
                  alt={about.historyTitle}
                  className="absolute inset-0 h-full w-full object-cover object-[46%_center] grayscale"
                  src={about.historyImageSrc}
                />
              </div>
            </div>

            <div className="space-y-4 self-center pt-[40.58px]">
              <p className="font-manrope text-[12px] font-bold tracking-[0.05em] text-[#831618] uppercase">
                {about.historyEyebrow}
              </p>
              <h2 className="font-epilogue max-w-[664px] text-[36px] leading-[40px] font-bold text-[#1f1b10]">
                {about.historyTitle}
              </h2>
              <div className="font-manrope space-y-[23.3px] pt-[15.25px] text-[18px] leading-[29.25px] text-[#58413f]">
                {about.historyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fcf3e0] px-6 pt-[91px] pb-[110px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1232px]">
            <div className="text-center">
              <h2 className="font-epilogue text-[36px] font-extrabold tracking-[-0.025em] text-[#1f1b10]">
                Visi, Misi, & Nilai
              </h2>
              <p className="font-manrope mt-4 text-[12px] font-bold tracking-[0.3em] text-[#5b5b81] uppercase">
                The Executive Board of HMPG ITB 2026
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
              <article className="relative overflow-hidden bg-[#831618] px-8 py-10 text-white lg:col-span-3 lg:px-12 lg:py-12">
                <img
                  alt=""
                  aria-hidden="true"
                  className="absolute top-[-32px] right-0 h-[200px] w-[200px] object-contain"
                  src="/assets/figma/about-vision-badge.png"
                />
                <div className="max-w-[48rem]">
                  <p className="font-manrope text-[12px] font-bold tracking-[0.3em] text-[#ffc3bd] uppercase">
                    Visi Utama
                  </p>
                  <p className="font-epilogue mt-6 max-w-[768px] text-[32px] leading-[1.2] font-bold md:text-[36px] md:leading-[40px]">
                    {about.vision}
                  </p>
                </div>
              </article>

              <article className="border-l-4 border-[#831618] bg-[#f0e7d5] px-8 py-10 lg:col-span-2">
                <p className="font-manrope text-[12px] font-bold tracking-[0.1em] text-[#831618] uppercase">
                  Misi Strategis
                </p>
                <div className="mt-8 space-y-3">
                  {about.missions.map((mission, index) => (
                    <div className="flex items-start gap-4" key={mission}>
                      <span className="font-epilogue mt-[3px] w-6 shrink-0 text-[16px] leading-6 font-bold whitespace-nowrap text-[#831618]">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <p className="font-manrope text-[16px] leading-6 text-[#1f1b10]">
                        {mission}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="flex flex-col justify-between bg-[#fde089] px-8 py-10">
                <div>
                  <p className="font-manrope text-[12px] font-bold tracking-[0.1em] text-[#2d2b21] uppercase">
                    Nilai Inti
                  </p>
                  <div className="mt-8 space-y-4">
                    {about.values.map((value) => (
                      <div
                        className="flex items-center gap-[11.99px]"
                        key={value}
                      >
                        <img
                          alt=""
                          aria-hidden="true"
                          className={`${valueIconClassMap[value as keyof typeof valueIconClassMap]} object-contain`}
                          src={valueIconMap[value as keyof typeof valueIconMap]}
                        />
                        <span className="font-epilogue text-[24px] font-bold text-[#2d2b21]">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="font-manrope mt-8 text-[12px] text-[rgba(45,43,33,0.7)]">
                  {about.motto}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#fff8f0] px-6 pt-[60px] pb-[96px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1232px]">
            <div className="text-center">
              <p className="font-manrope text-[12px] font-bold tracking-[0.05em] text-[#831618] uppercase">
                Simbolisme
              </p>
              <h2 className="font-epilogue mt-3 text-[36px] font-bold text-[#1f1b10]">
                Identitas Visual
              </h2>
            </div>

            <div className="relative mx-auto mt-16 h-[435px] max-w-[896px] overflow-hidden border border-[rgba(223,191,188,0.3)] bg-[#fcf3e0] p-1">
              <img
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-[-389px] left-[-16px] h-[990px] w-[921px] max-w-none object-cover opacity-35 mix-blend-multiply"
                src={about.identityTextureSrc}
              />
              <div className="relative grid h-full gap-10 bg-white px-8 py-12 md:grid-cols-[256px_1fr] md:items-center md:gap-16 md:px-10 md:py-16">
                <img
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-multiply"
                  src={about.identityTextureSrc}
                />
                <div className="flex items-center justify-center">
                  <img
                    alt={store.settings.shortName}
                    className="h-56 w-56 object-contain md:h-64 md:w-64"
                    src={about.logoShowcaseSrc}
                  />
                </div>

                <div>
                  <h3 className="font-epilogue text-[24px] font-bold text-[#831618]">
                    {about.logoMeaningTitle}
                  </h3>
                  <p className="font-manrope mt-6 max-w-[28rem] text-[16px] leading-[26px] text-[#58413f]">
                    {about.logoMeaningDescription}
                  </p>

                  <div className="mt-8 flex items-start gap-4">
                    {colorSwatches.map((swatch) => (
                      <ColorSwatch
                        bordered={swatch.bordered}
                        color={swatch.color}
                        key={swatch.label}
                        label={swatch.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}

function ColorSwatch({
  color,
  label,
  bordered = false,
}: {
  color: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div className="flex w-12 flex-col items-center text-center">
      <div
        className={[
          "mx-auto h-8 w-8 rounded-[12px]",
          bordered ? "border border-[#dfbfbc]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ backgroundColor: color }}
      />
      <p className="font-manrope mt-2 text-[10px] font-bold tracking-[0.05em] whitespace-nowrap text-[#1f1b10] uppercase">
        {label}
      </p>
    </div>
  );
}
