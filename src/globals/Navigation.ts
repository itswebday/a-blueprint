import { getButtonLinkFields, getLinkFields } from "@/utils";
import { revalidateNavigation } from "@/hooks/revalidate";
import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    group: "General",
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "links",
      label: "Links",
      type: "array",
      defaultValue: [],
      labels: {
        singular: "Link",
        plural: "Links",
      },
      fields: [
        ...getLinkFields({ includeDropdown: true }),
        {
          name: "sublinks",
          label: "Sublinks",
          type: "array",
          defaultValue: [],
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.dropdown === true;
            },
          },
          labels: {
            singular: "Sublink",
            plural: "Sublinks",
          },
          fields: getLinkFields(),
        },
        {
          name: "showOnEveryPage",
          label: "Show on every page",
          type: "checkbox",
          defaultValue: true,
        },
        {
          name: "showOnHomePage",
          label: "Show on home page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnBlogPage",
          label: "Show on blog page",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "showOnLegalPages",
          label: "Show on legal pages",
          type: "checkbox",
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
        {
          name: "pages",
          label: "Other pages where this link should be visible",
          type: "relationship",
          relationTo: "pages",
          hasMany: true,
          admin: {
            condition: (_, siblingData) => {
              return siblingData?.showOnEveryPage === false;
            },
          },
        },
      ],
    },
    ...getButtonLinkFields({ optional: true, hiddenFields: ["centered"] }),
    {
      name: "socialMediaLinks",
      label: "Social media links",
      type: "array",
      maxRows: 4,
      labels: {
        singular: "Social media link",
        plural: "Social media links",
      },
      fields: [
        {
          name: "icon",
          label: "Icon (SVG file)",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "url",
          label: "Link (URL)",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "slideOutMenu",
      label: "Slide out menu",
      type: "checkbox",
      defaultValue: false,
      required: false,
    },
  ],
  hooks: {
    afterChange: [revalidateNavigation],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    max: 30,
  },
};
