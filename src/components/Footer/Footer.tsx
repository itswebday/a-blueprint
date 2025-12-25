"use server";

import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";
import { LogoLink } from "@/components";
import { EmailIcon, LocationIcon, PhoneIcon } from "@/components/icons";
import type { Footer as FooterGlobal } from "@/payload-types";
import type { LocaleOption, RawUrl } from "@/types";
import { getMediaUrlAndAlt, getUrl } from "@/utils";
import { getCachedGlobal, getCachedGlobals } from "@/utils/server";
import FooterLink from "./FooterLink";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = async ({ className }) => {
  const locale = (await getLocale()) as LocaleOption;
  const [footerT, homeT, globals] = await Promise.all([
    getTranslations("footer"),
    getTranslations("home"),
    getCachedGlobals(locale)(),
  ]);
  const footer = ((globals as typeof globals & { footer?: unknown }).footer ??
    (await getCachedGlobal("footer", locale)())) as unknown as FooterGlobal;
  const { url: logoUrl, alt: logoAlt } = getMediaUrlAndAlt(footer.logo);

  return (
    <footer
      id="footer"
      className={twMerge("relative w-full pt-24 pb-8 bg-dark", className)}
    >
      {/* Container */}
      <div
        className={twMerge(
          "w-5/6 max-w-7xl mx-auto flex flex-col gap-8",
          "lg:gap-12",
        )}
      >
        {/* Top section */}
        <div
          className={twMerge(
            "flex flex-col gap-16",
            "sm:grid sm:grid-cols-2",
            "lg:grid lg:grid-cols-12",
          )}
        >
          {/* Logo and paragraph */}
          <div className="flex flex-col gap-4 lg:gap-6 lg:col-span-4">
            {/* Logo */}
            <div className="relative w-24">
              <LogoLink className="h-full w-full" src={logoUrl} alt={logoAlt} />
            </div>

            {/* Paragraph */}
            {footer.Paragraph && (
              <p
                className={twMerge(
                  "text-[14px] leading-relaxed text-white/70",
                  "max-w-md",
                )}
              >
                {footer.Paragraph}
              </p>
            )}
          </div>

          {/* Contact information */}
          <div
            className={twMerge("flex flex-col gap-4", "lg:gap-6 lg:col-span-4")}
          >
            {/* Heading */}
            <h6
              className={twMerge("text-[14px] font-semibold text-white mb-2")}
            >
              {footerT("contact.heading")}
            </h6>

            <div className="flex flex-col gap-4 lg:gap-6">
              {/* Email */}
              {footer.email.text && (
                <div className="flex items-center gap-3 lg:gap-4">
                  {/* Icon */}
                  <div
                    className={twMerge(
                      "flex items-center justify-center",
                      "w-12 h-12 p-3 rounded-full",
                      "bg-primary-purple/20 text-primary-purple",
                      "shrink-0",
                      "lg:w-14 lg:h-14",
                    )}
                  >
                    <EmailIcon className="w-6 h-6" />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1">
                    <span
                      className={twMerge(
                        "text-[10px] font-medium text-white/60",
                        "uppercase tracking-wide",
                      )}
                    >
                      {footerT("contact.email")}
                    </span>
                    <FooterLink
                      href={`mailto:${footer.email.text}`}
                      target="_blank"
                    >
                      <span className="text-[14px] font-medium text-white">
                        {footer.email.text}
                      </span>
                    </FooterLink>
                  </div>
                </div>
              )}

              {/* Phone */}
              {footer.phone.text && (
                <div className="flex items-center gap-3 lg:gap-4">
                  {/* Icon */}
                  <div
                    className={twMerge(
                      "flex items-center justify-center",
                      "w-12 h-12 p-3 rounded-full",
                      "bg-primary-purple/20 text-primary-purple",
                      "shrink-0",
                      "lg:w-14 lg:h-14",
                    )}
                  >
                    <PhoneIcon className="w-6 h-6" />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1">
                    <span
                      className={twMerge(
                        "text-[10px] font-medium text-white/60",
                        "uppercase tracking-wide",
                      )}
                    >
                      {footerT("contact.phone")}
                    </span>
                    <FooterLink
                      href={`tel:${footer.phone.text.replace(/\s/g, "")}`}
                      target="_blank"
                    >
                      <span className="text-[14px] font-medium text-white">
                        {footer.phone.text}
                      </span>
                    </FooterLink>
                  </div>
                </div>
              )}

              {/* Address */}
              {footer.address.line1 && (
                <div className="flex items-start gap-3 lg:gap-4">
                  {/* Icon */}
                  <div
                    className={twMerge(
                      "flex items-center justify-center",
                      "w-12 h-12 p-3 rounded-full",
                      "bg-primary-purple/20 text-primary-purple",
                      "shrink-0",
                      "lg:w-14 lg:h-14",
                    )}
                  >
                    <LocationIcon className="w-6 h-6" />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1">
                    <span
                      className={twMerge(
                        "text-[10px] font-medium text-white/60",
                        "uppercase tracking-wide",
                      )}
                    >
                      {footerT("address.heading")}
                    </span>
                    <FooterLink
                      className="flex flex-col items-start gap-0.5"
                      href={footer.address.url}
                      target="_blank"
                    >
                      {footer.address.line1 && (
                        <span className="text-[14px] font-medium text-white">
                          {footer.address.line1}
                        </span>
                      )}
                      {footer.address.line2 && (
                        <span className="text-[14px] font-medium text-white">
                          {footer.address.line2}
                        </span>
                      )}
                      {footer.address.line3 && (
                        <span className="text-[14px] font-medium text-white">
                          {footer.address.line3}
                        </span>
                      )}
                    </FooterLink>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick links and social media */}
          <div
            className={twMerge(
              "flex flex-col gap-16",
              "sm:grid sm:grid-cols-2 sm:col-span-2",
              "lg:flex lg:flex-col lg:col-span-4 lg:ml-auto lg:items-end",
            )}
          >
            {/* Quick links */}
            {footer.quickLinks.length > 0 && (
              <div className="flex flex-col gap-3">
                {/* Heading */}
                <h6
                  className={twMerge(
                    "text-[14px] font-semibold text-white mb-2",
                  )}
                >
                  {footerT("quickLinks.heading")}
                </h6>

                {/* Links */}
                <div className="flex flex-col gap-2 lg:items-end lg:gap-3">
                  {footer.quickLinks.map((link, index) => {
                    const linkUrl = getUrl(link as RawUrl, globals);

                    if (!linkUrl) {
                      return null;
                    }

                    return (
                      <FooterLink
                        key={index}
                        href={linkUrl}
                        target={link.newTab ? "_blank" : "_self"}
                      >
                        <span className="text-[14px] text-white/80">
                          {link.text}
                        </span>
                      </FooterLink>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Social media links */}
            {footer.socialMediaLinks.length > 0 && (
              <div
                className={twMerge(
                  "flex flex-col gap-3",
                  "lg:gap-4 lg:w-full lg:items-end",
                )}
              >
                {/* Heading */}
                <h6
                  className={twMerge(
                    "text-[14px] font-semibold text-white mb-2",
                  )}
                >
                  {footerT("socialMedia.heading")}
                </h6>

                {/* Links */}
                <div className="flex gap-3 lg:gap-4 lg:justify-end">
                  {footer.socialMediaLinks.map((item, index) => {
                    const { url: iconUrl, alt: iconAlt } = getMediaUrlAndAlt(
                      item.icon,
                    );

                    return (
                      <Link
                        key={item.id || index}
                        className={twMerge(
                          "group flex items-center justify-center",
                          "w-10 h-10 rounded-full",
                          "bg-primary-purple/20 text-primary-purple",
                          "hover:bg-primary-purple hover:text-white",
                          "transition-all duration-300",
                          "lg:w-12 lg:h-12",
                        )}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Social media link ${index + 1}`}
                      >
                        {iconUrl ? (
                          <span
                            className={twMerge(
                              "relative block h-5 w-5",
                              "lg:h-6 lg:w-6",
                            )}
                          >
                            <Image
                              className={twMerge(
                                "object-contain",
                                "transition-transform duration-300",
                                "group-hover:scale-110",
                              )}
                              src={iconUrl}
                              alt={iconAlt}
                              fill={true}
                              sizes="(max-width: 768px) 20px, 24px"
                              loading="lazy"
                            />
                          </span>
                        ) : (
                          <span
                            className={twMerge(
                              "text-[16px] font-semibold",
                              "lg:text-[18px]",
                            )}
                          >
                            S
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div
        className={twMerge(
          "w-11/12 max-w-6xl mx-auto mt-8 pt-6",
          "border-t border-white/10",
          "lg:mt-12 lg:pt-8",
        )}
      >
        {/* Legal links */}
        {footer.legalLinks.length > 0 && (
          <div
            className={twMerge(
              "flex flex-wrap justify-center gap-4 mb-6",
              "lg:justify-start lg:gap-6 lg:mb-8",
            )}
          >
            {footer.legalLinks.map((link, index) => {
              const linkUrl = getUrl(link as RawUrl, globals);

              if (!linkUrl) {
                return null;
              }

              return (
                <FooterLink
                  key={index}
                  href={linkUrl}
                  target={link.newTab ? "_blank" : "_self"}
                >
                  <span className="text-[12px] text-white/60">{link.text}</span>
                </FooterLink>
              );
            })}
          </div>
        )}

        {/* Copyright and company details */}
        <div
          className={twMerge(
            "flex flex-col gap-3 text-center text-[12px] text-white/60",
            "lg:flex-row lg:justify-between lg:gap-4 lg:text-left",
          )}
        >
          {/* Company details */}
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
            {footer.companyDetails.crn && (
              <span>
                {footerT("legalLinks.crn")}:{" "}
                <span className="font-medium text-white">
                  {footer.companyDetails.crn}
                </span>
              </span>
            )}
            {footer.companyDetails.vat && (
              <span>
                {footerT("legalLinks.vat")}:{" "}
                <span className="font-medium text-white">
                  {footer.companyDetails.vat}
                </span>
              </span>
            )}
          </div>

          {/* Copyright */}
          <div>
            <span>
              ©{" "}
              <Link
                className={twMerge(
                  "font-medium text-white",
                  "hover:text-primary-purple",
                  "transition-colors duration-200",
                )}
                href={homeT("href")}
                prefetch={true}
              >
                {/* TODO: Change to company name */}A Template
              </Link>{" "}
              {new Date().getFullYear()}. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
