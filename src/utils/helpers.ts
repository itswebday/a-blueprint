export const getMediaUrlAndAlt = (
  media:
    | {
        url?: string | null;
        alt?: string | null;
      }
    | string
    | number
    | null
    | undefined,
) => {
  if (!media || typeof media === "string" || typeof media === "number") {
    return { url: "", alt: "" };
  }

  // Get the URL of the media
  const url = media.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${media.url}`
    : "";

  // Get the alt text of the media
  const alt = media.alt || "";

  // Return the URL and alt text
  return { url, alt };
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

import type { Globals, RawUrl } from "@/types";

export const getGlobalUrl = (global: unknown): string | null => {
  if (
    typeof global === "object" &&
    global !== null &&
    "url" in global &&
    global.url
  ) {
    if (global.url && typeof global.url === "string") {
      return global.url;
    }
  }

  return null;
};

export const getUrl = (rawUrl: RawUrl, globals: Globals): string => {
  if (rawUrl.custom) {
    return rawUrl.url;
  }

  if (rawUrl.scroll) {
    return rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : "#top";
  }

  const getFromGlobal = (selector: (global: Globals) => unknown): string => {
    const value = selector(globals);

    return getGlobalUrl(value) || "";
  };

  if (rawUrl.urlType === "home") {
    return getFromGlobal((global) => global.home);
  }

  if (rawUrl.urlType === "blog") {
    return getFromGlobal((global) => global.blog);
  }

  if (rawUrl.urlType === "privacy-policy") {
    return getFromGlobal((global) => global.privacyPolicy);
  }

  if (rawUrl.urlType === "cookie-policy") {
    return getFromGlobal((global) => global.cookiePolicy);
  }

  if (rawUrl.urlType === "terms-and-conditions") {
    return getFromGlobal((global) => global.termsAndConditions);
  }

  const pageValue = rawUrl.page?.value || rawUrl.blogPost?.value;
  const pageUrl =
    typeof pageValue === "object" && pageValue !== null && "url" in pageValue
      ? pageValue.url || ""
      : "";

  return pageUrl;
};
