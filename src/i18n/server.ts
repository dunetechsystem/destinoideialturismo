import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import { dictionaries, type Dict } from "./dictionaries";
import { makeFormat } from "@/lib/format";

/** Idioma da rota atual (/pt, /en, /es) — vale em qualquer Server Component, sem passar por props. */
export async function getLang(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDict(): Promise<Dict> {
  return dictionaries[await getLang()];
}

/** Idioma + textos + formatadores (moeda, datas, durações) já no idioma da rota. */
export async function getI18n() {
  const l = await getLang();
  const t = dictionaries[l];
  return { lang: l, t, f: makeFormat(l, t) };
}
