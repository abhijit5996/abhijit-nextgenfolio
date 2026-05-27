import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, type Project } from "@/lib/portfolio-data";
import { useGalaxyPositions, GalaxySvg, GalaxyCore, GalaxyNode, BASE_ORBITS, BASE_SIZE } from "./galaxy/GalaxyEngine";

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
  const positions = useGalaxyPositions(orbits, SIZE);

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

        <GalaxySvg size={SIZE} positions={positions} hover={hover} setHover={setHover} coreRadius={90} />

        {/* rotating decorative rings with comet */}
        {(["inner", "middle", "outer"] as const).map((band, i) => {
          const scale = SIZE / BASE_SIZE;
          const r = BASE_ORBITS[band] * scale;
          return (
            <div key={`spin-${band}`} className="absolute left-1/2 top-1/2 pointer-events-none" style={{ width: r * 2, height: r * 2, transform: "translate(-50%,-50%)", animation: `orbit ${60 + i * 30}s linear infinite ${i % 2 ? "reverse" : ""}` }}>
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: ["oklch(0.82 0.16 195)","oklch(0.65 0.22 305)","oklch(0.7 0.22 325)"][i], boxShadow: "0 0 18px currentColor", color: ["oklch(0.82 0.16 195)","oklch(0.65 0.22 305)","oklch(0.7 0.22 325)"][i] }} />
            </div>
          );
        })}

        {/* core */}
        <GalaxyCore size={SIZE} label="// core" count={`${projects.length}+`} onClick={() => setActive(projects[0])} />

        {/* project portals */}
        {positions.map(({ item, band, x, y }, i) => {
          const p = item as Project;
          const isHover = hover === p.name;
          const isDim = hover && !isHover;
          const small = band === "outer";
          return (
            <React.Fragment key={p.name}>
              <GalaxyNode item={p} x={x} y={y} isHover={isHover} isDim={isDim} onHover={(s: string | null) => setHover(s)} onClick={(it: any) => setActive(it)} small={small} />
              <AnimatePresence>
                {isHover && (
                  <motion.div
                    key={`tooltip-${p.name}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="pointer-events-none absolute left-[50%] top-[50%] z-20"
                    style={{ left: `${x}px`, top: `${y + 32}px`, translate: "-50% 0" }}
                  >
                    <div className="pointer-events-none absolute left-1/2 top-full mt-3 w-48 -translate-x-1/2 glass-strong rounded-lg p-2.5 text-left z-20">
                      <div className="font-mono text-[9px] tracking-widest text-accent">{p.tag}</div>
                      <div className="font-display text-sm font-semibold text-glow">{p.name}</div>
                      <div className="mt-1 text-[10px] text-foreground/75 leading-snug">{p.desc.slice(0, 70)}…</div>
                      <div className="mt-1.5 font-mono text-[9px] text-primary">▷ click to dock</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
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
