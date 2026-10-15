"use client";

import { useState } from "react";
import { GlassColorEditor } from "@/components/glass/GlassColorEditor";
import { HeaderColorEditor } from "@/components/header/HeaderColorEditor";
import { HeaderSizeEditor } from "@/components/header/HeaderSizeEditor";
import { LogoEditor } from "@/components/logo/LogoEditor";
import { PhotoPositionEditor } from "@/components/photos/PhotoPositionEditor";
import { PhotoSizeEditor } from "@/components/photos/PhotoSizeEditor";
import type { GlassColors } from "@/lib/glassColors";
import type { PhotoFrames } from "@/lib/photoFrame";
import type { PhotoSize } from "@/lib/photoSize";
import { defaultHeroColors, headerGradient, type HeaderColors } from "@/lib/headerColors";
import type { HeaderSize } from "@/lib/headerSize";
import type { LogoPlacement } from "@/lib/logoPlacement";

export function EditStudio({
  placement,
  headerColors,
  heroColors,
  glassColors,
  photoSize,
  photoFrames,
  headerSize,
}: {
  placement: LogoPlacement;
  headerColors: HeaderColors;
  heroColors: HeaderColors;
  glassColors: GlassColors;
  photoSize: PhotoSize;
  photoFrames: PhotoFrames;
  headerSize: HeaderSize;
}) {
  const [headerPreview, setHeaderPreview] = useState(headerColors);
  const [headerSizePreview, setHeaderSizePreview] = useState(headerSize);

  return (
    <div className="flex flex-col gap-14">
      <HeaderColorEditor
        title="Header colors"
        description="Three equal zones blend into one gradient behind the logo. Dividing lines stay in this editor."
        endpoint="/api/header-colors"
        savedMessage="Saved. Visitors now see this header."
        initialColors={headerColors}
        onPreview={setHeaderPreview}
      />
      <HeaderSizeEditor
        initialSize={headerSize}
        colors={headerPreview}
        placement={placement}
        onPreview={setHeaderSizePreview}
      />
      <HeaderColorEditor
        title="Hero colors"
        description="Three equal horizontal bands blend from top to bottom around the two cards. This does not change the header."
        endpoint="/api/hero-colors"
        savedMessage="Saved. Visitors now see this hero."
        resetColors={defaultHeroColors}
        initialColors={heroColors}
        onPreview={() => undefined}
        showPreview
        orientation="rows"
      />
      <GlassColorEditor initialColors={glassColors} />
      <PhotoSizeEditor initialSize={photoSize} colors={glassColors} />
      <PhotoPositionEditor initialFrames={photoFrames} colors={glassColors} photoSize={photoSize} />
      <LogoEditor
        initialPlacement={placement}
        headerBackground={headerGradient(headerPreview)}
        headerHeights={headerSizePreview}
      />
    </div>
  );
}
