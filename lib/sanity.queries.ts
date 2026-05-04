// GROQ queries for fetching data from Sanity
// Reference: https://www.sanity.io/docs/groq

// ===== PROJECTS =====
export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(order asc) {
  name,
  "slug": slug.current,
  desc,
  tech,
  repo,
  demo
}`;

// ===== EXPERIENCE =====
export const ALL_EXPERIENCE_QUERY = `*[_type == "experience"] | order(order asc) {
  title,
  company,
  period,
  description,
  type
}`;

// ===== SKILLS =====
export const ALL_SKILLS_QUERY = `*[_type == "skillCategory"] | order(order asc) {
  title,
  skills
}`;

// ===== PROFILE (singleton -- grab the first one) =====
export const PROFILE_QUERY = `*[_type == "profile"][0] {
  name,
  handle,
  tagline,
  about,
  contact {
    email_masked,
    phone_masked,
    open_to
  },
  socials {
    github,
    linkedin,
    twitter,
    instagram,
    portfolio
  },
  education {
    summary
  }
}`;

// ===== RESUME (singleton) =====
export const RESUME_QUERY = `*[_type == "resume"][0] {
  url,
  filename,
  lastUpdated
}`;

// ===== SONGS =====
export const ALL_SONGS_QUERY = `*[_type == "song"] {
  title,
  artist
}`;

// ===== TASKS =====
export const ALL_TASKS_QUERY = `*[_type == "task"] {
  "id": _key,
  title,
  completed
}`;

// ===== HOBBIES =====
export const ALL_HOBBIES_QUERY = `*[_type == "hobby"] | order(order asc) {
  title,
  description
}`;
