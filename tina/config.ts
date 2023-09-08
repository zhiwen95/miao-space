import { defineConfig } from "tinacms";
import { MDXTemplates } from "../src/theme/template";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: "4948e685-3b72-4262-9aa8-29329485504e", // Get this from tina.io
  token: "bf03b651fa864b12f8748c404b5fe979d6ccb1d3", // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "img/blog",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "blog",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            name: "authors",
            label: "Authors",
            type: "string",
            required: true,
            list: true,
          },
          {
            name: "date",
            label: "Date",
            type: "string",
            required: true,
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [...MDXTemplates],
          },
        ],
      }
    ],
  },
});
