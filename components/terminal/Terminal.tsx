"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { commands, aliases, type CommandHandler, type Env, type ThemeName } from "@/components/terminal/commands";
import { generateUUID } from "@/lib/utils";

type HistoryItem = {
  id: string;
  command: string;
  output?: React.ReactNode;
};

function Banner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const art = `
 
 
 ░██████╗░█████╗░██╗░░░██╗██████╗░██╗░██████╗██╗░░██╗  ░██████╗░██╗░░██╗░█████╗░░██████╗██╗░░██╗
 ██╔════╝██╔══██╗██║░░░██║██╔══██╗██║██╔════╝██║░░██║  ██╔════╝░██║░░██║██╔══██╗██╔════╝██║░░██║
 ╚█████╗░██║░░██║██║░░░██║██████╔╝██║╚█████╗░███████║  ██║░░██╗░███████║██║░░██║╚█████╗░███████║
 ░╚═══██╗██║░░██║██║░░░██║██╔══██╗██║░╚═══██╗██╔══██║  ██║░░╚██╗██╔══██║██║░░██║░╚═══██╗██╔══██║
 ██████╔╝╚█████╔╝╚██████╔╝██║░░██║██║██████╔╝██║░░██║  ╚██████╔╝██║░░██║╚█████╔╝██████╔╝██║░░██║
 ╚═════╝░░╚════╝░░╚═════╝░╚═╝░░╚═╝╚═╝╚═════╝░╚═╝░░╚═╝  ░╚═════╝░╚═╝░░╚═╝░╚════╝░╚═════╝░╚═╝░░╚═╝                                                                                          
  
  `;

  return (
    <div className="text-zinc-300 overflow-auto">
      <pre
        className="whitespace-pre font-mono leading-none text-white crt-glow text-[10px] md:text-xs overflow-x-auto block"
        style={{
          color: "#dbdbdb",
          fontFamily:
            'Menlo, Monaco, Consolas, "Courier New", Courier, monospace',
          fontVariantLigatures: 'none',
          fontKerning: 'none',
          letterSpacing: 0,
          lineHeight: 1,
          tabSize: 4,
          whiteSpace: 'pre',
          wordSpacing: 0,
        }}
      >
        {art}
      </pre>
      <div className="mt-1 text-xs md:text-sm" style={{ color: "#a6adc8" }}>Built by <a href="https://github.com/7sg56" target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-green-400 underline">Sourish Ghosh</a>. Type <span className="text-zinc-200">help</span> to see available commands.</div>
    </div>
  );
}

function Prompt({ text }: { text: string }) {
  const [user, host, path] = React.useMemo(() => {
    const match = text.match(/^(.*)@(.*):(.*)$/);
    return match ? [match[1], match[2], match[3]] : [text, "", ""];
  }, [text]);
  return (
    <span className="shrink-0 select-none">
      <span style={{ color: "#a6e3a1" }}>{user}</span>
      <span className="text-zinc-400">@</span>
      <span style={{ color: "#89b4fa" }}>{host}</span>
      <span className="text-zinc-400">{path}$</span>
    </span>
  );
}

type TerminalProps = {
  embedded?: boolean;
  chrome?: boolean;
  externalCommand?: string | null;
  onExternalConsumed?: () => void;
  showBanner?: boolean;
  scrollHeightClass?: string; // applies to the scroll area height when embedded
  showFooter?: boolean; // controls bottom hint/footer
  sessionKey?: string; // when this changes, the terminal clears history (new session)
  scrollMode?: 'internal' | 'page'; // 'internal' uses an inner scroll container; 'page' lets the whole page scroll
};

