import fs from "fs";
import path from "path";
import { defaultPhotoFrames, sanitizePhotoFrames, type PhotoFrames } from "@/lib/photoFrame";

const framePath = path.join(process.cwd(), "data", "photoFrames.json");

export function readPhotoFrames(): PhotoFrames {
  try {
    const raw = fs.readFileSync(framePath, "utf8");
    return sanitizePhotoFrames(JSON.parse(raw));
  } catch {
    return defaultPhotoFrames;
  }
}

export function writePhotoFrames(value: unknown): PhotoFrames {
  const frames = sanitizePhotoFrames(value);
  fs.mkdirSync(path.dirname(framePath), { recursive: true });
  const temporaryPath = `${framePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(frames, null, 2)}\n`);
  fs.renameSync(temporaryPath, framePath);
  return frames;
}
