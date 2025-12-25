import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { TextBlock } from "@/payload-types";
import type { Globals, RawUrl, RichText } from "@/types";
import { getMediaUrlAndAlt, getPaddingClasses, getUrl } from "@/utils";

const Text: React.FC<TextBlock & { id?: string; globals: Globals }> = ({
  showHeading,
  heading,
  text,
  showButton,
  button,
  centered,
  width,
  theme,
  background,
  paddingTop,
  paddingBottom,
  id,
  globals,
}) => {
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;

  const getMaxWidthClass = () => {
    switch (width) {
      case "small":
        return "max-w-120";
      case "medium":
        return "max-w-240";
      case "large":
        return "max-w-320";
      default:
        return "max-w-240";
    }
  };

  // Heading
  const headingElement =
    showHeading && heading ? (
      <div
        className={twMerge(
          "flex items-center gap-3",
          centered && "justify-center",
        )}
      >
        {heading.icon &&
          (() => {
            const { url: iconUrl, alt: iconAlt } = getMediaUrlAndAlt(
              heading.icon,
            );
            return iconUrl ? (
              <span className="relative shrink-0 h-5 w-5">
                <Image
                  className="object-contain"
                  src={iconUrl}
                  alt={iconAlt}
                  fill={true}
                  sizes="20px"
                />
              </span>
            ) : null;
          })()}
        {React.createElement(
          "h5",
          { className: "text-primary-purple font-bold" },
          heading.text,
        )}
      </div>
    ) : null;

  // Text
  const textElement = text ? (
    <div
      className={twMerge(theme === "dark" ? "text-white/90" : "text-dark/90")}
    >
      <RichTextRenderer
        className={centered ? "text-center" : undefined}
        richText={text as RichText}
      />
    </div>
  ) : null;

  // Button
  const buttonElement =
    button && buttonUrl ? (
      <div className={twMerge("w-fit", centered && "mx-auto")}>
        <ButtonLink
          href={buttonUrl}
          variant={button.variant as ButtonLinkProps["variant"]}
          target={button.newTab ? "_blank" : "_self"}
        >
          {button.text}
        </ButtonLink>
      </div>
    ) : null;

  return (
    <section
      id={id}
      className={twMerge(
        "w-full overflow-hidden",
        theme === "dark" && "bg-dark text-white",
        background === "gray" && theme === "light" && "bg-background",
        getPaddingClasses(paddingTop, paddingBottom),
      )}
    >
      {/* Container */}
      <div className={twMerge("w-11/12 max-w-7xl mx-auto", getMaxWidthClass())}>
        {/* Section content */}
        <div className="flex flex-col gap-6">
          {headingElement}
          {textElement}
          {buttonElement && <div className="pt-2">{buttonElement}</div>}
        </div>
      </div>
    </section>
  );
};

export default Text;
