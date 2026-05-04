import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// API version date -- use a recent date for latest features
const apiVersion = "2026-05-04";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use CDN for published content (fast, cached reads)
  useCdn: true,
});
