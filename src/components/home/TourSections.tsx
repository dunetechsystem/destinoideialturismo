"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "@/i18n/link";
import { useT } from "@/i18n/client";
import { rich } from "@/i18n/text";
import { isPrivateTour } from "@/lib/format";
import type { PackageCard, TourCard as TourCardType } from "@/lib/dunastour/types";
import { PackageCardView, TourCard } from "@/components/tour/TourCard";
import { EmptyTours } from "@/components/tour/EmptyTours";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Kind = "group" | "private";

/**
 * Passeios separados em coletivos (por pessoa) e privativos (por veículo). Em vez de duas listas longas
 * uma abaixo da outra, um seletor alterna entre elas — a home fica bem mais curta, principalmente no celular.
 */
export function TourSections({ tours, packages, phone }: { tours: TourCardType[]; packages: PackageCard[]; phone: string }) {
  const t = useT();
  const priv = tours.filter(isPrivateTour);
  const group = tours.filter((x) => !isPrivateTour(x));
  const [picked, setPicked] = useState<Kind>("group");
  const kind: Kind = picked === "private" && priv.length === 0 ? "group" : picked === "group" && group.length === 0 ? "private" : picked;
  const list = kind === "group" ? group : priv;
  const both = group.length > 0 && priv.length > 0;
  const c = t.tours;

  return (
    <section id="passeios" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-28">
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
      {list.length > 0 && (
        <>
          <SectionTitle
            center
            eyebrow={kind === "group" ? c.sharedEyebrow : c.privateEyebrow}
            title={rich(kind === "group" ? c.sharedTitle : c.privateTitle)}
            text={kind === "group" ? c.sharedText : c.privateText}
          />
          {both && (
            <div role="tablist" aria-label={c.tabsLabel} className="mx-auto mt-8 flex w-fit rounded-full bg-sand p-1.5">
              {(["group", "private"] as const).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={kind === k}
                  onClick={() => setPicked(k)}
                  className={cn(
                    "min-h-11 rounded-full px-6 text-sm font-semibold transition sm:px-8",
                    kind === k ? "bg-ink text-white shadow-md" : "text-ink/70 hover:text-ink"
                  )}
                >
                  {k === "group" ? t.common.shared : t.common.private} <span className="ml-1 text-xs opacity-60">{k === "group" ? group.length : priv.length}</span>
                </button>
              ))}
            </div>
          )}
          <div key={kind} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((tour, i) => (
              <Reveal key={tour.id} delay={(i % 3) * 0.08} className="h-full">
                <TourCard tour={tour} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </>
      )}
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
