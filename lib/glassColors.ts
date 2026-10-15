import type { CSSProperties } from "react";
import { normalizeHex } from "@/lib/headerColors";

export type GlassColors = {
  highlight: string;
  tint: string;
  depth: string;
};

export const defaultGlassColors: GlassColors = {
  highlight: "#ffffff",
  tint: "#d5e6f0",
  depth: "#4d5d6b",
};

export function sanitizeGlassColors(value: unknown): GlassColors {
  const record = value && typeof value === "object" ? (value as Partial<GlassColors>) : {};
  return {
    highlight: normalizeHex(String(record.highlight ?? "")) ?? defaultGlassColors.highlight,
    tint: normalizeHex(String(record.tint ?? "")) ?? defaultGlassColors.tint,
    depth: normalizeHex(String(record.depth ?? "")) ?? defaultGlassColors.depth,
  };
}

function rgba(hex: string, alpha: number) {
  const normalized = normalizeHex(hex) ?? defaultGlassColors.tint;
  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function glassFrameStyle(colors: GlassColors): CSSProperties {
  const highlight = rgba(colors.highlight, 1);
  const tint = rgba(colors.tint, 0.78);
  const depth = rgba(colors.depth, 0.92);
  return {
    background: [
      `radial-gradient(46% 16px at 50% 0px, ${highlight} 0%, transparent 72%)`,
      `radial-gradient(42% 12px at 50% 100%, ${highlight} 0%, transparent 74%)`,
      `linear-gradient(180deg, ${rgba(colors.highlight, 0.98)} 0%, ${tint} 22%, ${rgba(colors.tint, 0.5)} 50%, ${depth} 100%)`,
    ].join(", "),
    boxShadow: [
      `inset 0 2px 1px ${rgba(colors.highlight, 1)}`,
      `inset 0 -4px 8px ${rgba(colors.depth, 0.65)}`,
      `inset 0 0 0 1px ${rgba(colors.highlight, 0.85)}`,
    ].join(", "),
    backdropFilter: "blur(14px) saturate(1.7)",
    WebkitBackdropFilter: "blur(14px) saturate(1.7)",
  };
}

export function glassLiftStyle(colors: GlassColors): CSSProperties {
  return {
    boxShadow: `0 14px 22px ${rgba(colors.depth, 0.45)}, 0 3px 6px ${rgba(colors.depth, 0.35)}`,
  };
}

export function glassSheenStyle(colors: GlassColors): CSSProperties {
  return {
    background: `linear-gradient(90deg, transparent, ${rgba(colors.highlight, 0.95)} 50%, transparent)`,
  };
}
