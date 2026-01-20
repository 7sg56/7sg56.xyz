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
    tech: ["Next.js", "Node.js", "Express", "MongoDB", "Tailwind", "JWT"],
    repo: "https://github.com/7sg56/stamped-v0",
    demo: "https://stamped-v0.vercel.app",
  },
  {
    name: "DawnMark - Online Markdown editor with live file uploads",
    slug: "dawnmark",
    desc: "A sleek, user-friendly online Markdown editor with real-time preview and seamless file uploads.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Vercel"],
    repo: "https://github.com/7sg56/dawnmark",
    demo: "https://dawnmark.netlify.app",
  },
  {
    name: "ClackClick - A website to test out your typing speed",
    slug: "clackclick",
    desc: "A typing speed test app on the web.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Netlify"],
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
    title: "Associate Technical Lead",
    company: "Hackerrank Campus Crew (HRCC - SRM)",
    period: "2025 - Present",
    description: "Leading technical initiatives and mentoring fellow students in competitive programming and software development. Organizing coding contests and technical workshops for the campus community.",
    type: 'volunteer'
  },
  {
    title: "Technical Team Member",
    company: "Newton School of Coding Club SRM (NSCC - SRM)",
    period: "2025 - Present",
    description: "Active member of the technical team, contributing to coding competitions, hackathons, and collaborative projects. Focus on modern web development and competitive programming.",
    type: 'volunteer'
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
    title: "Programming Languages",
    skills: ["C/C++", "Java", "TypeScript"]
  },
  {
    title: "Frontend",
    skills: ["Next.js", "AstroJs", "Three.js"]
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express"]
  },
  {
    title: "Databases",
    skills: ["MongoDB", "Prisma", "SQLite", "Supabase"]
  },
  {
    title: "Tools",
    skills: ["Git", "Figma", "Postman", "Linux", "Raspberry Pi"]
  }
];

// ===== RESUME =====
export const RESUME: Resume = {
  url: "/sourish-ghosh-resume.pdf",
  filename: "sourish-ghosh-resume.pdf",
  lastUpdated: "2025-10-01"
};

// ===== PROFILE =====
export const PROFILE: Profile = {
  name: "Sourish Ghosh",
  handle: "7sg56",
  tagline: "Full-Stack Developer focused on Next.js + design systems",
  about: "I'm a B.Tech Computer Science student at SRMIST, Chennai, passionate about building scalable web applications and exploring modern web technologies. I enjoy creating clean, responsive designs and experimenting with full-stack projects. Beyond web development, I'm also interested in machine learning, particularly NLP, and I regularly try to solve problems on LeetCode. I'm currently looking for opportunities to contribute to meaningful projects and continue growing as a developer. Let's connect and create the unimaginable",
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
    portfolio: "https://sourish-ghosh.vercel.app",
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
  { title: "Sicko Mode", artist: "Travis Scott" },
  { title: "Sao Paulo", artist: "The Weeknd" },
  { title: "Chanel", artist: "Tyla" },
  { title: "We have time", artist: "Shreea Kaul" },
  { title: "Chihiro", artist: "Billie Eilish" },
  { title: "Cry for Me", artist: "The Weeknd" },
  { title: "Sofia", artist: "Clairo" },
];

// ===== TASKS (Todo Widget) =====
export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export const TASKS: Task[] = [
  { id: 1, title: "Running high on NextJs", completed: false },
  { id: 2, title: "Petting Mr.Rowlins", completed: false },
  { id: 3, title: "Watching True Detective", completed: false },
  { id: 4, title: "Lewis Hamilton is the goat", completed: false },
  { id: 5, title: "Searching for a code partner", completed: false },
  { id: 6, title: "Looking up for Shawarma", completed: false },
];

// ===== HOBBIES =====
export type Hobby = string;

export const HOBBIES: Hobby[] = [
  "Gaming - Soulsborne fan, platinum trophy hunter",
  "Chess - 1500 rating on Chess.com",
  "Cat Lover - Proud owner of feline friends",
  "Cooking - Experimenting in the kitchen"
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