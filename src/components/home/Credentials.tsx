import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Building2, Star } from "lucide-react";
import { getDict } from "@/i18n/server";
import { fmt, rich } from "@/i18n/text";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Agência regularizada": aparece quando a agência preenche o link do Cadastur no DunasTour.
 * O Cadastur é o cadastro oficial do Ministério do Turismo — o turista confere o registro lá.
 */
export async function Credentials({
  cadasturUrl,
  cnpj,
  legalName,
  rating,
}: {
  cadasturUrl: string | null;
  cnpj: string | null;
  legalName: string | null;
  rating: { average: number; count: number } | null;
}) {
  if (!cadasturUrl) return null;
  const t = (await getDict()).credentials;
  const items = [
    cnpj && { icon: Building2, title: t.company, text: legalName ? `${legalName} · ${cnpj}` : `CNPJ ${cnpj}` },
    rating && { icon: Star, title: fmt(t.ratingTitle, { avg: rating.average.toFixed(1) }), text: fmt(t.ratingText, { n: rating.count }) },
  ].filter((i): i is { icon: typeof Star; title: string; text: string } => !!i);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 ring-1 ring-ink/10 text-ink sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-brand sm:text-sm">
                <BadgeCheck size={16} /> {t.eyebrow}
              </p>
              <h2 className="mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl">
                {rich(t.title)}
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-ink/70">
                {t.text}
              </p>
              <a href={cadasturUrl} target="_blank" rel="noreferrer" aria-label="Cadastur" className="mt-6 block w-fit rounded-xl bg-white p-2 ring-1 ring-ink/10 transition hover:ring-cyan-brand/40">
                <Image src="/brand/cadastur.jpg" alt="Cadastur" width={240} height={72} className="h-12 w-auto object-contain" />
              </a>
              <a
                href={cadasturUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-night-900 transition hover:bg-gold-400"
              >
                {t.cta} <ArrowUpRight size={18} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <ul className="grid gap-3">
              {items.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-3xl bg-ink/5 p-5 ring-1 ring-ink/10">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-gold-600">
                    <Icon size={22} />
                  </span>
                  <span>
                    <strong className="block">{title}</strong>
                    <span className="text-sm text-ink/60">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
