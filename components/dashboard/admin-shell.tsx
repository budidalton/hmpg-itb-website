"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  FileText,
  PencilRuler,
  Images,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { AdminSession } from "@/lib/auth/session";
import {
  canManageAssets,
  canManageSiteContent,
  canManageUsers,
} from "@/lib/auth/rbac";
import { cn } from "@/lib/utils";

import { SignOutButton } from "@/components/dashboard/sign-out-button";

const dashboardLinks = [
  { href: "/dashboard", label: "Overview", adminOnly: true, icon: LayoutGrid },
  {
    href: "/dashboard/reports",
    label: "Reports",
    adminOnly: false,
    icon: FileText,
  },
  {
    href: "/dashboard/content",
    label: "Content",
    adminOnly: true,
    icon: PencilRuler,
  },
  { href: "/dashboard/assets", label: "Assets", adminOnly: true, icon: Images },
  { href: "/dashboard/users", label: "Users", adminOnly: true, icon: Users },
] satisfies {
  href: string;
  label: string;
  adminOnly: boolean;
  icon: React.ComponentType<{ className?: string }>;
}[];

export function AdminShell({
  session,
  pathname,
  children,
}: {
  session: AdminSession;
  pathname: string;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const visibleLinks = useMemo(
    () =>
      dashboardLinks.filter((link) => {
        if (!link.adminOnly) {
          return true;
        }

        if (link.href === "/dashboard/content") {
          return canManageSiteContent(session.role);
        }

        if (link.href === "/dashboard/assets") {
          return canManageAssets(session.role);
        }

        if (link.href === "/dashboard/users") {
          return canManageUsers(session.role);
        }

        return session.role === "admin";
      }),
    [session.role],
  );

  return (
    <div className="editorial-shell min-h-screen bg-[#fcf7f0]">
      <header className="border-brand-sand/70 sticky top-0 z-40 border-b bg-[rgba(252,247,240,0.92)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/figma/about-logo-identity.png"
              alt="HMPG ITB logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full bg-white object-contain p-1 shadow-sm"
              priority
            />
            <div>
              <p className="font-epilogue text-brand-ink text-sm font-bold">
                HMPG ITB
              </p>
              <p className="text-brand-maroon text-[10px] font-extrabold tracking-[0.18em] uppercase">
                CMS Portal
              </p>
            </div>
          </div>
          <button
            aria-label="Toggle dashboard navigation"
            className="border-brand-sand/80 rounded-2xl border bg-white/90 p-2.5 shadow-sm"
            onClick={() => setMobileMenuOpen((value) => !value)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="text-brand-ink h-5 w-5" />
            ) : (
              <Menu className="text-brand-ink h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <div className="mx-auto grid min-h-screen max-w-[96rem] gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside
          className={cn(
            "border-brand-sand/70 bg-brand-cream/80 fixed inset-y-0 left-0 z-40 flex w-[18rem] -translate-x-full flex-col border-r p-5 shadow-[0_25px_60px_rgba(76,41,18,0.14)] transition-transform duration-300 lg:sticky lg:inset-y-auto lg:top-8 lg:left-auto lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:rounded-[2rem] lg:border lg:shadow-[0_20px_50px_rgba(76,41,18,0.08)]",
            mobileMenuOpen && "translate-x-0",
          )}
        >
          <div className="flex items-center gap-3 rounded-[1.5rem] bg-white/85 p-3 shadow-sm">
            <Image
              src="/assets/figma/about-logo-identity.png"
              alt="HMPG ITB logo"
              width={52}
              height={52}
              className="bg-brand-shell h-12 w-12 rounded-full object-contain p-1"
              priority
            />
            <div className="min-w-0">
              <p className="font-epilogue text-brand-ink truncate text-base font-bold">
                HMPG ITB
              </p>
              <p className="text-brand-maroon truncate text-[10px] font-extrabold tracking-[0.18em] uppercase">
                CMS Portal
              </p>
            </div>
          </div>

          <div className="border-brand-sand/70 mt-5 rounded-[1.5rem] border bg-white/70 p-4">
            <p className="text-brand-body truncate text-xs font-semibold">
              {session.email}
            </p>
            <span className="bg-brand-shell text-brand-maroon mt-3 inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] uppercase">
              {session.role}
            </span>
          </div>

          <nav className="mt-6 space-y-1.5">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));

              return (
                <Link
                  className={cn(
                    "group flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-brand-maroon text-white shadow-[0_12px_28px_rgba(93,28,30,0.22)]"
                      : "text-brand-body hover:text-brand-ink hover:bg-white",
                  )}
                  href={link.href as Route}
                  key={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-brand-maroon",
                    )}
                  />
                  <span className={isActive ? "text-white" : undefined}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="border-brand-sand/60 mt-6 rounded-[1.5rem] border border-dashed bg-white/50 p-4">
            <p className="text-brand-body text-xs leading-6">
              Kelola laporan, konten, asset, dan akses pengguna dari panel
              administrasi ini.
            </p>
          </div>

          <div className="mt-auto pt-6">
            <SignOutButton />
          </div>
        </aside>

        <main className="min-w-0 space-y-5 lg:space-y-6">{children}</main>
      </div>
    </div>
  );
}
