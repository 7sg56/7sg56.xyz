"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MINECRAFT_MODELS, type MinecraftKind } from "@/components/three/constants";
import {
  getProject,
  getAllProjects,
  getAllExperience,
  getResume,
  getProfile,
  getProjectsCount,
  getAllSkills,
  getHobbies
} from "@/lib/data";

// Lazy load the 3D component with no SSR to avoid blocking hydration/initial render
const DynamicMinecraftSpawn = dynamic(() => import("./MinecraftSpawn"), {
  ssr: false,
  loading: () => <div className="text-zinc-500 text-sm">Loading 3D Module...</div>
});

export type ThemeName = "default" | "mocha";

export type Env = {
  setTheme: (name: ThemeName) => void;
  setBannerVisible: (v: boolean) => void;
  setPrompt: (p: string) => void;
  open: (url: string) => void;
  run: (cmd: string) => void; // programmatically run a command from clickable UI
  theme: ThemeName;
  prompt: string;
  bannerVisible: boolean;
};

export type CommandHandler = (args: string[], env: Env) => React.ReactNode;

// Data is now imported from centralized lib/data.ts

const Skills = () => {
  const skills = getAllSkills();

  return (
    <div className="space-y-1">
      <div className="text-zinc-100">Skills</div>
      <ul className="list-disc pl-6 text-zinc-300">
        {skills.map((category) => (
          <li key={category.title}>
            <span className="text-zinc-200">{category.title}:</span> {category.skills.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

function link(href: string, text?: string) {
  return (
    <a className="text-green-400 underline" href={href} target="_blank" rel="noreferrer">
      {text ?? href}
    </a>
  );
}

export const aliases: Record<string, string> = {
  about: "aboutme",
  surprise: "spawn", // backward-compatible alias
};

export const commands: Record<string, CommandHandler> = {
  help: () => (
    <div className="space-y-2">
      <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-1 font-mono text-sm">
        <div className="text-green-400">help</div>
        <div>List all commands</div>
        <div className="text-green-400">startx</div>
        <div>access GUI</div>
        <div className="text-green-400">about</div>
        <div>Who Am I ?</div>
        <div className="text-green-400">experience</div>
        <div>Places I have worked</div>
        <div className="text-green-400">skills</div>
        <div>My Tech Stack</div>
        <div className="text-green-400">projects</div>
        <div>View my projects</div>
        <div className="text-green-400">socials</div>
        <div>View my socials</div>
        <div className="text-green-400">resume</div>
        <div>Download my resume</div>
        <div className="text-green-400">hobbies</div>
        <div>What I do for fun</div>
        <div className="text-green-400">spawn</div>
        <div>It&#39;s a secret</div>
        <div className="text-green-400">shutdown</div>
        <div>Return to GRUB menu</div>
        <div className="text-green-400">clear</div>
        <div>Clear terminal</div>
      </div>
    </div>
  ),

  // hobbies
  hobbies: () => {
    const hobbies = getHobbies();
    return (
      <div className="space-y-1">
        <div className="text-zinc-100">Hobbies</div>
        <ul className="list-disc pl-6 text-zinc-300">
          {hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      </div>
    );
  },

  // aboutme
  aboutme: () => {
    const profile = getProfile();
    return (
      <div className="space-y-1">
        <div className="text-zinc-100 font-semibold">{profile.name}</div>
        <div className="text-zinc-300">{profile.tagline}</div>
        <div className="text-zinc-400 whitespace-pre-wrap">{profile.about}</div>
      </div>
    );
  },

  startx: () => {
    try {
      window.location.assign('/desktop');
    } catch { }
    return (
      <div className="text-zinc-300">Launching Desktop… <span className="text-green-400">o/desktop</span></div>
    );
  },

  // experience
  experience: () => (
    <div className="space-y-1">
      <div className="text-zinc-100">Experience</div>
      <ul className="list-disc pl-6 text-zinc-300 space-y-1">
        {getAllExperience().map((exp, index) => (
          <li key={index}>
            <span className="text-zinc-200">{exp.company}</span> — {exp.title} ({exp.period})
          </li>
        ))}
        <li>Open-source / Personal projects — {getProjectsCount()}+ projects, focusing on web apps and tooling</li>
      </ul>
    </div>
  ),

  // skills (keep existing component)
  skills: () => <Skills />,

  // projects (keep existing implementation)
  projects: (args) => {
    const sub = (args[0] || "list").toLowerCase();
    if (sub === "view") {
      const key = (args[1] || "").toLowerCase();
      const p = getProject(key);
      if (!p) return <div className="text-red-300">Usage: projects view &lt;slug|#&gt;</div>;
      return (
        <div className="space-y-1">
          <div className="text-zinc-100 font-semibold">{p.name}</div>
          <div className="text-zinc-300">{p.desc}</div>
          <div className="text-zinc-400">Tech: {p.tech.join(", ")}</div>
          <div className="space-x-3">
            {p.demo && link(p.demo, "demo")}
            {p.repo && link(p.repo, "repo")}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <div className="text-zinc-100">Projects ({getProjectsCount()})</div>
        <ul className="list-disc pl-6 space-y-1">
          {getAllProjects().map((p, i) => (
            <li key={p.slug}>
              <span className="text-zinc-200">[{i + 1}] {p.name}</span>
              <span className="text-zinc-500"> — {p.desc}</span>{" "}
              {p.demo && link(p.demo, "demo")}
              {p.repo && <span className="ml-2">{link(p.repo, "repo")}</span>}
            </li>
          ))}
        </ul>
        <div className="text-zinc-500">View details: projects view &lt;slug|#&gt;</div>
      </div>
    );
  },

  // socials (keep existing)
  socials: () => {
    const profile = getProfile();
    return (
      <div className="space-y-1">
        <div className="text-zinc-100">Links & Contact</div>
        <div>GitHub: {link(profile.socials.github)}</div>
        <div>LinkedIn: {link(profile.socials.linkedin)}</div>
        <div>Twitter/X: {link(profile.socials.twitter)}</div>
        <div>Portfolio: {link(profile.socials.portfolio)}</div>
        <div>Email: <span className="text-zinc-200">{profile.contact.email_masked}</span></div>
      </div>
    );
  },

  // resume: attempt to download a PDF from /public
  resume: (args) => {
    const resume = getResume();
    const target = (args[0] || resume.url).replace(/^\/+/, '');
    const url = `/${target}`;
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch { }
    return (
      <div className="space-y-1">
        <div className="text-zinc-100">Resume</div>
        <div>Attempting download: <span className="text-zinc-200">{resume.filename}</span></div>
        <div className="text-zinc-500 text-sm">Last updated: {resume.lastUpdated}</div>
      </div>
    );
  },

  // spawn: random or specific minecraft character
  spawn: (args) => {
    const arg = (args[0] || "").toLowerCase();
    const asKind = (MINECRAFT_MODELS as readonly string[]).includes(arg) ? (arg as MinecraftKind) : null;
    // Use dynamic component here
    return <DynamicMinecraftSpawn forcedKind={asKind} />;
  },

  // shutdown with confirmation
  shutdown: () => (
    <div className="space-y-2">
      <div className="text-zinc-100">Shutdown requested</div>
      <div className="text-zinc-400">Return to GRUB menu? This will leave the terminal.</div>
      <div className="flex gap-2">
        <button
          className="px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-800"
          onClick={() => { try { window.location.assign('/'); } catch { } }}
        >
          Yes
        </button>
        <button
          className="px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-800"
          onClick={() => { /* no-op: user can continue */ }}
        >
          No
        </button>
      </div>
      <div className="text-zinc-500 text-xs">Tip: type <span className="text-zinc-200">help</span> to continue.</div>
    </div>
  ),
};
