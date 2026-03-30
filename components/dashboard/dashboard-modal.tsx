"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardModal({
  open,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  onClose,
  tone = "default",
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  onClose: () => void;
  tone?: "default" | "danger";
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[120] flex items-end justify-center bg-[rgba(31,27,16,0.58)] px-4 py-4 sm:items-center sm:px-6"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="border-brand-sand/70 w-full max-w-[34rem] rounded-[1.75rem] border bg-[linear-gradient(180deg,rgba(255,248,240,0.98),rgba(255,255,255,0.98))] p-5 shadow-[0_24px_80px_rgba(31,27,16,0.28)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p
              className={cn(
                "text-[11px] font-extrabold tracking-[0.22em] uppercase",
                tone === "danger" ? "text-[#831618]" : "text-brand-maroon",
              )}
            >
              {tone === "danger" ? "Perlu konfirmasi" : "Konfirmasi"}
            </p>
            <h2 className="font-epilogue text-brand-ink text-[1.65rem] leading-tight font-bold tracking-[-0.04em]">
              {title}
            </h2>
            {description ? (
              <p className="text-brand-body max-w-[30rem] text-sm leading-7">
                {description}
              </p>
            ) : null}
          </div>

          <Button
            aria-label="Tutup modal"
            className="h-10 w-10 shrink-0 rounded-full px-0"
            onClick={onClose}
            size="sm"
            variant="secondary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {children ? <div className="mt-5">{children}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {secondaryAction}
          {primaryAction}
        </div>
      </div>
    </div>
  );
}
