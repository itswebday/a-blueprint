"use server";

import HamburgerButton from "./HamburgerButton";
import NavBar from "./NavBar";
import NavMenu from "./NavMenu";
import {
  ButtonLink,
  type ButtonLinkProps,
  LogoLink,
  TranslateButton,
} from "@/components";
import type { LocaleOption, NavigationLink, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getUrl } from "@/utils";
import { getCachedGlobal, getCachedGlobals } from "@/utils/server";
import { getLocale } from "next-intl/server";
import { twMerge } from "tailwind-merge";

type NavBarNavMenuProps = {
  className?: string;
};

const NavBarNavMenu: React.FC<NavBarNavMenuProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const [navigation, globals] = await Promise.all([
    getCachedGlobal("navigation", locale)(),
    getCachedGlobals(locale)(),
  ]);
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(navigation?.logo);
  const links = (navigation?.links || []).map((link) => ({
    text: link.text || "",
    href: getUrl(link as RawUrl, globals),
    dropdown: link.dropdown || false,
    clickable: link.clickable || false,
    newTab: link.newTab || false,
    subLinks: (link.sublinks || []).map((sublink) => ({
      text: sublink.text || "",
      href: getUrl(sublink as RawUrl, globals),
      newTab: sublink.newTab || false,
    })),
    showOnEveryPage: link.showOnEveryPage || false,
    showOnHomePage: link.showOnHomePage || false,
    showOnBlogPage: link.showOnBlogPage || false,
    showOnLegalPages: link.showOnLegalPages || false,
    pageSlugs: (link.pages || []).map((page) => {
      if (typeof page === "object" && page !== null && "slug" in page) {
        return page.slug || "";
      }
      return "";
    }),
  })) as NavigationLink[];

  // Get button data from navigation
  const showButton = navigation?.showButton;
  const button = navigation?.button;
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;

  return (
    <nav
      className={twMerge(
        "z-95 w-full h-nav-bar px-4 bg-dark",
        "de:pl-6 de:pr-12",
        className,
      )}
    >
      {/* Container */}
      <div
        className={twMerge(
          "flex justify-between items-center gap-4 w-full h-full",
        )}
      >
        {/* Logo */}
        <LogoLink className="z-95 w-12 shrink-0" src={logoUrl} alt={logoAlt} />

        {/* Right side: NavBar, Button, Translate, Hamburger */}
        <div className="flex items-center gap-8 ml-auto">
          {/* Navigation bar (desktop) */}
          <NavBar className="hidden de:flex" links={links} />

          {/* Button (desktop) */}
          {showButton && buttonUrl && button?.text && (
            <div className="hidden de:block">
              <ButtonLink
                href={buttonUrl}
                target={button.newTab ? "_blank" : "_self"}
                variant={button.variant as ButtonLinkProps["variant"]}
              >
                {button.text}
              </ButtonLink>
            </div>
          )}

          {/* Translate button */}
          <TranslateButton className="z-95 shrink-0" />

          {/* Hamburger button (mobile) */}
          <HamburgerButton className="z-95 flex de:hidden shrink-0" />
        </div>

        {/* Navigation menu (mobile) */}
        <NavMenu
          className="flex de:hidden"
          links={links}
          slideOutMenu={navigation?.slideOutMenu || false}
          button={
            showButton && buttonUrl && button?.text
              ? {
                  text: button.text,
                  href: buttonUrl,
                  variant: button.variant as ButtonLinkProps["variant"],
                  newTab: button.newTab || false,
                }
              : undefined
          }
        />
      </div>
    </nav>
  );
};

export default NavBarNavMenu;
