"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { DEFAULT_LOCALE, LOCALES } from "@/constants";
import { useNavMenu, usePage } from "@/contexts";
import type { LocaleOption } from "@/types";
import { request } from "@/utils";

type TranslateButtonProps = {
  className?: string;
};

const TranslateButton: React.FC<TranslateButtonProps> = ({ className }) => {
  const currentLocale = useLocale() as LocaleOption;
  const generalT = useTranslations("general");
  const { currentPage, currentPageSlug } = usePage();
  const { isOpen: isNavMenuOpen } = useNavMenu();
  const [translatedUrls, setTranslatedUrls] = useState<Record<
    LocaleOption,
    string
  > | null>(null);

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    const fetchTranslatedUrls = async () => {
      try {
        await request<{
          localizedUrls: Record<LocaleOption, string>;
          status: number;
        }>("GET", "/api/localized-routes", currentLocale, {
          searchParams: {
            currentPage: currentPage,
            currentPageSlug: currentPageSlug,
          },
          defaultErrorMessage: generalT("errors.localizedUrls"),
          setData: (data) => {
            if (data) {
              setTranslatedUrls(data.localizedUrls);
            }
          },
        });
      } catch {
        setTranslatedUrls(null);
      }
    };

    fetchTranslatedUrls();
  }, [currentPage, currentPageSlug, currentLocale, generalT]);

  return (
    <div className={twMerge("flex items-center", className)}>
      {/* Locales */}
      {LOCALES.map((locale, index) => {
        const isActive = locale === currentLocale;
        const href = isActive
          ? undefined
          : translatedUrls?.[locale] ||
            (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);

        return (
          <div key={locale} className="flex items-center">
            {isActive ? (
              <span
                className={twMerge(
                  "px-2 py-1 text-[12px] font-semibold text-primary-purple",
                )}
              >
                {locale.toUpperCase()}
              </span>
            ) : (
              <Link
                className={twMerge(
                  "px-2 py-1 text-[12px] font-medium text-white/80",
                  "transition-colors duration-200 hover:text-white",
                )}
                href={href || "#"}
                prefetch={true}
              >
                {locale.toUpperCase()}
              </Link>
            )}
            {index < LOCALES.length - 1 && (
              <div
                className={twMerge(
                  "w-px mx-1 h-4",
                  isNavMenuOpen ? "bg-white/30" : "bg-gray-300",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TranslateButton;
