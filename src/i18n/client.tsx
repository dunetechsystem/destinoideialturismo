"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dict } from "./dictionaries";
import { makeFormat } from "@/lib/format";

interface Ctx {
  lang: Locale;
  t: Dict;
}
const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ lang, t, children }: { lang: Locale; t: Dict; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t }), [lang, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useCtx() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("LocaleProvider ausente");
  return ctx;
}

export const useLang = () => useCtx().lang;
export const useT = () => useCtx().t;

/** Formatadores no idioma atual (moeda, datas, durações, unidades). */
export function useFormat() {
  const { lang, t } = useCtx();
  return useMemo(() => makeFormat(lang, t), [lang, t]);
}
