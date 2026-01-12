"use client";

import React from "react";

export function Banner({ visible }: { visible: boolean }) {
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
        <div className="text-zinc-300">
            <pre
                className="whitespace-pre font-mono leading-none text-white crt-glow text-[10px] md:text-xs overflow-x-auto overflow-y-hidden block"
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

export function Prompt({ text }: { text: string }) {
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
