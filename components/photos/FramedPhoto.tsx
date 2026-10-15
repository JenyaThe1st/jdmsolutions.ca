import type { CSSProperties } from "react";
import Image from "next/image";
import type { PhotoCrop } from "@/lib/photoFrame";

export function FramedPhoto({
  id,
  src,
  alt,
  crop,
  priority,
  sizes,
  still,
  unoptimized,
}: {
  id?: string;
  src: string;
  alt: string;
  crop?: PhotoCrop;
  priority?: boolean;
  sizes?: string;
  still?: boolean;
  unoptimized?: boolean;
}) {
  const style = (
    crop
      ? {
          "--pan-x": `${crop.x}%`,
          "--pan-y": `${crop.y}%`,
          "--zoom": String(crop.zoom),
        }
      : undefined
  ) as CSSProperties | undefined;

  return (
    <Image
      id={id}
      src={src}
      alt={alt}
      width={1254}
      height={1254}
      priority={priority}
      sizes={sizes}
      unoptimized={unoptimized}
      draggable={false}
      className={still ? "photo-image photo-image-still" : "photo-image"}
      style={style}
    />
  );
}
