import fs from "fs";
import path from "path";
import { defaultGlassColors, sanitizeGlassColors, type GlassColors } from "@/lib/glassColors";

const colorsPath = path.join(process.cwd(), "data", "glassColors.json");

export function readGlassColors(): GlassColors {
  try {
    const raw = fs.readFileSync(colorsPath, "utf8");
    return sanitizeGlassColors(JSON.parse(raw));
  } catch {
    return defaultGlassColors;
  }
}

export function writeGlassColors(value: unknown): GlassColors {
  const colors = sanitizeGlassColors(value);
  fs.mkdirSync(path.dirname(colorsPath), { recursive: true });
  const temporaryPath = `${colorsPath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(colors, null, 2)}\n`);
  fs.renameSync(temporaryPath, colorsPath);
  return colors;
}
