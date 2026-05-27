import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NebulaBackground } from "@/components/NebulaBackground";
import { Terminal } from "@/components/Terminal";
import { AIAssistant } from "@/components/AIAssistant";
import { SkillGalaxy } from "@/components/SkillGalaxy";
import { ProjectGalaxy } from "@/components/ProjectGalaxy";
import { ResumeSequence } from "@/components/ResumeSequence";
import { BootSequence } from "@/components/BootSequence";
import { PreferencesProvider, usePreferences } from "@/lib/preferences";
import { profile, stats, projects } from "@/lib/portfolio-data";

export default function App() {
  return (
    <PreferencesProvider>
      <PortfolioApp />
    </PreferencesProvider>
  );
}

function PortfolioApp() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [time, setTime] = useState("");
  const [tagIdx, setTagIdx] = useState(0);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, perfMode, toggleLite } = usePreferences();
  const lite = reducedMotion || perfMode;
  const [showBoot, setShowBoot] = useState(() => {
    try {
      return typeof window !== "undefined" && !sessionStorage.getItem("bootSeen");
    } catch {
      return false;
    }
  });
  const [showMain, setShowMain] = useState(() => {
    try {
      return typeof window !== "undefined" && !!sessionStorage.getItem("bootSeen");
    } catch {
      return true;
    }
  });

  // Nebula runs beneath everything so we can blend into it — keep it mounted during boot

  useEffect(() => {
    document.title = "Abhijit Das — Developer OS";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        "Cinematic interactive portfolio of Abhijit Das — Full Stack Developer, AI/ML Enthusiast, Modern UI Engineer.",
      );
    }
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (lite) {
      setTagIdx(0);
      return;
    }
    const id = setInterval(() => setTagIdx((index) => (index + 1) % profile.taglines.length), 2800);
    return () => clearInterval(id);
  }, [lite]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "`" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setTerminalOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setTerminalOpen(false);
        setResumeOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onResume = () => setResumeOpen(true);
    const onScrollGalaxy = () => galaxyRef.current?.scrollIntoView({ behavior: lite ? "auto" : "smooth", block: "start" });
    const onRevealMain = () => setShowMain(true);
    window.addEventListener("portfolio:resume", onResume);
    window.addEventListener("portfolio:scroll-galaxy", onScrollGalaxy);
    window.addEventListener("portfolio:reveal", onRevealMain);
    return () => {
      window.removeEventListener("portfolio:resume", onResume);
      window.removeEventListener("portfolio:scroll-galaxy", onScrollGalaxy);
      window.removeEventListener("portfolio:reveal", onRevealMain);
    };
  }, [lite]);

  const runCommand = (command: string) => {
    setTerminalOpen(true);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("portfolio:run", { detail: command }));
    }, 250);
  };

  return (
    <main className="relative min-h-screen overflow-hidden font-display">
      <NebulaBackground />

      {showBoot && (
        <BootSequence
          onFinish={() => {
            setShowBoot(false);
            setShowMain(true);
          }}
        />
      )}

      <motion.div
        initial={false}
        animate={{ opacity: showMain ? 1 : 0, y: showMain ? 0 : 8 }}
        transition={{ duration: showMain ? 0.40 : 0, delay: showMain ? 0.40 : 0, ease: [0.16, 1, 0.3, 1] }}
        style={{ visibility: showMain ? "visible" : "hidden", pointerEvents: showMain ? "auto" : "none" }}
      >
          <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 90, scale: 1.05 }}
              className="grid h-9 w-9 place-items-center rounded-lg glass cursor-pointer"
              onClick={() => runCommand("whoami")}
            >
              <span className="font-mono text-xs font-bold text-primary">{profile.logo}</span>
            </motion.div>
            <div className="hidden font-mono text-[11px] tracking-[0.25em] text-foreground/80 sm:block">
              {profile.handle.toUpperCase()}<span className="text-primary">/&gt;</span>
            </div>
          </div>
          <div className="hidden items-center gap-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:flex">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              status <span className="text-primary">{profile.status}</span>
            </div>
            <div>
              system time <span className="text-foreground/90">{time}</span>
            </div>
            <div>
              loc <span className="text-foreground/90">IN-WB</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLite}
              title={lite ? "Disable performance mode" : "Enable performance mode (reduce motion)"}
              aria-pressed={lite}
              className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/85 hover:bg-white/5"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${lite ? "bg-[oklch(0.78_0.18_75)]" : "bg-primary animate-pulse-glow"}`} />
              {lite ? "lite" : "cinema"}
            </button>
            <button
              onClick={() => setResumeOpen(true)}
              className="glass hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
            >
              ↓ resume.pdf
            </button>
            <button
              onClick={() => setTerminalOpen(true)}
              className="glass group flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] text-primary transition hover:bg-primary/10"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              <span className="hidden sm:inline">initialize terminal</span>
              <span className="sm:hidden">&gt;_</span>
              <kbd className="ml-1 rounded bg-white/5 px-1 py-0.5 text-[9px] text-muted-foreground">⌘K</kbd>
            </button>
          </div>
        </div>
          </header>

      <aside className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        {[
          { l: ">_", c: "help" },
          { l: "◈", c: "about" },
          { l: "✦", c: "skills" },
          { l: "▢", c: "projects" },
          { l: "⌬", c: "galaxy" },
          { l: "↓", c: "resume" },
          { l: "✉", c: "contact" },
        ].map((button) => (
          <motion.button
            key={button.c}
            whileHover={{ scale: 1.12, x: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => runCommand(button.c)}
            title={button.c}
            className="glass grid h-10 w-10 place-items-center rounded-lg font-mono text-sm text-primary transition hover:bg-primary/10"
          >
            {button.l}
          </motion.button>
        ))}
      </aside>

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-24">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary/90">HELLO, I&apos;M</div>
            <h1 className="mt-3 font-display text-[clamp(3.2rem,9vw,7rem)] font-semibold leading-[0.95] tracking-tight text-glow">
              <span className="text-gradient">{profile.name.toUpperCase()}</span>
            </h1>
            <div className="mt-3 h-7 overflow-hidden">
              <motion.div
                key={tagIdx}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-sm tracking-[0.3em] text-primary uppercase"
              >
                {profile.taglines[tagIdx]}
              </motion.div>
            </div>
            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/75">{profile.bio}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTerminalOpen(true)}
                className="group relative overflow-hidden rounded-full glass-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary"
                style={{ boxShadow: "0 0 30px oklch(0.78 0.18 200 / 0.35)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  initialize terminal
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-primary/0 via-primary/15 to-accent/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setResumeOpen(true)}
                className="group relative rounded-full hairline px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/85 hover:bg-white/5"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="text-primary">↓</span> download resume
                </span>
              </motion.button>
              <button
                onClick={() => runCommand("galaxy")}
                className="rounded-full hairline px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/85 hover:bg-white/5"
              >
                project galaxy
              </button>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-4 gap-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-lg p-2.5 text-center cursor-default"
                >
                  <div className="font-display text-lg font-semibold text-glow">{stat.value}</div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div>
                location · <span className="text-primary">{profile.city.split(",")[0]}, IN</span>
              </div>
              <div className="hidden sm:block">
                scroll to explore <span className="inline-block animate-bounce">↓</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto hidden aspect-square w-full max-w-[520px] lg:block"
          >
            <Portal />
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">// preview · skill.galaxy</div>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">An ecosystem, not a list.</h2>
            <p className="mt-3 max-w-md text-foreground/75">
              Skills orbit a JavaScript core — inner orbit holds the daily-driven, outer orbit holds the experimental. Hover any node to inspect its signal.
            </p>
            <button onClick={() => runCommand("skills")} className="mt-6 rounded-full glass px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-primary hover:bg-primary/10">
              run `skills` →
            </button>
          </div>
          <div className="relative">
            <SkillGalaxy />
          </div>
        </div>
      </section>

      <section ref={galaxyRef} className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">// system · project.galaxy</div>
          <h2 className="font-display text-3xl font-semibold sm:text-5xl text-glow">{projects.length}+ live transmissions, one constellation.</h2>
          <p className="max-w-xl text-foreground/75">
            Each node is a real shipped project. Hover to scan, click to dock with the station and stream a live preview.
          </p>
        </div>
        <ProjectGalaxy />
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">// preview · project.stations</div>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Featured transmissions</h2>
          </div>
          <button onClick={() => runCommand("projects")} className="rounded-full hairline px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10">
            all projects →
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, index) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -6 }}
              transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass group relative overflow-hidden rounded-xl p-5 transition"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
              <div
                className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), oklch(0.78 0.18 200 / 0.18), transparent 40%)" }}
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-accent">{project.tag}</span>
                <span className="font-mono text-[10px] text-primary opacity-0 transition group-hover:opacity-100">↗ open</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-glow">{project.name}</h3>
              <p className="mt-1 text-sm text-foreground/75">{project.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {project.stack.map((stackItem) => (
                  <span key={stackItem} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[9px] text-foreground/70">
                    {stackItem}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl px-5 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">// system.whisper</div>
          <p className="mt-3 font-display text-xl text-foreground/85">"Not every section is visible. Some require a command."</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 font-mono text-[10px] text-muted-foreground">
            <span>try:</span>
            {[
              "whoami",
              "education",
              "achievements",
              "certifications",
              "matrix",
              "sudo reveal",
              "resume",
            ].map((command) => (
              <button key={command} onClick={() => runCommand(command)} className="rounded-full hairline px-2 py-0.5 text-primary hover:bg-primary/10">
                {command}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="relative border-t border-[var(--glass-border)] py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <div>© 2025 {profile.name} · portfolio_os v2.0.1</div>
          <div className="flex gap-4">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-primary">
              github
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary">
              linkedin
            </a>
            <a href={`mailto:${profile.email}`} className="hover:text-primary">
              email
            </a>
            <button onClick={() => setResumeOpen(true)} className="uppercase hover:text-primary">
              resume
            </button>
          </div>
        </div>
      </footer>

      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} onMinimize={() => setTerminalOpen(false)} />
      <ResumeSequence open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <AIAssistant onCommand={runCommand} />
        </motion.div>
    </main>
  );
}

function Portal() {
  return (
    <div className="relative h-full w-full">
      {[1, 0.78, 0.58, 0.4, 0.22].map((scale, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2 rounded-full hairline"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            transform: "translate(-50%, -50%)",
            animation: `orbit ${20 + index * 8}s linear infinite ${index % 2 ? "reverse" : ""}`,
            background:
              index === 4
                ? "radial-gradient(circle, oklch(0.78 0.18 200 / 0.55), oklch(0.65 0.22 305 / 0.25) 60%, transparent 80%)"
                : "transparent",
            boxShadow:
              index === 0
                ? "0 0 80px oklch(0.65 0.22 305 / 0.3), inset 0 0 60px oklch(0.78 0.18 200 / 0.18)"
                : "inset 0 0 40px oklch(0.78 0.18 200 / 0.12)",
          }}
        >
          {index < 4 && (
            <div
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary"
              style={{ boxShadow: "0 0 14px var(--primary)" }}
            />
          )}
        </div>
      ))}
      <div
        className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-glow"
        style={{ background: "radial-gradient(circle, oklch(0.85 0.18 195 / 0.9), oklch(0.6 0.22 290 / 0.4) 50%, transparent 75%)" }}
      />
      <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 opacity-60" style={{ background: "linear-gradient(to bottom, transparent, oklch(0.78 0.18 200 / 0.6), transparent)" }} />
      {["01", "△", "◇", "◈", "✦", "⌬"].map((character, index) => (
        <div
          key={index}
          className="absolute font-mono text-xs text-primary/70 animate-float"
          style={{
            left: `${20 + (index * 13) % 70}%`,
            top: `${15 + (index * 17) % 70}%`,
            animationDelay: `${index * 0.4}s`,
          }}
        >
          {character}
        </div>
      ))}
    </div>
  );
}