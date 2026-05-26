import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/portfolio-data";

const STEPS = [
  "establishing secure link…",
  "authenticating identity token…",
  "decrypting resume.pdf …",
  "running integrity check ✓",
  "preparing transmission packet…",
  "DOWNLOAD READY",
];

export function ResumeSequence({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const downloadedRef = useRef(false);

  useEffect(() => {
    if (!open) { setStep(0); setProgress(0); downloadedRef.current = false; return; }
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 9 + 4;
      if (p >= 100) { p = 100; clearInterval(id); }
      setProgress(p);
      setStep(Math.min(STEPS.length - 1, Math.floor((p / 100) * STEPS.length)));
      if (p >= 100 && !downloadedRef.current) {
        downloadedRef.current = true;
        triggerDownload();
      }
    }, 220);
    return () => clearInterval(id);
  }, [open]);

  const triggerDownload = () => {
    const a = document.createElement("a");
    a.href = profile.resumeUrl;
    a.download = profile.resumeFilename;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-background/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong scanline relative w-[min(560px,92vw)] overflow-hidden rounded-2xl p-7"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              // transmission · resume.pdf
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-glow">
              {profile.name} — Curriculum Vitae
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              format: PDF · 1.2 MB · signed by abhijit.dev
            </div>

            <div className="mt-6 space-y-1.5 font-mono text-xs text-foreground/80 min-h-[120px]">
              {STEPS.slice(0, step + 1).map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === STEPS.length - 1 ? "text-primary font-semibold tracking-widest" : ""}
                >
                  <span className="text-primary mr-2">▸</span>{s}
                </motion.div>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>uplink</span><span>{Math.floor(progress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-[oklch(0.7_0.22_325)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                download={profile.resumeFilename}
                className="glass rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-primary hover:bg-primary/10"
              >
                ↓ download manually
              </a>
              <button
                onClick={onClose}
                className="rounded-full hairline px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-foreground/80 hover:bg-white/5"
              >
                close [esc]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
