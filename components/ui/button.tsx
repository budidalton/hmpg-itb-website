import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "border border-brand-maroon bg-brand-maroon text-white hover:border-brand-maroon-dark hover:bg-brand-maroon-dark active:border-brand-wine active:bg-brand-wine focus-visible:outline-brand-gold",
  secondary:
    "border border-brand-sand bg-brand-cream text-brand-ink hover:border-brand-stroke/40 hover:bg-brand-shell active:border-brand-stroke/60 active:bg-brand-sand focus-visible:outline-brand-gold",
  ghost:
    "border border-brand-ink bg-brand-ink text-brand-cream hover:bg-[#2a2518] active:bg-[#141108] focus-visible:outline-brand-gold",
  outline:
    "border border-brand-stroke/40 bg-transparent text-brand-ink hover:border-brand-maroon hover:bg-brand-maroon/5 hover:text-brand-maroon active:border-brand-wine active:bg-brand-maroon/10 active:text-brand-wine focus-visible:outline-brand-maroon",
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
        "font-manrope group/button inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap uppercase transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-200 ease-out select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
      {iconSrc ? (
        <img
          alt={iconAlt}
          aria-hidden={iconAlt ? undefined : true}
          className="h-2.5 w-2.5 object-contain transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
          src={iconSrc}
        />
      ) : null}
    </button>
  );
}
