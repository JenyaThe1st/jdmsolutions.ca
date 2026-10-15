import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  ariaLabel?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  ariaLabel,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta";

  const variants = {
    primary:
      "bg-cta text-primary px-6 py-3.5 text-base hover:brightness-105 active:brightness-95 shadow-sm",
    secondary:
      "border-2 border-white/80 bg-transparent text-white px-6 py-3.5 text-base hover:bg-white/10",
  };

  return (
    <a href={href} className={cn(baseStyles, variants[variant], className)} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
