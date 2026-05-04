import { defineField, defineType } from "sanity";
import { TECH_OPTIONS } from "@/lib/techIcons";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "desc",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tech",
      title: "Technologies",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: TECH_OPTIONS,
          },
        },
      ],
      description: "Select technologies -- each must match a tech SVG icon",
    }),
    defineField({
      name: "repo",
      title: "Repository URL",
      type: "url",
    }),
    defineField({
      name: "demo",
      title: "Demo URL",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "desc" },
  },
});
