import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/lib/portfolio-data";

const ORBITS = { inner: 78, middle: 142, outer: 215 } as const;

export function SkillGalaxy({ compact = false }: { compact?: boolean }) {
  const size = compact ? 340 : 520;
  const c = size / 2;
  const scale = compact ? 0.68 : 1;
  const [hover, setHover] = useState<string | null>(null);

  const grouped = {
    inner: skills.filter((s) => s.orbit === "inner"),
    middle: skills.filter((s) => s.orbit === "middle"),
    outer: skills.filter((s) => s.orbit === "outer"),
  };

  // pre-compute every node's polar position so we can draw connecting lines
  const positions = (["inner", "middle", "outer"] as const).flatMap((orbit) => {
    const list = grouped[orbit];
    const r = ORBITS[orbit] * scale;
    return list.map((s, i) => {
      const angle = (i / list.length) * Math.PI * 2 - Math.PI / 2;
      return { s, x: c + Math.cos(angle) * r, y: c + Math.sin(angle) * r };
    });
  });

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* radial nebula backdrop */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.78 0.18 200 / 0.18), oklch(0.65 0.22 305 / 0.08) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* SVG: orbit rings + connection lines */}
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="sg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.95 0.16 195)" stopOpacity="1" />
            <stop offset="60%" stopColor="oklch(0.7 0.2 280)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="sg-link" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.65 0.22 305)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* orbit rings */}
        {(["inner", "middle", "outer"] as const).map((o, i) => (
          <circle
            key={o}
            cx={c} cy={c} r={ORBITS[o] * scale}
            fill="none"
            stroke="oklch(0.78 0.18 200 / 0.22)"
            strokeWidth={1}
            strokeDasharray={i === 1 ? "2 6" : i === 2 ? "1 9" : undefined}
          />
        ))}

        {/* link lines from core to every node */}
        {positions.map(({ s, x, y }) => (
          <line
            key={`l-${s.name}`}
            x1={c} y1={c} x2={x} y2={y}
            stroke="url(#sg-link)"
            strokeWidth={hover === s.name ? 1.6 : 0.7}
            opacity={hover && hover !== s.name ? 0.15 : 1}
            style={{ transition: "all .3s" }}
          />
        ))}

        {/* highlight ring on hover */}
        {hover && (() => {
          const p = positions.find((q) => q.s.name === hover);
          if (!p) return null;
          return (
            <circle cx={p.x} cy={p.y} r={28}
              fill="none" stroke={p.s.color} strokeOpacity={0.5} strokeWidth={1} />
          );
        })()}

        {/* core glow */}
        <circle cx={c} cy={c} r={60 * scale} fill="url(#sg-core)" />
      </svg>

      {/* rotating ring decorations */}
      {(["inner", "middle", "outer"] as const).map((o, i) => (
        <div
          key={`spin-${o}`}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: ORBITS[o] * 2 * scale,
            height: ORBITS[o] * 2 * scale,
            transform: "translate(-50%,-50%)",
            animation: `orbit ${50 + i * 22}s linear infinite ${i % 2 ? "reverse" : ""}`,
          }}
        >
          <div
            className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
            style={{ background: i === 0 ? "oklch(0.82 0.16 195)" : i === 1 ? "oklch(0.65 0.22 305)" : "oklch(0.7 0.22 325)",
                     boxShadow: "0 0 14px currentColor", color: "oklch(0.78 0.18 200)" }}
          />
        </div>
      ))}

      {/* core badge */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full glass-strong animate-pulse-glow"
      >
        <div className="text-center">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/80">// core</div>
          <div className="font-display text-xl font-bold text-gradient">JS</div>
          <div className="font-mono text-[8px] tracking-widest text-muted-foreground">{skills.length} modules</div>
        </div>
      </motion.div>

      {/* skill nodes */}
      {positions.map(({ s, x, y }, i) => {
        const isHover = hover === s.name;
        const isDim = hover && !isHover;
        return (
          <motion.button
            key={s.name}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: isDim ? 0.35 : 1, scale: isHover ? 1.25 : 1 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 18 }}
            onHoverStart={() => setHover(s.name)}
            onHoverEnd={() => setHover(null)}
            onFocus={() => setHover(s.name)}
            onBlur={() => setHover(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            style={{ left: x, top: y }}
            aria-label={s.name}
          >
            <div
              className="relative grid h-11 w-11 place-items-center rounded-full glass"
              style={{
                boxShadow: `0 0 22px ${s.color}55, inset 0 0 14px ${s.color}33`,
                borderColor: `${s.color}66`,
              }}
            >
              <span className="font-mono text-[10px] font-bold tracking-tight" style={{ color: s.color }}>
                {s.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: `0 0 30px ${s.color}aa` }} />
            </div>
            {/* tooltip */}
            <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md glass-strong px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="font-display text-xs font-semibold" style={{ color: s.color }}>{s.name}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="h-1 w-16 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.level}%`, background: s.color }} />
                </div>
                <span className="font-mono text-[9px] text-foreground/80">{s.level}%</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
