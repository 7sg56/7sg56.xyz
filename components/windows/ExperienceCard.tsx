"use client";

import React from "react";

interface ExperienceCardProps {
  title: string;
  company: string;
  duration: string;
  description: string;
  tech?: string[];
  achievements?: string[];
  isCurrent?: boolean;
}

export default function ExperienceCard({
  title,
  company,
  duration,
  description,
  tech,
  achievements,
  isCurrent = false,
}: ExperienceCardProps) {
  return (
    <div className="border border-white/5 hover:border-red-500/20 rounded-2xl p-6 bg-zinc-900 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div>
           <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{title}</h3>
           <div className="text-zinc-400 text-sm font-medium">{company} • <span className="text-zinc-500 font-normal">{duration}</span></div>
        </div>
        {isCurrent && (
          <div className="bg-green-500/10 px-3 py-1 rounded-full text-xs font-semibold text-green-400 border border-green-500/20 tracking-wide">
            PRESENT
          </div>
        )}
      </div>
      
      <p className="text-zinc-300 leading-relaxed mb-6">{description}</p>
      
      {tech && tech.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
           {tech.map((t, i) => (
             <span key={i} className="text-xs px-2 py-1 rounded bg-[#0d0d0d] border border-white/5 text-zinc-400 font-mono">
               {t}
             </span>
           ))}
        </div>
      )}
      
      {achievements && achievements.length > 0 && (
        <ul className="space-y-2">
          {achievements.map((achievement, index) => (
            <li key={index} className="text-zinc-400 text-sm flex items-start gap-2">
              <span className="text-red-500/50 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
