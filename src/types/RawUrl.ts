export type RawUrl = {
  custom: boolean;
  url: string;
  scroll: boolean;
  scrollTarget: string;
  urlType:
    | "home"
    | "page"
    | "blog"
    | "blog-post"
    | "privacy-policy"
    | "cookie-policy"
    | "terms-and-conditions";
  page: {
    relationTo: "pages";
    value: number | { url: string; slug: string };
  };
  blogPost: {
    relationTo: "blog-posts";
    value: number | { url: string; slug: string };
  };
};
