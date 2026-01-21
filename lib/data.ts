// Centralized data management for portfolio
// This file contains all the data that needs to be updated across the application

export type Project = {
  name: string;
  slug: string;
  desc: string;
  tech: string[];
  repo?: string;
  demo?: string;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
  type: 'internship' | 'education' | 'volunteer' | 'project' | 'work';
};

export type Resume = {
  url: string;
  filename: string;
  lastUpdated: string;
};

export type SkillCategory = {
  title: string;
  skills: string[];
};

export type Profile = {
  name: string;
  handle: string;
  tagline: string;
  about: string;
  contact: {
    email_masked: string;
    phone_masked: string;
    open_to: string;
  };
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    portfolio: string;
  };
  education: {
    summary: string;
  };
};

// ===== PROJECTS =====
export const PROJECTS: Project[] = [
  {
    name: "Stamped — Event management & Attendance system",
    slug: "stamped",
    desc: "Seamless event registration, instant QR check-ins, and real-time analytics.",
    tech: ["Next.js", "Express", "MongoDB", "Tailwind CSS"],
    repo: "https://github.com/7sg56/stamped-v0",
    demo: "https://stamped-v0.vercel.app",
  },
  {
    name: "DawnMark - Online Markdown editor with live file uploads",
    slug: "dawnmark",
    desc: "A sleek, user-friendly online Markdown editor with real-time preview and seamless file uploads.",
    tech: ["Next.js", "Tailwind CSS", "React"],
    repo: "https://github.com/7sg56/dawnmark",
    demo: "https://dawnmark.netlify.app",
  },
  {
    name: "ClackClick - A website to test out your typing speed",
    slug: "clackclick",
    desc: "A typing speed test app on the web.",
    tech: ["Next.js", "Tailwind CSS", "React"],
    repo: "https://github.com/7sg56/clackclick",
    demo: "https://clackclick.netlify.app",
  },
];

// ===== EXPERIENCE =====
export const EXPERIENCE: Experience[] = [
  {
    title: "Frontend Intern",
    company: "Xenkrypt Technologies",
    period: "2026 - Present",
    description: "Latest trends of development, and a enthusiastic startup, a perfect combo",
    type: 'internship'
  },
  {
    title: "B.Tech Computer Science Engineering",
    company: "SRM Institute of Science and Technology",
    period: "2024 - Present",
    description: "Pursuing Bachelor of Technology in Computer Science Engineering with focus on software development, and modern web technologies.",
    type: 'education'
  }
];

// ===== SKILLS =====
export const SKILLS: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["C", "C++", "Java", "TypeScript"]
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "AstroJs", "Tailwind"]
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "MongoDB", "MySQL", "SQLite"]
  },
  {
    title: "Mobile & Desktop",
    skills: ["React Native", "Tauri", "Electron"]
  },
  {
    title: "DevOps & Cloud",
    skills: ["AWS", "Docker", "Jenkins", "Linux", "Git", "Bash"]
  },
  {
    title: "Tools & Testing",
    skills: ["Figma", "Postman", "Jest"]
  }
];

// ===== RESUME =====
export const RESUME: Resume = {
  url: "/sourish-ghosh-resume.pdf",
  filename: "sourish-ghosh-resume.pdf",
  lastUpdated: "2025-10-01 (outdated)"
};

// ===== PROFILE =====
export const PROFILE: Profile = {
  name: "Sourish Ghosh",
  handle: "7sg56",
  tagline: "Full-Stack Developer focused on Next.js + design systems",
  about: "I'm a B.Tech Computer Science student at SRMIST, Chennai, passionate about building scalable web applications and exploring modern web technologies. I enjoy creating clean, responsive designs and experimenting with full-stack projects. Beyond web development, I'm also interested in devOps, and I regularly try to solve problems on LeetCode. I'm currently looking for opportunities to contribute to meaningful projects and continue growing as a developer. Let's connect and create the unimaginable",
  contact: {
    email_masked: "sourishghosh777@gmail.com",
    phone_masked: "Let's not rush, first a date :)",
    open_to: "Open to work / mentorship",
  },
  socials: {
    github: "https://github.com/7sg56",
    linkedin: "https://www.linkedin.com/in/7sg56",
    twitter: "https://x.com/sourishghosh777",
    instagram: "https://www.instagram.com/nicetry",
    portfolio: "coming soon",
  },
  education: {
    summary: "B.Tech in CSE w/s SE (2024-2028) CGPA: 9.1",
  },
};

