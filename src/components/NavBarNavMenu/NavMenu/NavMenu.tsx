"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import { useNavMenu, usePage } from "@/contexts";
import { createLinkClickHandler } from "@/utils";
import type { NavigationLink } from "@/types";

type NavMenuProps = {
  className?: string;
  links: NavigationLink[];
  slideOutMenu?: boolean;
  button?: {
    variant: ButtonLinkProps["variant"];
    text: string;
    href: string;
    newTab: boolean;
  };
};

const NavMenu: React.FC<NavMenuProps> = ({
  className,
  links,
  slideOutMenu = false,
  button,
}) => {
  const pathname = usePathname();
  const { isOpen, close } = useNavMenu();
  const { currentPage, currentPageSlug } = usePage();

  // Filter links based on visibility rules
  const filteredLinks = links.filter((link) => {
    // Show on every page
    if (link.showOnEveryPage) {
      return true;
    }

    // Show on home page
    if (
      currentPage === "home" &&
      currentPageSlug === "" &&
      link.showOnHomePage
    ) {
      return true;
    }

    // Show on blog page
    if (currentPage === "blog" && link.showOnBlogPage) {
      return true;
    }

    // Show on legal pages
    if (
      (currentPage === "privacy-policy" ||
        currentPage === "cookie-policy" ||
        currentPage === "terms-and-conditions") &&
      link.showOnLegalPages
    ) {
      return true;
    }

    // Show on specific pages
    if (currentPageSlug && link.pageSlugs && link.pageSlugs.length > 0) {
      return link.pageSlugs.includes(currentPageSlug);
    }

    return false;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={twMerge(
            "z-90 fixed inset-0 flex flex-col bg-linear-to-t",
            "from-primary-purple via-dark to-dark backdrop-blur-xl",
            !isOpen && "pointer-events-none",
            className,
          )}
          initial={slideOutMenu ? { x: "100%", opacity: 0 } : { opacity: 0 }}
          animate={slideOutMenu ? { x: 0, opacity: 1 } : { opacity: 1 }}
          exit={slideOutMenu ? { x: "100%", opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              close();
            }
          }}
        >
          {/* Top bar with close button area */}
          <div
            className={twMerge(
              "w-full h-nav-bar bg-dark/50 backdrop-blur-md",
              "border-b border-white/10",
            )}
          />

          {/* Container */}
          <motion.div
            className={twMerge(
              "flex-1 w-11/12 max-w-2xl py-12 mx-auto overflow-y-auto",
            )}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Button */}
            {button && (
              <motion.div
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <ButtonLink
                  variant={button.variant}
                  href={button.href}
                  target={button.newTab ? "_blank" : "_self"}
                  onClick={close}
                >
                  {button.text}
                </ButtonLink>
              </motion.div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-4">
              {filteredLinks.map((link, index) => (
                <motion.div
                  className="flex flex-col"
                  key={index}
                  initial={{ x: slideOutMenu ? 50 : 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  {link.clickable ? (
                    <Link
                      className={twMerge(
                        "group relative px-4 py-3 rounded-xl",
                        "transition-all duration-300",
                        "hover:bg-white/10 hover:pl-6",
                      )}
                      href={link.href}
                      target={link.newTab ? "_blank" : "_self"}
                      rel={link.newTab ? "noopener noreferrer" : undefined}
                      prefetch={true}
                      onClick={createLinkClickHandler(link.href, pathname, {
                        onNavigate: close,
                        onClick: close,
                      })}
                    >
                      <motion.span
                        className="text-[16px] font-semibold text-white"
                        whileHover={{ color: "rgb(196, 181, 253)", x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.text}
                      </motion.span>
                      <motion.div
                        className={twMerge(
                          "absolute left-0 top-1/2 -translate-y-1/2",
                          "w-1 h-0 bg-primary-purple rounded-r-full",
                        )}
                        initial={{ height: 0 }}
                        whileHover={{ height: "60%" }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  ) : (
                    <div className="px-4 py-3 opacity-50">
                      <span className="text-[16px] font-semibold text-white">
                        {link.text}
                      </span>
                    </div>
                  )}

                  {/* Sublinks */}
                  {link.subLinks.length > 0 && (
                    <motion.div
                      className="flex flex-col pl-6 mt-2 gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3, delay: 0.25 + index * 0.1 }}
                    >
                      {link.subLinks.map((sublink, i) => (
                        <Link
                          className={twMerge(
                            "group px-4 py-2 rounded-lg",
                            "transition-all duration-300",
                            "hover:bg-white/5 hover:pl-6",
                          )}
                          key={i}
                          href={sublink.href}
                          target={sublink.newTab ? "_blank" : "_self"}
                          rel={
                            sublink.newTab ? "noopener noreferrer" : undefined
                          }
                          prefetch={true}
                          onClick={createLinkClickHandler(
                            sublink.href,
                            pathname,
                            {
                              onNavigate: close,
                              onClick: close,
                            },
                          )}
                        >
                          <motion.span
                            className="text-[15px] font-medium text-white/80"
                            whileHover={{ color: "rgb(196, 181, 253)", x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sublink.text}
                          </motion.span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMenu;
