import type { Route } from "next";
import Link from "next/link";

import type { SiteSettings } from "@/lib/data/types";

const footerLinks = {
  primary: [
    { href: "/", label: "Beranda" },
    { href: "/about-us", label: "Profil" },
    { href: "/reports", label: "Reports" },
  ],
  secondary: [
    { href: "/reports#drive-akademik", label: "Drive Akademik" },
    { href: "/contact-us", label: "Kontak" },
    { href: "/dashboard/login", label: "Halaman Admin" },
  ],
} satisfies {
  primary: { href: Route; label: string }[];
  secondary: { href: Route; label: string }[];
};

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const footerActions = [
    {
      href:
        settings.socialLinks.find((link) => link.platform === "instagram")
          ?.href ?? settings.driveAkademikUrl,
      iconSrc: "/assets/figma/footer-icon-share.svg",
      label: "Media sosial HMPG ITB",
    },
    {
      href: `mailto:${settings.email}`,
      iconSrc: "/assets/figma/footer-icon-mail.svg",
      label: "Email HMPG ITB",
    },
    {
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
      iconSrc: "/assets/figma/footer-icon-phone.svg",
      label: "Telepon HMPG ITB",
    },
  ] as const;

  return (
    <footer className="bg-brand-wine text-brand-cream px-4 pt-20 pb-10 sm:px-6 lg:px-12">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="border-brand-stroke/30 grid gap-x-12 gap-y-12 border-b pb-16 md:grid-cols-2 lg:grid-cols-12 lg:pb-[81px]">
          <div className="space-y-[22px] lg:col-span-4">
            <div className="flex items-center gap-2">
              <img
                alt={`${settings.shortName} footer logo`}
                className="h-10 w-10 object-cover"
                src={settings.footerLogoSrc}
              />
              <span className="font-epilogue text-xl font-bold tracking-[-0.5px]">
                {settings.shortName}
              </span>
            </div>
            <div className="font-manrope text-brand-muted space-y-1 text-sm leading-[22.75px]">
              {settings.footerAddressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-[9px]">
              {footerActions.map((action) => (
                <a
                  className="border-brand-stroke hover:border-brand-cream hover:bg-brand-cream/5 flex h-10 w-10 items-center justify-center border transition duration-300 hover:-translate-y-0.5"
                  href={action.href}
                  key={action.label}
                  rel={
                    action.href.startsWith("http") ? "noreferrer" : undefined
                  }
                  target={action.href.startsWith("http") ? "_blank" : undefined}
                >
                  <img
                    alt={action.label}
                    className="h-5 w-5 object-contain"
                    src={action.iconSrc}
                  />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            className="lg:col-span-2"
            items={footerLinks.primary}
            title="Navigasi"
          />
          <FooterColumn
            className="lg:col-span-2"
            items={footerLinks.secondary}
            title="Navigasi"
          />
          <SocialFooterColumn
            className="lg:col-span-2"
            items={settings.socialLinks}
            title="Media Sosial"
          />
        </div>

        <p className="font-manrope text-brand-stroke pt-9 text-center text-[10px] tracking-[0.1em] uppercase sm:pt-10">
          {settings.footerCopyright}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  className,
}: {
  title: string;
  items: { href: Route; label: string }[];
  className?: string;
}) {
  return (
    <div className={["space-y-8", className].filter(Boolean).join(" ")}>
      <p className="font-manrope text-brand-cream text-xs font-bold tracking-[0.1em] uppercase">
        {title}
      </p>
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            className="font-manrope text-brand-muted hover:text-brand-cream block text-sm leading-5 transition duration-300 hover:translate-x-1"
            href={item.href}
            key={item.label}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialFooterColumn({
  title,
  items,
  className,
}: {
  title: string;
  items: SiteSettings["socialLinks"];
  className?: string;
}) {
  return (
    <div className={["space-y-8", className].filter(Boolean).join(" ")}>
      <p className="font-manrope text-brand-cream text-xs font-bold tracking-[0.1em] uppercase">
        {title}
      </p>
      <div className="space-y-4">
        {items.map((item) => (
          <a
            className="font-manrope text-brand-muted hover:text-brand-cream block text-sm leading-5 transition duration-300 hover:translate-x-1"
            href={item.href}
            key={item.platform}
            rel="noreferrer"
            target="_blank"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
