/**
 * React hooks for fetching portfolio data from Sanity.
 *
 * Each hook initializes with the hardcoded fallback from lib/data.ts
 * so there's zero loading flash. Once Sanity responds, the data
 * is silently swapped in.
 */

"use client";

import { useState, useEffect } from "react";
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
} from "./data";
import {
  fetchAllProjects,
  fetchAllExperience,
  fetchAllSkills,
  fetchProfile,
  fetchResume,
  fetchAllSongs,
  fetchAllTasks,
  fetchAllHobbies,
} from "./sanity.fetch";

/**
 * Generic hook: starts with fallback, fetches from Sanity in background.
 */
function useSanityData<T>(fallback: T, fetcher: () => Promise<T>): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;
    fetcher().then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

export function useProjects(): Project[] {
  return useSanityData(PROJECTS, fetchAllProjects);
}

export function useExperience(): Experience[] {
  return useSanityData(EXPERIENCE, fetchAllExperience);
}

export function useSkills(): SkillCategory[] {
  return useSanityData(SKILLS, fetchAllSkills);
}

export function useProfile(): Profile {
  return useSanityData(PROFILE, fetchProfile);
}

export function useResume(): Resume {
  return useSanityData(RESUME, fetchResume);
}

export function useSongs(): Song[] {
  return useSanityData(SONGS, fetchAllSongs);
}

export function useTasks(): Task[] {
  return useSanityData(TASKS, fetchAllTasks);
}

export function useHobbies(): string[] {
  return useSanityData(HOBBIES, fetchAllHobbies);
}
