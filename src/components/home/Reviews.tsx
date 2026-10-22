import { Quote, Star } from "lucide-react";
import type { AgencyPublicReviews, CheckoutPageContent } from "@/lib/dunastour/types";
import { displayTitle } from "@/lib/format";
import { getDict } from "@/i18n/server";
import { fmt } from "@/i18n/text";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

/** Avaliações reais: as dos turistas no DunasTour e as do Google que a agência cadastrou. Sem nenhuma, não aparece. */
export async function Reviews({ reviews, page }: { reviews: AgencyPublicReviews | null; page: CheckoutPageContent | null | undefined }) {
  const t = (await getDict()).reviews;
  const items = [
    ...(reviews?.items ?? []).map((r) => ({ author: r.touristName, rating: r.rating, text: r.comment, source: displayTitle(r.tourTitle) })),
    ...(page?.googleReviews ?? []).map((r) => ({ author: r.author, rating: r.rating, text: r.text, source: "Google" })),
  ];
  if (items.length === 0) return null;
  return (
    <section id="avaliacoes" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          center
          eyebrow={t.eyebrow}
          title={t.title}
          text={
            reviews && reviews.count > 0 ? (
              <span className="inline-flex items-center gap-2">
                <Star size={18} className="fill-amber-400 text-gold-600" /> {fmt(t.average, { avg: reviews.average.toFixed(1), n: reviews.count })}
              </span>
            ) : undefined
          }
        />
        <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3">
          {items.map((r, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <figure className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-ink/5">
                <Quote className="text-gold-300" size={28} />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} size={15} className={s < Math.round(r.rating) ? "fill-amber-400 text-gold-600" : "text-ink/15"} />
                  ))}
                </div>
                <blockquote className="mt-3 leading-relaxed text-ink/75">{r.text}</blockquote>
                <figcaption className="mt-5 text-sm">
                  <strong className="text-ink">{r.author}</strong> <span className="text-ink/40">· {r.source}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
