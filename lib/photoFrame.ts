export type PhotoCrop = {
  /** Horizontal shift inside the frame, as a percent of the photo height. */
  x: number;
  /** Vertical shift inside the frame, as a percent of the photo height. */
  y: number;
  /** 1 fills the frame height. Lower values show more of the original photo. */
  zoom: number;
};

export type PhotoFrameSet = {
  mobile: PhotoCrop;
  desktop: PhotoCrop;
};

export type PhotoFrames = {
  garage: PhotoFrameSet;
  doors: PhotoFrameSet;
};

const mobileZoom = 0.82;

export const defaultPhotoFrames: PhotoFrames = {
  garage: {
    mobile: { x: 0, y: (1 - mobileZoom) * 50, zoom: mobileZoom },
    desktop: { x: 0, y: 0, zoom: 1 },
  },
  doors: {
    mobile: { x: 0, y: (1 - mobileZoom) * 50, zoom: mobileZoom },
    desktop: { x: 0, y: 0, zoom: 1 },
  },
};

function clamp(input: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function sanitizeCrop(value: unknown, fallback: PhotoCrop): PhotoCrop {
  const record = value && typeof value === "object" ? (value as Partial<PhotoCrop>) : {};
  return {
    x: Math.round(clamp(record.x, fallback.x, -80, 80) * 10) / 10,
    y: Math.round(clamp(record.y, fallback.y, -80, 80) * 10) / 10,
    zoom: Math.round(clamp(record.zoom, fallback.zoom, 0.45, 2.5) * 100) / 100,
  };
}

function sanitizeSet(value: unknown, fallback: PhotoFrameSet): PhotoFrameSet {
  const record = value && typeof value === "object" ? (value as Partial<PhotoFrameSet>) : {};
  return {
    mobile: sanitizeCrop(record.mobile, fallback.mobile),
    desktop: sanitizeCrop(record.desktop, fallback.desktop),
  };
}

export function clampPhotoCrop(crop: PhotoCrop): PhotoCrop {
  return sanitizeCrop(crop, crop);
}

export function sanitizePhotoFrames(value: unknown): PhotoFrames {
  const record = value && typeof value === "object" ? (value as Partial<PhotoFrames>) : {};
  return {
    garage: sanitizeSet(record.garage, defaultPhotoFrames.garage),
    doors: sanitizeSet(record.doors, defaultPhotoFrames.doors),
  };
}

function cropRule(id: string, crop: PhotoCrop) {
  return `#${id}{--pan-x:${crop.x}%;--pan-y:${crop.y}%;--zoom:${crop.zoom}}`;
}

export function photoFrameCss(frames: PhotoFrames) {
  return `${cropRule("photo-garage", frames.garage.mobile)}${cropRule("photo-doors", frames.doors.mobile)}@media(min-width:1024px){${cropRule("photo-garage", frames.garage.desktop)}${cropRule("photo-doors", frames.doors.desktop)}}`;
}
