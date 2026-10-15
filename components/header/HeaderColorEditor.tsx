"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  defaultHeaderColors,
  generatePalette,
  headerGradient,
  heroGradient,
  normalizeHex,
  type HeaderColors,
} from "@/lib/headerColors";

type Zone = "left" | "center" | "right";

const columnZones: { id: Zone; label: string }[] = [
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
];

const rowZones: { id: Zone; label: string }[] = [
  { id: "left", label: "Top" },
  { id: "center", label: "Middle" },
  { id: "right", label: "Bottom" },
];

function ZoneControl({
  label,
  color,
  disabled,
  onChange,
}: {
  label: string;
  color: string;
  disabled?: boolean;
  onChange: (color: string) => void;
}) {
  const [hexInput, setHexInput] = useState(color);
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const apply = (next: string) => {
    const normalized = normalizeHex(next);
    if (!normalized) return;
    setHexInput(normalized);
    onChange(normalized);
  };

  return (
    <fieldset className="min-w-0 rounded-lg border border-neutral-light bg-white p-4" disabled={disabled}>
      <legend className="px-1 font-display text-sm font-bold uppercase tracking-[0.12em] text-primary">
        {label}
      </legend>
      <div className="mt-3 flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} color`}
          value={color}
          onChange={(event) => apply(event.target.value)}
          className="h-11 w-14 cursor-pointer border border-neutral-light bg-white"
        />
        <input
          aria-label={`${label} hex`}
          value={hexInput}
          spellCheck={false}
          onChange={(event) => {
            const next = event.target.value;
            setHexInput(next);
            const normalized = normalizeHex(next);
            if (normalized) onChange(normalized);
          }}
          onBlur={() => setHexInput(color)}
          className="w-full rounded-md border border-neutral-light px-3 py-2 font-mono text-sm uppercase text-primary"
        />
      </div>
      <button
        type="button"
        onClick={() => setPalette(generatePalette(color))}
        className="mt-3 rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary"
      >
        Generate Palette
      </button>
      {palette.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {palette.map((swatch) => (
            <button
              key={swatch}
              type="button"
              aria-label={`Use ${swatch}`}
              onClick={() => apply(swatch)}
              className="h-8 w-8 rounded-md border border-primary/30"
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}

export function HeaderColorEditor({
  title,
  description,
  endpoint,
  savedMessage,
  resetColors = defaultHeaderColors,
  initialColors,
  onPreview,
  showPreview = false,
  orientation = "columns",
}: {
  title: string;
  description: string;
  endpoint: string;
  savedMessage: string;
  resetColors?: HeaderColors;
  initialColors: HeaderColors;
  onPreview: (colors: HeaderColors) => void;
  showPreview?: boolean;
  orientation?: "columns" | "rows";
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialColors);
  const [draft, setDraft] = useState(initialColors);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const zones = orientation === "rows" ? rowZones : columnZones;
  const previewBackground = orientation === "rows" ? heroGradient(draft) : headerGradient(draft);

  const update = (next: HeaderColors) => {
    const mirrored = next.mirrorSides ? { ...next, right: next.left } : next;
    setDraft(mirrored);
    onPreview(mirrored);
  };

  const setZone = (zone: Zone, color: string) => {
    if (draft.mirrorSides && (zone === "left" || zone === "right")) {
      update({ ...draft, left: color, right: color });
      return;
    }
    update({ ...draft, [zone]: color });
  };

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Save failed");
      const colors = (await response.json()) as HeaderColors;
      setSaved(colors);
      setDraft(colors);
      onPreview(colors);
      setStatus(savedMessage);
      router.refresh();
    } catch {
      setStatus("Could not save these colors.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="mr-2 flex items-center gap-2 text-sm text-primary">
            <input
              type="checkbox"
              checked={draft.mirrorSides}
              onChange={(event) => update({ ...draft, mirrorSides: event.target.checked })}
            />
            {orientation === "rows" ? "Mirror Ends" : "Mirror Sides"}
          </label>
          {showPreview ? (
            <label className="mr-2 flex items-center gap-2 text-sm text-primary">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(event) => setShowGrid(event.target.checked)}
              />
              Grid
            </label>
          ) : null}
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
              update(resetColors);
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
      {showPreview ? (
        <div
          className="relative h-48 overflow-hidden rounded-lg"
          style={{ background: previewBackground }}
        >
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
          {orientation === "rows" ? (
            <>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-white/80" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-white/80" />
            </>
          ) : (
            <>
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-white/80" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2/3 w-px bg-white/80" />
            </>
          )}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {zones.map((zone) => (
          <ZoneControl
            key={zone.id}
            label={zone.label}
            color={draft[zone.id]}
            onChange={(color) => setZone(zone.id, color)}
          />
        ))}
      </div>
    </section>
  );
}
