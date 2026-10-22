import type { TourCard, TourSaleUnit } from "@/lib/dunastour/types";
import type { Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { LOCAL_TOUR_TEXT } from "@/lib/local/tours.i18n";
import { displayTitle, isPrivateTour, makeFormat, tourUnitPrice } from "@/lib/format";
import { PRIVATE_SUFFIX } from "@/lib/local/ids";

/** Uma forma de fazer o passeio (compartilhado ou privativo) com o preço dela. */
export interface ChatOption {
  id: string;
  kind: "shared" | "private";
  price: number;
  saleUnit: TourSaleUnit;
  /** Pessoas por veículo (privativo/quadriciclo); null = preço por pessoa. */
  capacity: number | null;
  allowKids: boolean;
}

/** Passeio como o chat mostra: dados serializáveis, já no idioma da rota. */
export interface ChatTour {
  id: string;
  title: string;
  image: string | null;
  schedule: string;
  description: string;
  itinerary: string[];
  bring: string[];
  options: ChatOption[];
}

/**
 * Passeios do site → passeios do chat. No catálogo local, o par coletivo/privativo vira um passeio com
 * duas opções; os do DunasTour entram um a um (cada um já tem a própria unidade de venda e preço).
 */
export function chatTours(tours: TourCard[], lang: Locale): ChatTour[] {
  const t = dictionaries[lang];
  const f = makeFormat(lang, t);
  const out = new Map<string, ChatTour>();

  for (const tour of tours) {
    const isPriv = isPrivateTour(tour);
    const baseId = tour.id.endsWith(PRIVATE_SUFFIX) ? tour.id.slice(0, -PRIVATE_SUFFIX.length) : tour.id;
    const text = LOCAL_TOUR_TEXT[lang][baseId];
    const unit = tour.saleUnit ?? "PESSOA";
    const option: ChatOption = {
      id: tour.id,
      kind: isPriv ? "private" : "shared",
      price: tourUnitPrice(tour),
      saleUnit: unit,
      capacity: unit === "PESSOA" ? null : (tour.vehicleMaxOccupancy ?? null),
      allowKids: !tour.riskType,
    };
    const existing = out.get(baseId);
    if (existing) {
      existing.options.push(option);
      existing.options.sort((a) => (a.kind === "shared" ? -1 : 1));
      continue;
    }
    out.set(baseId, {
      id: baseId,
      title: text?.title ?? displayTitle(tour.title),
      image: tour.coverImageUrl,
      schedule: text?.schedule ?? f.duration(tour.durationMinutes),
      description: text?.description ?? tour.tags.join(" · "),
      itinerary: text?.itinerary ?? [],
      bring: text?.whatToBring ?? [],
      options: [option],
    });
  }
  return [...out.values()];
}

/** Quantos veículos são precisos para N pessoas (preço por pessoa = 1 "unidade" por pessoa). */
export function unitsFor(option: ChatOption, people: number) {
  if (option.saleUnit === "PESSOA") return people;
  return Math.max(1, Math.ceil(people / (option.capacity ?? Math.max(people, 1))));
}

export const lineTotal = (option: ChatOption, people: number) => option.price * unitsFor(option, people);
