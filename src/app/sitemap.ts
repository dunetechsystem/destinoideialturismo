import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales, localeInfo } from "@/i18n/config";
import { getPackages, getTours } from "@/lib/dunastour/server";

export const revalidate = 3600;

/** Cada página nos três idiomas, cada uma apontando as outras versões (hreflang). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, packages] = await Promise.all([getTours("pt"), getPackages()]);
  const pages: [string, number][] = [
    ["", 1],
    ["/passeios", 0.9],
    ["/galeria", 0.4],
    ...tours.map((t): [string, number] => [`/passeios/${t.id}`, 0.9]),
    ...packages.map((p): [string, number] => [`/pacotes/${p.id}`, 0.8]),
  ];
  const languages = (path: string) => Object.fromEntries(locales.map((l) => [localeInfo[l].tag, `${site.url}/${l}${path}`]));
  return pages.flatMap(([path, priority]) =>
    locales.map((l) => ({ url: `${site.url}/${l}${path}`, lastModified: new Date(), priority, alternates: { languages: languages(path) } }))
  );
}
