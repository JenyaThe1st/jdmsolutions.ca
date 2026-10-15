import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCall } from "@/components/layout/MobileStickyCall";
import { readHeaderColors } from "@/lib/headerColorStore";
import { readHeaderSize } from "@/lib/headerSizeStore";
import { readLogoPlacement } from "@/lib/logoPlacementStore";

export function SiteChrome({ children }: { children: ReactNode }) {
  const placement = readLogoPlacement();
  const colors = readHeaderColors();
  const headerSize = readHeaderSize();

  return (
    <div className="pb-16 md:pb-0">
      <style>{`:root{--site-header-height:${headerSize.mobile}rem}@media(min-width:1024px){:root{--site-header-height:${headerSize.desktop}rem}}`}</style>
      <Header placement={placement} colors={colors} />
      {children}
      <Footer />
      <MobileStickyCall />
    </div>
  );
}
