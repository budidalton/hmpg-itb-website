"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
  { href: "/reports#drive-akademik", label: "HMPG’S Archives" },
  { href: "/reports", label: "Reports" },
  { href: "/contact-us", label: "Contact Us" },
] satisfies { href: Route; label: string }[];

export function SiteHeader({ settings, activeHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-brand-stroke/40 bg-brand-sand/95 sticky top-0 z-50 border-b backdrop-blur">
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
            const active =
              activeHref !== undefined
                ? item.href === activeHref
                : item.href === "/reports#drive-akademik"
                  ? pathname === "/reports"
                  : pathname === item.href;

            return (
              <Link
                className={cn(
                  "font-manrope text-brand-ink hover:text-brand-maroon border-b-2 border-transparent pb-1 text-[0.7rem] font-bold tracking-[0.16em] uppercase transition",
                  active && "border-brand-maroon text-brand-maroon",
                )}
                href={item.href}
                key={item.label}
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
          className="border-brand-stroke/40 text-brand-ink inline-flex h-10 w-10 items-center justify-center rounded-none border lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-brand-stroke/30 bg-brand-sand border-t px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                className="font-manrope text-brand-ink text-sm font-bold tracking-[0.16em] uppercase"
                href={item.href}
                key={item.label}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/dashboard/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-center">Login</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
