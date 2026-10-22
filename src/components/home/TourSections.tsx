"use client";

import { ArrowRight } from "lucide-react";
import Link from "@/i18n/link";
import { useT } from "@/i18n/client";
import { rich } from "@/i18n/text";
import { isPrivateTour } from "@/lib/format";
import type { PackageCard, TourCard as TourCardType } from "@/lib/dunastour/types";
import { PackageCardView, TourCard } from "@/components/tour/TourCard";
import { EmptyTours } from "@/components/tour/EmptyTours";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

/**
 * Passeios separados em coletivos (por pessoa) e privativos (por veículo), um bloco abaixo do outro.
 */
export function TourSections({ tours, packages, phone }: { tours: TourCardType[]; packages: PackageCard[]; phone: string }) {
  const t = useT();
  const priv = tours.filter(isPrivateTour);
  const group = tours.filter((x) => !isPrivateTour(x));
  const c = t.tours;

  return (
    <section id="passeios" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28">
      {packages.length > 0 && (
        <div className="mb-16 grid gap-5 md:grid-cols-2">
          {packages.map((p) => (
            <Reveal key={p.id}>
              <PackageCardView pkg={p} />
            </Reveal>
          ))}
        </div>
      )}
      {tours.length === 0 && packages.length === 0 && (
        <>
          <SectionTitle center eyebrow={c.sectionEyebrow} title={rich(c.sectionTitle)} />
          <EmptyTours phone={phone} />
        </>
      )}
      {(["group", "private"] as const).map((k) => {
        const list = k === "group" ? group : priv;
        if (list.length === 0) return null;
        return (
          <div key={k} className="mb-16 last:mb-0">
            <SectionTitle
              center
              eyebrow={k === "group" ? c.sharedEyebrow : c.privateEyebrow}
              title={rich(k === "group" ? c.sharedTitle : c.privateTitle)}
              text={k === "group" ? c.sharedText : c.privateText}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {list.map((tour, i) => (
                <Reveal key={tour.id} delay={(i % 3) * 0.08} className="h-full">
                  <TourCard tour={tour} priority={k === "group" && i < 3} />
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
      {tours.length > 0 && (
        <Reveal className="mt-12 text-center">
          <Link href="/passeios" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-gold-500 decoration-2 underline-offset-4">
            {c.seeAll} <ArrowRight size={18} className="text-cyan-brand transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      )}
    </section>
  );
}
