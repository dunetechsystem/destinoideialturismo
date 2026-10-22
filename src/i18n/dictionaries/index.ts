import type { Locale } from "../config";
import { en } from "./en";
import { es } from "./es";
import { pt, type Dict } from "./pt";

export type { Dict };
export const dictionaries: Record<Locale, Dict> = { pt, en, es };
