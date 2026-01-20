"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

export default function HeroSelector({ defaultSeconds = 10, onSelect }: { defaultSeconds?: number; onSelect: (mode: "desktop" | "terminal" | "7sg56") => void }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  
  // Touch support (optional; not used for gating behavior)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const items = useMemo(
    () => [
      { key: "7sg56" as const, label: "7sg56", desc: "Curated for Professionals", disabled: false, comingSoon: false },
      { key: "desktop" as const, label: "Desktop", desc: "For developers and admirers", isDefault: true, disabled: false, comingSoon: false },
    ],
    []
  );
  const [index, setIndex] = useState(1); // default selection: Desktop OS

  // Retro roles with typewriter effect (slower)
  const roles = useMemo(() => [
    "FullStack Dev",
    "Game Designer",
    "LeetCoder",
    "Creative Coder",
  ], []);
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const full = roles[roleIdx];
    let delay = deleting ? 55 : 95; // typing speed
    if (!deleting && typed === full) delay = 1000; // pause at end
    if (deleting && typed === "") delay = 450; // pause at start
    const id = setTimeout(() => {
      if (!deleting) {
        if (typed === full) setDeleting(true);
        else setTyped(full.slice(0, typed.length + 1));
      } else {
        if (typed === "") {
          setDeleting(false);
          setRoleIdx((i) => (i + 1) % roles.length);
        } else setTyped(full.slice(0, typed.length - 1));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [typed, deleting, roleIdx, roles]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [paused, setPaused] = useState(false);
  // Countdown timer with pause support
  useEffect(() => {
    if (paused) return;
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [paused, seconds]);
  // Auto-boot when countdown ends (if not paused)
  useEffect(() => {
    if (!paused && seconds === 0) {
      onSelect("desktop");
    }
  }, [paused, seconds, onSelect]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => {
          let newIndex = (i - 1 + items.length) % items.length;
          // Skip disabled items
          while (items[newIndex]?.disabled && newIndex !== i) {
            newIndex = (newIndex - 1 + items.length) % items.length;
          }
          return newIndex;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => {
          let newIndex = (i + 1) % items.length;
          // Skip disabled items
          while (items[newIndex]?.disabled && newIndex !== i) {
            newIndex = (newIndex + 1) % items.length;
          }
          return newIndex;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const it = items[index];
        if (!it.disabled) {
          onSelect(it.key);
        }
      } else if (e.key.toLowerCase() === "p" || e.key === " ") {
        setPaused((p) => !p);
      }
    },
    [index, items, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Touch handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      // Navigate menu items
      if (isLeftSwipe) {
        setIndex((i) => {
          let newIndex = (i + 1) % items.length;
          while (items[newIndex]?.disabled && newIndex !== i) {
            newIndex = (newIndex + 1) % items.length;
          }
          return newIndex;
        });
      } else {
        setIndex((i) => {
          let newIndex = (i - 1 + items.length) % items.length;
          while (items[newIndex]?.disabled && newIndex !== i) {
            newIndex = (newIndex - 1 + items.length) % items.length;
          }
          return newIndex;
        });
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-4xl rounded-xl border border-zinc-800/50 bg-zinc-950/40 shadow-2xl backdrop-blur-md shadow-red-500/5"
      >
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/30 rounded-t-xl gap-2">
          <div className="text-xs sm:text-sm font-mono text-red-300">GRUB v2.06 — Boot Manager</div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="text-xs font-mono text-green-400">
              {paused ? "Auto boot paused" : "Auto boot Desktop OS in "}
              {!paused && <span className="text-green-300 font-bold text-sm">{seconds}</span>}
              {!paused && <span className="text-green-400">s</span>}
            </div>
            <button
              onClick={() => setPaused((p) => !p)}
              className="text-xs font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 text-zinc-200 touch-manipulation"
            >
              {paused ? "Continue" : "Pause"}
            </button>
          </div>
        </div>

        {/* Name + retro tagline */}
        <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-50">I&apos;m Sourish Ghosh</div>
          <div className="mt-2 font-mono text-green-400 text-sm md:text-base">
            {typed}
            <span className="ml-1 text-green-500 animate-pulse">|</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">Press Enter to continue • Use P to pause/resume</p>
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <a href="/sourish-ghosh-resume.pdf" download className="text-xs font-mono px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 text-zinc-200 touch-manipulation">Resume</a>
            <a href="https://github.com/7sg56" target="_blank" rel="noopener noreferrer" className="text-xs font-mono px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 text-zinc-200 touch-manipulation">GitHub</a>
          </div>
        </div>

        {/* Divider */}
        <div className="px-4 sm:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        </div>

        {/* Menu */}
        <div role="menu" aria-label="Boot menu" className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="mx-auto w-full max-w-2xl">
            {items.map((it, i) => {
              const selected = i === index;
              const isDisabled = it.disabled;
              return (
                <motion.button
                  key={it.key}
                  onClick={() => {
                    if (!isDisabled) {
                      onSelect(it.key);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isDisabled) {
                      setIndex(i);
                    }
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.03 }}
                  disabled={isDisabled}
                  className={[
                    "group relative w-full text-left rounded-md border border-zinc-800/70 px-3 sm:px-4 py-3 mb-3 touch-manipulation",
                    isDisabled 
                      ? "bg-zinc-950/30 opacity-50 cursor-not-allowed"
                      : selected
                        ? "bg-gradient-to-r from-zinc-900 to-zinc-900/40 shadow-inner"
                        : "bg-zinc-950/60 hover:bg-zinc-900/50 active:bg-zinc-900/40",
                  ].join(" ")}
                >
                  {/* Left accent and caret when selected */}
                  <span className="absolute left-0 top-0 h-full w-1 rounded-l-md"
                    style={{ 
                      background: selected && !isDisabled 
                        ? "linear-gradient(180deg,rgb(99, 239, 68) 0%,rgb(181, 220, 38) 100%)" 
                        : isDisabled 
                          ? "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)"
                          : "transparent" 
                    }}
                  />
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 sm:w-5 text-right font-mono text-zinc-500">
                      {selected && !isDisabled ? <span className="text-green-400">&gt;</span> : ""}
                      {isDisabled ? <span className="text-red-400">✗</span> : ""}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold tracking-tight flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 ${
                        isDisabled ? "text-zinc-500" : "text-zinc-100"
                      }`}>
                        <span className="text-sm sm:text-base">{it.label}</span>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {it.isDefault && <span className="text-xs text-zinc-500">(default)</span>}
                          {it.comingSoon && <span className="text-xs text-orange-400 font-mono">(coming soon)</span>}
                        </div>
                      </div>
                      <div className={`text-xs sm:text-sm ${isDisabled ? "text-zinc-600" : "text-zinc-400"}`}>
                        {it.desc}
                      </div>
                    </div>
                    {selected && !isDisabled && (
                      <div className="text-xs font-mono text-green-400 hidden sm:block">selected</div>
                    )}
                    {isDisabled && (
                      <div className="text-xs font-mono text-red-400 hidden sm:block">disabled</div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer help */}
        <div className="px-4 sm:px-8 pb-4 sm:pb-6">
          <div className="flex items-center justify-center text-xs font-mono text-zinc-500">
            <div className="text-center">Use ↑ ↓ to choose, Enter to boot • P to pause/resume</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
