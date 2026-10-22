"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useFormat, useT } from "@/i18n/client";
import { fmt } from "@/i18n/text";
import { ArrowUpRight, Clock, Footprints, ShieldAlert, Star } from "lucide-react";
import type { PackageCard, TourCard as TourCardType } from "@/lib/dunastour/types";
import { DuneScene } from "@/components/ui/DuneScene";
import { displayTitle, tourUnitPrice } from "@/lib/format";

export function TourCard({ tour, priority = false }: { tour: TourCardType; priority?: boolean }) {
  const t = useT();
  const { money, duration, perUnit } = useFormat();
  const price = tourUnitPrice(tour);
  const discounted = price < tour.basePrice;
  return (
    <Link
      href={`/passeios/${tour.id}`}
      className="group flex h-full flex-col rounded-[1.75rem] bg-white p-3 ring-1 ring-ink/10 transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(6,6,95,0.35)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-sand">
        {tour.coverImageUrl ? (
          <Image
            src={tour.coverImageUrl}
            alt={displayTitle(tour.title)}
            fill
            priority={priority}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 420px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <DuneScene id={tour.id.slice(0, 6)} />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {tour.durationMinutes > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">
              <Clock size={11} /> {duration(tour.durationMinutes)}
            </span>
          )}
          {discounted && <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-bold text-night-900">-{tour.discountPercent}%</span>}
          {tour.riskType && (
            <span className="flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
              <ShieldAlert size={11} /> {t.tours.adventure}
            </span>
          )}
          {tour.trekLevel && (
            <span className="flex items-center gap-1 rounded-full bg-lagoon-500 px-2.5 py-1 text-[11px] font-semibold text-night-900">
              <Footprints size={11} /> {t.tours.trekking}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
        {tour.tags.length > 0 && <p className="line-clamp-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-brand">{tour.tags.slice(0, 3).join(" · ")}</p>}
        <h3 className="mt-1.5 font-display text-2xl leading-tight text-ink">{displayTitle(tour.title)}</h3>
        {tour.ratingCount > 0 && (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-ink/70">
            <Star size={12} className="fill-gold-500 text-gold-500" /> {tour.ratingAvg.toFixed(1)} ({tour.ratingCount})
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="min-w-0 leading-none">
            {discounted && <span className="mb-1 block text-xs text-ink/40 line-through">{money(tour.basePrice)}</span>}
            <span className="block text-[11px] text-ink/50">{t.common.from}</span>
            <span className="block font-display text-3xl text-ink">{money(price)}</span>
            <span className="mt-1 block truncate text-xs text-ink/55">{perUnit(tour.saleUnit)}</span>
          </p>
          <span className="flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900 transition group-hover:bg-gold-400">
            {t.common.seeTour} <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PackageCardView({ pkg }: { pkg: PackageCard }) {
  const t = useT();
  const { money } = useFormat();
  return (
    <Link
      href={`/pacotes/${pkg.id}`}
      className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[2rem] bg-night-700 p-6 text-white ring-1 ring-white/10"
    >
      {pkg.coverImageUrl && (
        <Image src={pkg.coverImageUrl} alt="" fill sizes="(max-width: 768px) 90vw, 600px" className="object-cover opacity-70 transition duration-700 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold">{fmt(t.tours.comboBadge, { pct: pkg.discountPercent })}</span>
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.2em] font-label text-gold-400">{fmt(t.tours.comboTours, { n: pkg.toursCount })}</p>
        <h3 className="mt-1 font-display text-3xl">{displayTitle(pkg.title)}</h3>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-sm text-white/50 line-through">{money(pkg.originalPrice)}</span>
          <span className="text-2xl font-extrabold">{money(pkg.finalPrice)}</span>
          <span className="text-xs text-white/60">{t.common.perPerson}</span>
        </p>
      </div>
    </Link>
  );
}
