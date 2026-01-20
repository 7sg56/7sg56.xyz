"use client";

import { useState, useEffect } from "react";
import Terminal from "@/components/terminal/Terminal";
import BootLog from "@/components/boot/BootLog";
import { generateUUID } from "@/lib/utils";

export default function TerminalPage() {
  const [sessionKey] = useState<string>(() => generateUUID());
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!booting) return;
    
    // Simulate boot loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment
        return Math.min(prev + Math.random() * 8, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [booting]);

  return (
    <div>
      {/* Terminal visible on all devices */}
      <div
        className="fixed inset-0 bg-black text-green-400 font-mono overflow-hidden px-1 md:px-1 relative"
        style={{
          fontFamily:
            'Menlo, Monaco, Consolas, "Courier New", Courier, ui-monospace, monospace',
        }}
      >
        {booting ? (
          <BootLog 
            progress={progress} 
            onComplete={() => setBooting(false)} 
          />
        ) : (
          /* Mobile-friendly terminal container */
          <div className="relative z-10 h-screen w-full flex flex-col animate-in fade-in zoom-in-95 duration-700">
            {/* Terminal with responsive sizing */}
            <div className="flex-1 w-full overflow-hidden">
              <Terminal
                embedded
                chrome={false}
                showBanner={true}
                showFooter={false}
                sessionKey={sessionKey}
                scrollMode="internal"
                scrollHeightClass="h-full"
              />
            </div>
          </div>
        )}

        {/* CRT overlays */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(16,255,106,0.12) 0, rgba(16,255,106,0.12) 1px, transparent 2px)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 80% at 50% 50%, transparent 62%, rgba(0,0,0,0.45) 100%)',
          }}
        />
        <div className="crt-scanline" />
      </div>
    </div>
  );
}