// ===== SONGS (Now Listening Widget) =====
export type Song = {
  title: string;
  artist: string;
};

export const SONGS: Song[] = [
  { title: "My Eyes", artist: "Travis Scott" },
  { title: "No Pole", artist: "Don Toliver" },
  { title: "Dracula", artist: "Tame Impala" },
  { title: "Humble", artist: "Kendrick Lamar" },
  { title: "Softcore", artist: "The Neighbourhood" },
  { title: "Runaway", artist: "Kanye West" },
  { title: "Wildflower", artist: "Billie Eilish" },
  { title: "Sao Paulo", artist: "The Weeknd" },
  { title: "Chanel", artist: "Tyla" },
  { title: "Chihiro", artist: "Billie Eilish" },
  { title: "Sofia", artist: "Clairo" },
  { title: "Guess", artist: "Billie Eilish"},
  { title: "I KNOW?", artist: "Travis Scott"}
];

// ===== TASKS (Todo Widget) =====
export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export const TASKS: Task[] = [
  { id: 1, title: "Running high on AstroJs", completed: false },
  { id: 2, title: "Petting Mr. Rowlins", completed: false },
  { id: 3, title: "May God shed light when i debug", completed: false},
  { id: 4, title: "Just keep Watching", completed: false },
  { id: 5, title: "Watching The Night Manager", completed: false },
  { id: 6, title: "Intern Lesson 101: Git is dangerous", completed: false},
  { id: 7, title: "Lewis Hamilton is the GOAT", completed: false },
  { id: 8, title: "Try starting your day with Jim Beam", completed: false },
  { id: 9, title: "Life's a B*TCH, so are we", completed: false },
  { id: 10, title: "I love Billie Eilish" , completed: false },
  { id: 11, title: "Sometimes I wish I'd become a composer", completed: false},
  { id: 12, title: "Can Fanny Magnet work on one person?", completed: false},
  { id: 13, title: "I swear I didn't use AI to build this", completed: false},
  { id: 14, title: "My flirting style is forgetting how to talk", completed: false}
];

// ===== HOBBIES =====
export type Hobby = string;

export const HOBBIES: Hobby[] = [
  "Gaming — \"Rise, Tarnished.\" - Elden Ring",
  "Chess — 1200+ on Chess.com",
  "Cats — Permanently chosen by at least one feline",
  "Cooking — Alchemy, to satisfy my hunger"
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get project by slug or index
 */
export function getProject(identifier: string | number): Project | undefined {
  if (typeof identifier === 'number') {
    return PROJECTS[identifier - 1]; // 1-indexed
  }
  return PROJECTS.find(p => p.slug === identifier || p.name.toLowerCase().includes(identifier.toLowerCase()));
}

/**
 * Get all projects
 */
export function getAllProjects(): Project[] {
  return PROJECTS;
}

/**
 * Get all experience entries
 */
export function getAllExperience(): Experience[] {
  return EXPERIENCE;
}

/**
 * Get resume information
 */
export function getResume(): Resume {
  return RESUME;
}

/**
 * Get profile information
 */
export function getProfile(): Profile {
  return PROFILE;
}

/**
 * Get projects count for dynamic text
 */
export function getProjectsCount(): number {
  return PROJECTS.length;
}

/**
 * Get all skills categories
 */
export function getAllSkills(): SkillCategory[] {
  return SKILLS;
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: string): SkillCategory | undefined {
  return SKILLS.find(s => s.title.toLowerCase() === category.toLowerCase());
}

/**
 * Get all hobbies
 */
export function getHobbies(): Hobby[] {
  return HOBBIES;
}

/**
 * Get all songs for Now Listening widget
 */
export function getSongs(): Song[] {
  return SONGS;
}

/**
 * Get all tasks for Todo widget
 */
export function getTasks(): Task[] {
  return TASKS;
}