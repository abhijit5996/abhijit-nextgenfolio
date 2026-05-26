import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HINTS = [
  "try `help` to see all commands",
  "psst… there's a hidden `sudo reveal`",
  "type `projects` to launch project stations",
  "`skills` opens the skill galaxy",
  "`whoami` reveals who you really are",
  "`matrix` if you're feeling brave…",
];

export function AIAssistant({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [hint, setHint] = useState(HINTS[0]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setHint(HINTS[Math.floor(Math.random() * HINTS.length)]);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-[320px]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="glass-strong relative mb-2 rounded-2xl p-3 pr-7"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
              aria-label="dismiss"
            >×</button>
            <div className="flex gap-2.5">
              <div className="relative h-9 w-9 shrink-0">
                <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-primary/70 to-accent/70" />
                <div className="absolute inset-[3px] grid place-items-center rounded-full bg-background/80 font-mono text-[10px] text-primary">
                  AI
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">assistant</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hint}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="font-mono text-xs text-foreground/85 leading-snug"
                  >
                    {hint}
                  </motion.div>
                </AnimatePresence>
                <div className="mt-2 flex flex-wrap gap-1">
                  {["help","about","projects"].map((c) => (
                    <button
                      key={c}
                      onClick={() => onCommand(c)}
                      className="rounded-full hairline px-2 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/10"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="glass-strong animate-pulse-glow grid h-12 w-12 place-items-center rounded-full"
          aria-label="open assistant"
        >
          <span className="font-mono text-xs text-primary">AI</span>
        </button>
      )}
    </div>
  );
}
