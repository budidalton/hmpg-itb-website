import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand-maroon text-white hover:bg-brand-maroon-dark focus-visible:outline-brand-gold",
  secondary:
    "bg-brand-ink text-brand-cream hover:bg-brand-ink/90 focus-visible:outline-brand-gold",
  ghost:
    "bg-transparent text-brand-ink hover:bg-brand-maroon/5 focus-visible:outline-brand-maroon",
  outline:
    "border border-brand-maroon/20 bg-brand-surface text-brand-ink hover:border-brand-maroon hover:text-brand-maroon focus-visible:outline-brand-maroon",
};

const sizes = {
  sm: "h-10 px-4 text-xs tracking-[0.18em]",
  md: "h-12 px-6 text-sm tracking-[0.18em]",
  lg: "h-14 px-8 text-sm tracking-[0.18em]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  iconSrc?: string;
  iconAlt?: string;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  iconSrc,
  iconAlt = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-manrope group/button inline-flex items-center justify-center gap-2 rounded-none font-bold uppercase transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        "hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)]",
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      <span>{children}</span>
      {iconSrc ? (
        <img
          alt={iconAlt}
          aria-hidden={iconAlt ? undefined : true}
          className="h-2.5 w-2.5 object-contain transition duration-300 group-hover/button:translate-x-1"
          src={iconSrc}
        />
      ) : null}
    </button>
  );
}
