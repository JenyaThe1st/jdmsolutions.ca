"use client";

import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GlassFrame } from "@/components/glass/GlassFrame";
import type { GlassColors } from "@/lib/glassColors";
import { defaultPhotoSize, type PhotoSize } from "@/lib/photoSize";

const photos = [
  { src: "/images/services/garage-doors.jpg", name: "Garage Doors" },
  { src: "/images/services/doors-windows.jpg", name: "Entry Doors & Windows" },
] as const;

function Pair({
  colors,
  className,
  frameClassName,
  frameStyle,
}: {
  colors: GlassColors;
  className?: string;
  frameClassName?: string;
  frameStyle?: CSSProperties;
}) {
  return (
    <div className={className}>
      {photos.map((photo) => (
        <GlassFrame key={photo.name} colors={colors} className={frameClassName} style={frameStyle}>
          <Image src={photo.src} alt="" fill sizes="12rem" className="object-cover" />
        </GlassFrame>
      ))}
    </div>
  );
}

function ResizeHandle({
  label,
  onDrag,
}: {
  label: string;
  onDrag: (deltaX: number, deltaY: number) => void;
}) {
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };

    const onMove = (move: PointerEvent) => {
      onDrag((move.clientX - start.current.x) * 2, (move.clientY - start.current.y) * 2);
      start.current = { x: move.clientX, y: move.clientY };
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      className="absolute -bottom-2 -right-2 z-20 h-5 w-5 cursor-nwse-resize rounded-sm border border-primary bg-cta shadow"
    />
  );
}

export function PhotoSizeEditor({
  initialSize,
  colors,
}: {
  initialSize: PhotoSize;
  colors: GlassColors;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSize);
  const [draft, setDraft] = useState(initialSize);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/photo-size", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Save failed");
      const size = (await response.json()) as PhotoSize;
      setSaved(size);
      setDraft(size);
      setStatus("Saved. Visitors now see this photo size.");
      router.refresh();
    } catch {
      setStatus("Could not save the photo size.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Photo size</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">
            Desktop photos stay square. Drag the desktop corner to change their width. On mobile,
            drag sideways for width and downward to make the photos taller.
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
              setDraft(defaultPhotoSize);
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
      <div className="grid gap-8">
        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-primary">
            Desktop · {draft.desktop}rem
          </p>
          <div className="rounded-lg bg-[#e4e7eb] px-6 py-8">
            <div className="relative mx-auto" style={{ width: `${draft.desktop}rem`, maxWidth: "100%" }}>
              <Pair colors={colors} className="grid grid-cols-2 items-start gap-5" frameClassName="aspect-square" />
              <ResizeHandle
                label="Resize desktop photos"
                onDrag={(deltaX) =>
                  setDraft((current) => ({
                    ...current,
                    desktop: Math.round(Math.min(56, Math.max(16, current.desktop + deltaX / 16)) * 10) / 10,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-primary">
            Mobile · {draft.mobile}% wide · {draft.mobileRatio}× tall
          </p>
          <div className="mx-auto w-[22rem] max-w-full rounded-lg bg-[#e4e7eb] px-3 py-8">
            <div className="relative mx-auto" style={{ width: `${draft.mobile}%` }}>
              <Pair
                colors={colors}
                className="grid grid-cols-2 items-start gap-3"
                frameStyle={{ aspectRatio: `1 / ${draft.mobileRatio}` }}
              />
              <ResizeHandle
                label="Resize mobile photos"
                onDrag={(deltaX, deltaY) =>
                  setDraft((current) => ({
                    ...current,
                    mobile: Math.round(Math.min(96, Math.max(48, current.mobile + deltaX / 3.2)) * 10) / 10,
                    mobileRatio:
                      Math.round(Math.min(2, Math.max(1, current.mobileRatio + deltaY / 140)) * 100) / 100,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
