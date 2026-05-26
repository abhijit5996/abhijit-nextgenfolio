import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/portfolio-data";

export function ProjectGalaxy() {
  const [active, setActive] = useState<Project | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const orbits = useMemo(() => {
    const inner = projects.slice(0, Math.ceil(projects.length / 3));
    const middle = projects.slice(Math.ceil(projects.length / 3), Math.ceil(projects.length / 1.5));
    const outer = projects.slice(Math.ceil(projects.length / 1.5));
    return { inner, middle, outer };
  }, []);

  const SIZE = 680;
  const C = SIZE / 2;
  const R = { inner: 130, middle: 215, outer: 295 } as const;

  const positions = (["inner", "middle", "outer"] as const).flatMap((band) => {
    const list = orbits[band];
    const r = R[band];
    return list.map((p, i) => {
      const angle = (i / list.length) * Math.PI * 2 - Math.PI / 2 + (band === "middle" ? Math.PI / list.length : 0);
      return { p, band, x: C + Math.cos(angle) * r, y: C + Math.sin(angle) * r };
    });
  });

  return (
    <div className="relative">
      <div className="relative mx-auto" style={{ width: "min(100%, " + SIZE + "px)", aspectRatio: "1" }}>
        {/* radial nebula */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.65 0.22 305 / 0.22), oklch(0.78 0.18 200 / 0.10) 40%, transparent 72%)",
            filter: "blur(12px)",
          }}
        />

        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="pg-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.95 0.18 200)" stopOpacity="1" />
              <stop offset="60%" stopColor="oklch(0.65 0.22 305)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="pg-link" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.16 195)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="oklch(0.7 0.22 325)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* orbit rings */}
          {(["inner", "middle", "outer"] as const).map((band, i) => (
            <circle
              key={band}
              cx={C} cy={C} r={R[band]}
              fill="none"
              stroke="oklch(0.78 0.18 200 / 0.22)"
              strokeWidth={1}
              strokeDasharray={i === 0 ? undefined : i === 1 ? "3 7" : "1 10"}
            />
          ))}

          {/* connecting lines */}
          {positions.map(({ p, x, y }) => (
            <line
              key={`L-${p.name}`}
              x1={C} y1={C} x2={x} y2={y}
              stroke="url(#pg-link)"
              strokeWidth={hover === p.name ? 2 : 0.8}
              opacity={hover && hover !== p.name ? 0.12 : 1}
              style={{ transition: "all .3s" }}
            />
          ))}

          {/* constellation links between neighbors of outer ring */}
          {orbits.outer.map((p, i, arr) => {
            const a1 = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / arr.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <line key={`out-${p.name}`}
                x1={C + Math.cos(a1) * R.outer} y1={C + Math.sin(a1) * R.outer}
                x2={C + Math.cos(a2) * R.outer} y2={C + Math.sin(a2) * R.outer}
                stroke="oklch(0.78 0.18 200 / 0.22)" strokeWidth={0.6} strokeDasharray="2 4" />
            );
          })}

          {/* core glow */}
          <circle cx={C} cy={C} r={90} fill="url(#pg-core)" />
        </svg>

        {/* rotating decorative rings with comet */}
        {(["inner", "middle", "outer"] as const).map((band, i) => (
          <div key={`spin-${band}`}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: R[band] * 2, height: R[band] * 2,
              transform: "translate(-50%,-50%)",
              animation: `orbit ${60 + i * 30}s linear infinite ${i % 2 ? "reverse" : ""}`,
            }}>
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
              style={{
                background: ["oklch(0.82 0.16 195)","oklch(0.65 0.22 305)","oklch(0.7 0.22 325)"][i],
                boxShadow: "0 0 18px currentColor",
                color: ["oklch(0.82 0.16 195)","oklch(0.65 0.22 305)","oklch(0.7 0.22 325)"][i],
              }} />
          </div>
        ))}

        {/* core */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setActive(projects[0])}
          className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full glass-strong animate-pulse-glow z-10"
          aria-label="project core"
          style={{
            left: "50%", top: "50%",
          }}
        >
          <div className="text-center">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">// core</div>
            <div className="mt-0.5 font-display text-2xl font-bold text-gradient">{projects.length}+</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">stations</div>
          </div>
        </motion.button>

        {/* project portals */}
        {positions.map(({ p, band, x, y }, i) => {
          const isHover = hover === p.name;
          const isDim = hover && !isHover;
          const small = band === "outer";
          const pct = `${(x / SIZE) * 100}%`;
          const pcy = `${(y / SIZE) * 100}%`;
          return (
            <motion.button
              key={p.name}
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ opacity: isDim ? 0.35 : 1, scale: isHover ? 1.2 : 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 18 }}
              onMouseEnter={() => setHover(p.name)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(p.name)}
              onBlur={() => setHover(null)}
              onClick={() => setActive(p)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none ${small ? "h-12 w-12" : "h-16 w-16"}`}
              style={{ left: pct, top: pcy }}
            >
              <span className="absolute inset-0 rounded-full glass animate-pulse-glow" />
              <span className="absolute inset-1 grid place-items-center rounded-full bg-gradient-to-br from-primary/30 via-accent/30 to-[oklch(0.7_0.22_325/0.3)] font-mono text-[10px] font-bold text-primary-foreground">
                {p.tag.slice(0, 2)}
              </span>
              {isHover && (
                <span className="pointer-events-none absolute inset-[-8px] rounded-full"
                  style={{ boxShadow: "0 0 35px oklch(0.78 0.18 200 / 0.8), inset 0 0 16px oklch(0.78 0.18 200 / 0.4)" }} />
              )}
              <AnimatePresence>
                {isHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="pointer-events-none absolute left-1/2 top-full mt-3 w-48 -translate-x-1/2 glass-strong rounded-lg p-2.5 text-left z-20"
                  >
                    <div className="font-mono text-[9px] tracking-widest text-accent">{p.tag}</div>
                    <div className="font-display text-sm font-semibold text-glow">{p.name}</div>
                    <div className="mt-1 text-[10px] text-foreground/75 leading-snug">{p.desc.slice(0, 70)}…</div>
                    <div className="mt-1.5 font-mono text-[9px] text-primary">▷ click to dock</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> core orbit</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> mid orbit</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.7 0.22 325)" }} /> outer band</span>
        <span>· hover to scan · click to dock</span>
      </div>

      <AnimatePresence>
        {active && <ProjectStation p={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ProjectStation({ p, onClose }: { p: Project; onClose: () => void }) {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] grid place-items-center bg-background/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong scanline relative w-[min(960px,96vw)] max-h-[88vh] overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-widest text-accent">// station · {p.tag}</span>
            <span className="font-display text-base font-semibold text-glow">{p.name}</span>
          </div>
          <button onClick={onClose} className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-destructive border border-[oklch(0.62_0.24_25/0.4)] hover:bg-[oklch(0.62_0.24_25/0.18)]">✕ close</button>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-sm text-foreground/85 leading-relaxed">{p.desc}</p>
            <div className="mt-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">stack</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full glass px-2.5 py-1 font-mono text-[10px] text-foreground/85">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={p.url} target="_blank" rel="noreferrer"
                 className="glass rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10">↗ open live</a>
              <button onClick={() => setShowPreview((v) => !v)}
                 className="rounded-full hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground/85 hover:bg-white/5">
                {showPreview ? "hide preview" : "▶ live preview"}
              </button>
            </div>
            <div className="mt-4 font-mono text-[10px] text-muted-foreground">
              url: <a href={p.url} target="_blank" rel="noreferrer" className="text-primary break-all">{p.url}</a>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-[var(--glass-border)] bg-black/40">
            {showPreview ? (
              <iframe
                src={p.url}
                title={`${p.name} preview`}
                className="h-[420px] w-full"
                sandbox="allow-scripts allow-same-origin allow-popups"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full min-h-[280px] place-items-center p-6 text-center">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">// preview offline</div>
                  <div className="text-sm text-foreground/75">Dock with this station to stream a live preview.</div>
                  <button onClick={() => setShowPreview(true)}
                    className="mt-4 glass rounded-full px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10">
                    initiate stream →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
