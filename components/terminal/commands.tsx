"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MinecraftCharacter, MINECRAFT_MODELS, type MinecraftKind } from "@/components/three/Minecraft";
import * as THREE from "three";
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
import { generateUUID } from "@/lib/utils";

// Single-active summon coordination so only the latest stays active
let activeSummonId: string | null = null;
const activeListeners = new Set<(id: string | null) => void>();
function setActiveSummon(id: string | null) {
  activeSummonId = id;
  activeListeners.forEach((fn) => fn(id));
}

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

// Follow-the-mouse character (tracking defaults ON). Keys: q stops, f toggles.
function CharacterFollow({ kind, active }: { kind: MinecraftKind; active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [tracking, setTracking] = useState<boolean>(true);
  const mouse = useRef({ x: 0, y: 0 });
  const effectiveTracking = tracking && active;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!effectiveTracking) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.x = x;
      mouse.current.y = y;
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "q") setTracking(false);
      if (k === "f") setTracking((v) => !v);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [effectiveTracking]);

  useFrame(() => {
    if (!groupRef.current || !effectiveTracking) return;
    const targetYaw = mouse.current.x * Math.PI * 0.3;
    // Invert pitch so moving mouse up tilts model up
    const targetPitch = mouse.current.y * Math.PI * 0.15;
    groupRef.current.rotation.y += (targetYaw - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (targetPitch - groupRef.current.rotation.x) * 0.1;
  });

  const s = 0.075; // slightly smaller for better fit
  return (
    <group ref={groupRef} scale={[-s, s, s]}>
      <MinecraftCharacter kind={kind} position={[0, -0.95, 0]} />
    </group>
  );
}

function CharacterSpawn({ forcedKind }: { forcedKind?: MinecraftKind | null }) {
  const [kind, setKind] = useState<MinecraftKind | null>(forcedKind ?? null);
  const [id] = useState<string>(() => generateUUID());
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // Pick specific kind if forced, else select random
    if (forcedKind) {
      setKind(forcedKind);
      return;
    }
    const list = [...MINECRAFT_MODELS];
    const idx = Math.floor(Math.random() * list.length);
    setKind(list[idx]);
  }, [forcedKind]);

  useEffect(() => {
    const onActive = (activeId: string | null) => setIsActive(activeId === id);
    activeListeners.add(onActive);
    // become active on mount
    setActiveSummon(id);
    return () => {
      activeListeners.delete(onActive);
      if (activeSummonId === id) setActiveSummon(null);
    };
  }, [id]);

  // Choose camera based on model
  const cam = (() => {
    if (kind === 'enderman') return { position: [0, 1.6, 11.5] as [number, number, number], fov: 26 };
    if (kind === 'steve') return { position: [0, 1.2, 10.0] as [number, number, number], fov: 28 };
    return { position: [0, 1.0, 5.5] as [number, number, number], fov: 35 };
  })();

  return (
    <div className="mt-2 mb-4 block rounded border border-zinc-700/70 bg-black/40" style={{ width: 260, height: 260, display: isActive ? 'block' : 'none', overflow: 'hidden' }}>
      <Canvas camera={cam}>
        {/* Base lights */}
        <ambientLight intensity={1.0} />
        <hemisphereLight intensity={0.7} args={[0xffffff, 0x444444]} />
        <directionalLight intensity={1.2} position={[2, 3, 2]} />
        {/* Extra lighting for Enderman (very dark) */}
        {kind === 'enderman' && (
          <>
            {/* Strong front fill */}
            <directionalLight intensity={3.0} position={[0, 3, 6]} />
            <pointLight intensity={1.8} position={[0, 2.2, 2.5]} />
            {/* Overhead spotlight to brighten full body */}
            <spotLight intensity={2.4} position={[0, 6, 3]} angle={0.6} penumbra={0.5} />
            {/* Rim/back light for silhouette separation */}
            <directionalLight intensity={1.2} position={[-2, 3.5, -3]} />
            {/* Slight ambient boost */}
            <ambientLight intensity={0.5} />
          </>
        )}
        {kind && <CharacterFollow kind={kind} active={isActive} />}
      </Canvas>
      <div className="text-[10px] text-zinc-400 p-1 px-2">{kind ? `${kind} spawned. (f: toggle follow, q: stop)` : "Loading..."}</div>
    </div>
  );
}

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
      window.location.assign('/portfolio/desktop');
    } catch { }
    return (
      <div className="text-zinc-300">Launching Desktop… <span className="text-green-400">/portfolio/desktop</span></div>
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
    return <CharacterSpawn forcedKind={asKind} />;
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
  // Remove legacy commands below — replaced by the new set above
};
