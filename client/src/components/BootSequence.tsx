import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

type Props = {
  onFinish?: () => void;
};

const LINES = [
  "> Loading Portfolio Engine",
  "> Fetching Projects",
  "> Syncing Developer Profile",
  "> Launching Interface",
];

export function BootSequence({ onFinish }: Props) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Initializing...");
  const [exiting, setExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ambientTweenRef = useRef<any>(null);
  const exitTlRef = useRef<any>(null);

  const maxDuration = 3600; // target total in ms (≈3.6s)

  useEffect(() => {
    // quick orchestrated timings to keep total under ~4s
    const timers: number[] = [];

    // Phase 1: environment fade-in (300ms)
    timers.push(window.setTimeout(() => setPhase(1), 300));

    // Phase 2: show INITIALIZING heading shortly after and start ambient tween
    timers.push(
      window.setTimeout(() => {
        setPhase(2);
        // begin typing simulation
        typeLine(0);
        // ambient breathing tween
        if (containerRef.current) {
          ambientTweenRef.current = gsap.to(containerRef.current, { scale: 1.02, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
        }
      }, 520),
    );

    // build exit timeline (paused) to be played on ENTER/Skip
    if (containerRef.current) {
      exitTlRef.current = gsap.timeline({ paused: true });
      exitTlRef.current.addLabel("zoomStart");
      exitTlRef.current.to(containerRef.current, { scale: 1.06, duration: 0.6, ease: "power3.out" }, "zoomStart");
      exitTlRef.current.to(containerRef.current, { y: -6, duration: 0.6, ease: "power3.out" }, "zoomStart");
      exitTlRef.current.addLabel("zoomSettle");
      exitTlRef.current.to(containerRef.current, { scale: 0.995, y: -2, duration: 0.9, ease: "elastic.out(1,0.6)" }, ">0.05");
      // subtle post-zoom drift + fade
      exitTlRef.current.to(containerRef.current, { x: 0, y: 0, scale: 0.98, opacity: 0, duration: 0.48, ease: "power2.inOut" }, ">0.2");
      exitTlRef.current.call(() => {
        try { window.dispatchEvent(new CustomEvent("boot:activate")); } catch {}
      }, null, ">-0.4");
      exitTlRef.current.eventCallback("onComplete", () => {
        setVisible(false);
        onFinish?.();
      });
    }

    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeLine = (lineIdx: number) => {
    if (lineIdx >= LINES.length) {
      // all typed -> progress
      setPhase(3);
      // orchestrate staged progress
      setTimeout(() => runProgressSequence(), 300);
      return;
    }

    const line = LINES[lineIdx];
    let pos = 0;
    const speed = Math.max(6, Math.floor(line.length * 8 / (maxDuration / 1000))); // fast
    const id = window.setInterval(() => {
      pos++;
      setTyped((prev) => {
        const copy = [...prev];
        copy[lineIdx] = line.slice(0, pos);
        return copy;
      });
      if (pos >= line.length) {
        clearInterval(id);
        setCurrentIdx((i) => i + 1);
        // small pause between lines
        setTimeout(() => typeLine(lineIdx + 1), 110);
      }
    }, speed);
  };

  const runProgressSequence = () => {
    // stages with percentages and labels
    const stages = [
      { pct: 12, label: "Loading modules" },
      { pct: 37, label: "Syncing developer profile" },
      { pct: 68, label: "Building interface" },
      { pct: 92, label: "Finalizing environment" },
      { pct: 100, label: "Access Granted" },
    ];

    // faster, staged timings aimed at ~4s total experience
    let t = 0;
    const timers: number[] = [];
    // timings chosen to feel intelligent but snappy
    const increments = [420, 420, 520, 360];
    for (let i = 0; i < stages.length; i++) {
      const delay = t;
      timers.push(
        window.setTimeout(() => {
          setProgressLabel(stages[i].label);
          setProgressPct(stages[i].pct);
        }, delay),
      );
      t += increments[i] ?? 320;
    }

    // after completion, reveal welcome with cinematic timing (compact)
    timers.push(
      window.setTimeout(() => {
        setPhase(4);
        window.setTimeout(() => setPhase(5), 320);
        window.setTimeout(() => setPhase(6), 680);
        // let others (nebula) know progress finished so timeline can sync
        try {
          window.dispatchEvent(new CustomEvent("boot:progressComplete"));
        } catch {}
      }, t + 180),
    );
  };

  const handleEnter = () => {
    // cinematic activation: play shared exit timeline
    setExiting(true);
    sessionStorage.setItem("bootSeen", "1");
    try { window.dispatchEvent(new CustomEvent("portfolio:reveal")); } catch {}
    if (ambientTweenRef.current) ambientTweenRef.current.timeScale(0.85);
    if (exitTlRef.current) {
      exitTlRef.current.timeScale(1);
      exitTlRef.current.play();
    } else {
      try { window.dispatchEvent(new CustomEvent("boot:activate")); } catch {}
      setVisible(false);
      onFinish?.();
    }
  };

  const handleSkip = () => {
    // faster path but still cinematic
    setExiting(true);
    sessionStorage.setItem("bootSeen", "1");
    try { window.dispatchEvent(new CustomEvent("portfolio:reveal")); } catch {}
    if (ambientTweenRef.current) ambientTweenRef.current.timeScale(0.6);
    if (exitTlRef.current) {
      exitTlRef.current.timeScale(1.6);
      exitTlRef.current.play();
    } else {
      try { window.dispatchEvent(new CustomEvent("boot:activate")); } catch {}
      setVisible(false);
      onFinish?.();
    }
  };

  const progressValue = useMemo(() => ({ width: "100%" }), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(1200px_600px_at_10%_20%,rgba(103,97,255,0.18),transparent),linear-gradient(180deg,#050217 0%,#0b0f1a 100%)]"
        >
          <div className="absolute inset-0 overflow-hidden">
            {/* subtle animated gradient and streaks */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_10%,rgba(124,58,237,0.12),transparent)] blur-2xl" />
              <div className="absolute -left-1/4 top-1/3 h-1/3 w-3/4 transform rotate-6 bg-gradient-to-r from-transparent via-[rgba(99,102,241,0.12)] to-transparent opacity-80 animate-slow-pan blur-md" />
              <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.06" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.06" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#g1)" />
              </svg>
              {/* grid */}
              <div className="absolute inset-0 -z-9 opacity-40">
                <div className="absolute inset-0 bg-grid" />
              </div>
            </div>

            {/* floating panels removed for cleaner cinematic composition */}
          </div>

          <div ref={containerRef} className={`relative z-10 mx-auto w-full max-w-2xl px-6 text-center ${exiting ? "boot-exit" : ""}`}>
            <div className="mb-6 text-sm font-mono uppercase tracking-widest text-foreground/60">INITIALIZING SYSTEM...</div>

            <div className={`boot-noise`} aria-hidden />

            <div className="mx-auto max-w-xl rounded-2xl bg-white/3 p-6 backdrop-blur-sm shadow-2xl">
              <div className="min-h-[96px]">
                <div className="font-mono text-left text-[13px] text-foreground/85">
                  {LINES.map((line, idx) => (
                    <div key={line} className="mb-1 h-5 overflow-hidden">
                      <span className="inline-block align-middle text-primary">{idx === 0 ? "\u003e" : "\u003e"}</span>
                      <span className="ml-2">{typed[idx] ?? (idx < currentIdx ? line : "")}</span>
                      {idx === currentIdx && (
                        <span className="ml-1 inline-block h-5 w-1 animate-blink bg-foreground" />
                      )}
                    </div>
                  ))}
                </div>

                {/* progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-foreground/70">{progressLabel}</div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-foreground/80">{progressPct}%</div>
                  </div>
                  <div className="relative mx-auto h-4 w-full max-w-md overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_20px_#7c3aed66]"
                    />
                    <motion.div
                      className="absolute -right-6 top-[-6px] h-16 w-16 rounded-full pointer-events-none opacity-60 blur-[12px]"
                      animate={{ x: progressPct >= 100 ? 10 : 0, opacity: progressPct >= 100 ? 1 : 0.3 }}
                      transition={{ duration: 0.7 }}
                      style={{ background: "radial-gradient(circle, rgba(124,58,237,0.8), transparent 40%)" }}
                    />
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, filter: "blur(2px)" }}
                animate={{ opacity: phase >= 5 ? 1 : 0, scale: phase >= 5 ? 1 : 0.96, filter: phase >= 5 ? "blur(0px)" : "blur(2px)" }}
                transition={{ duration: 0.65, ease: [0.2, 0.9, 0.2, 1] }}
                className="mt-6 text-center"
              >
                <div className="font-display text-3xl leading-tight text-foreground/95 drop-shadow-[0_8px_24px_rgba(124,58,237,0.12)]">WELCOME TO</div>
                <div className="mt-1 font-mono text-4xl font-bold tracking-wider text-glow transform-gpu" style={{ textShadow: "0 8px 40px rgba(124,58,237,0.18)" }}>ABHIJIT_DAS.OS</div>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <motion.button
                    onClick={handleEnter}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-strong rounded-xl px-6 py-3 font-mono text-sm uppercase tracking-widest text-foreground/95 transition-transform"
                    style={{ boxShadow: exiting ? "0 0 80px rgba(124,58,237,0.28)" : undefined }}
                  >
                    ENTER
                  </motion.button>
                  <button onClick={handleSkip} className="rounded-xl px-4 py-2 font-mono text-sm text-muted-foreground hover:text-foreground">
                    Skip Intro
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Small helper CSS injected to reproduce subtle grid & animations without touching global styles */
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = `
.bg-grid { background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 28px 28px, 28px 28px; }
.animate-slow-pan { animation: slowpan 12s linear infinite; }
@keyframes slowpan { 0% { transform: translateX(-6%) translateY(0) rotate(6deg); } 50% { transform: translateX(6%) translateY(-2%) rotate(6deg); } 100% { transform: translateX(-6%) translateY(0) rotate(6deg); } }
.animate-blink { animation: blink 1s steps(2,end) infinite; }
@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }

/* cinematic warp/glitch exit */
.boot-exit { transform-origin: 50% 50%; animation: boot-warp 760ms cubic-bezier(.2,.9,.2,1) forwards; }
@keyframes boot-warp {
  0% { transform: scale(1) rotate(0deg) translateY(0); filter: none; }
  40% { transform: scale(1.06) rotate(0.6deg) translateY(-6px); filter: brightness(1.06) saturate(1.05); }
  70% { transform: scale(1.02) rotate(-0.4deg) translateY(-2px); filter: brightness(1.02) saturate(1.02); }
  100% { transform: scale(0.98) rotate(0deg) translateY(0); filter: blur(1px) contrast(1.02) brightness(1.04); opacity: 0; }
}

/* noise/glitch overlay used during exit */
.boot-noise {
  position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen; opacity: 0; transition: opacity 420ms ease;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="1" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(%23n)" fill="white"/></svg>');
  background-size: 200% 200%;
}
.boot-exit .boot-noise { opacity: 0.22; animation: noise-shift 760ms linear forwards; }
@keyframes noise-shift { 0% { background-position: 0% 0% } 100% { background-position: 100% 50% } }

`;
    document.head.appendChild(style);
  }
