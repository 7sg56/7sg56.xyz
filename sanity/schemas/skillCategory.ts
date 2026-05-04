import { defineField, defineType } from "sanity";
import { TECH_OPTIONS } from "@/lib/techIcons";

export const skillCategory = defineType({
  name: "skillCategory",
  title: "Skill Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: TECH_OPTIONS,
          },
        },
      ],
      description: "Select skills -- each must match a tech SVG icon",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
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
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Untitled Category" };
    },
  },
});
