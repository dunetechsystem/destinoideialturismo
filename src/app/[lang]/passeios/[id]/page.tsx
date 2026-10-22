import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Backpack, BadgeCheck, CarFront, Check, Clock, Flame, Footprints, ShieldAlert, Sunrise, Users } from "lucide-react";
import { getAgency, getTour, getTours } from "@/lib/dunastour/server";
import { tourBase } from "@/lib/booking-base";
import { agencyInfo } from "@/lib/agency-info";
import { displayTitle } from "@/lib/format";
import { getI18n } from "@/i18n/server";
import { fmt, rich, strong } from "@/i18n/text";
import { PageHero } from "@/components/layout/PageHero";
import { MediaMosaic } from "@/components/tour/MediaMosaic";
import { BookingPanel } from "@/components/tour/BookingPanel";
import { LineList, RichText } from "@/components/tour/RichText";
import { TourCard } from "@/components/tour/TourCard";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTours("pt")).map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/passeios/[id]">): Promise<Metadata> {
  const [tour, { t }] = await Promise.all([getTour((await params).id), getI18n()]);
  if (!tour) return { title: t.meta.tourNotFound };
  const title = displayTitle(tour.title);
  return {
    title,
    description: tour.description.replace(/\s+/g, " ").slice(0, 160),
    openGraph: { title, images: tour.mediaUrls.slice(0, 1) },
  };
}

export default async function TourPage({ params }: PageProps<"/[lang]/passeios/[id]">) {
  const { id } = await params;
  const { t, f } = await getI18n();
  const { duration, unitLabel } = f;
  const [tour, tours, agency] = await Promise.all([getTour(id), getTours(), getAgency()]);
  if (!tour) notFound();
  const title = displayTitle(tour.title);
  const cover = tour.mediaUrls[0] ?? tours.find((t) => t.id === id)?.coverImageUrl ?? null;
  const others = tours.filter((t) => t.id !== id).slice(0, 3);
  const vehicle = tour.saleUnit && tour.saleUnit !== "PESSOA";

  const facts = [
    tour.durationMinutes > 0 && { icon: Clock, label: t.tour.duration, value: duration(tour.durationMinutes) },
    tour.defaultPickupTime && { icon: Sunrise, label: t.tour.departure, value: tour.defaultPickupTime.slice(0, 5).replace(":", "h") },
    { icon: CarFront, label: t.tour.pickup, value: t.tour.pickupValue },
    vehicle
      ? { icon: Users, label: t.tour.soldBy, value: `${unitLabel(tour.saleUnit, 1)}${tour.vehicleMaxOccupancy ? ` · ${fmt(t.tour.upTo, { n: tour.vehicleMaxOccupancy })}` : ""}` }
      : { icon: Users, label: t.tour.price, value: t.tour.perPerson },
    tour.instantConfirmation && { icon: BadgeCheck, label: t.tour.confirmation, value: t.tour.immediate },
    tour.trek && { icon: Footprints, label: t.tour.trek, value: fmt(t.tour.trekValue, { km: tour.trek.distanceKm, days: tour.trek.days }) },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: tour.description.slice(0, 500),
    image: tour.mediaUrls.slice(0, 3),
    provider: { "@type": "TravelAgency", name: agency?.tradeName ?? "Destino Ideal Turismo" },
    offers: { "@type": "Offer", price: tour.basePrice, priceCurrency: "BRL", availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        image={cover}
        tall
        eyebrow={tour.tags.length ? tour.tags.join(" · ") : t.tour.wherever}
        title={title}
        crumbs={[
          { href: "/", label: t.common.home },
          { href: "/passeios", label: t.common.tours },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {tour.durationMinutes > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-ink/15 px-4 py-2 text-sm font-semibold text-ink backdrop-blur">
              <Clock size={15} /> {duration(tour.durationMinutes)}
            </span>
          )}
          {tour.riskType && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-ink">
              <ShieldAlert size={15} /> {t.tour.adventureActivity}
            </span>
          )}
          {(tour.recentBookings ?? 0) >= 3 && (
            <span className="flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-night-900">
              <Flame size={15} /> {fmt(t.tour.recentBookings, { n: tour.recentBookings ?? 0 })}
            </span>
          )}
        </div>
      </PageHero>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <MediaMosaic urls={tour.mediaUrls} title={title} />

          <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-3xl bg-white p-4 ring-1 ring-ink/5">
                <Icon size={20} className="text-gold-600" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink/40">{label}</p>
                <p className="font-bold capitalize text-ink">{value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-12">
            <h2 className="mb-5 font-display text-3xl text-ink">{t.tour.about}</h2>
            <RichText text={tour.description} />
          </Reveal>

          {(tour.included || tour.whatToBring) && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {tour.included && (
                <Reveal className="rounded-[2rem] bg-white p-6">
                  <h3 className="mb-4 font-display text-2xl text-ink">{t.tour.included}</h3>
                  <LineList text={tour.included} icon={<Check size={18} className="text-cyan-brand" />} />
                </Reveal>
              )}
              {tour.whatToBring && (
                <Reveal className="rounded-[2rem] bg-white p-6">
                  <h3 className="mb-4 font-display text-2xl text-ink">{t.tour.toBring}</h3>
                  <LineList text={tour.whatToBring} icon={<Backpack size={18} className="text-gold-600" />} />
                </Reveal>
              )}
            </div>
          )}

          {tour.riskType && (
            <div className="mt-8 flex gap-3 rounded-3xl border border-amber-400/40 bg-amber-400/10 p-5 text-sm text-ink/80">
              <ShieldAlert className="shrink-0 text-gold-600" />
              <p>{strong(t.tour.riskNote)}</p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel base={tourBase(tour, cover)} phone={agencyInfo(agency).phone} />
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <h2 className="mb-8 font-display text-4xl text-ink">
            {rich(t.tour.combine)}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
