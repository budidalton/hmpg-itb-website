"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

import type { SiteSettings } from "@/lib/data/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface SiteHeaderProps {
  settings: SiteSettings;
  activeHref?: Route;
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/reports#reports-hero", label: "HMPG's Archives" },
  { href: "/reports#reports-overview", label: "Reports" },
  { href: "/contact-us", label: "Contact Us" },
] satisfies { href: Route; label: string }[];

const desktopNavLinkClass =
  "font-manrope relative inline-flex pb-1 text-[0.7rem] font-bold tracking-[0.16em] uppercase text-brand-ink transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-maroon after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-brand-maroon after:transition-transform after:duration-300 after:ease-out hover:text-brand-maroon hover:after:scale-x-100 focus-visible:text-brand-maroon focus-visible:after:scale-x-100";

const mobileNavLinkClass =
  "font-manrope relative inline-flex w-fit pb-1 text-sm font-bold tracking-[0.16em] uppercase text-brand-ink transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-maroon after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-brand-maroon after:transition-transform after:duration-300 after:ease-out hover:text-brand-maroon hover:after:scale-x-100 focus-visible:text-brand-maroon focus-visible:after:scale-x-100";

export function SiteHeader({ settings, activeHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [reportsSection, setReportsSection] = useState<"archives" | "reports">(
    "archives",
  );

  useEffect(() => {
    if (pathname !== "/reports") {
      return;
    }

    const updateReportsSection = () => {
      const header = document.querySelector<HTMLElement>("[data-site-header]");
      const driveAkademik = document.getElementById("drive-akademik");
      const reportsOverview = document.getElementById("reports-overview");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const activationOffset = headerHeight + 24;
      const driveBottom = driveAkademik?.getBoundingClientRect().bottom;
      const overviewTop = reportsOverview?.getBoundingClientRect().top;

      if (typeof overviewTop !== "number" && typeof driveBottom !== "number") {
        setReportsSection("archives");
        return;
      }

      setReportsSection(
        (typeof overviewTop === "number" && overviewTop <= activationOffset) ||
          (typeof driveBottom === "number" && driveBottom <= headerHeight + 8)
          ? "reports"
          : "archives",
      );
    };

    updateReportsSection();

    window.addEventListener("scroll", updateReportsSection, { passive: true });
    window.addEventListener("resize", updateReportsSection);
    window.addEventListener("hashchange", updateReportsSection);

    return () => {
      window.removeEventListener("scroll", updateReportsSection);
      window.removeEventListener("resize", updateReportsSection);
      window.removeEventListener("hashchange", updateReportsSection);
    };
  }, [pathname]);

  const isItemActive = (href: Route) => {
    if (pathname === "/reports") {
      if (href === "/reports#reports-hero") {
        return reportsSection === "archives";
      }

      if (href === "/reports#reports-overview") {
        return reportsSection === "reports";
      }
    }

    return activeHref !== undefined ? href === activeHref : pathname === href;
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: Route,
  ) => {
    if (pathname === "/reports") {
      const isReportsHero = href === "/reports#reports-hero";
      const isReportsOverview = href === "/reports#reports-overview";

      if (isReportsHero || isReportsOverview) {
        event.preventDefault();

        const header =
          document.querySelector<HTMLElement>("[data-site-header]");
        const target = document.getElementById(
          isReportsHero ? "reports-hero" : "reports-overview",
        );

        if (target) {
          const headerHeight = header?.getBoundingClientRect().height ?? 0;
          const extraOffset = isReportsOverview ? 20 : 0;
          const top = Math.max(
            0,
            window.scrollY +
              target.getBoundingClientRect().top -
              headerHeight -
              extraOffset,
          );

          window.history.replaceState(null, "", href);
          window.scrollTo({ top, behavior: "smooth" });
          setReportsSection(isReportsOverview ? "reports" : "archives");
        }
      }
    }

    setIsOpen(false);
  };

  return (
    <header
      className="border-brand-stroke/40 bg-brand-sand/95 sticky top-0 z-50 border-b backdrop-blur"
      data-site-header
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link className="flex items-center gap-3" href="/">
          <img
            alt={`${settings.shortName} logo`}
            className="h-8 w-8 object-cover"
            src={settings.logoSrc}
          />
          <span className="font-epilogue text-brand-ink text-sm font-bold tracking-tight">
            {settings.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = isItemActive(item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  desktopNavLinkClass,
                  active && "text-brand-maroon after:scale-x-100",
                )}
                href={item.href}
                key={item.label}
                onClick={(event) => handleNavClick(event, item.href)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/dashboard/login">
            <Button className="h-8 px-5 text-[0.65rem]" size="sm">
              Login
            </Button>
          </Link>
        </div>

        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="border-brand-stroke/40 text-brand-ink hover:border-brand-maroon hover:text-brand-maroon focus-visible:outline-brand-maroon active:border-brand-wine active:text-brand-wine inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-none border transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-brand-stroke/30 bg-brand-sand border-t px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const active = isItemActive(item.href);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    mobileNavLinkClass,
                    active && "text-brand-maroon after:scale-x-100",
                  )}
                  href={item.href}
                  key={item.label}
                  onClick={(event) => handleNavClick(event, item.href)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/dashboard/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center">Login</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
