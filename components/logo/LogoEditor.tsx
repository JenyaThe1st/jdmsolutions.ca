"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useRouter } from "next/navigation";
import {
  LOGO_ASPECT,
  defaultLogoPlacement,
  type LogoPlacement,
  type LogoSlot,
} from "@/lib/logoPlacement";

const SNAP_PERCENT = 2.5;

type Corner = "nw" | "ne" | "sw" | "se";

type StageProps = {
  label: string;
  slot: LogoSlot;
  onChange: (slot: LogoSlot) => void;
  frameClassName: string;
  frameHeight: string;
  showGrid: boolean;
  headerBackground: string;
  showZones: boolean;
};

function cornerSign(corner: Corner) {
  return {
    x: corner === "ne" || corner === "se" ? 1 : -1,
    y: corner === "sw" || corner === "se" ? 1 : -1,
  };
}

function LogoStage({
  label,
  slot,
  onChange,
  frameClassName,
  frameHeight,
  showGrid,
  headerBackground,
  showZones,
}: StageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef(slot);
  slotRef.current = slot;
  const [guides, setGuides] = useState({ x: false, y: false });

  const applyPoint = (xPx: number, yPx: number, width: number, height: number, logoHeight: number) => {
    const logoWidth = logoHeight * LOGO_ASPECT;
    let x = xPx;
    let y = yPx;
    const snapX = width * (SNAP_PERCENT / 100);
    const snapY = height * (SNAP_PERCENT / 100);
    const showX = Math.abs(x - width / 2) <= snapX;
    const showY = Math.abs(y - height / 2) <= snapY;
    if (showX) x = width / 2;
    if (showY) y = height / 2;

    const halfW = logoWidth / 2;
    const halfH = logoHeight / 2;
    x = halfW * 2 >= width ? width / 2 : Math.min(width - halfW, Math.max(halfW, x));
    y = halfH * 2 >= height ? height / 2 : Math.min(height - halfH, Math.max(halfH, y));

    setGuides({ x: showX, y: showY });
    onChange({
      x: (x / width) * 100,
      y: (y / height) * 100,
      height: (logoHeight / height) * 100,
    });
  };

  const onDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const frame = frameRef.current;
    if (!frame) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = frame.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = slotRef.current;
    const originX = (origin.x / 100) * rect.width;
    const originY = (origin.y / 100) * rect.height;
    const logoHeight = (origin.height / 100) * rect.height;

    const move = (moveEvent: PointerEvent) => {
      applyPoint(
        originX + (moveEvent.clientX - startX),
        originY + (moveEvent.clientY - startY),
        rect.width,
        rect.height,
        logoHeight
      );
    };
    const up = () => {
      setGuides({ x: false, y: false });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onResizeStart = (corner: Corner) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const frame = frameRef.current;
    if (!frame) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = frame.getBoundingClientRect();
    const origin = slotRef.current;
    const sign = cornerSign(corner);
    const cx = (origin.x / 100) * rect.width;
    const cy = (origin.y / 100) * rect.height;
    const logoHeight = (origin.height / 100) * rect.height;
    const logoWidth = logoHeight * LOGO_ASPECT;
    const fixed = {
      x: cx - sign.x * (logoWidth / 2),
      y: cy - sign.y * (logoHeight / 2),
    };

    const move = (moveEvent: PointerEvent) => {
      const px = moveEvent.clientX - rect.left;
      const py = moveEvent.clientY - rect.top;
      let nextWidth = (px - fixed.x) * sign.x;
      let nextHeight = (py - fixed.y) * sign.y;
      nextWidth = Math.max(rect.height * 0.12 * LOGO_ASPECT, nextWidth);
      nextHeight = Math.max(rect.height * 0.12, nextHeight);
      if (nextWidth / LOGO_ASPECT > nextHeight) nextHeight = nextWidth / LOGO_ASPECT;
      else nextWidth = nextHeight * LOGO_ASPECT;
      applyPoint(
        fixed.x + sign.x * (nextWidth / 2),
        fixed.y + sign.y * (nextHeight / 2),
        rect.width,
        rect.height,
        nextHeight
      );
    };
    const up = () => {
      setGuides({ x: false, y: false });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const handles: { corner: Corner; className: string }[] = [
    { corner: "nw", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" },
    { corner: "ne", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" },
    { corner: "sw", className: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" },
    { corner: "se", className: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" },
  ];

  return (
    <figure className="min-w-0">
      <figcaption className="mb-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-secondary">
        {label}
      </figcaption>
      <div
        ref={frameRef}
        className={`site-header relative overflow-hidden ${frameClassName}`}
        style={{ background: headerBackground, height: frameHeight }}
      >
        {showZones ? (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/3 z-20 w-px bg-white/80" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2/3 z-20 w-px bg-white/80" />
          </>
        ) : null}
        {showGrid ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.28) 1px, transparent 1px)",
              backgroundSize: "10% 10%",
            }}
          />
        ) : null}
        {guides.x ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-cta" />
        ) : null}
        {guides.y ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-cta" />
        ) : null}
        <div
          role="presentation"
          onPointerDown={onDragStart}
          className="absolute cursor-grab touch-none active:cursor-grabbing"
          style={{
            left: `${slot.x}%`,
            top: `${slot.y}%`,
            height: `${slot.height}%`,
            aspectRatio: `${LOGO_ASPECT}`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src="/images/jdm-header-logo.png"
            alt=""
            draggable={false}
            className="pointer-events-none h-full w-full object-contain"
          />
          {handles.map((handle) => (
            <button
              key={handle.corner}
              type="button"
              aria-label={`Resize from the ${handle.corner} corner`}
              onPointerDown={onResizeStart(handle.corner)}
              className={`absolute z-10 h-3 w-3 rounded-sm border border-primary bg-cta ${handle.className}`}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}

export function LogoEditor({
  initialPlacement,
  headerBackground,
  headerHeights,
}: {
  initialPlacement: LogoPlacement;
  headerBackground: string;
  headerHeights: { mobile: number; desktop: number };
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialPlacement);
  const [draft, setDraft] = useState(initialPlacement);
  const [showGrid, setShowGrid] = useState(true);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/logo-placement", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Save failed");
      const placement = (await response.json()) as LogoPlacement;
      setSaved(placement);
      setDraft(placement);
      setStatus("Saved. Visitors now see this placement.");
      router.refresh();
    } catch {
      setStatus("Could not save the logo placement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Logo placement</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">
            Drag the logo or pull a corner. Each preview keeps its own placement. Save stores it for every visitor.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="mr-2 flex items-center gap-2 text-sm text-primary">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(event) => setShowGrid(event.target.checked)}
            />
            Grid
          </label>
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
              setDraft(defaultLogoPlacement);
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
      <LogoStage
        label="Mobile"
        slot={draft.mobile}
        showGrid={showGrid}
        showZones
        headerBackground={headerBackground}
        frameClassName="mx-auto w-[390px] max-w-full"
        frameHeight={`${headerHeights.mobile}rem`}
        onChange={(mobile) => setDraft((current) => ({ ...current, mobile }))}
      />
      <LogoStage
        label="Desktop"
        slot={draft.desktop}
        showGrid={showGrid}
        showZones
        headerBackground={headerBackground}
        frameClassName="w-full"
        frameHeight={`${headerHeights.desktop}rem`}
        onChange={(desktop) => setDraft((current) => ({ ...current, desktop }))}
      />
    </section>
  );
}
