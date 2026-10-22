import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Tenor_Sans } from "next/font/google";
import "../globals.css";
import { site } from "@/config/site";
import { getAgency, getTours } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { hasLocale, localeInfo, locales } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { LocaleProvider } from "@/i18n/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chat } from "@/components/chat/Chat";
import { chatTours } from "@/components/chat/chat-tours";

// Tenor Sans = títulos e letreiro dos cards (a mesma do site da agência); Inter = textos.
const tenor = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-tenor", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = dictionaries[lang].meta;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.title, template: t.template },
    description: t.description,
    keywords: t.keywords,
    icons: { icon: "/brand/mark.png", apple: "/brand/mark.png" },
    // O site já tem PT/EN/ES: sem isso o Chrome oferece traduzir e embaralha os textos (ex.: abas do chat).
    other: { google: "notranslate" },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [localeInfo[l].tag, `/${l}`])),
    },
    openGraph: {
      type: "website",
      locale: localeInfo[lang].og,
      siteName: site.name,
      title: t.ogTitle,
      description: t.ogDescription,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: t.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: t.ogTitle, description: t.twitterDescription, images: ["/og.jpg"] },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = dictionaries[lang];
  const [agency, tours] = await Promise.all([getAgency(), getTours()]);
  const info = agencyInfo(agency);
  return (
    <html lang={localeInfo[lang].tag} translate="no" className={`${tenor.variable} ${inter.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <LocaleProvider lang={lang} t={t}>
          <Header info={info} />
          <main>{children}</main>
          <Footer info={info} />
          <Chat info={info} tours={chatTours(tours, lang)} />
        </LocaleProvider>
      </body>
    </html>
  );
}
