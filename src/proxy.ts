import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";

/** Escolhe o idioma pelo cookie da última visita ou pelo Accept-Language; padrão: português. */
function preferred(request: NextRequest): Locale {
  const saved = request.cookies.get("lang")?.value;
  if (hasLocale(saved)) return saved;
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().split(/[-;]/)[0].toLowerCase();
    if (hasLocale(code)) return code;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (hasLocale(first)) return;
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Fora: API, internos do Next e qualquer arquivo estático (tem ponto no nome).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
