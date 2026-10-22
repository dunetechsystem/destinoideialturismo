import Image from "next/image";
import { CalendarDays, Info, Landmark, Leaf, MapPin, Maximize2, Mountain, Navigation, Waves, type LucideIcon } from "lucide-react";
import { getI18n } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const FACT_ICONS: Record<string, LucideIcon> = { area: Maximize2, dunes: Mountain, lagoon: Waves, park: Landmark };

/** Situação das lagoas por mês (índice 0 = janeiro): enchem com as chuvas, ficam cheias de mai a set, secam até dezembro. */
const SEASON = ["filling", "filling", "filling", "filling", "full", "full", "full", "full", "full", "drying", "drying", "drying"] as const;
const SEASON_STYLE = { full: "bg-cyan-brand h-full", filling: "bg-lagoon-400/60 h-[55%]", drying: "bg-gold-500/70 h-[35%]" } as const;
const LEGEND_DOT = { full: "bg-cyan-brand", filling: "bg-lagoon-400/60", drying: "bg-gold-500/70" } as const;

/** "Sobre o destino": foto em arco com selo e círculo, números em faixa, calendário das lagoas e rotas de chegada. */
export async function Destination() {
  const { t: dict, f } = await getI18n();
  const t = dict.destination;
  return (
    <section id="destino" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md pb-10 lg:max-w-none lg:pb-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-sand shadow-[0_40px_80px_-44px_rgba(12,35,64,0.55)] ring-1 ring-ink/10">
            <Image src="/fotos/panoramicDunes.jpg" alt={t.imageAlt} fill sizes="(max-width: 1024px) 90vw, 520px" className="object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-36 w-36 overflow-hidden rounded-full ring-8 ring-paper sm:-right-6 sm:h-44 sm:w-44">
            <Image src="/fotos/sunsetLagoon.jpg" alt="" fill sizes="176px" className="object-cover" />
          </div>
          <div className="absolute left-0 top-[14%] flex items-center gap-3 rounded-2xl bg-white py-3 pl-3 pr-5 shadow-xl ring-1 ring-ink/10 sm:-left-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-brand/10 text-cyan-brand">
              <Leaf size={20} />
            </span>
            <span className="leading-tight">
              <strong className="block font-display text-base text-ink">{t.park}</strong>
              <span className="text-xs text-ink/55">{t.badge}</span>
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-brand sm:text-sm">
            <Info size={14} /> {t.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{rich(t.title)}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">{t.text}</p>

          <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-3xl bg-ink text-white sm:grid-cols-4">
            {t.facts.map((fact, i) => {
              const Icon = FACT_ICONS[fact.icon] ?? Info;
              return (
                <div key={fact.label} className={cn("px-5 py-5", i % 2 === 1 && "border-l border-white/10", i >= 2 && "border-t border-white/10 sm:border-t-0", i > 0 && "sm:border-l sm:border-white/10")}>
                  <Icon size={18} className="text-gold-400" />
                  <dd className="mt-3 break-words font-display text-2xl leading-none sm:text-[1.65rem]">{fact.value}</dd>
                  <dd className="mt-1 text-sm text-white/70">{fact.unit || " "}</dd>
                  <dt className="mt-3 text-[11px] uppercase leading-snug tracking-[0.12em] text-white/50">{fact.label}</dt>
                </div>
              );
            })}
          </dl>

          <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-ink/10 sm:p-6">
            <h3 className="flex items-center gap-2.5 font-display text-lg text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-brand/10 text-cyan-brand">
                <CalendarDays size={17} />
              </span>
              {t.bestTime}
            </h3>
            <div className="mt-4 flex h-16 items-end gap-1.5" aria-hidden>
              {SEASON.map((s, i) => (
                <div key={i} className="flex h-full flex-1 items-end rounded-md bg-sand/70">
                  <div className={cn("w-full rounded-md", SEASON_STYLE[s])} />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex gap-1.5" aria-hidden>
              {SEASON.map((_, i) => (
                <span key={i} className="flex-1 text-center text-[10px] uppercase text-ink/45">
                  {f.monthShort(i).slice(0, 3)}
                </span>
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/65">
              {(["full", "filling", "drying"] as const).map((k) => (
                <li key={k} className="flex items-center gap-1.5">
                  <span className={cn("h-2.5 w-2.5 rounded-sm", LEGEND_DOT[k])} /> {t.seasonLegend[k]}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{t.bestTimeText}</p>
          </div>

          <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-ink/10 sm:p-6">
            <h3 className="flex items-center gap-2.5 font-display text-lg text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-brand/10 text-cyan-brand">
                <MapPin size={17} />
              </span>
              {t.howTo}
            </h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {t.routes.map((r) => (
                <li key={r.to} className="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3">
                  <Navigation size={16} className="shrink-0 text-cyan-brand" />
                  <span className="leading-tight">
                    <strong className="block text-sm text-ink">
                      {r.from} → {r.to}
                    </strong>
                    <span className="text-xs text-ink/55">{r.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{t.howToText}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
