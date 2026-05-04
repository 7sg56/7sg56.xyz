import { defineField, defineType } from "sanity";

export const task = defineType({
  name: "task",
  title: "Task",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "completed",
      title: "Completed",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", completed: "completed" },
    prepare({ title, completed }) {
      return {
        title: title || "Untitled Task",
        subtitle: completed ? "Done" : "Pending",
      };
    },
  },
});
