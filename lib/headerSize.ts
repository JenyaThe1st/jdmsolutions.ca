export type HeaderSize = {
  /** Header height below the desktop layout, in rem. */
  mobile: number;
  /** Header height on wide screens, in rem. */
  desktop: number;
};

export const defaultHeaderSize: HeaderSize = {
  mobile: 8.125,
  desktop: 5.5,
};

function clamp(input: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function sanitizeHeaderSize(value: unknown): HeaderSize {
  const record = value && typeof value === "object" ? (value as Partial<HeaderSize>) : {};
  return {
    mobile: Math.round(clamp(record.mobile, defaultHeaderSize.mobile, 4.5, 14) * 1000) / 1000,
    desktop: Math.round(clamp(record.desktop, defaultHeaderSize.desktop, 3.5, 10) * 1000) / 1000,
  };
}
