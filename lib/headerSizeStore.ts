import fs from "fs";
import path from "path";
import { defaultHeaderSize, sanitizeHeaderSize, type HeaderSize } from "@/lib/headerSize";

const sizePath = path.join(process.cwd(), "data", "headerSize.json");

export function readHeaderSize(): HeaderSize {
  try {
    const raw = fs.readFileSync(sizePath, "utf8");
    return sanitizeHeaderSize(JSON.parse(raw));
  } catch {
    return defaultHeaderSize;
  }
}

export function writeHeaderSize(value: unknown): HeaderSize {
  const size = sanitizeHeaderSize(value);
  fs.mkdirSync(path.dirname(sizePath), { recursive: true });
  const temporaryPath = `${sizePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(size, null, 2)}\n`);
  fs.renameSync(temporaryPath, sizePath);
  return size;
}
