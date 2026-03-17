import Link from "next/link";

import type { ReportRecord } from "@/lib/data/types";
import { formatDisplayDate } from "@/lib/utils";

interface ReportCardProps {
  report: ReportRecord;
  compact?: boolean;
}

export function ReportCard({ report, compact = false }: ReportCardProps) {
  return (
    <article className="group">
      <Link
        className="block space-y-4 transition duration-300 group-hover:-translate-y-1"
        href={`/reports/${report.slug}`}
      >
        <div className="bg-brand-surface overflow-hidden">
          <img
            alt={report.title}
            className={
              compact
                ? "h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                : "h-[28rem] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            }
            src={report.cardImageSrc ?? report.coverImageSrc}
          />
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-[0.6rem] font-bold tracking-[0.18em] uppercase">
            <span className="bg-brand-blush text-brand-maroon px-2 py-1">
              {report.categoryLabel}
            </span>
            <span className="text-brand-muted">
              {report.periodLabel || formatDisplayDate(report.publishedAt)}
            </span>
          </div>
          <h3 className="font-epilogue text-brand-ink group-hover:text-brand-maroon text-xl leading-tight font-bold transition duration-300">
            {report.title}
          </h3>
          <p className="font-manrope text-brand-body text-sm leading-6">
            {report.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
