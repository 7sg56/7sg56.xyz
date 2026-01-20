"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Apple, Settings, Power, Info, Command } from "lucide-react";

export default function MenuBar({ hidden = false, title = "7sg56", showSystemMenu = false, terminalHref = "/terminal", shutdownHref = "/gui" }: { hidden?: boolean; title?: string; showSystemMenu?: boolean; terminalHref?: string; shutdownHref?: string }) {
  const [now, setNow] = useState<string>("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleString());
    update();
    const t = setInterval(update, 1000 * 30);
    return () => clearInterval(t);
  }, []);

  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleAction = (action: "shutdown" | "terminal" | "restart") => {
    setOpen(false);
    if (action === "terminal") router.push(terminalHref);
    if (action === "shutdown") router.push(shutdownHref);
    if (action === "restart") window.location.reload();
  };

  return (
    <div
      className={`fixed top-0 inset-x-0 h-8 px-3 flex items-center justify-between text-xs z-50 transition-opacity ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      } bg-[#0d0d0d] border-b border-zinc-800 text-theme-2`}
    >
      <div className="flex items-center gap-3" ref={menuRef}>
        {showSystemMenu && (
          <div className="relative" id="system-menu-anchor">
            <button className="font-semibold px-2 py-0.5 bg-red-500/75 hover:bg-red-500 rounded-sm border border-white/10 transition-all hover:text-white shadow-sm text-xs" onClick={() => setOpen((v) => !v)}>
              7sg56
            </button>
            {open && (
              <div
                className={`absolute top-full left-0 mt-1 min-w-[200px] 
                  bg-[#0d0d0d] border border-zinc-700 
                  shadow-[0px_10px_30px_rgba(0,0,0,0.5)] rounded-lg py-1.5 z-50
                  flex flex-col animate-in fade-in zoom-in-95 duration-100 ease-out origin-top-left`}
              >
                  <div className="px-1.5 py-1 flex flex-col gap-0.5">
                    <button
                        className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-white/90 hover:bg-white/10 transition-colors duration-75"
                        onClick={() => handleAction("terminal")}
                      >
                        Terminal
                      </button>
                      <button
                        className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-white/90 hover:bg-white/10 transition-colors duration-75"
                        onClick={() => handleAction("restart")}
                      >
                        Restart
                      </button>
                      <button
                        className="w-full text-left px-3 py-1.5 rounded-md text-[13px] text-white/90 hover:bg-white/10 transition-colors duration-75"
                        onClick={() => handleAction("shutdown")}
                      >
                        Shut Down
                      </button>
                  </div>
              </div>
            )}
          </div>
        )}
        <span className="font-semibold hidden sm:inline">{title}</span>
        <span className="text-zinc-400 hidden sm:inline"></span>

      </div>
      <div className="text-zinc-400" suppressHydrationWarning>{now}</div>
    </div>
  );
}
