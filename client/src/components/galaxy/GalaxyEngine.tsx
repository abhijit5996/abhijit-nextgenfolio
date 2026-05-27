import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OrbitBand = "inner" | "middle" | "outer";

export const BASE_SIZE = 520;
export const BASE_ORBITS = { inner: 78, middle: 142, outer: 215 } as const;

export function useGalaxyPositions<T extends { name: string }>(groups: Record<OrbitBand, T[]>, size: number) {
  const c = size / 2;
  const scale = size / BASE_SIZE;
  return useMemo(() => {
    const ORBITS = { inner: BASE_ORBITS.inner * scale, middle: BASE_ORBITS.middle * scale, outer: BASE_ORBITS.outer * scale } as const;
    return ([("inner" as OrbitBand), ("middle" as OrbitBand), ("outer" as OrbitBand)] as const).flatMap((band) => {
      const list = groups[band];
      const r = ORBITS[band];
      return list.map((item, i) => {
        const angle = (i / list.length) * Math.PI * 2 - Math.PI / 2 + (band === "middle" ? Math.PI / list.length : 0);
        return { item, band, x: c + Math.cos(angle) * r, y: c + Math.sin(angle) * r };
      });
    });
  }, [groups, size]);
}

export function GalaxySvg({ size, positions, hover, setHover, coreRadius = 60 }: { size: number; positions: Array<any>; hover: string | null; setHover: (s: string | null) => void; coreRadius?: number; }) {
  const c = size / 2;
  const scale = size / BASE_SIZE;
  const ORBITS = { inner: BASE_ORBITS.inner * scale, middle: BASE_ORBITS.middle * scale, outer: BASE_ORBITS.outer * scale } as const;

  return (
    <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="g-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.95 0.16 195)" stopOpacity="1" />
          <stop offset="60%" stopColor="oklch(0.7 0.2 280)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="g-link" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 305)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {(["inner", "middle", "outer"] as const).map((o, i) => (
        <circle key={o} cx={c} cy={c} r={ORBITS[o]} fill="none" stroke="oklch(0.78 0.18 200 / 0.22)" strokeWidth={1}
          strokeDasharray={i === 1 ? "2 6" : i === 2 ? "1 9" : undefined} />
      ))}

      {positions.map(({ item, x, y }: any) => (
        <line key={`l-${item.name}`} x1={c} y1={c} x2={x} y2={y} stroke="url(#g-link)" strokeWidth={hover === item.name ? 1.6 : 0.7}
          opacity={hover && hover !== item.name ? 0.15 : 1} style={{ transition: "all .3s" }} />
      ))}

      {hover && (() => {
        const p = positions.find((q) => q.item.name === hover);
        if (!p) return null;
        return <circle cx={p.x} cy={p.y} r={28} fill="none" stroke="#7c3aed" strokeOpacity={0.5} strokeWidth={1} />;
      })()}

      <circle cx={c} cy={c} r={coreRadius * scale} fill="url(#g-core)" />
    </svg>
  );
}

export function GalaxyCore({ size, label, count, onClick }: { size: number; label?: string; count?: React.ReactNode; onClick?: () => void }) {
  const scale = size / BASE_SIZE;
  return (
    <motion.button whileHover={{ scale: 1.06 }} className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full glass-strong animate-pulse-glow"
      style={{ width: 96 * scale, height: 96 * scale }} onClick={onClick}>
      <div className="text-center">
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/80">{label ?? "// core"}</div>
        <div className="font-display text-xl font-bold text-gradient">{count}</div>
      </div>
    </motion.button>
  );
}

export function GalaxyNode({ item, x, y, isHover, isDim, onHover, onClick, small }: any) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: isDim ? 0.35 : 1, scale: isHover ? 1.25 : 1 }}
      transition={{ delay: 0.02, type: "spring", stiffness: 200, damping: 18 }}
      onMouseEnter={() => onHover(item.name)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(item.name)} onBlur={() => onHover(null)} onClick={() => onClick?.(item)}
      className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
      style={{ left: x, top: y }} aria-label={item.name}
    >
      <div className={`relative grid ${small ? "h-12 w-12" : "h-11 w-11"} place-items-center rounded-full glass`} style={{ boxShadow: `0 0 22px ${item.color || "#7c3aed"}55, inset 0 0 14px ${item.color || "#7c3aed"}33`, borderColor: `${item.color || "#7c3aed"}66` }}>
        <span className="font-mono text-[10px] font-bold tracking-tight" style={{ color: item.color || "#7c3aed" }}>{(item.name || "..").slice(0, 2).toUpperCase()}</span>
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: `0 0 30px ${item.color || "#7c3aed"}aa` }} />
      </div>
    </motion.button>
  );
}

export default {};
