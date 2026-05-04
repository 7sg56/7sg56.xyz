import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  // Singleton: only one profile document should exist
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "handle",
      title: "Handle / Username",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "about",
      title: "About",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      fields: [
        defineField({
          name: "email_masked",
          title: "Email",
          type: "string",
        }),
        defineField({
          name: "phone_masked",
          title: "Phone (or message)",
          type: "string",
        }),
        defineField({
          name: "open_to",
          title: "Open To",
          type: "string",
          description: 'e.g. "Open to work / mentorship"',
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "twitter", title: "Twitter / X", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({
          name: "portfolio",
          title: "Portfolio",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "object",
      fields: [
        defineField({
          name: "summary",
          title: "Summary",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline" },
  },
});
