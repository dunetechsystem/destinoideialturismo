import Image from "next/image";
import Link from "@/i18n/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/** Topo claro das páginas internas: título à esquerda e, quando há foto, uma faixa arredondada embaixo. */
export function PageHero({
  image,
  eyebrow,
  title,
  children,
  crumbs = [],
  tall = false,
}: {
  image?: string | null;
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  crumbs?: { href: string; label: string }[];
  /** Página de passeio: a foto já aparece no mosaico logo abaixo, então não repete a faixa. */
  tall?: boolean;
}) {
  return (
    <section className="bg-paper pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {crumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs font-medium text-ink/50">
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-1">
                <Link href={c.href} className="hover:text-ink">
                  {c.label}
                </Link>
                <ChevronRight size={12} />
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-brand sm:text-sm">{eyebrow}</div>}
        <h1 className="mt-3 max-w-4xl text-balance font-display text-4xl leading-[1.08] text-ink sm:text-6xl">{title}</h1>
        {children}
        {image && !tall && (
          <div className="relative mt-10 aspect-[21/8] overflow-hidden rounded-[2rem] bg-sand">
            <Image src={image} alt="" fill priority sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
