import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Prefs = {
  reducedMotion: boolean;
  perfMode: boolean;
  setReducedMotion: (v: boolean) => void;
  setPerfMode: (v: boolean) => void;
  toggleLite: () => void;
};

const Ctx = createContext<Prefs | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [perfMode, setPerfMode] = useState(false);

  // hydrate from system + storage
  useEffect(() => {
    const sysReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const storedRM = localStorage.getItem("pref:reduced-motion");
    const storedPM = localStorage.getItem("pref:perf-mode");
    setReducedMotion(storedRM ? storedRM === "1" : sysReduced);
    setPerfMode(storedPM === "1");
  }, []);

  // sync to html class + storage + global flag
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("reduced-motion", reducedMotion);
    html.classList.toggle("perf-mode", perfMode);
    (window as any).__lite = reducedMotion || perfMode;
    localStorage.setItem("pref:reduced-motion", reducedMotion ? "1" : "0");
    localStorage.setItem("pref:perf-mode", perfMode ? "1" : "0");
  }, [reducedMotion, perfMode]);

  const toggleLite = () => {
    const next = !(reducedMotion || perfMode);
    setReducedMotion(next);
    setPerfMode(next);
  };

  return (
    <Ctx.Provider value={{ reducedMotion, perfMode, setReducedMotion, setPerfMode, toggleLite }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePreferences() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePreferences must be used within PreferencesProvider");
  return v;
}
