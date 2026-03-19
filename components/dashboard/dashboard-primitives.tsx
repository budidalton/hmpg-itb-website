import { cn } from "@/lib/utils";

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-brand-sand/70 from-brand-cream/90 rounded-[2rem] border bg-gradient-to-br to-white/95 p-6 shadow-[0_20px_50px_rgba(76,41,18,0.08)] md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? (
            <p className="text-brand-maroon text-xs font-extrabold tracking-[0.24em] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-epilogue text-brand-ink text-3xl leading-tight font-bold tracking-[-0.04em] md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="text-brand-body max-w-2xl text-sm leading-7 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}

export function DashboardPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "border-brand-sand/70 rounded-[2rem] border bg-white/95 p-5 shadow-[0_12px_36px_rgba(76,41,18,0.08)] md:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function DashboardPanelHeader({
  title,
  description,
  actions,
  tone = "default",
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b pb-4 md:flex-row md:items-start md:justify-between",
        tone === "inverse"
          ? "border-white/18"
          : "border-[rgba(140,113,110,0.14)]",
      )}
    >
      <div className="space-y-2">
        <h2
          className={cn(
            "font-epilogue text-xl font-bold tracking-[-0.03em] md:text-2xl",
            tone === "inverse" ? "text-white" : "text-brand-ink",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-sm leading-6",
              tone === "inverse" ? "text-white/78" : "text-brand-body",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function DashboardStatCard({
  label,
  value,
  tone = "default",
  hint,
}: {
  label: string;
  value: string | number;
  tone?: "default" | "accent";
  hint?: string;
}) {
  return (
    <article
      className={cn(
        "border-brand-sand/70 rounded-[1.6rem] border p-5",
        tone === "accent"
          ? "from-brand-maroon to-brand-wine bg-gradient-to-br text-white shadow-[0_18px_36px_rgba(93,28,30,0.2)]"
          : "bg-brand-surface",
      )}
    >
      <p
        className={cn(
          "text-[11px] font-extrabold tracking-[0.2em] uppercase",
          tone === "accent" ? "text-white/70" : "text-brand-body",
        )}
      >
        {label}
      </p>
      <p className="font-epilogue mt-4 text-4xl font-bold tracking-[-0.05em]">
        {value}
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-3 text-sm",
            tone === "accent" ? "text-white/80" : "text-brand-body",
          )}
        >
          {hint}
        </p>
      ) : null}
    </article>
  );
}

export function DashboardBadge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "success" | "warning" | "accent";
}) {
  const toneClass = {
    muted: "bg-brand-shell text-brand-body",
    success: "bg-[#e8f5ea] text-[#22623a]",
    warning: "bg-[#fff1d6] text-[#9a5b00]",
    accent: "bg-brand-maroon text-white",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] uppercase",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

export function DashboardEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-brand-sand/70 bg-brand-surface rounded-[1.6rem] border border-dashed p-8 text-center">
      <h3 className="font-epilogue text-brand-ink text-xl font-bold">
        {title}
      </h3>
      <p className="text-brand-body mx-auto mt-3 max-w-xl text-sm leading-7">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function DashboardLinkCard({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <a
      className="border-brand-sand/70 group hover:border-brand-maroon/35 rounded-[1.6rem] border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(76,41,18,0.08)]"
      href={href}
    >
      {badge ? <DashboardBadge>{badge}</DashboardBadge> : null}
      <h3 className="font-epilogue text-brand-ink group-hover:text-brand-maroon mt-3 text-lg font-bold">
        {title}
      </h3>
      <p className="text-brand-body mt-2 text-sm leading-6">{description}</p>
    </a>
  );
}
