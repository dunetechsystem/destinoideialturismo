import "server-only";
import { displayTitle, spotName } from "../format";
import { getDict } from "@/i18n/server";
import { fixMediaUrl, isVideo, type GalleryItem } from "../media";
import { LOCAL_GALLERY, isLocalTourId, photoUrl } from "../local/tours";
import { getAgency, getRouteMedia, getTour, getTours } from "./server";

/**
 * Galeria montada com o que a agência já cadastrou no DunasTour: fotos/vídeos dos lugares do mapa,
 * as fotos de cada passeio e a galeria da página do link. Nada a manter aqui no site.
 */
export async function getGallery(): Promise<GalleryItem[]> {
  const [routeMedia, tours, agency, t] = await Promise.all([getRouteMedia(), getTours(), getAgency(), getDict()]);
  const details = await Promise.all(tours.map((t) => getTour(t.id)));
  const seen = new Set<string>();
  const items: GalleryItem[] = [];
  const add = (url: string | null, place: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    items.push({ url, place, video: isVideo(url) });
  };
  for (const [spot, urls] of Object.entries(routeMedia)) urls.forEach((u) => add(u, spotName(spot)));
  details.forEach((d) => d?.mediaUrls.forEach((u) => add(u, displayTitle(d.title))));
  agency?.checkoutPage?.gallery.forEach((u) => add(fixMediaUrl(u), "Destino Ideal Turismo"));
  if (tours.some((tour) => isLocalTourId(tour.id))) LOCAL_GALLERY.forEach(({ photo, place }) => add(photoUrl(photo), place === "fleet" ? t.gallery.frontTruck : t.gallery.defaultPlace));
  // Intercala os lugares pra prévia não começar com 10 fotos do mesmo ponto.
  const byPlace = new Map<string, GalleryItem[]>();
  items.forEach((i) => byPlace.set(i.place, [...(byPlace.get(i.place) ?? []), i]));
  const mixed: GalleryItem[] = [];
  const queues = [...byPlace.values()];
  while (queues.some((q) => q.length)) queues.forEach((q) => q.length && mixed.push(q.shift()!));
  return mixed;
}