export default function Terminal({ embedded = false, chrome = true, externalCommand = null, onExternalConsumed, showBanner = true, scrollHeightClass, showFooter = true, sessionKey, scrollMode = 'internal' }: TerminalProps) {
  const [history, setHistory] = useState<HistoryItem[]>(() => []);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeName>("mocha");
  const [bannerVisible, setBannerVisible] = useState(showBanner);
  const [prompt, setPrompt] = useState<string>("s0urishg@7sg56:~");
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const envRef = useRef<Env | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setBannerVisible(showBanner);
  }, [showBanner]);

  const scrollToBottom = useCallback(() => {
    // In page scroll mode, ensure the input (cursor) is brought into view
    if (scrollMode === 'page') {
      const target = inputRef.current ?? bottomRef.current;
      try {
        target?.scrollIntoView({ block: 'end' });
        return;
      } catch { }
      try {
        const doc = document.documentElement;
        window.scrollTo({ top: doc.scrollHeight });
        return;
      } catch { }
    }
    // Internal scroll mode: use the sentinel within the scroll container
    if (bottomRef.current) {
      try {
        bottomRef.current.scrollIntoView({ block: "end" });
        return;
      } catch { }
    }
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [scrollMode]);

  const onScroll = useCallback(() => {
    if (scrollMode === 'page') {
      const doc = document.documentElement;
      const nearBottom = (window.scrollY + window.innerHeight) >= (doc.scrollHeight - 10);
      // Auto-scroll state updated
      setAutoScroll(nearBottom);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    // Auto-scroll state updated
    setAutoScroll(nearBottom);
  }, [scrollMode]);

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [history.length, bannerVisible, autoScroll, scrollToBottom]);

  useEffect(() => {
    const onResize = () => scrollToBottom();
    window.addEventListener("resize", onResize);
    if (scrollMode === 'page') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (scrollMode === 'page') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, [scrollToBottom, scrollMode, onScroll]);

  // Reset session when sessionKey changes
  useEffect(() => {
    if (sessionKey === undefined) return;
    setHistory([]);
    setInput("");
    setHistoryIndex(null);
  }, [sessionKey]);

  const historyCommands = useMemo(() => history.map(h => h.command).filter(Boolean), [history]);

  const env: Env = useMemo(() => ({
    setTheme,
    setBannerVisible,
    setPrompt,
    open: (url: string) => {
      try {
        const u = url.startsWith("http") ? url : `https://${url}`;
        window.open(u, "_blank", "noopener,noreferrer");
      } catch { }
    },
    run: (cmd: string) => {
      run(cmd);
      inputRef.current?.focus();
    },
    theme,
    prompt,
    bannerVisible,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [theme, prompt, bannerVisible]);

  const run = useCallback((raw: string) => {
    const id = generateUUID();
    const text = raw.trim();
    if (!text) return;

    const [cmd, ...args] = text.split(/\s+/);
    let key = cmd.toLowerCase();
    if (!commands[key] && aliases[key]) key = aliases[key];

    if (key === "clear") {
      setHistory([]);
      // ensure next input is visible
      setAutoScroll(true);
      requestAnimationFrame(() => scrollToBottom());
      return;
    }


    const handler: CommandHandler | undefined = commands[key];
    const ctx = envRef.current ?? env;
    const output = handler ? handler(args, ctx) : (
      <div className="text-red-300">
        Command not found: <span className="text-red-100">{cmd}</span>. Type <span className="text-zinc-200">help</span>.
      </div>
    );

    setHistory(prev => [...prev, { id, command: text, output }]);
    // Force auto-scroll to show the newest output immediately
    setAutoScroll(true);
    requestAnimationFrame(() => scrollToBottom());
  }, [env, scrollToBottom]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input;
      setInput("");
      setHistoryIndex(null);
      run(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!historyCommands.length) return;
      setHistoryIndex(prev => {
        const next = prev === null ? historyCommands.length - 1 : Math.max(0, prev - 1);
        setInput(historyCommands[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = Math.min(historyCommands.length - 1, historyIndex + 1);
      setHistoryIndex(next);
      setInput(historyCommands[next] ?? "");
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      // Simulate ^C to cancel current line
      e.preventDefault();
      setInput("");
    }
  };

  const frameStyle = theme === "mocha"
    ? { borderColor: "#45475a", backgroundColor: "rgba(30,30,46,0.85)" }
    : {};

  // keep envRef pointing to latest env
  useEffect(() => { envRef.current = env; }, [env]);

  // consume external command requests
  useEffect(() => {
    if (externalCommand && externalCommand.trim()) {
      run(externalCommand);
      onExternalConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCommand]);

  // Embedded: render body only (no outer overlay/chrome)
  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col min-h-0">
        {chrome && (
          <div className="flex items-center gap-2 pb-2">
            <span className="ml-3 text-xs" style={{ color: "#a6adc8" }}>sourish@portfolio — zsh</span>
          </div>
        )}
        <div
          ref={containerRef}
          className={`${scrollMode === 'internal' ? 'overscroll-contain overflow-y-auto' : 'overflow-visible'} px-3 font-mono text-xs md:text-sm flex-1 min-h-0 ${scrollHeightClass ?? ""}`}
          style={{ color: "#cdd6f4" }}
          onScroll={scrollMode === 'internal' ? onScroll : undefined}
        >
          <Banner visible={bannerVisible} />
          <div className="my-3 border-t" style={{ borderColor: "#313244" }} />
          <div className="max-w-[1100px] px-2 md:px-0">
            {history.map(item => (
              <div key={item.id} className="mb-2">
                <div className="flex items-start gap-2">
                  <Prompt text={prompt} />
                  <span className="whitespace-pre-wrap break-words">{item.command}</span>
                </div>
                {item.output && <div className="mt-1 pl-6 break-words">{item.output}</div>}
              </div>
            ))}
            {/* Live input as part of the scrollable flow */}
            <div className="mt-2 mb-4 flex items-center gap-2 font-mono text-xs md:text-sm">
              <Prompt text={prompt} />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none placeholder-zinc-600 text-xs md:text-sm"
                placeholder="type a command… (try: help)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck={false}
                style={{ caretColor: "#a6e3a1" }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>
        {showFooter && (
          <div className="mt-2 text-[10px]" style={{ color: "#a6adc8" }}>Type &apos;clear&apos; to clear the screen.</div>
        )}
      </div>
    );
  }

  // Standalone fallback
  return (
    <div className="relative z-40 w-full max-w-4xl mx-auto">
      <div className="pointer-events-auto rounded-lg border backdrop-blur p-3" style={frameStyle}>
        {chrome && (
          <div className="flex items-center gap-2 pb-2">
            <span className="ml-3 text-xs" style={{ color: "#a6adc8" }}>sourish@portfolio — zsh</span>
          </div>
        )}

        <div ref={containerRef} className="h-[70vh] overscroll-contain overflow-y-auto px-3 font-mono text-xs md:text-sm" style={{ color: "#cdd6f4" }} onScroll={onScroll}>
          <Banner visible={bannerVisible} />
          <div className="my-3 border-t" style={{ borderColor: "#313244" }} />
          <div className="max-w-[300px]">
            {history.map(item => (
              <div key={item.id} className="mb-2">
                <div className="flex items-start gap-2">
                  <Prompt text={prompt} />
                  <span className="whitespace-pre-wrap break-words">{item.command}</span>
                </div>
                {item.output && <div className="mt-1 pl-6 break-words">{item.output}</div>}
              </div>
            ))}
            {/* Live input as part of the scrollable flow */}
            <div className="mt-2 mb-4 flex items-center gap-2 font-mono text-xs md:text-sm">
              <Prompt text={prompt} />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none placeholder-zinc-600 text-xs md:text-sm"
                placeholder="type a command… (try: help)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck={false}
                style={{ caretColor: "#a6e3a1" }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {showFooter && (
          <div className="mt-2 text-[10px]" style={{ color: "#a6adc8" }}>Type &apos;clear&apos; to clear the screen.</div>
        )}
      </div>
    </div>
  );
}

