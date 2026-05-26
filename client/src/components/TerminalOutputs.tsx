import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  profile, stats, journey, projects, skillCategories,
  education, achievements, certifications,
} from "@/lib/portfolio-data";
import { SkillGalaxy } from "./SkillGalaxy";

const Panel = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="glass relative overflow-hidden rounded-xl p-4"
  >
    {label && (
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/80">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
        {label}
      </div>
    )}
    {children}
  </motion.div>
);

export function OutAbout() {
  return (
    <Panel label="// identity.dat">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="font-display text-2xl font-semibold text-gradient">{profile.name}</div>
          <div className="font-mono text-xs text-primary/90 mt-1">{profile.taglines.join(" • ")}</div>
          <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{profile.fullBio}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.traits.map((t) => (
              <span key={t} className="rounded-full glass px-2.5 py-1 font-mono text-[10px] text-foreground/80">{t}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 content-start min-w-[180px]">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-lg p-2 text-center">
              <div className="font-display text-lg font-semibold text-glow">{s.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function OutSkills() {
  return (
    <Panel label="// skill.galaxy">
      <div className="grid gap-4 md:grid-cols-[auto_1fr] items-center">
        <SkillGalaxy compact />
        <div className="space-y-2">
          {skillCategories.map((c) => (
            <div key={c.cat} className="glass rounded-lg p-2.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-primary">{c.cat}</span>
                <span className="text-muted-foreground">{c.level}%</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-[oklch(0.7_0.22_325)]" style={{ width: `${c.level}%` }} />
              </div>
              <div className="mt-1 text-[10px] text-foreground/70">{c.items}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function OutProjects() {
  return (
    <Panel label="// project.stations">
      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group glass relative block overflow-hidden rounded-lg p-3 transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-widest text-accent">{p.tag}</span>
              <span className="font-mono text-[9px] text-primary opacity-0 transition-opacity group-hover:opacity-100">↗ open</span>
            </div>
            <div className="mt-1 font-display text-base font-semibold text-glow">{p.name}</div>
            <p className="mt-1 text-xs text-foreground/75">{p.desc}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[9px] text-foreground/70">{s}</span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </Panel>
  );
}

export function OutExperience() {
  return (
    <Panel label="// developer.journey">
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
        {journey.map((j, i) => (
          <motion.div key={j.year} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative mb-3 last:mb-0">
            <span className="absolute -left-[18px] top-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            <div className="font-mono text-[10px] text-primary">{j.year}</div>
            <div className="font-display text-sm font-semibold">{j.title}</div>
            <div className="text-xs text-foreground/75">{j.text}</div>
          </motion.div>
        ))}
        <div className="glass mt-3 rounded-lg p-2.5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">currently</div>
          <div className="text-xs text-foreground/85 mt-0.5">{profile.focus}</div>
        </div>
      </div>
    </Panel>
  );
}

export function OutContact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [phase, setPhase] = useState<"idle" | "transmitting" | "sent" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim() || form.name.length > 80) e.name = "name required (1–80 chars)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.email.length > 200) e.email = "valid email required";
    if (form.message.trim().length < 8 || form.message.length > 1000) e.message = "message 8–1000 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const transmit = async () => {
    if (!validate()) return;
    setPhase("transmitting");
    setLogs([]);
    const sequence = [
      "▸ opening secure channel …",
      "▸ encrypting payload (AES-256·GCM) …",
      `▸ routing via subspace relay → ${profile.email}`,
      "▸ awaiting handshake …",
      "▸ ✓ transmission acknowledged.",
    ];
    for (const line of sequence) {
      await new Promise((r) => setTimeout(r, 420));
      setLogs((l) => [...l, line]);
    }
    // open user's mail client as a real fallback
    const subject = encodeURIComponent(`Portal transmission from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} <${form.email}>`);
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, "_blank");
    setPhase("sent");
  };

  if (phase === "sent") {
    return (
      <Panel label="// transmission.complete">
        <div className="space-y-2 font-mono text-xs">
          {logs.map((l) => (
            <div key={l} className={l.includes("✓") ? "text-primary tracking-widest" : "text-accent/90"}>{l}</div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-lg p-4 text-center"
        >
          <div className="text-2xl">📡</div>
          <div className="mt-1 font-display text-lg text-glow">Signal received, {form.name.split(" ")[0] || "operator"}.</div>
          <div className="mt-1 text-xs text-foreground/75">A mail draft has opened in your client. Expect a reply within 24h.</div>
          <button
            onClick={() => { setPhase("idle"); setLogs([]); setForm({ name: "", email: "", message: "" }); }}
            className="mt-3 rounded-full glass px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/10"
          >▷ send another</button>
        </motion.div>
      </Panel>
    );
  }

  return (
    <Panel label="// transmission.channel">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-2.5">
          {(["name","email"] as const).map((k) => (
            <div key={k}>
              <label className="font-mono text-[10px] uppercase tracking-widest text-primary">{k}</label>
              <input
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                placeholder={k === "name" ? "operator handle" : "you@signal.dev"}
                className="mt-1 w-full rounded-md bg-black/40 border border-[var(--glass-border)] px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-primary focus:shadow-[0_0_18px_oklch(0.78_0.18_200/0.35)] transition"
                disabled={phase === "transmitting"}
                maxLength={k === "email" ? 200 : 80}
              />
              {errors[k] && <div className="mt-0.5 font-mono text-[10px] text-destructive">⚠ {errors[k]}</div>}
            </div>
          ))}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-primary">message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="encode your signal …"
              maxLength={1000}
              disabled={phase === "transmitting"}
              className="mt-1 w-full resize-none rounded-md bg-black/40 border border-[var(--glass-border)] px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-primary focus:shadow-[0_0_18px_oklch(0.78_0.18_200/0.35)] transition"
            />
            <div className="mt-0.5 flex justify-between font-mono text-[10px]">
              <span className={errors.message ? "text-destructive" : "text-muted-foreground"}>{errors.message ?? `${form.message.length}/1000`}</span>
              <span className="text-muted-foreground">enc · AES-256</span>
            </div>
          </div>
          <button
            onClick={transmit}
            disabled={phase === "transmitting"}
            className="group relative overflow-hidden rounded-full glass-strong px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary disabled:opacity-60"
            style={{ boxShadow: "0 0 24px oklch(0.78 0.18 200 / 0.35)" }}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {phase === "transmitting" ? "transmitting…" : "▷ transmit signal"}
              {phase !== "transmitting" && <span className="transition-transform group-hover:translate-x-1">→</span>}
            </span>
          </button>
          {phase === "transmitting" && (
            <div className="space-y-1 font-mono text-xs">
              {logs.map((l) => (
                <motion.div key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  className={l.includes("✓") ? "text-primary tracking-widest" : "text-accent/90"}>{l}</motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="grid content-start gap-2 min-w-[200px]">
          {[
            { k: "email", v: profile.email, href: `mailto:${profile.email}` },
            { k: "github", v: profile.github.replace("https://", ""), href: profile.github },
            { k: "linkedin", v: profile.linkedin.replace("https://", ""), href: profile.linkedin },
            { k: "location", v: profile.city, href: undefined },
          ].map((c) => (
            <a key={c.k} href={c.href}
              target={c.href?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="glass block rounded-lg p-2.5 transition hover:bg-white/5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-primary">{c.k}</div>
              <div className="font-mono text-[11px] text-foreground/90 break-all">{c.v}</div>
            </a>
          ))}
          <div className="font-mono text-[10px] text-muted-foreground mt-1">
            status: <span className="text-primary">{profile.status}</span>
            <br />open to: {profile.open}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function OutEducation() {
  return (
    <Panel label="// education.log">
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
        {education.map((e, i) => (
          <motion.div
            key={e.school}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative mb-3 last:mb-0"
          >
            <span className="absolute -left-[18px] top-2 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            <div className="glass rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="font-display text-sm font-semibold">{e.school}</div>
                <span className="font-mono text-[10px] text-primary">{e.year}</span>
              </div>
              <div className="text-xs text-foreground/75 mt-0.5">{e.degree}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">score</span>
                <span className="font-mono text-xs text-foreground/90">{e.score}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now(); const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}{suffix}</span>;
}

export function OutAchievements() {
  const metrics = [
    { label: "projects shipped", value: 10, suffix: "+" },
    { label: "repositories", value: 20, suffix: "+" },
    { label: "experience yrs", value: 2, suffix: "+" },
    { label: "certifications", value: 3, suffix: "+" },
  ];
  return (
    <Panel label="// achievements.dat">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass rounded-lg p-2.5 text-center">
            <div className="font-display text-xl font-semibold text-glow">
              <CountUp to={m.value} suffix={m.suffix} />
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {achievements.map((a, i) => (
          <motion.li
            key={a}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-2 text-sm text-foreground/85"
          >
            <span className="text-accent">◆</span>{a}
          </motion.li>
        ))}
      </ul>
    </Panel>
  );
}

export function OutCertifications() {
  return (
    <Panel label="// certifications.list">
      <ul className="space-y-1.5">
        {certifications.map((a) => (
          <li key={a} className="flex gap-2 text-sm text-foreground/85">
            <span className="text-primary">▷</span>{a}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function OutWhoami() {
  return (
    <Panel label="// whoami">
      <pre className="font-mono text-xs text-foreground/85 leading-relaxed whitespace-pre-wrap">
{`user      : ${profile.handle}
realname  : ${profile.name}
roles     : ${profile.taglines.join(", ")}
location  : ${profile.city}
status    : ${profile.status}
mood      : building cinematic web experiences ✦`}
      </pre>
    </Panel>
  );
}

export function OutHelp({ onRun }: { onRun: (cmd: string) => void }) {
  const cmds: [string, string][] = [
    ["about", "identity & bio"],
    ["skills", "skill galaxy & stack"],
    ["projects", "project stations"],
    ["galaxy", "warp to project galaxy"],
    ["experience", "developer journey"],
    ["education", "academic log"],
    ["achievements", "milestones"],
    ["certifications", "credentials"],
    ["contact", "transmission channels"],
    ["resume", "↓ download resume.pdf"],
    ["whoami", "current user"],
    ["matrix", "enter the matrix"],
    ["sudo reveal", "🗝 hidden directive"],
    ["clear", "wipe terminal"],
  ];
  return (
    <Panel label="// available.commands">
      <div className="grid gap-1.5 sm:grid-cols-2">
        {cmds.map(([c, d]) => (
          <button
            key={c}
            onClick={() => onRun(c)}
            className="glass group flex items-center justify-between rounded-md px-2.5 py-1.5 text-left transition hover:bg-white/5 hover:-translate-y-0.5"
          >
            <span className="font-mono text-xs text-primary">{c}</span>
            <span className="font-mono text-[10px] text-muted-foreground group-hover:text-foreground/80">{d}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 font-mono text-[10px] text-muted-foreground">
        tip: <kbd className="rounded bg-white/5 px-1">tab</kbd> autocompletes ·
        <kbd className="ml-1 rounded bg-white/5 px-1">↑/↓</kbd> recalls history ·
        <kbd className="ml-1 rounded bg-white/5 px-1">esc</kbd> closes
      </div>
    </Panel>
  );
}

export function OutMatrix() {
  const chars = "アイウエオカキクケコサシスセソタチツテト01ABXY∆ΩΣ$#*<>/{}";
  const cols = 56, rows = 9;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const lite = (window as any).__lite;
    if (lite) return;
    const id = setInterval(() => setTick((t) => t + 1), 110);
    return () => clearInterval(id);
  }, []);
  return (
    <Panel label="// matrix.stream">
      <div className="relative overflow-hidden rounded-md bg-black/40 p-2 font-mono text-[10px] leading-tight text-primary/85">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="whitespace-nowrap">
            {Array.from({ length: cols }).map((_, c) => {
              const seed = (r * 31 + c * 7 + tick * (c % 5 + 1)) | 0;
              const ch = chars[Math.abs(seed) % chars.length];
              const intensity = ((Math.sin(tick * 0.3 + c * 0.4 + r) + 1) / 2);
              return (
                <span key={c} style={{ opacity: 0.15 + intensity * 0.85, color: intensity > 0.85 ? "white" : undefined }}>
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>
      <div className="mt-2 font-mono text-[10px] text-accent">wake up, neo… try <span className="text-primary">sudo reveal</span></div>
    </Panel>
  );
}

export function OutSecret() {
  const lines = [
    "▸ bypassing firewall …",
    "▸ decrypting kernel …",
    "▸ authenticating ghost-protocol …",
    "▸ ACCESS GRANTED.",
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setShown((s) => (s < lines.length ? s + 1 : s)), 280);
    return () => clearInterval(id);
  }, []);
  return (
    <Panel label="// 🗝 classified.transmission">
      <div className="space-y-1 font-mono text-xs">
        {lines.slice(0, shown).map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={i === lines.length - 1 ? "text-primary tracking-widest font-semibold" : "text-accent/90"}
          >
            {l}
          </motion.div>
        ))}
      </div>
      {shown >= lines.length && (
        <motion.pre
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-lg p-3 font-mono text-xs text-foreground/85 whitespace-pre-wrap leading-relaxed"
        >
{`> portfolio_os v2.0.1 — built by ${profile.name}
> coffee.consumed : ∞
> bugs.squashed   : countless
> dreams.shipped  : in progress
> easter.egg      : you found the ghost in the machine 👻
> message         : "thanks for exploring — most don't make it this far."`}
        </motion.pre>
      )}
    </Panel>
  );
}

export function OutText({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs text-foreground/80 px-1">{children}</div>
  );
}
