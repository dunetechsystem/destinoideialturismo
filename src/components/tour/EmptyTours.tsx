"use client";

import { whatsappUrl } from "@/lib/format";
import { useT } from "@/i18n/client";
import { rich } from "@/i18n/text";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { DiMark } from "@/components/ui/Logo";

/** API fora do ar ou agência sem passeios: mostra os destinos e leva pro WhatsApp. */
export function EmptyTours({ phone }: { phone: string }) {
  const t = useT();
  return (
    <div className="relative isolate mt-12 overflow-hidden rounded-[2rem] px-6 py-16 text-center ring-1 ring-ink/10 sm:px-12">
      <DuneScene id="empty" />
      <div className="absolute inset-0 -z-10 bg-night-950/55" />
      <DiMark className="mx-auto w-20" />
      <p className="mt-5 font-display text-4xl text-white sm:text-5xl [&_em]:text-gold-400">{rich(t.empty.title)}</p>
      <p className="mx-auto mt-3 max-w-lg text-white/75">{t.empty.text}</p>
      <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
        {t.destinations.map((d) => (
          <li key={d} className="rounded-lg bg-night-950/70 px-4 py-1.5 font-display text-base text-white ring-1 ring-white/15">
            {d}
          </li>
        ))}
      </ul>
      <a
        href={whatsappUrl(phone, t.empty.waMessage)}
        target="_blank"
        rel="noreferrer"
        className="mt-9 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-night-900 transition hover:bg-gold-400"
      >
        <WhatsAppIcon size={18} /> {t.empty.cta}
      </a>
    </div>
  );
}
