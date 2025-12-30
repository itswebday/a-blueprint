"use client";

import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { getMediaUrlAndAlt } from "@/utils";

type HeadingProps = {
  className?: string;
  icon?: number | { id?: number | null; url?: string | null } | null;
  heading: React.ReactNode;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  theme?: "light" | "dark";
};

const Heading: React.FC<HeadingProps> = ({
  className,
  icon,
  heading,
  tagName,
  theme,
}) => {
  const { url: iconUrl, alt: iconAlt } = icon
    ? getMediaUrlAndAlt(icon)
    : { url: undefined, alt: undefined };

  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      {iconUrl && (
        <span className="relative shrink-0 h-5 w-5">
          <Image
            className="object-contain"
            src={iconUrl}
            alt={iconAlt || ""}
            fill={true}
            sizes="20px"
          />
        </span>
      )}

      {React.createElement(
        tagName,
        {
          className: twMerge(
            "font-bold",
            theme === "dark" ? "text-white" : "text-dark",
          ),
        },
        heading,
      )}
    </div>
  );
};

export default Heading;
