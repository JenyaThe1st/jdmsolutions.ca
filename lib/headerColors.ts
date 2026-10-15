export type HeaderColors = {
  left: string;
  center: string;
  right: string;
  mirrorSides: boolean;
};

export const defaultHeaderColors: HeaderColors = {
  left: "#d5d8dc",
  center: "#111314",
  right: "#d5d8dc",
  mirrorSides: true,
};

export const defaultHeroColors: HeaderColors = {
  left: "#e4e7eb",
  center: "#e4e7eb",
  right: "#e4e7eb",
  mirrorSides: true,
};

export function normalizeHex(input: string): string | null {
  const value = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value
      .split("")
      .map((character) => character + character)
      .join("")
      .toLowerCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(value)) return `#${value.toLowerCase()}`;
  return null;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex) ?? defaultHeaderColors.center;
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: lightness * 100 };
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;
  return { h: hue * 60, s: saturation * 100, l: lightness * 100 };
}

function hueToRgb(p: number, q: number, t: number) {
  let channel = t;
  if (channel < 0) channel += 1;
  if (channel > 1) channel -= 1;
  if (channel < 1 / 6) return p + (q - p) * 6 * channel;
  if (channel < 1 / 2) return q;
  if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
  return p;
}

function hslToHex(h: number, s: number, l: number) {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.min(100, Math.max(0, s)) / 100;
  const lightness = Math.min(100, Math.max(0, l)) / 100;
  if (saturation === 0) {
    const gray = Math.round(lightness * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${gray}${gray}${gray}`;
  }
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const toHex = (channel: number) =>
    Math.round(channel * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(hueToRgb(p, q, hue / 360 + 1 / 3))}${toHex(hueToRgb(p, q, hue / 360))}${toHex(hueToRgb(p, q, hue / 360 - 1 / 3))}`;
}

export function generatePalette(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const colors = [18, 32, 46, 58, 72, 86].map((lightness) => hslToHex(h, Math.max(s, 8), lightness));
  colors.push(hslToHex(h + 24, s, l), hslToHex(h - 24, s, l), normalizeHex(hex) ?? defaultHeaderColors.center);
  return [...new Set(colors)];
}

function gradientStops(colors: HeaderColors, fallback: HeaderColors) {
  const top = normalizeHex(colors.left) ?? fallback.left;
  const middle = normalizeHex(colors.center) ?? fallback.center;
  const bottom = colors.mirrorSides ? top : normalizeHex(colors.right) ?? fallback.right;
  return `${top} 0%, ${middle} 50%, ${bottom} 100%`;
}

export function headerGradient(colors: HeaderColors) {
  return `linear-gradient(90deg, ${gradientStops(colors, defaultHeaderColors)})`;
}

export function heroGradient(colors: HeaderColors) {
  return `linear-gradient(180deg, ${gradientStops(colors, defaultHeroColors)})`;
}

export function sanitizeHeaderColors(value: unknown): HeaderColors {
  const record = value && typeof value === "object" ? (value as Partial<HeaderColors>) : {};
  const left = normalizeHex(String(record.left ?? "")) ?? defaultHeaderColors.left;
  const center = normalizeHex(String(record.center ?? "")) ?? defaultHeaderColors.center;
  const mirrorSides = record.mirrorSides !== false;
  const right = mirrorSides ? left : normalizeHex(String(record.right ?? "")) ?? left;
  return { left, center, right, mirrorSides };
}
