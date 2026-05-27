import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const maxDuration = 3600; // target total in ms (≈3.6s)

  useEffect(() => {
    // quick orchestrated timings to keep total under ~4s
    const timers: number[] = [];

    // Phase 1: environment fade-in (300ms)
    timers.push(window.setTimeout(() => setPhase(1), 300));

    // Phase 2: show INITIALIZING heading shortly after
    timers.push(
      window.setTimeout(() => {
        setPhase(2);
        // begin typing simulation
        typeLine(0);
      }, 520),
    );

    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeLine = (lineIdx: number) => {
    if (lineIdx >= LINES.length) {
      // all typed -> progress
      setPhase(3);
      // progress then welcome reveal
      setTimeout(() => setPhase(4), 600);
      setTimeout(() => setPhase(5), 1100);
      setTimeout(() => setPhase(6), 1600);
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

  const handleEnter = () => {
    // dissolve transition
    setVisible(false);
    sessionStorage.setItem("bootSeen", "1");
    setTimeout(() => onFinish?.(), 450);
  };

  const handleSkip = () => {
    sessionStorage.setItem("bootSeen", "1");
    setVisible(false);
    setTimeout(() => onFinish?.(), 240);
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

            {/* floating panels */}
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/3 flex gap-4">
              <motion.div initial={{ y: -12 }} animate={{ y: [ -12, 6, -12 ] }} transition={{ duration: 4, repeat: Infinity }} className="glass-strong rounded-2xl w-64 p-4 opacity-90 backdrop-blur-md">
                <div className="h-2 w-20 rounded-full bg-gradient-to-r from-primary to-accent opacity-80" />
                <div className="mt-3 h-6 w-full rounded bg-white/3" />
              </motion.div>
              <motion.div initial={{ y: 6 }} animate={{ y: [6, -8, 6] }} transition={{ duration: 5, repeat: Infinity }} className="glass rounded-2xl w-44 p-3 opacity-85 backdrop-blur-sm">
                <div className="h-2 w-12 rounded-full bg-primary/70" />
                <div className="mt-2 h-4 w-full rounded bg-white/4" />
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-2xl px-6 text-center">
            <div className="mb-6 text-sm font-mono uppercase tracking-widest text-foreground/60">INITIALIZING SYSTEM...</div>

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
                  <div className="relative mx-auto h-4 w-full max-w-md overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: progressValue.width }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_20px_#7c3aed66]"
                    />
                    <div className="absolute right-2 top-0 text-[11px] font-mono uppercase tracking-widest text-foreground/80">100%</div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: phase >= 5 ? 1 : 0, scale: phase >= 5 ? 1 : 0.98 }}
                transition={{ duration: 0.45 }}
                className="mt-6 text-center"
              >
                <div className="font-display text-3xl leading-tight text-foreground/95">WELCOME TO</div>
                <div className="mt-1 font-mono text-4xl font-bold tracking-wider text-glow">ABHIJIT_DAS.OS</div>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={handleEnter}
                    className="glass-strong rounded-xl px-6 py-3 font-mono text-sm uppercase tracking-widest text-foreground/95 transition-transform hover:scale-105"
                  >
                    ENTER
                  </button>
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
`;
  document.head.appendChild(style);
}
