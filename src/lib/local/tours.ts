import type { TourCard, TourDetail, TourRiskType } from "../dunastour/types";
import type { Locale } from "@/i18n/config";
import { dictionaries, type Dict } from "@/i18n/dictionaries";
import { LOCAL_TOUR_TEXT } from "./tours.i18n";
import { PRIVATE_SUFFIX, isLocalTourId } from "./ids";

export { isLocalTourId };

/**
 * Catálogo local da Destino Ideal Turismo — passeios do site antigo (destinoidealturismo.com.br).
 * Só vale enquanto a agência não tem passeios cadastrados no DunasTour: assim que a API devolver
 * passeios para o slug (DUNASTOUR_AGENCY_SLUG), `getTours()` passa a usar só os dela e este arquivo
 * deixa de ser lido (ver lib/dunastour/server.ts). Pode apagar depois de migrar tudo.
 *
 * Os textos ficam em tours.i18n.ts (pt/en/es). Cada passeio vira dois: coletivo (preço por pessoa) e privativo (preço por veículo), como no site antigo.
 */

interface LocalTour {
  slug: string;
  /** Saída em "HH:mm". */
  pickup: string;
  durationMinutes: number;
  /** Fotos em /public/fotos — a primeira é a capa. */
  photos: string[];
  priceShared: number;
  pricePrivate: number;
  /** Lugares do veículo privativo. */
  capacity: number;
  /** Vendido por quadriciclo (dupla), com termo de risco. */
  quad?: boolean;
}

const LOCAL_TOURS: LocalTour[] = [
  { slug: "lagoa-azul", pickup: "09:00", durationMinutes: 240, photos: ["lagoonGoldenHour", "panoramicDunes", "lagoonOvercast"], priceShared: 150, pricePrivate: 1200, capacity: 9 },
  { slug: "lagoa-bonita", pickup: "14:00", durationMinutes: 270, photos: ["sunsetLagoon", "sunsetDunes", "sunsetTourists"], priceShared: 150, pricePrivate: 1200, capacity: 9 },
  { slug: "duas-lagoas", pickup: "09:00", durationMinutes: 600, photos: ["panoramicDunes", "lagoonGoldenHour", "sunsetLagoon"], priceShared: 250, pricePrivate: 2000, capacity: 9 },
  { slug: "atins", pickup: "09:00", durationMinutes: 480, photos: ["dunesLagoonVehicle", "atinsNight", "vehicle4x4Dunes"], priceShared: 220, pricePrivate: 1800, capacity: 9 },
  { slug: "rio-preguicas-cabure", pickup: "08:30", durationMinutes: 420, photos: ["boatRiver", "fleetParking"], priceShared: 140, pricePrivate: 1400, capacity: 12 },
  { slug: "boia-cross", pickup: "08:30", durationMinutes: 270, photos: ["boiaCross1", "boiaCross2"], priceShared: 140, pricePrivate: 1400, capacity: 11 },
  { slug: "nascer-do-sol", pickup: "04:30", durationMinutes: 150, photos: ["sunriseDeus", "sunsetDunesHorizon", "sunsetLagoonChairs"], priceShared: 180, pricePrivate: 1400, capacity: 9 },
  { slug: "mirar-das-estrelas", pickup: "19:30", durationMinutes: 210, photos: ["milkyWayDunes", "vehicleNight", "atinsNight"], priceShared: 180, pricePrivate: 1400, capacity: 9 },
  { slug: "quadriciclo", pickup: "09:00", durationMinutes: 480, photos: ["quadriciclos", "darkVehicleLagoon"], priceShared: 600, pricePrivate: 1000, capacity: 2, quad: true },
];

/** Fotos extras (frota, trilhas) que entram só na galeria. */
export const LOCAL_GALLERY: { photo: string; place: "fleet" | "park" }[] = [
  { photo: "vehicle4x4Logo", place: "fleet" },
  { photo: "vehicle4x4Sunset", place: "fleet" },
  { photo: "vehicle4x4Palm", place: "fleet" },
  { photo: "vehicle4x4Forest", place: "fleet" },
  { photo: "vehicles4x4Fleet", place: "fleet" },
  { photo: "vehiclesFleet2", place: "fleet" },
  { photo: "whiteToyota", place: "fleet" },
  { photo: "vehicleDark", place: "park" },
];

export const photoUrl = (name: string) => `/fotos/${name}.jpg`;

function cards(t: LocalTour, lang: Locale, dict: Dict): TourCard[] {
  const text = LOCAL_TOUR_TEXT[lang][t.slug];
  const riskType: TourRiskType | null = t.quad ? "QUADRICICLO" : null;
  const base = {
    coverImageUrl: photoUrl(t.photos[0]),
    ratingAvg: 0,
    ratingCount: 0,
    agencyName: "Destino Ideal Turismo",
    riskType,
    durationMinutes: t.durationMinutes,
    currency: "BRL",
  };
  const shared: TourCard = {
    ...base,
    id: t.slug,
    title: text.title,
    basePrice: t.priceShared,
    tags: [text.tag],
    saleUnit: t.quad ? "QUADRICICLO" : "PESSOA",
    vehicleMaxOccupancy: t.quad ? 2 : null,
  };
  const priv: TourCard = {
    ...base,
    id: t.slug + PRIVATE_SUFFIX,
    title: `${text.title} · ${dict.common.private}`,
    basePrice: t.pricePrivate,
    tags: [text.tag, dict.common.private],
    saleUnit: t.quad ? "QUADRICICLO" : "CARRO",
    vehicleMaxOccupancy: t.capacity,
  };
  return [shared, priv];
}

const allCards = (lang: Locale) => {
  const dict = dictionaries[lang];
  return LOCAL_TOURS.flatMap((t) => cards(t, lang, dict).map((card) => ({ card, tour: t })));
};

export const localTours = (lang: Locale): TourCard[] => allCards(lang).map((e) => e.card);

export function localTour(id: string, lang: Locale): TourDetail | null {
  const entry = allCards(lang).find((e) => e.card.id === id);
  if (!entry) return null;
  const { card, tour: t } = entry;
  const text = LOCAL_TOUR_TEXT[lang][t.slug];
  const d = dictionaries[lang].tour;
  const isPrivate = id.endsWith(PRIVATE_SUFFIX);
  const lines = [
    text.description,
    text.note ?? "",
    isPrivate ? d.privateLine.replace("{n}", String(t.capacity)) : d.sharedLine,
    d.scheduleLine.replace("{schedule}", text.schedule),
    d.itineraryTitle,
    ...text.itinerary.map((step, i) => `${i + 1}. ${step}`),
  ].filter(Boolean);
  return {
    ...card,
    description: lines.join("\n"),
    mediaUrls: t.photos.map(photoUrl),
    defaultPickupTime: `${t.pickup}:00`,
    whatToBring: text.whatToBring.join("\n"),
    instantConfirmation: false,
  };
}
