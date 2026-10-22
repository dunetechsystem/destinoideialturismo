import type { ReactNode } from "react";

/** "Onde o *paraíso*" → texto com <em> no trecho entre asteriscos (destaque dos títulos). */
export function rich(text: string): ReactNode {
  return text.split(/\*([^*]+)\*/g).map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part));
}

/** Variante com <strong> (textos corridos). */
export function strong(text: string): ReactNode {
  return text.split(/\*([^*]+)\*/g).map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/** "Olá, {name}" + { name: "Ana" } → "Olá, Ana". */
export function fmt(template: string, vars: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
