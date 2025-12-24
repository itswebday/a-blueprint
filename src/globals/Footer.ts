import type { GlobalConfig } from "payload";
import { revalidateFooter } from "@/hooks/revalidate";
import { getLinkFields } from "@/utils";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
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
      name: "Paragraph",
      label: "Paragraph",
      type: "text",
      defaultValue: "",
      localized: true,
    },
    {
      name: "email",
      label: "Email",
      type: "group",
      required: true,
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "phone",
      label: "Phone",
      type: "group",
      required: true,
      fields: [
        {
          name: "text",
          label: "",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "address",
      label: "Address",
      type: "group",
      required: true,
      fields: [
        {
          name: "text",
          label: "Text",
          type: "text",
          defaultValue: "",
          required: true,
        },
        {
          name: "url",
          label: "URL",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "quickLinks",
      labels: {
        singular: "Quick link",
        plural: "Quick links",
      },
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      fields: getLinkFields(),
    },
    {
      name: "socialMediaLinks",
      label: "Social media links",
      type: "array",
      maxRows: 4,
      minRows: 1,
      required: true,
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
          defaultValue: "",
          required: true,
        },
      ],
    },
    {
      name: "legalLinks",
      label: "Legal links",
      type: "array",
      defaultValue: [],
      minRows: 1,
      required: true,
      labels: {
        singular: "Legal link",
        plural: "Legal links",
      },
      fields: getLinkFields(),
    },
    {
      name: "companyDetails",
      label: "Company details",
      type: "group",
      required: true,
      fields: [
        {
          name: "crn",
          label: "Company registration number",
          type: "text",
          defaultValue: "",
          required: true,
        },
        {
          name: "vat",
          label: "VAT number",
          type: "text",
          defaultValue: "",
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
    max: 30,
  },
};
