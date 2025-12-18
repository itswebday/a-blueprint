import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import type { Field } from "payload";

export const getMetaFields = ({
  hiddenFields = [],
  relationTo = "media",
}: {
  hiddenFields?: string[];
  relationTo?: string;
} = {}): Field[] => {
  const overviewField = OverviewField({
    titlePath: "meta.title",
    descriptionPath: "meta.description",
    imagePath: "meta.image",
  });
  const titleField = MetaTitleField({});
  const descriptionField = MetaDescriptionField({});
  const imageField = MetaImageField({
    relationTo: relationTo,
  });
  const previewField = PreviewField({
    titlePath: "meta.title",
    descriptionPath: "meta.description",
  });

  return [
    {
      ...overviewField,
      admin: {
        ...(overviewField.admin || {}),
        ...(hiddenFields.includes("overview") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...titleField,
      admin: {
        ...(titleField.admin || {}),
        ...(hiddenFields.includes("title") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...descriptionField,
      admin: {
        ...(descriptionField.admin || {}),
        ...(hiddenFields.includes("description") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...imageField,
      admin: {
        ...(imageField.admin || {}),
        ...(hiddenFields.includes("image") ? { hidden: true } : {}),
      },
    } as Field,
    {
      ...previewField,
      admin: {
        ...(previewField.admin || {}),
        ...(hiddenFields.includes("preview") ? { hidden: true } : {}),
      },
    } as Field,
  ];
};

export const getBlockStyleFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "theme",
      label: "Theme",
      type: "select",
      options: [
        {
          label: "Light",
          value: "light",
        },
        {
          label: "Dark",
          value: "dark",
        },
      ],
      defaultValue: "light",
      required: true,
      admin: hiddenFields.includes("theme") ? { hidden: true } : undefined,
    },
  ];
};

export const getPaddingFields = ({
  hiddenFields = [],
}: {
  hiddenFields?: string[];
} = {}): Field[] => {
  return [
    {
      name: "paddingTop",
      label: "Padding top",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      required: true,
      admin: hiddenFields.includes("paddingTop") ? { hidden: true } : undefined,
    },
    {
      name: "paddingBottom",
      label: "Padding bottom",
      type: "select",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
      defaultValue: "medium",
      required: true,
      admin: hiddenFields.includes("paddingBottom")
        ? { hidden: true }
        : undefined,
    },
  ];
};

export const getHeadingFields = ({
  hiddenFields = [],
  optional = false,
}: {
  hiddenFields?: string[];
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "icon",
      label: "Icon (optional)",
      type: "upload",
      relationTo: "media",
      admin: hiddenFields.includes("icon") ? { hidden: true } : undefined,
    },
    {
      name: "text",
      label: "Text",
      type: "text",
      defaultValue: "",
      localized: true,
      required: true,
      admin: hiddenFields.includes("text") ? { hidden: true } : undefined,
    },
  ];

  if (optional) {
    return [
      {
        name: "showHeading",
        label: "Show heading",
        type: "checkbox",
        defaultValue: true,
        admin: hiddenFields.includes("showHeading")
          ? { hidden: true }
          : undefined,
      },
      {
        name: "heading",
        label: "Heading",
        type: "group",
        required: true,
        admin: {
          ...(hiddenFields.includes("heading")
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.showHeading === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return fields;
};

export const getLinkFields = ({
  hiddenFields = [],
  includeDropdown = false,
  localizedText = true,
  excludeTextField = false,
}: {
  hiddenFields?: string[];
  includeDropdown?: boolean;
  localizedText?: boolean;
  excludeTextField?: boolean;
} = {}): Field[] => {
  const baseFields: Field[] = [];

  if (!excludeTextField) {
    baseFields.push({
      name: "text",
      label: "Text",
      type: "text",
      localized: localizedText,
      required: true,
      admin: hiddenFields.includes("text") ? { hidden: true } : undefined,
    });
  }

  baseFields.push({
    name: "custom",
    label: "Custom URL",
    type: "checkbox",
    defaultValue: hiddenFields.includes("custom") ? true : false,
    admin: {
      ...(hiddenFields.includes("custom")
        ? { hidden: true }
        : {
            condition: includeDropdown
              ? (_, siblingData) => {
                  return !siblingData?.dropdown || siblingData?.clickable;
                }
              : undefined,
          }),
    },
  });

  baseFields.push({
    name: "url",
    label: "URL (e.g., 'https://www.itswebday.com')",
    type: "text",
    defaultValue: "",
    localized: false,
    required: true,
    admin: {
      ...(hiddenFields.includes("url")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (includeDropdown) {
                return (
                  siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }
              return siblingData?.custom;
            },
          }),
    },
  });

  baseFields.push({
    name: "scroll",
    label: "Smooth scroll to a block",
    type: "checkbox",
    defaultValue: false,
    admin: {
      ...(hiddenFields.includes("scroll")
        ? { hidden: true }
        : {
            condition: includeDropdown
              ? (_, siblingData) => {
                  if (siblingData?.custom) {
                    return false;
                  }

                  return !siblingData?.dropdown || siblingData?.clickable;
                }
              : (_, siblingData) => {
                  return !siblingData?.custom;
                },
          }),
    },
  });

  baseFields.push({
    name: "scrollTarget",
    label: "Target block (e.g., 'text-block-1', 'visual-block-3', or 'footer')",
    type: "text",
    defaultValue: "",
    localized: false,
    required: true,
    admin: {
      ...(hiddenFields.includes("scrollTarget")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.custom) {
                return false;
              }

              if (includeDropdown) {
                return (
                  siblingData?.scroll &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }

              return siblingData?.scroll;
            },
          }),
    },
  });

  baseFields.push({
    name: "urlType",
    label: "Link type",
    type: "select",
    options: [
      { label: "Home page", value: "home" },
      { label: "Other page", value: "page" },
      { label: "Blog overview", value: "blog" },
      { label: "Blog post", value: "blog-post" },
      { label: "Privacy policy", value: "privacy-policy" },
      { label: "Cookie policy", value: "cookie-policy" },
      { label: "Terms and conditions", value: "terms-and-conditions" },
    ],
    defaultValue: "home",
    required: true,
    admin: {
      ...(hiddenFields.includes("urlType")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable)
                );
              }
              return !siblingData?.custom;
            },
          }),
    },
  });

  baseFields.push({
    name: "page",
    label: "Page",
    type: "relationship",
    relationTo: ["pages"],
    required: true,
    admin: {
      ...(hiddenFields.includes("page")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.urlType === "page"
                );
              }
              return !siblingData?.custom && siblingData?.urlType === "page";
            },
          }),
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData?: Record<string, unknown> },
    ) => {
      if (includeDropdown) {
        if (
          !siblingData?.custom &&
          (!siblingData?.dropdown || siblingData?.clickable) &&
          siblingData?.urlType === "page" &&
          !value
        ) {
          return "Other page is required when 'Link type' is 'Other page'";
        }
      } else {
        if (!siblingData?.custom && siblingData?.urlType === "page" && !value) {
          return "Other page is required when 'Link type' is 'Other page'";
        }
      }
      return true;
    },
  });

  baseFields.push({
    name: "blogPost",
    label: "Blog post",
    type: "relationship",
    relationTo: ["blog-posts"],
    required: true,
    admin: {
      ...(hiddenFields.includes("blogPost")
        ? { hidden: true }
        : {
            condition: (_, siblingData) => {
              if (siblingData?.scroll) {
                return false;
              }

              if (includeDropdown) {
                return (
                  !siblingData?.custom &&
                  (!siblingData?.dropdown || siblingData?.clickable) &&
                  siblingData?.urlType === "blog-post"
                );
              }
              return (
                !siblingData?.custom && siblingData?.urlType === "blog-post"
              );
            },
          }),
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData?: Record<string, unknown> },
    ) => {
      if (includeDropdown) {
        if (
          !siblingData?.custom &&
          (!siblingData?.dropdown || siblingData?.clickable) &&
          siblingData?.urlType === "blog-post" &&
          !value
        ) {
          return "Blog post is required when 'Link type' is 'Blog post'";
        }
      } else {
        if (
          !siblingData?.custom &&
          siblingData?.urlType === "blog-post" &&
          !value
        ) {
          return "Blog post is required when 'Link type' is 'Blog post'";
        }
      }
      return true;
    },
  });

  baseFields.push({
    name: "newTab",
    label: "Open in a new tab",
    type: "checkbox",
    defaultValue: false,
    admin: hiddenFields.includes("newTab")
      ? { hidden: true }
      : {
          condition: (_, siblingData) => {
            return !siblingData?.scroll;
          },
        },
  });

  if (includeDropdown) {
    baseFields.push({
      name: "dropdown",
      label: "Dropdown link",
      type: "checkbox",
      defaultValue: false,
      admin: hiddenFields.includes("dropdown") ? { hidden: true } : undefined,
    });

    baseFields.push({
      name: "clickable",
      label: "Clickable",
      type: "checkbox",
      defaultValue: true,
      admin: {
        ...(hiddenFields.includes("clickable")
          ? { hidden: true }
          : {
              condition: (_, siblingData) => {
                return siblingData?.dropdown === true;
              },
            }),
      },
    });
  }

  return baseFields;
};

