"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useRouter } from "next/navigation";
import { GlassFrame } from "@/components/glass/GlassFrame";
import { FramedPhoto } from "@/components/photos/FramedPhoto";
import type { GlassColors } from "@/lib/glassColors";
import {
  clampPhotoCrop,
  defaultPhotoFrames,
  sanitizePhotoFrames,
  type PhotoCrop,
  type PhotoFrames,
} from "@/lib/photoFrame";
import type { PhotoSize } from "@/lib/photoSize";

const photos = [
  { key: "garage", src: "/images/services/garage-doors.jpg", name: "Garage Doors" },
  { key: "doors", src: "/images/services/doors-windows.jpg", name: "Doors & Windows" },
] as const;

function Stage({
  label,
  src,
  crop,
  colors,
  frameStyle,
  onChange,
}: {
  label: string;
  src: string;
  crop: PhotoCrop;
  colors: GlassColors;
  frameStyle: CSSProperties;
  onChange: (crop: PhotoCrop) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const cropRef = useRef(crop);
  const onChangeRef = useRef(onChange);
  const origin = useRef({ x: 0, y: 0, cropX: 0, cropY: 0, zoom: 1, height: 1 });
  cropRef.current = crop;
  onChangeRef.current = onChange;

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      onChangeRef.current(
        clampPhotoCrop({ ...cropRef.current, zoom: cropRef.current.zoom + (event.deltaY > 0 ? -0.04 : 0.04) }),
      );
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const height = frameRef.current?.getBoundingClientRect().height ?? 1;
    event.currentTarget.setPointerCapture(event.pointerId);
    origin.current = {
      x: event.clientX,
      y: event.clientY,
      cropX: crop.x,
      cropY: crop.y,
      zoom: crop.zoom,
      height,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const dx = ((event.clientX - origin.current.x) / origin.current.height) * 100;
    const dy = ((event.clientY - origin.current.y) / origin.current.height) * 100;
    onChange(
      clampPhotoCrop({
        x: origin.current.cropX + dx,
        y: origin.current.cropY + dy,
        zoom: origin.current.zoom,
      }),
    );
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-primary">{label}</p>
      <div ref={frameRef} className="relative" style={frameStyle}>
        <GlassFrame colors={colors} style={{ width: "100%", height: "100%" }}>
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "#1c1c1c" }} />
          <FramedPhoto src={src} alt="" crop={crop} still unoptimized />
        </GlassFrame>
        <div
          role="presentation"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          style={{ position: "absolute", inset: 0, zIndex: 20, cursor: "grab", touchAction: "none" }}
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-primary">
        <span className="w-12 shrink-0 font-semibold">Zoom</span>
        <input
          type="range"
          min={45}
          max={250}
          step={1}
          value={Math.round(crop.zoom * 100)}
          aria-label={`${label} zoom`}
          onChange={(event) => onChange(clampPhotoCrop({ ...crop, zoom: Number(event.target.value) / 100 }))}
          className="min-w-0 flex-1"
        />
        <span className="w-12 text-right tabular-nums">{Math.round(crop.zoom * 100)}%</span>
      </label>
    </div>
  );
}

export function PhotoPositionEditor({
  initialFrames,
  colors,
  photoSize,
}: {
  initialFrames: PhotoFrames;
  colors: GlassColors;
  photoSize: PhotoSize;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialFrames);
  const [draft, setDraft] = useState(initialFrames);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (key: "garage" | "doors", view: "mobile" | "desktop", crop: PhotoCrop) => {
    setDraft((current) => ({
      ...current,
      [key]: { ...current[key], [view]: crop },
    }));
  };

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/photo-frames", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Save failed");
      const frames = sanitizePhotoFrames(await response.json());
      setSaved(frames);
      setDraft(frames);
      setStatus("Saved. Visitors now see this photo placement.");
      router.refresh();
    } catch {
      setStatus("Could not save the photo placement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Photo position</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">
            Drag a photo to move it inside its frame. Use the slider or scroll over the photo to zoom
            the original image. The frames stay the same size.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraft(saved);
              setStatus("");
            }}
            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(defaultPhotoFrames);
              setStatus("");
            }}
            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-cta px-4 py-2 text-sm font-semibold text-primary disabled:opacity-60"
          >
            {saving ? "Saving" : "Save"}
          </button>
        </div>
      </div>
      {status ? <p className="text-sm text-secondary">{status}</p> : null}
      <div className="grid gap-10 lg:grid-cols-2">
        {photos.map((photo) => (
          <div key={photo.key} className="rounded-lg bg-[#e4e7eb] p-4 sm:p-6">
            <h3 className="mb-4 font-display text-2xl font-bold text-primary">{photo.name}</h3>
            <div className="grid grid-cols-2 items-start gap-4">
              <Stage
                label="Mobile"
                src={photo.src}
                crop={draft[photo.key].mobile}
                colors={colors}
                frameStyle={{ width: "100%", aspectRatio: `1 / ${photoSize.mobileRatio}` }}
                onChange={(crop) => update(photo.key, "mobile", crop)}
              />
              <Stage
                label="Desktop"
                src={photo.src}
                crop={draft[photo.key].desktop}
                colors={colors}
                frameStyle={{ width: "100%", aspectRatio: "1 / 1" }}
                onChange={(crop) => update(photo.key, "desktop", crop)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
