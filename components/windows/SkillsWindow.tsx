"use client";

import React from "react";
import { getAllSkills } from "@/lib/data";

export default function SkillsWindow() {
  const skillCategories = getAllSkills();

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Skills & Technologies</h2>
            <p className="text-zinc-400 text-lg">Technologies and tools I work with</p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => (
              <div key={category.title} className="rounded-2xl p-6 border border-white/5 bg-zinc-900 hover:border-red-500/20 transition-all hover:-translate-y-1 duration-300 group">
                <h3 className="text-lg font-bold text-white mb-5 pb-2 border-b border-white/5 flex items-center justify-between">
                    {category.title}
                    <span className="text-red-500/50 text-xs font-mono px-2 py-0.5 rounded bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                        {category.skills.length}
                    </span>
                </h3>
                
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1.5 bg-[#0d0d0d] text-zinc-300 rounded-md text-xs font-medium border border-white/5 hover:border-red-500/30 hover:text-white transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
