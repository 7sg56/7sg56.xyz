/**
 * Seed script: populates Sanity with all the data from lib/data.ts
 *
 * Usage:
 *   npx tsx sanity/seed.ts
 *
 * This pushes your hardcoded portfolio data into Sanity so you can
 * manage it from the Studio going forward. Safe to run multiple times --
 * it uses createOrReplace so existing docs get overwritten.
 */

import { createClient } from "@sanity/client";
import {
  PROJECTS,
  EXPERIENCE,
  SKILLS,
  PROFILE,
  RESUME,
  SONGS,
  TASKS,
  HOBBIES,
} from "../lib/data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "snu4zq4v";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  // You need a token with write access for this script.
  // Generate one at: https://www.sanity.io/manage/project/<projectId>/api#tokens
  token: process.env.SANITY_WRITE_TOKEN,
});

async function seed() {
  console.log(`Seeding Sanity project "${projectId}" dataset "${dataset}"...\n`);

  const transaction = client.transaction();

  // ===== PROJECTS =====
  for (const [i, p] of PROJECTS.entries()) {
    const doc = {
      _id: `project-${p.slug}`,
      _type: "project",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      desc: p.desc,
      tech: p.tech,
      repo: p.repo || undefined,
      demo: p.demo || undefined,
      order: i + 1,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Project: ${p.name}`);
  }

  // ===== EXPERIENCE =====
  for (const [i, exp] of EXPERIENCE.entries()) {
    const id = `experience-${exp.company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
    const doc = {
      _id: id,
      _type: "experience",
      title: exp.title,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      type: exp.type,
      order: i + 1,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Experience: ${exp.title} at ${exp.company}`);
  }

  // ===== SKILLS =====
  for (const [i, cat] of SKILLS.entries()) {
    const id = `skill-${cat.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
    const doc = {
      _id: id,
      _type: "skillCategory",
      title: cat.title,
      skills: cat.skills,
      order: i + 1,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Skill Category: ${cat.title}`);
  }

  // ===== PROFILE (singleton) =====
  {
    const doc = {
      _id: "profile-singleton",
      _type: "profile",
      name: PROFILE.name,
      handle: PROFILE.handle,
      tagline: PROFILE.tagline,
      about: PROFILE.about,
      contact: {
        email_masked: PROFILE.contact.email_masked,
        phone_masked: PROFILE.contact.phone_masked,
        open_to: PROFILE.contact.open_to,
      },
      socials: {
        github: PROFILE.socials.github,
        linkedin: PROFILE.socials.linkedin,
        twitter: PROFILE.socials.twitter,
        instagram: PROFILE.socials.instagram,
        portfolio: PROFILE.socials.portfolio,
      },
      education: {
        summary: PROFILE.education.summary,
      },
    };
    transaction.createOrReplace(doc);
    console.log(`  + Profile: ${PROFILE.name}`);
  }

  // ===== RESUME (singleton) =====
  {
    const doc = {
      _id: "resume-singleton",
      _type: "resume",
      url: RESUME.url,
      filename: RESUME.filename,
      lastUpdated: RESUME.lastUpdated,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Resume: ${RESUME.filename}`);
  }

  // ===== SONGS =====
  for (const [i, song] of SONGS.entries()) {
    const id = `song-${song.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-${i}`;
    const doc = {
      _id: id,
      _type: "song",
      title: song.title,
      artist: song.artist,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Song: ${song.title} - ${song.artist}`);
  }

  // ===== TASKS =====
  for (const [i, task] of TASKS.entries()) {
    const id = `task-${i + 1}`;
    const doc = {
      _id: id,
      _type: "task",
      title: task.title,
      completed: task.completed,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Task: ${task.title}`);
  }

  // ===== HOBBIES =====
  for (const [i, hobby] of HOBBIES.entries()) {
    // Parse "Gaming -- \"Rise, Tarnished.\" - Elden Ring" format
    const parts = hobby.split(" -- ");
    const title = parts[0]?.replace(/^[^\w]*/, "").trim() || hobby;
    const description = parts[1]?.trim();

    const id = `hobby-${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
    const doc = {
      _id: id,
      _type: "hobby",
      title,
      description,
      order: i + 1,
    };
    transaction.createOrReplace(doc);
    console.log(`  + Hobby: ${title}`);
  }

  // Commit all at once
  console.log("\nCommitting transaction...");
  const result = await transaction.commit();
  console.log(
    `\nDone! ${result.results.length} documents created/updated.`
  );
  console.log(
    `\nView your content at: https://www.sanity.io/manage/project/${projectId}`
  );
  console.log(`Or open Studio at: http://localhost:3000/studio`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
