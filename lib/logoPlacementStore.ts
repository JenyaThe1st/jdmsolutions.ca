import fs from "fs";
import path from "path";
import {
  defaultLogoPlacement,
  sanitizeLogoPlacement,
  type LogoPlacement,
} from "@/lib/logoPlacement";

const placementPath = path.join(process.cwd(), "data", "logoPlacement.json");

export function isLogoEditorEnabled() {
  return process.env.LOGO_EDITOR_ENABLED === "true";
}

export function readLogoPlacement(): LogoPlacement {
  try {
    const raw = fs.readFileSync(placementPath, "utf8");
    return sanitizeLogoPlacement(JSON.parse(raw));
  } catch {
    return defaultLogoPlacement;
  }
}

export function writeLogoPlacement(value: unknown): LogoPlacement {
  const placement = sanitizeLogoPlacement(value);
  fs.mkdirSync(path.dirname(placementPath), { recursive: true });
  const temporaryPath = `${placementPath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(placement, null, 2)}\n`);
  fs.renameSync(temporaryPath, placementPath);
  return placement;
}