export const getButtonLinkFields = ({
  hiddenFields = [],
  includeDropdown = false,
  localizedText = true,
  optional = false,
}: {
  hiddenFields?: string[];
  includeDropdown?: boolean;
  localizedText?: boolean;
  optional?: boolean;
} = {}): Field[] => {
  const fields: Field[] = [
    {
      name: "variant",
      label: "Variant",
      type: "select",
      options: [
        {
          label: "Purple button",
          value: "purpleButton",
        },
        {
          label: "White button",
          value: "whiteButton",
        },
        {
          label: "Dark button",
          value: "darkButton",
        },
        {
          label: "Transparent button",
          value: "transparentButton",
        },
      ],
      defaultValue: "purpleButton",
      required: true,
      admin: hiddenFields.includes("variant") ? { hidden: true } : undefined,
    },
    ...getLinkFields({
      hiddenFields,
      includeDropdown,
      localizedText,
    }),
  ];

  if (optional) {
    return [
      {
        name: "showButton",
        label: "Show button",
        type: "checkbox",
        defaultValue: false,
        admin: hiddenFields.includes("showButton")
          ? { hidden: true }
          : undefined,
      },
      {
        name: "button",
        label: "Button",
        type: "group",
        required: true,
        admin: {
          ...(hiddenFields.includes("button")
            ? { hidden: true }
            : {
                condition: (_data, siblingData) => {
                  return siblingData?.showButton === true;
                },
              }),
        },
        fields,
      },
    ];
  }

  return fields;
};
