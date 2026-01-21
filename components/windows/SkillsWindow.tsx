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

{/* Skills Sections */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-12 items-start">
            {skillCategories.map((category) => (
              <div key={category.title} className="relative">
                <h3 className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-5 pl-1">
                    {category.title}
                </h3>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {category.skills.map((skill) => {
                    const iconMap: Record<string, string> = {
                      "Bash": "Bash.svg",
                      "C": "C.svg",
                      "C++": "C++-(CPlusPlus).svg",
                      "Java": "Java.svg",
                      "TypeScript": "TypeScript.svg",
                      "React": "React.svg",
                      "Next.js": "Next.js.svg",
                      "AstroJs": "Astro.svg",
                      "Tailwind": "Tailwind-CSS.svg",
                      "Node.js": "Node.js.svg",
                      "Express": "Express.svg",
                      "MongoDB": "MongoDB.svg",
                      "MySQL": "MySQL.svg",
                      "SQLite": "SQLite.svg",
                      "React Native": "React.svg",
                      "Tauri": "Tauri.svg",
                      "Electron": "Electron.svg",
                      "AWS": "AWS.svg",
                      "Docker": "Docker.svg",
                      "Jenkins": "Jenkins.svg",
                      "Linux": "Linux.svg",
                      "Git": "Git.svg",
                      "Figma": "Figma.svg",
                      "Postman": "Postman.svg",
                      "Jest": "Jest.svg",
                    };

                    const iconFile = iconMap[skill];
                    const diffIcon = ["Next.js", "Express", "AstroJs", "Bash", "AWS"].includes(skill);

                    return (
                      <div key={skill} className="flex flex-col items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="w-14 h-14 flex items-center justify-center bg-zinc-900/50 rounded-2xl border border-white/5 group-hover:border-white/10 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/50 transition-all duration-300">
                          {iconFile ? (
                            <img 
                              src={`/tech svg/${iconFile}`} 
                              alt={`${skill} icon`}
                              className={`w-7 h-7 object-contain ${diffIcon ? "brightness-0 invert" : ""} opacity-80 group-hover:opacity-100 transition-opacity`}
                            />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                          )}
                        </div>
                        <span className="text-zinc-500 font-medium text-xs text-center group-hover:text-zinc-300 transition-colors leading-tight">
                          {skill}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
