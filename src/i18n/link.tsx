"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "./config";
import { useLang } from "./client";

/** next/link que mantém o idioma da página: href="/passeios" vira "/en/passeios" em inglês. */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const lang = useLang();
  return <NextLink href={typeof href === "string" ? localizeHref(lang, href) : href} {...props} />;
}
