import React from "react";
import { twMerge } from "tailwind-merge";
import { ButtonLink, type ButtonLinkProps, Heading } from "@/components";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { TextBlock } from "@/payload-types";
import type { Globals, RawUrl, RichText } from "@/types";
import { getPaddingClasses, getUrl, highlightText } from "@/utils";

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
  hidden,
  id,
  globals,
}) => {
  const buttonUrl = showButton ? getUrl(button as RawUrl, globals) : undefined;

  const getMaxWidthClass = () => {
    switch (width) {
      case "small":
        return "max-w-3xl";
      case "medium":
        return "max-w-5xl";
      case "large":
        return "max-w-7xl";
      default:
        return "max-w-5xl";
    }
  };

  // Heading
  const headingElement =
    showHeading && heading ? (
      <Heading
        className={centered ? "justify-center" : undefined}
        icon={heading.icon}
        heading={
          typeof heading.text === "string" && heading.hlTexts
            ? highlightText(heading.text, heading.hlTexts, theme)
            : heading.text
        }
        tagName="h5"
        theme={theme}
      />
    ) : null;

  // Text
  const textElement = (
    <RichTextRenderer
      className={twMerge(
        theme === "dark" ? "text-white/90" : "text-dark/90",
        centered && "text-center",
      )}
      richText={text as RichText}
    />
  );

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
        hidden && "hidden",
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
