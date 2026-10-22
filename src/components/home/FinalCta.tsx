import Image from "next/image";
import Link from "@/i18n/link";
import { getDict } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { ArrowRight, CalendarCheck, CarFront, Wallet } from "lucide-react";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";

const PERK_ICONS = [Wallet, CalendarCheck, CarFront];

// Três janelas em arco, coladas na base do cartão, cada uma com uma altura.
const ARCHES = ["h-[58%]", "h-[86%]", "h-[68%]"];

export async function FinalCta({ images, phone }: { images: string[]; phone: string }) {
  const t = (await getDict()).cta;
  const tiles = images.slice(0, 3);
  const withPhotos = tiles.length === 3;
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-ink text-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-lagoon-500/25 blur-3xl" />

        <div className={`relative grid items-stretch gap-10 px-6 pt-16 sm:px-14 sm:pt-20 ${withPhotos ? "lg:grid-cols-[1.1fr_1fr]" : "pb-16 text-center sm:pb-20"}`}>
          <div className={`${withPhotos ? "pb-16 sm:pb-20" : "mx-auto max-w-2xl"}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">{t.eyebrow}</p>
            <h2 className="mt-4 text-balance font-display text-4xl leading-[1.1] sm:text-5xl [&_em]:text-gold-400">
              {rich(t.title)}
            </h2>
            <div className={`mt-9 flex flex-col gap-3 sm:flex-row ${withPhotos ? "" : "justify-center"}`}>
              <a
                href={whatsappUrl(phone, t.waMessage)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-full bg-gold-500 px-7 py-4 text-sm font-semibold text-night-900 transition hover:bg-gold-400"
              >
                <WhatsAppIcon size={20} /> {t.whatsapp}
              </a>
              <Link href="/passeios" className="group flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-semibold ring-1 ring-white/30 transition hover:bg-white/10">
                {t.tours} <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
            <ul className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 ${withPhotos ? "" : "justify-center"}`}>
              {t.perks.map((text, i) => {
                const Icon = PERK_ICONS[i];
                return (
                  <li key={text} className="flex items-center gap-2">
                    <Icon size={16} className="text-gold-400" /> {text}
                  </li>
                );
              })}
            </ul>
          </div>

          {withPhotos && (
            <div className="hidden h-[26rem] items-end gap-3 lg:flex">
              {tiles.map((src, i) => (
                <div key={src} className={`relative flex-1 overflow-hidden rounded-t-[999px] bg-night-700 ${ARCHES[i]}`}>
                  <Image src={src} alt="" fill sizes="200px" className="object-cover transition duration-700 hover:scale-110" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
