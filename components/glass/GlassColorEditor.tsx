"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GlassFrame } from "@/components/glass/GlassFrame";
import { generatePalette, normalizeHex } from "@/lib/headerColors";
import { defaultGlassColors, type GlassColors } from "@/lib/glassColors";

const fields: { id: keyof GlassColors; label: string }[] = [
  { id: "highlight", label: "Highlight" },
  { id: "tint", label: "Tint" },
  { id: "depth", label: "Depth" },
];

function ColorControl({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
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
    <fieldset className="min-w-0 rounded-lg border border-neutral-light bg-white p-4">
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

export function GlassColorEditor({ initialColors }: { initialColors: GlassColors }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialColors);
  const [draft, setDraft] = useState(initialColors);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/glass-colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw new Error("Save failed");
      const colors = (await response.json()) as GlassColors;
      setSaved(colors);
      setDraft(colors);
      setStatus("Saved. Visitors now see this glass.");
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
          <h2 className="font-display text-3xl font-bold text-primary">Glass colors</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">
            Highlight, tint, and depth color the liquid glass frame around each photo. The frame
            updates as you change a color.
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
              setDraft(defaultGlassColors);
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
      <div
        className="flex justify-center rounded-lg px-6 py-10"
        style={{ background: "linear-gradient(160deg, #efe4e4 0%, #8d8080 100%)" }}
      >
        <GlassFrame colors={draft} className="aspect-square w-44">
          <Image
            src="/images/services/garage-doors.jpg"
            alt=""
            fill
            sizes="11rem"
            className="object-cover"
          />
        </GlassFrame>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {fields.map((field) => (
          <ColorControl
            key={field.id}
            label={field.label}
            color={draft[field.id]}
            onChange={(color) => setDraft({ ...draft, [field.id]: color })}
          />
        ))}
      </div>
    </section>
  );
}
