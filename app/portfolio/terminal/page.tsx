"use client";

import { useState } from "react";
import Link from "next/link";
import Terminal from "@/components/terminal/Terminal";
import { generateUUID } from "@/lib/utils";

export default function TerminalPage() {
  const [sessionKey] = useState<string>(() => generateUUID());

  return (
    <div>
      {/* Mobile message */}
      <div className="md:hidden flex items-center justify-center min-h-screen bg-black text-green-400 p-6 text-center">
        <div className="space-y-3 max-w-md">
          <div className="text-2xl font-semibold">Coming soon</div>
          <div className="text-green-300">Terminal experience for mobiles is coming soon.</div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-green-400/30 bg-green-400/10 hover:bg-green-400/20 text-green-300"
            >
              ← Go to Boot Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop terminal */}
      <div
        className="hidden md:block fixed inset-0 bg-black text-green-400 font-mono overflow-hidden px-1 md:px-1 relative"
        style={{
          fontFamily:
            'Menlo, Monaco, Consolas, "Courier New", Courier, ui-monospace, monospace',
        }}
      >

        {/* Mobile-friendly terminal container */}
        <div className="relative z-10 h-screen w-full flex flex-col">
          {/* Mobile header with touch-friendly controls */}
          <div className="md:hidden bg-black/50 border-b border-green-400/20 px-4 py-2 flex items-center justify-between">
            <div className="text-xs text-green-400 font-mono">s0urishg@portfolio</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.history.back()}
                className="text-xs px-2 py-1 bg-green-400/10 border border-green-400/30 rounded text-green-400 hover:bg-green-400/20 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-xs px-2 py-1 bg-green-400/10 border border-green-400/30 rounded text-green-400 hover:bg-green-400/20 transition-colors"
              >
                ↻ Reload
              </button>
            </div>
          </div>

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
