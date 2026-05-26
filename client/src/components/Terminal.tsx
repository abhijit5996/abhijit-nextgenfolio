import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  OutAbout, OutSkills, OutProjects, OutExperience, OutContact,
  OutHelp, OutWhoami, OutMatrix, OutSecret, OutEducation,
  OutAchievements, OutCertifications, OutText,
} from "./TerminalOutputs";

type Entry = { id: number; cmd: string; node: ReactNode };

const COMMANDS = [
  "help","about","skills","projects","galaxy","experience","education",
  "achievements","certifications","contact","resume","whoami","matrix",
  "sudo reveal","clear",
];

export function Terminal({
  open, onClose, onMinimize,
}: { open: boolean; onClose: () => void; onMinimize: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const run = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") { setEntries([]); return; }
    let node: ReactNode;
    switch (cmd) {
      case "help": node = <OutHelp onRun={(c) => run(c)} />; break;
      case "about": node = <OutAbout />; break;
      case "skills": node = <OutSkills />; break;
      case "projects": node = <OutProjects />; break;
      case "experience": node = <OutExperience />; break;
      case "education": node = <OutEducation />; break;
      case "achievements": node = <OutAchievements />; break;
      case "certifications": node = <OutCertifications />; break;
      case "contact": node = <OutContact />; break;
      case "whoami": node = <OutWhoami />; break;
      case "matrix": node = <OutMatrix />; break;
      case "resume":
      case "cv":
      case "download resume":
        window.dispatchEvent(new CustomEvent("portfolio:resume"));
        node = <OutText>▸ initiating secure transmission of resume.pdf … check the holo-window.</OutText>;
        break;
      case "galaxy":
      case "stations":
        window.dispatchEvent(new CustomEvent("portfolio:scroll-galaxy"));
        node = <OutText>▸ warping to project.galaxy …</OutText>;
        break;
      case "sudo reveal":
      case "reveal": node = <OutSecret />; break;
      default:
        node = <OutText>command not found: <span className="text-destructive">{cmd}</span> — try <span className="text-primary">help</span></OutText>;
    }
    idRef.current += 1;
    setEntries((e) => [...e, { id: idRef.current, cmd, node }]);
    setHistory((h) => [cmd, ...h].slice(0, 50));
  }, []);

  // Boot sequence
  useEffect(() => {
    if (entries.length === 0 && open) {
      setEntries([
        { id: -3, cmd: "boot", node: <OutText>portfolio_os v2.0.1 — kernel loaded · neural-link established</OutText> },
        { id: -2, cmd: "boot", node: <OutText>session: <span className="text-primary">guest@abhijit.dev</span> · type <span className="text-primary">help</span> to explore</OutText> },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  // External command bus (HUD buttons, AI assistant)
  useEffect(() => {
    const h = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      if (cmd) run(cmd);
    };
    window.addEventListener("portfolio:run", h as EventListener);
    return () => window.removeEventListener("portfolio:run", h as EventListener);
  }, [run]);


  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (!input) { setSuggestion(""); return; }
    const m = COMMANDS.find((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase());
    setSuggestion(m ?? "");
  }, [input]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); setInput(""); setHistIdx(-1); }
    else if (e.key === "Tab") { e.preventDefault(); if (suggestion) setInput(suggestion); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const ni = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(ni); if (history[ni]) setInput(history[ni]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(histIdx - 1, -1);
      setHistIdx(ni); setInput(ni === -1 ? "" : history[ni] ?? "");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: -300, right: 300, top: -100, bottom: 200 }}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-1/2 top-1/2 z-50 w-[min(960px,94vw)] h-[min(680px,82vh)] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="glass-strong relative flex h-full w-full flex-col overflow-hidden rounded-2xl scanline">
            {/* titlebar */}
            <div
              className="flex cursor-grab items-center justify-between gap-3 border-b border-[var(--glass-border)] px-4 py-2.5 active:cursor-grabbing"
              onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <button onClick={onClose} title="close" className="h-3 w-3 rounded-full bg-[oklch(0.65_0.22_25)] hover:opacity-80" aria-label="close" />
                  <button onClick={onMinimize} title="minimize" className="h-3 w-3 rounded-full bg-[oklch(0.78_0.18_75)] hover:opacity-80" aria-label="minimize" />
                  <div className="h-3 w-3 rounded-full bg-[oklch(0.7_0.18_150)]" />
                </div>
                <div className="font-mono text-[11px] tracking-widest text-foreground/80">
                  <span className="text-primary">▷</span> TERMINAL <span className="text-muted-foreground">v2.0.1</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline-flex items-center gap-2">
                  <span>guest@abhijit.dev</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                </span>
                <button
                  onClick={onMinimize}
                  title="minimize (esc)"
                  className="glass rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/80 hover:bg-white/10"
                >— min</button>
                <button
                  onClick={onClose}
                  title="close (esc)"
                  className="rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-destructive border border-[oklch(0.62_0.24_25/0.4)] hover:bg-[oklch(0.62_0.24_25/0.18)]"
                >✕ close</button>
              </div>
            </div>

            {/* output */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 [scrollbar-width:thin]">
              {entries.map((e) => (
                <div key={e.id} className="space-y-1.5">
                  {!String(e.id).startsWith("-") && e.cmd !== "boot" && (
                    <div className="font-mono text-xs">
                      <span className="text-primary">guest@abhijit.dev</span>
                      <span className="text-muted-foreground">:~$ </span>
                      <span className="text-foreground">{e.cmd}</span>
                    </div>
                  )}
                  {e.node}
                </div>
              ))}
            </div>

            {/* prompt */}
            <div className="border-t border-[var(--glass-border)] px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-primary">guest@abhijit.dev</span>
                <span className="text-muted-foreground">:~$</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full bg-transparent outline-none caret-primary text-foreground placeholder:text-muted-foreground/50"
                    placeholder="type a command — try 'help'"
                  />
                  {suggestion && input && (
                    <div className="pointer-events-none absolute inset-0 flex items-center text-muted-foreground/50">
                      <span className="invisible">{input}</span>
                      <span>{suggestion.slice(input.length)}</span>
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground/60">⇥ tab</span>
                    </div>
                  )}
                </div>
                <span className="inline-block h-4 w-1.5 bg-primary animate-blink" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
