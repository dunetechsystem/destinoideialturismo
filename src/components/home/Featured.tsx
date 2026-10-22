import Image from "next/image";
import Link from "@/i18n/link";
import { getDict } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";
import type { TourCard } from "@/lib/dunastour/types";
import { whatsappUrl } from "@/lib/format";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

/** "Experiências exclusivas": linhas alternadas, foto em arco de um lado e texto do outro. */
export async function Featured({ tours, phone }: { tours: TourCard[]; phone: string }) {
  const t = await getDict();
  const copy = t.featured;
  return (
    <section id="destaques" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-28">
      <SectionTitle center eyebrow={copy.eyebrow} title={rich(copy.title)} />
      <div className="mt-16 space-y-8">
        {site.featured.map((cfg, i) => {
          const f = { ...cfg, ...copy.items[i] };
          const matches = tours.filter((t) => f.match.test(t.title));
          const tour = matches.find((t) => t.coverImageUrl) ?? matches[0];
          const href = tour ? `/passeios/${tour.id}` : whatsappUrl(phone, f.message);
          const flip = i % 2 === 1;
          return (
            <Reveal key={f.title}>
              <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-sand p-5 sm:p-8 md:grid-cols-2 md:gap-14">
                <div className={`relative aspect-[5/4] overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] ${flip ? "md:order-2" : ""}`}>
                  <Image src={tour?.coverImageUrl ?? `/fotos/${f.photo}.jpg`} alt={f.title} fill sizes="(max-width: 768px) 90vw, 560px" className="object-cover" />
                </div>
                <div className="md:py-6">
                  <span className="inline-block rounded-full bg-gold-500 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-night-900">{f.badge}</span>
                  <h3 className="mt-4 text-balance font-display text-4xl leading-[1.08] text-ink sm:text-5xl">{f.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70">{f.text}</p>
                  <p className="mt-5 text-sm font-semibold text-cyan-brand">
                    {f.note}
                    {f.sub ? ` · ${f.sub}` : ""}
                  </p>
                  <Link
                    href={href}
                    {...(tour ? {} : { target: "_blank", rel: "noreferrer" })}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-night-600"
                  >
                    {tour ? copy.seeTour : copy.whatsapp} <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
