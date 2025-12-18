export type NavigationLink = {
  text: string;
  href: string;
  dropdown: boolean;
  clickable: boolean;
  newTab: boolean;
  subLinks: Array<{
    text: string;
    href: string;
    newTab: boolean;
  }>;
  showOnEveryPage: boolean;
  showOnHomePage: boolean;
  showOnBlogPage: boolean;
  showOnLegalPages: boolean;
  pageSlugs: string[];
};
