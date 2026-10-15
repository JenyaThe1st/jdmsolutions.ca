import type { CSSProperties, ReactNode } from "react";
import { glassFrameStyle, glassLiftStyle, glassSheenStyle, type GlassColors } from "@/lib/glassColors";
import { cn } from "@/lib/cn";

const RIM = 6;
const PHOTO_RADIUS = 22;

export function GlassFrame({
  colors,
  children,
  className,
  style,
}: {
  colors: GlassColors;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const outerRadius = PHOTO_RADIUS + RIM;

  return (
    <span
      className={cn(
        "relative block transition-transform duration-200 ease-out group-hover:-translate-y-1 group-active:translate-y-0.5",
        className,
      )}
      style={style}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ ...glassLiftStyle(colors), borderRadius: outerRadius }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ ...glassFrameStyle(colors), borderRadius: outerRadius }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[18%] h-[2px] rounded-full"
        style={{ ...glassSheenStyle(colors), top: 1 }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[22%] h-[2px] rounded-full"
        style={{ ...glassSheenStyle(colors), bottom: 1 }}
      />
      <span
        className="absolute z-10 overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"
        style={{ inset: RIM, borderRadius: PHOTO_RADIUS }}
      >
        {children}
      </span>
    </span>
  );
}
