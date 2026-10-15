"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/siteConfig";
import type { HeaderColors } from "@/lib/headerColors";
import { LOGO_ASPECT, type LogoPlacement } from "@/lib/logoPlacement";

export function Header({
  placement,
  colors,
}: {
  placement: LogoPlacement;
  colors: HeaderColors;
}) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.offsetHeight}px`
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [pathname]);

  const onNavigateHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const slot = placement.desktop;
  const sideRight = colors.mirrorSides ? colors.left : colors.right;
  const background = `linear-gradient(90deg, ${colors.left} 0%, ${colors.center} 42%, ${colors.center} 58%, ${sideRight} 100%)`;

  return (
    <header
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 w-full overflow-hidden shadow-lg"
      style={{ background, height: "var(--site-header-height)" }}
    >
      <Link
        href="/"
        aria-label={siteConfig.businessName}
        onClick={onNavigateHome}
        className="absolute block max-w-none lg:hidden"
        style={{
          left: `${placement.mobile.x}%`,
          top: `${placement.mobile.y}%`,
          height: `${placement.mobile.height}%`,
          aspectRatio: `${LOGO_ASPECT}`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image
          src="/images/jdm-header-logo.png"
          alt=""
          width={2172}
          height={724}
          priority
          unoptimized
          className="h-full w-full object-contain"
        />
      </Link>
      <Link
        href="/"
        aria-label={siteConfig.businessName}
        onClick={onNavigateHome}
        className="absolute hidden max-w-none lg:block"
        style={{
          left: `${slot.x}%`,
          top: `${slot.y}%`,
          height: `${slot.height}%`,
          aspectRatio: `${LOGO_ASPECT}`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image
          src="/images/jdm-header-logo.png"
          alt=""
          width={2172}
          height={724}
          priority
          unoptimized
          className="h-full w-full object-contain"
        />
      </Link>
    </header>
  );
}
