import { client } from "./sanity.client";
import {
  ALL_PROJECTS_QUERY,
  ALL_EXPERIENCE_QUERY,
  ALL_SKILLS_QUERY,
  PROFILE_QUERY,
  RESUME_QUERY,
  ALL_SONGS_QUERY,
  ALL_TASKS_QUERY,
  ALL_HOBBIES_QUERY,
} from "./sanity.queries";

// Import hardcoded data as fallbacks
import {
  PROJECTS,
  EXPERIENCE,
  SKILLS,
  PROFILE,
  RESUME,
  SONGS,
  TASKS,
  HOBBIES,
  type Project,
  type Experience,
  type SkillCategory,
  type Profile,
  type Resume,
  type Song,
  type Task,
  type Hobby,
} from "./data";

/**
 * Generic fetch wrapper with fallback.
 * Tries Sanity first; if empty result or error, falls back to hardcoded data.
 */
async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  label: string
): Promise<T> {
  try {
    const result = await client.fetch<T>(query);

    // If result is null/undefined, or an empty array, use fallback
    if (result === null || result === undefined) {
      return fallback;
    }
    if (Array.isArray(result) && result.length === 0) {
      return fallback;
    }

    return result;
  } catch (error) {
    console.warn(`[Sanity] Failed to fetch ${label}, using fallback:`, error);
    return fallback;
  }
}

// ===== FETCH FUNCTIONS =====
// These mirror the function signatures in lib/data.ts so components
// can switch to them with minimal changes.

export async function fetchAllProjects(): Promise<Project[]> {
  return fetchWithFallback<Project[]>(ALL_PROJECTS_QUERY, PROJECTS, "projects");
}

export async function fetchAllExperience(): Promise<Experience[]> {
  return fetchWithFallback<Experience[]>(
    ALL_EXPERIENCE_QUERY,
    EXPERIENCE,
    "experience"
  );
}

export async function fetchAllSkills(): Promise<SkillCategory[]> {
  return fetchWithFallback<SkillCategory[]>(
    ALL_SKILLS_QUERY,
    SKILLS,
    "skills"
  );
}

export async function fetchProfile(): Promise<Profile> {
  return fetchWithFallback<Profile>(PROFILE_QUERY, PROFILE, "profile");
}

export async function fetchResume(): Promise<Resume> {
  return fetchWithFallback<Resume>(RESUME_QUERY, RESUME, "resume");
}

export async function fetchAllSongs(): Promise<Song[]> {
  return fetchWithFallback<Song[]>(ALL_SONGS_QUERY, SONGS, "songs");
}

export async function fetchAllTasks(): Promise<Task[]> {
  return fetchWithFallback<Task[]>(ALL_TASKS_QUERY, TASKS, "tasks");
}

export async function fetchAllHobbies(): Promise<string[]> {
  // Sanity hobbies have { title, description }, but data.ts stores them as
  // combined strings like 'Gaming -- "Rise, Tarnished." - Elden Ring'
  // We convert Sanity format to the string format for backward compatibility
  try {
    const result = await client.fetch<
      { title: string; description?: string }[]
    >(ALL_HOBBIES_QUERY);

    if (!result || result.length === 0) {
      return HOBBIES;
    }

    return result.map((h) =>
      h.description ? `${h.title} -- ${h.description}` : h.title
    );
  } catch (error) {
    console.warn("[Sanity] Failed to fetch hobbies, using fallback:", error);
    return HOBBIES;
  }
}

export async function fetchProjectsCount(): Promise<number> {
  const projects = await fetchAllProjects();
  return projects.length;
}
