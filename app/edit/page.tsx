import { notFound } from "next/navigation";
import { EditStudio } from "@/components/edit/EditStudio";
import { readGlassColors } from "@/lib/glassColorStore";
import { readHeaderColors } from "@/lib/headerColorStore";
import { readHeaderSize } from "@/lib/headerSizeStore";
import { readHeroColors } from "@/lib/heroColorStore";
import { isLogoEditorEnabled, readLogoPlacement } from "@/lib/logoPlacementStore";
import { readPhotoFrames } from "@/lib/photoFrameStore";
import { readPhotoSize } from "@/lib/photoSizeStore";

export const dynamic = "force-dynamic";

export default function LogoEditPage() {
  if (!isLogoEditorEnabled()) notFound();

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl px-4 pb-16 pt-[calc(var(--site-header-height)+1.5rem)] sm:px-6 lg:px-8"
    >
      <EditStudio
        placement={readLogoPlacement()}
        headerColors={readHeaderColors()}
        heroColors={readHeroColors()}
        glassColors={readGlassColors()}
        photoSize={readPhotoSize()}
        photoFrames={readPhotoFrames()}
        headerSize={readHeaderSize()}
      />
    </main>
  );
}
