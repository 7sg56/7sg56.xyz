"use client";

import React from "react";
import { PROJECTS } from "@/lib/data";

export default function ProjectsWindow() {
  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 text-white tracking-tight">Showcasing My Work</h2>
            <p className="text-zinc-400 text-lg">A showcase of my recent work and side projects</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((p) => (
            <div key={p.slug} className="flex flex-col border border-white/5 rounded-2xl p-6 bg-zinc-900 hover:border-red-500/20 transition-colors group">
              <div className="mb-auto">
                <div className="text-white font-bold text-xl mb-3 group-hover:text-red-400 transition-colors">{p.name}</div>
                <div className="text-zinc-400 mb-4 leading-relaxed text-sm">{p.desc}</div>
              </div>
              
              <div className="pt-4 border-t border-white/5 mt-4">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {p.tech.map(t => (
                        <span key={t} className="text-xs font-mono px-2 py-1 rounded bg-[#0d0d0d] text-zinc-300 border border-white/5">
                            {t}
                        </span>
                    ))}
                 </div>
                <div className="flex gap-4 text-sm font-medium">
                  {p.demo && (
                    <a className="text-white hover:text-red-400 flex items-center gap-1 transition-colors" href={p.demo} target="_blank" rel="noopener noreferrer">
                      <span>Live Demo</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                  {p.repo && (
                    <a className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors" href={p.repo} target="_blank" rel="noopener noreferrer">
                      <span>Source Code</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
            ))}
            {PROJECTS.length === 0 && (
              <div className="text-gray-400 text-center col-span-full py-12">No projects yet. Add some in commands.tsx.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
