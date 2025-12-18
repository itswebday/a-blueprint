import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Field } from "payload";

type RichTextFieldProps = {
  name?: string;
  label?: string;
  condition?: (data: unknown, siblingData: unknown) => boolean;
};

export const RichTextField = ({
  name = "text",
  label = "Text",
  condition,
}: RichTextFieldProps = {}): Field => ({
  name: name,
  label: label,
  type: "richText",
  defaultValue: undefined,
  localized: true,
  admin: {
    condition: condition,
  },
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures.filter(
          (feature) =>
            !["upload", "relationship", "checklist"].includes(feature.key),
        ),
        HeadingFeature({
          enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
        }),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        AlignFeature(),
        IndentFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        LinkFeature({
          fields: [
            {
              name: "url",
              label: "URL (e.g., '/', '/about', or 'https://www.google.com')",
              type: "text",
              defaultValue: "",
              localized: false,
              required: true,
            },
            {
              name: "newTab",
              label: "Open in a new tab",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        }),
        BlockquoteFeature(),
        HorizontalRuleFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ];
    },
  }),
});
