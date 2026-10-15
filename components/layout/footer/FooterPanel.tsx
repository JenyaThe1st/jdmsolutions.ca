import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FooterPanelProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function FooterPanel({
  title,
  icon,
  children,
  className,
  id,
}: FooterPanelProps) {
  return (
    <div id={id} className={cn("footer-panel", className)}>
      <div className="footer-panel-header">
        <span className="footer-panel-header-icon" aria-hidden="true">
          {icon}
        </span>
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}
