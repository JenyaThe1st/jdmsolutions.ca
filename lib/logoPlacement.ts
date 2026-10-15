export const LOGO_ASPECT = 2172 / 724;

export type LogoSlot = {
  /** Horizontal center, percent of the header width. */
  x: number;
  /** Vertical center, percent of the header height. */
  y: number;
  /** Logo height as a percent of the header height. */
  height: number;
};

export type LogoPlacement = {
  desktop: LogoSlot;
  mobile: LogoSlot;
};

export const defaultLogoPlacement: LogoPlacement = {
  desktop: { x: 50, y: 50, height: 72.7 },
  mobile: { x: 50, y: 50, height: 81.5 },
};

function clampSlot(value: unknown, fallback: LogoSlot): LogoSlot {
  if (!value || typeof value !== "object") return fallback;
  const slot = value as Partial<LogoSlot>;
  const number = (input: unknown, fallbackValue: number, min: number, max: number) => {
    const parsed = typeof input === "number" ? input : Number(input);
    if (!Number.isFinite(parsed)) return fallbackValue;
    return Math.min(max, Math.max(min, parsed));
  };

  return {
    x: number(slot.x, fallback.x, 0, 100),
    y: number(slot.y, fallback.y, 0, 100),
    height: number(slot.height, fallback.height, 12, 100),
  };
}

export function sanitizeLogoPlacement(value: unknown): LogoPlacement {
  const record = value && typeof value === "object" ? (value as Partial<LogoPlacement>) : {};
  return {
    desktop: clampSlot(record.desktop, defaultLogoPlacement.desktop),
    mobile: clampSlot(record.mobile, defaultLogoPlacement.mobile),
  };
}
