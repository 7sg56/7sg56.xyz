import { defineField, defineType } from "sanity";

export const resume = defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  // Singleton: only one resume document should exist
  fields: [
    defineField({
      name: "url",
      title: "Resume URL / Path",
      type: "string",
      description: 'Path to the resume file, e.g. "/sourish-ghosh-resume.pdf"',
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "string",
      description: 'e.g. "2025-10-01"',
    }),
  ],
  preview: {
    select: { title: "filename", subtitle: "lastUpdated" },
  },
});
