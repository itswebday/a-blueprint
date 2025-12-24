import type React from "react";
import type { Globals, RawUrl } from "@/types";

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

export const createLinkClickHandler = (
  href: string | undefined,
  pathname: string,
  options?: {
    onNavigate?: () => void;
    onClick?: () => void;
  },
) => {
  return (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>,
  ) => {
    if (!href) {
      if (options?.onClick) {
        options.onClick();
      }
      return;
    }

    // Normalize pathname (remove any hash that might be in the URL)
    const normalizedPathname =
      pathname === "/" ? "/" : pathname.split("#")[0].replace(/\/$/, "");

    // Handle hash-only links (scroll on current page)
    if (href.startsWith("#")) {
      e.preventDefault();

      const targetElement = document.querySelector(href);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start",
        });
      }
    } else if (href.includes("#")) {
      // Handle links with hash (page#target)
      const [pageUrl, hash] = href.split("#");
      const hashTarget = hash ? `#${hash}` : "";

      // Normalize page URL for comparison (remove trailing slashes)
      const normalizedPageUrl =
        pageUrl === "/" ? "/" : pageUrl.replace(/\/$/, "");

      // If already on the target page, prevent navigation and just scroll
      if (normalizedPageUrl === normalizedPathname) {
        e.preventDefault();

        const targetElement = document.querySelector(hashTarget);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
        }
      } else {
        // Navigate to the page - Next.js will handle scrolling to hash on load
        if (options?.onNavigate) {
          options.onNavigate();
        }
      }
    } else {
      // Regular link navigation (no hash in href)
      const normalizedHref = href === "/" ? "/" : href.replace(/\/$/, "");

      // If it is the same page, scroll to top
      if (normalizedHref === normalizedPathname) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        if (options?.onNavigate) {
          options.onNavigate();
        }
      } else {
        // If it is a different page, ensure we navigate cleanly without hash
        if (typeof window !== "undefined" && window.location.hash) {
          const urlWithoutHash =
            window.location.pathname + window.location.search;

          window.history.replaceState(null, "", urlWithoutHash);
        }

        // Handle navigation normally
        if (options?.onNavigate) {
          options.onNavigate();
        }
      }
    }

    // Handle click event
    if (options?.onClick) {
      options.onClick();
    }
  };
};

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
  const getFromGlobal = (selector: (global: Globals) => unknown): string => {
    const value = selector(globals);

    return getGlobalUrl(value) || "";
  };

  if (rawUrl.custom) {
    return rawUrl.url;
  }

  if (rawUrl.scroll) {
    if (rawUrl.targetPage === "home" || rawUrl.targetPage === "page") {
      if (rawUrl.targetPage === "home") {
        const homeUrl = getFromGlobal((global) => global.home);

        return homeUrl
          ? `${homeUrl}${rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : ""}`
          : `#${rawUrl.scrollTarget || "top"}`;
      } else if (rawUrl.targetPage === "page" && rawUrl.page) {
        const pageValue = rawUrl.page?.value;
        const pageUrl =
          typeof pageValue === "object" &&
          pageValue !== null &&
          "url" in pageValue
            ? pageValue.url || ""
            : "";

        return pageUrl
          ? `${pageUrl}${rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : ""}`
          : `#${rawUrl.scrollTarget || "top"}`;
      }
    }

    return rawUrl.scrollTarget ? `#${rawUrl.scrollTarget}` : "#top";
  }

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
