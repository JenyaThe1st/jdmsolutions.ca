import fs from "fs";
import path from "path";
import {
  defaultHeroColors,
  sanitizeHeaderColors,
  type HeaderColors,
} from "@/lib/headerColors";

const colorsPath = path.join(process.cwd(), "data", "heroColors.json");

export function readHeroColors(): HeaderColors {
  try {
    const raw = fs.readFileSync(colorsPath, "utf8");
    return sanitizeHeaderColors(JSON.parse(raw));
  } catch {
    return defaultHeroColors;
  }
}

export function writeHeroColors(value: unknown): HeaderColors {
  const colors = sanitizeHeaderColors(value);
  fs.mkdirSync(path.dirname(colorsPath), { recursive: true });
  const temporaryPath = `${colorsPath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(colors, null, 2)}\n`);
  fs.renameSync(temporaryPath, colorsPath);
  return colors;
}
