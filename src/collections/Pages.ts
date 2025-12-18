import { authenticated, authenticatedOrPublished } from "@/access";
import { blockConfigs } from "@/blocks/config";
import { DEFAULT_LOCALE } from "@/constants";
import { SlugField } from "@/fields";
import {
  generateUrlWithoutLocale,
  populatePublishedAtCollection,
} from "@/hooks";
import { revalidatePage, revalidateDelete } from "@/hooks/revalidate";
import { getMetaFields, getPreviewPathCollection } from "@/utils";
import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Other page",
    plural: "Other pages",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "url", "updatedAt"],
    group: "Pages",
    livePreview: {
      url: ({ data }) =>
        getPreviewPathCollection({
          url: data?.url,
          collection: "pages",
        }),
    },
    preview: (data) =>
      getPreviewPathCollection({
        url: data?.url as string,
        collection: "pages",
      }),
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Main content",
          fields: [
            {
              name: "blocks",
              label: "Blocks",
              type: "blocks",
              blocks: blockConfigs,
              defaultValue: [],
            },
          ],
        },
        {
          name: "meta",
          label: "SEO",
          fields: getMetaFields(),
        },
      ],
    },
    {
      name: "publishedAt",
      label: "Published at",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd-MM-yyyy HH:mm",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [populatePublishedAtCollection],
      },
    },
    SlugField({ readOnly: true }),
    {
      name: "url",
      label: "Page URL",
      type: "text",
      defaultValue: "",
      localized: true,
      unique: true,
      admin: {
        description:
          "URL of the page (e.g. /about-us or /nl/services/websites)",
        position: "sidebar",
      },
      validate: (value: string | string[] | null | undefined) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return true;
        }

        if (!value || typeof value !== "string") {
          return true;
        }

        if (value === "/") {
          return "The root path / is reserved for the Home page";
        }

        if (!value.startsWith("/")) {
          return "URL must start with /";
        }

        if (value.endsWith("/")) {
          return "URL must not end with /";
        }

        if (value.includes("//") && !value.startsWith("//")) {
          return "URL must not contain consecutive slashes";
        }

        if (!/^\/[a-zA-Z0-9\/\-_]*$/.test(value)) {
          return "URL must not contain invalid characters";
        }

        return true;
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req }) => {
            if (value && typeof value === "string" && value.trim() !== "") {
              let normalized = value.trim();

              if (!normalized.startsWith("/")) {
                normalized = `/${normalized}`;
              }

              if (normalized.endsWith("/")) {
                normalized = normalized.slice(0, -1);
              }

              normalized = normalized.replace(/(?<!^)\/+/g, "/");

              if (normalized === "/") {
                return "";
              }

              return normalized;
            }

            const source = data?.title || "";

            if (!source || typeof source !== "string") {
              return "";
            }

            const slug = source
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");

            if (!slug) {
              return "";
            }

            const basePath = `/${slug}`;
            const locale = req?.locale || DEFAULT_LOCALE;

            return locale === DEFAULT_LOCALE
              ? basePath
              : `/${locale}${basePath}`;
          },
        ],
      },
    },
    {
      name: "urlWithoutLocale",
      label: "URL without locale",
      type: "text",
      localized: true,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Automatically generated from URL",
      },
      hooks: {
        beforeChange: [generateUrlWithoutLocale],
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
};
