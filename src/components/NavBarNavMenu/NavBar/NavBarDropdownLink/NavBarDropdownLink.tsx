"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { NavLink } from "@/components";
import { DropdownArrow } from "@/components/icons";

export type NavBarDropdownLinkProps = {
  className?: string;
  text: string;
  href?: string;
  newTab?: boolean;
  subLinks: { text: string; href: string; newTab: boolean }[];
  clickable?: boolean;
  onClick?: () => void;
};

const NavBarDropdownLink: React.FC<NavBarDropdownLinkProps> = ({
  className,
  text,
  href,
  newTab,
  subLinks,
  clickable = true,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (href && clickable) {
      if (href.startsWith("#")) {
        e.preventDefault();

        setTimeout(() => {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "start",
            });
          }
        }, 100);
      } else {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 1000);
      }
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={twMerge(
        "relative h-full",
        isClicked && "pointer-events-none",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Link */}
      <NavLink
        className="h-full"
        href={clickable ? href : undefined}
        target={newTab ? "_blank" : "_self"}
      >
        {/* Text and dropdown arrow */}
        <motion.div
          className="flex items-center gap-2 h-full"
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Text */}
          <motion.span
            className="text-[15px] font-medium"
            animate={{
              color: isHovered ? "rgb(140, 82, 254)" : "rgb(255, 255, 255)",
            }}
            transition={{ duration: 0.3 }}
          >
            {text}
          </motion.span>

          {/* Dropdown arrow */}
          <motion.div
            className="flex items-center"
            animate={{
              rotate: isHovered ? 180 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.span
              animate={{
                color: isHovered
                  ? "rgb(140, 82, 254)"
                  : "rgba(255, 255, 255, 0.7)",
              }}
              transition={{ duration: 0.3 }}
            >
              <DropdownArrow className="w-4 h-4" />
            </motion.span>
          </motion.div>
        </motion.div>
      </NavLink>

      {/* Dropdown list */}
      <AnimatePresence>
        {isHovered && subLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className={twMerge(
              "z-95 absolute -left-2 top-full flex flex-col w-56",
              "rounded-xl bg-white shadow-xl",
              "border border-gray-100/50 overflow-hidden backdrop-blur-md",
            )}
          >
            {/* Sublinks */}
            {subLinks.map((subLink, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                }}
              >
                {/* Sublink */}
                <NavLink
                  className={twMerge(
                    "block px-5 py-3",
                    "hover:bg-primary-purple/5 transition-colors duration-200",
                  )}
                  href={subLink.href}
                  target={subLink.newTab ? "_blank" : "_self"}
                >
                  <motion.span
                    className="text-[14px] font-medium text-dark/80"
                    whileHover={{ color: "rgb(140, 82, 254)", x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {subLink.text}
                  </motion.span>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBarDropdownLink;
