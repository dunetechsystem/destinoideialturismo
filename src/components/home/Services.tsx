import { Camera, CarFront, Heart, Map, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { getDict } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

const ICONS: Record<string, LucideIcon> = { car: CarFront, shield: ShieldCheck, users: Users, camera: Camera, map: Map, heart: Heart };

/** "Por que a Destino Ideal": seis itens em cartões brancos, sem blocos coloridos. */
export async function Services() {
  const t = await getDict();
  const c = t.services;
  return (
    <section id="experiencias" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle center eyebrow={c.eyebrow} title={rich(c.title)} text={c.text} />
        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.08}>
                <div className="flex gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-brand/10 text-cyan-brand">
                    <Icon size={24} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink">{s.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
