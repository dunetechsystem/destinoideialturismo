export const locales = ["pt", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export const hasLocale = (value: string | undefined): value is Locale => !!value && (locales as readonly string[]).includes(value);

/** Rótulos do seletor de idioma e tag BCP-47 de cada um (datas, números, <html lang>). */
export const localeInfo: Record<Locale, { label: string; name: string; tag: string; og: string }> = {
  pt: { label: "PT", name: "Português", tag: "pt-BR", og: "pt_BR" },
  en: { label: "EN", name: "English", tag: "en-US", og: "en_US" },
  es: { label: "ES", name: "Español", tag: "es-ES", og: "es_ES" },
};

/** "/passeios" → "/en/passeios"; mantém âncora ("/#lagoas" → "/en/#lagoas"). Links externos e relativos passam direto. */
export function localizeHref(lang: Locale, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const first = href.split(/[/?#]/)[1];
  if (hasLocale(first)) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

/** Troca o idioma de um caminho já localizado: "/pt/passeios/x" + "en" → "/en/passeios/x". */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  if (hasLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}
