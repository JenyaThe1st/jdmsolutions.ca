"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { headerGradient, type HeaderColors } from "@/lib/headerColors";
import { defaultHeaderSize, type HeaderSize } from "@/lib/headerSize";
import { LOGO_ASPECT, type LogoPlacement, type LogoSlot } from "@/lib/logoPlacement";

function HeightHandle({
  label,
  onDrag,
}: {
  label: string;
  onDrag: (deltaY: number) => void;
}) {
  const startY = useRef(0);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    startY.current = event.clientY;

    const onMove = (move: PointerEvent) => {
      onDrag(move.clientY - startY.current);
      startY.current = move.clientY;
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
      className="absolute -bottom-2 left-1/2 z-20 h-4 w-16 -translate-x-1/2 cursor-ns-resize rounded-sm border border-primary bg-cta shadow"
    />
  );
}

function HeaderPreview({
  label,
  heightRem,
  widthClassName,
  colors,
  slot,
  onDrag,
}: {
  label: string;
  heightRem: number;
  widthClassName: string;
  colors: HeaderColors;
  slot: LogoSlot;
  onDrag: (deltaY: number) => void;
}) {
  return (
    <div>
      <p className="mb-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-primary">
        {label} · {heightRem}rem
      </p>
      <div className={`relative ${widthClassName}`}>
        <div
          className="relative overflow-hidden shadow-lg"
          style={{ height: `${heightRem}rem`, background: headerGradient(colors) }}
        >
          <span
            className="absolute block max-w-none"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              height: `${slot.height}%`,
              aspectRatio: `${LOGO_ASPECT}`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src="/images/jdm-header-logo.png"
              alt=""
              width={2172}
              height={724}
              unoptimized
              className="h-full w-full object-contain"
            />
          </span>
        </div>
        <HeightHandle label={`Resize ${label} header`} onDrag={onDrag} />
      </div>
    </div>
  );
}

export function HeaderSizeEditor({
  initialSize,
  colors,
  placement,
  onPreview,
}: {
  initialSize: HeaderSize;
  colors: HeaderColors;
  placement: LogoPlacement;
  onPreview: (size: HeaderSize) => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSize);
  const [draft, setDraft] = useState(initialSize);
  const draftRef = useRef(initialSize);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (next: HeaderSize) => {
    draftRef.current = next;
    setDraft(next);
    onPreview(next);
  };

  const nudge = (key: keyof HeaderSize, deltaY: number, min: number, max: number) => {
    const current = draftRef.current;
    update({
      ...current,
      [key]: Math.round(Math.min(max, Math.max(min, current[key] + deltaY / 16)) * 1000) / 1000,
    });
  };

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/header-size", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Save failed");
      const size = (await response.json()) as HeaderSize;
      setSaved(size);
      setDraft(size);
      onPreview(size);
      setStatus("Saved. Visitors now see this header size.");
      router.refresh();
    } catch {
      setStatus("Could not save the header size.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Header size</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">
            Drag the bottom edge of each bar. Mobile and desktop heights are saved separately.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDraft(saved);
              onPreview(saved);
              setStatus("");
            }}
            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              update(defaultHeaderSize);
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
        <HeaderPreview
          label="Mobile"
          heightRem={draft.mobile}
          widthClassName="mx-auto w-[390px] max-w-full"
          colors={colors}
          slot={placement.mobile}
          onDrag={(deltaY) => nudge("mobile", deltaY, 4.5, 14)}
        />
        <HeaderPreview
          label="Desktop"
          heightRem={draft.desktop}
          widthClassName="w-full"
          colors={colors}
          slot={placement.desktop}
          onDrag={(deltaY) => nudge("desktop", deltaY, 3.5, 10)}
        />
      </div>
    </section>
  );
}
