import { Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import { getDict } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { whatsappUrl } from "@/lib/format";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

/** "Venha nos visitar": mapa (OpenStreetMap) da base em Barreirinhas + endereço, telefones, horário e Instagram. */
export async function Location({ instagram, phone }: { instagram: string; phone: string }) {
  const t = (await getDict()).location;
  const { lat, lng } = site.coords;
  const d = 0.008;
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const phones = [phone, site.secondaryWhatsapp].filter((p, i, all) => p && all.indexOf(p) === i);
  const card = "rounded-3xl bg-white p-5 ring-1 ring-ink/10 sm:p-6";
  const icon = "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-brand/10 text-cyan-brand";

  return (
    <section id="localizacao" className="bg-white py-24 sm:py-28 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle center eyebrow={t.eyebrow} title={rich(t.title)} text={t.text} />
        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[2rem] bg-sand ring-1 ring-ink/10 lg:min-h-[34rem]">
            <iframe src={embed} title={t.mapTitle} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full border-0" />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-ink/10 transition hover:bg-gold-500"
            >
              <ExternalLink size={15} /> {t.openMap}
            </a>
          </Reveal>

          <div className="grid content-start gap-4">
            <Reveal className={card}>
              <div className="flex items-center gap-3">
                <span className={icon}>
                  <MapPin size={20} />
                </span>
                <h3 className="font-display text-xl text-ink">{t.address}</h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{site.address}</p>
            </Reveal>

            <Reveal delay={0.06} className={card}>
              <div className="flex items-center gap-3">
                <span className={icon}>
                  <Phone size={20} />
                </span>
                <h3 className="font-display text-xl text-ink">{t.phones}</h3>
              </div>
              <ul className="mt-3 space-y-1 text-[15px] text-ink/70">
                {phones.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href={whatsappUrl(phone)} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-cyan-brand hover:underline">
                {t.callWhatsapp} →
              </a>
            </Reveal>

            <Reveal delay={0.12} className={card}>
              <div className="flex items-center gap-3">
                <span className={icon}>
                  <Clock size={20} />
                </span>
                <h3 className="font-display text-xl text-ink">{t.hours}</h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                {t.hoursValue[0]}
                <br />
                {t.hoursValue[1]}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer" className={`${card} flex items-center gap-4 transition hover:ring-cyan-brand/40`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white">
                  <InstagramIcon size={22} />
                </span>
                <span className="leading-tight">
                  <strong className="block font-display text-lg text-ink">@{instagram}</strong>
                  <span className="text-sm text-ink/60">{t.follow}</span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
