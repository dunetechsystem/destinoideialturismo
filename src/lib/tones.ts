/** Fundos dos blocos coloridos do site (fundo · marca · texto). */
export const TONES = {
  noite: { card: "bg-night-700", accent: "text-gold-500", text: "text-white/70", title: "text-white" },
  ouro: { card: "bg-gold-500", accent: "text-night-900", text: "text-night-900/80", title: "text-night-900" },
  lagoa: { card: "bg-lagoon-500", accent: "text-night-900", text: "text-night-900/80", title: "text-night-900" },
  "azul-royal": { card: "bg-night-600", accent: "text-amber-400", text: "text-white/75", title: "text-white" },
} as const;

export type Tone = keyof typeof TONES;

export const toneOf = (name: string) => TONES[name as Tone] ?? TONES.noite;
