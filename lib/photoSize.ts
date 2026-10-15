export type PhotoSize = {
  /** Width of the pair on desktop, in rem. Photos stay square. */
  desktop: number;
  /** Width of the pair on smaller screens, as a percent of the content area. */
  mobile: number;
  /** Mobile photo height divided by its width. Above 1 means taller than square. */
  mobileRatio: number;
};

export const defaultPhotoSize: PhotoSize = {
  desktop: 30,
  mobile: 75,
  mobileRatio: 1.45,
};

function clamp(input: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function sanitizePhotoSize(value: unknown): PhotoSize {
  const record = value && typeof value === "object" ? (value as Partial<PhotoSize>) : {};
  return {
    desktop: Math.round(clamp(record.desktop, defaultPhotoSize.desktop, 16, 56) * 10) / 10,
    mobile: Math.round(clamp(record.mobile, defaultPhotoSize.mobile, 48, 96) * 10) / 10,
    mobileRatio: Math.round(clamp(record.mobileRatio, defaultPhotoSize.mobileRatio, 1, 2) * 100) / 100,
  };
}
