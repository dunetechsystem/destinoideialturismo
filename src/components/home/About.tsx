import Image from "next/image";
import { site } from "@/config/site";
import { getDict } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { cn } from "@/lib/cn";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";

/** "Sobre a Destino Ideal Turismo": mosaico de fotos + o manifesto (ou a descrição cadastrada no DunasTour). */
export async function About({ description, instagram }: { description: string | null; instagram: string }) {
  const t = (await getDict()).about;
  const lines = (description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <section id="sobre" className="relative scroll-mt-20 overflow-hidden border-y border-ink/10 bg-white">
      <div className="sun-stripes pointer-events-none absolute -left-40 top-1/2 aspect-square w-[44rem] -translate-y-1/2 rounded-full bg-gold-500/10 [mask:linear-gradient(to_right,black,transparent_75%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.15fr]">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="grid grid-cols-5 grid-rows-5 gap-3">
            {site.aboutPhotos.map((name, i) => (
              <div
                key={name}
                className={cn(
                  "relative overflow-hidden rounded-[1.75rem] ring-1 ring-ink/10",
                  i === 0 && "col-span-3 row-span-5 aspect-[3/5]",
                  i === 1 && "col-span-2 row-span-3",
                  i === 2 && "col-span-2 row-span-2"
                )}
              >
                <Image src={`/fotos/${name}.jpg`} alt="" fill sizes="(max-width: 1024px) 60vw, 260px" className="object-cover" />
              </div>
            ))}
          </div>
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="absolute -left-2 top-8 flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 font-label text-base text-night-900 shadow-lg transition hover:bg-gold-400 sm:-left-6"
          >
            <InstagramIcon size={16} /> @{instagram}
          </a>
          <div className="absolute -right-2 bottom-10 animate-float rounded-2xl bg-paper px-5 py-3.5 ring-1 ring-ink/15 sm:-right-6">
            <p className="font-display text-3xl leading-none text-cyan-brand">{t.years}</p>
            <p className="text-xs text-ink/65">{t.yearsText}</p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="flex items-center gap-3 font-label text-lg text-cyan-brand">
              <span className="h-0.5 w-8 -skew-x-[30deg] bg-gold-500" />
              {t.eyebrow}
            </p>
            <h2 className="mt-3 text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
              {rich(t.title)}
            </h2>
            <span className="brush mt-3 block h-3 w-44" />
          </Reveal>
          <Reveal delay={0.1}>
            {lines.length > 0 ? (
              <ul className="mt-8 space-y-2.5 text-lg text-ink/75">
                {lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 text-lg leading-relaxed text-ink/75">{t.manifesto}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-3">
            {t.stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-paper p-4 text-center ring-1 ring-ink/10">
                <p className="font-display text-3xl text-cyan-brand">{value}</p>
                <p className="text-xs text-ink/60">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
