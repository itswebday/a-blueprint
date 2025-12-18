import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "User",
    plural: "Users",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email"],
    group: "General",
  },
  auth: true,
  fields: [],
};
