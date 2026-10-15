import fs from "fs";
import path from "path";
import { defaultPhotoSize, sanitizePhotoSize, type PhotoSize } from "@/lib/photoSize";

const sizePath = path.join(process.cwd(), "data", "photoSize.json");

export function readPhotoSize(): PhotoSize {
  try {
    const raw = fs.readFileSync(sizePath, "utf8");
    return sanitizePhotoSize(JSON.parse(raw));
  } catch {
    return defaultPhotoSize;
  }
}

export function writePhotoSize(value: unknown): PhotoSize {
  const size = sanitizePhotoSize(value);
  fs.mkdirSync(path.dirname(sizePath), { recursive: true });
  const temporaryPath = `${sizePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(size, null, 2)}\n`);
  fs.renameSync(temporaryPath, sizePath);
  return size;
}
