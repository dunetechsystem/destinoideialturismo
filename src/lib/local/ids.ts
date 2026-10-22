/** Slugs do catálogo local (lib/local/tours.ts) — arquivo leve, pode ir pro navegador sem levar os textos junto. */
export const LOCAL_SLUGS = [
  "lagoa-azul",
  "lagoa-bonita",
  "duas-lagoas",
  "atins",
  "rio-preguicas-cabure",
  "boia-cross",
  "nascer-do-sol",
  "mirar-das-estrelas",
  "quadriciclo",
] as const;

export const PRIVATE_SUFFIX = "-privativo";

export const isLocalTourId = (id: string) => LOCAL_SLUGS.some((slug) => id === slug || id === slug + PRIVATE_SUFFIX);
