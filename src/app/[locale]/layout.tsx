import {
  CookieNotification,
  PreviewListener,
  NavBarNavMenu,
  Footer,
} from "@/components";
import { NavMenuProvider, PageProvider } from "@/contexts";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";

const getServerSideUrl = () => {
  return process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
};

const HomeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  return (
    <NextIntlClientProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;
            0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        </head>

        <body className="text-[15px] font-lato bg-white text-dark">
          <PageProvider initialPage="">
            <NavMenuProvider>
              <PreviewListener />
              <NavBarNavMenu />
              {children}
              <Footer />
              <CookieNotification />
            </NavMenuProvider>
          </PageProvider>
        </body>
      </html>
    </NextIntlClientProvider>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideUrl()),
};

export default HomeLayout;
