import { useEffect, useRef, useState } from "react";

/**
 * GPU-friendly animated nebula background: layered canvas particles with
 * subtle parallax that reacts to cursor + scroll. No three.js needed.
 */
export function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const scroll = useRef(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [boost, setBoost] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 640 ? 90 : 180;
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.3 + 0.2,
      tw: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.5 ? 195 : Math.random() < 0.5 ? 290 : 325,
    }));

    const sysReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let t = 0;

    const draw = () => {
      const lite = !!(window as any).__lite || sysReduced;
      t += lite ? 0.002 : 0.008;
      ctx.clearRect(0, 0, w, h);

      // nebula gradients
      const mx = (mouse.current.x - 0.5) * (lite ? 10 : 40);
      const my = (mouse.current.y - 0.5) * (lite ? 10 : 40);

      const g1 = ctx.createRadialGradient(w * 0.25 + mx, h * 0.3 + my, 0, w * 0.25, h * 0.3, Math.max(w, h) * 0.6);
      g1.addColorStop(0, "hsla(290, 80%, 55%, 0.32)");
      g1.addColorStop(0.5, "hsla(260, 70%, 35%, 0.12)");
      g1.addColorStop(1, "hsla(260, 70%, 10%, 0)");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.8 - mx, h * 0.7 - my, 0, w * 0.8, h * 0.7, Math.max(w, h) * 0.55);
      g2.addColorStop(0, "hsla(195, 90%, 55%, 0.28)");
      g2.addColorStop(0.6, "hsla(210, 80%, 30%, 0.08)");
      g2.addColorStop(1, "hsla(210, 70%, 10%, 0)");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

      if (!lite) {
        const g3 = ctx.createRadialGradient(w * 0.55, h * 0.15, 0, w * 0.55, h * 0.15, Math.max(w, h) * 0.4);
        g3.addColorStop(0, "hsla(325, 90%, 60%, 0.18)");
        g3.addColorStop(1, "hsla(325, 90%, 10%, 0)");
        ctx.fillStyle = g3; ctx.fillRect(0, 0, w, h);

        // stars (skipped in lite mode for perf)
        for (const s of stars) {
          const px = (s.x * w + mx * s.z * 2) % w;
          const py = (s.y * h + my * s.z * 2 + scroll.current * s.z * 0.15) % h;
          const tw = 0.5 + 0.5 * Math.sin(t * (0.5 + s.z) + s.tw);
          ctx.beginPath();
          ctx.arc(px < 0 ? px + w : px, py < 0 ? py + h : py, s.r * (0.6 + tw * 0.7), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, ${60 + tw * 20}%, ${0.35 + tw * 0.55})`;
          ctx.shadowBlur = 8 * s.z;
          ctx.shadowColor = `hsla(${s.hue}, 90%, 70%, 0.8)`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      raf = lite ? (setTimeout(draw, 100) as unknown as number) : requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    const onScroll = () => { scroll.current = window.scrollY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(raf as unknown as ReturnType<typeof setTimeout>);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // listen for boot activation to briefly boost visuals
  useEffect(() => {
    const onBoost = () => {
      setBoost(true);
      window.setTimeout(() => setBoost(false), 900);
    };
    const onProgressPulse = () => {
      setBoost(true);
      window.setTimeout(() => setBoost(false), 520);
    };
    window.addEventListener("boot:activate", onBoost as EventListener);
    window.addEventListener("boot:progressComplete", onProgressPulse as EventListener);
    return () => {
      window.removeEventListener("boot:activate", onBoost as EventListener);
      window.removeEventListener("boot:progressComplete", onProgressPulse as EventListener);
    };
  }, []);

  // inject small styles for the boost effect
  useEffect(() => {
    if (typeof document === "undefined") return;
    const styleId = "nebula-boost-styles";
    if (document.getElementById(styleId)) return;
    const s = document.createElement("style");
    s.id = styleId;
    s.textContent = `
      .nebula-root.nebula-boost canvas { transform: scale(1.02); filter: brightness(1.12) contrast(1.05) blur(0.6px); transition: transform 700ms cubic-bezier(.2,.9,.2,1), filter 700ms cubic-bezier(.2,.9,.2,1); }
      .nebula-root.nebula-boost > div:first-child { opacity: 1 !important; }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div ref={rootRef} className={`nebula-root ${boost ? "nebula-boost" : ""}`}>
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,oklch(0.2_0.08_290/0.6),oklch(0.08_0.04_270)_60%)]" />
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(circle_at_center,transparent_55%,oklch(0.05_0.02_270/0.85))]" aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] mix-blend-overlay [background-image:repeating-linear-gradient(0deg,transparent_0,transparent_2px,oklch(1_0_0/0.4)_3px,transparent_4px)]" aria-hidden />
    </div>
  );
}
