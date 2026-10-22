import Link from "@/i18n/link";
import { getDict } from "@/i18n/server";
import { fmt } from "@/i18n/text";
import { BadgeCheck, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import type { AgencyInfo } from "@/lib/agency-info";
import { whatsappUrl } from "@/lib/format";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DiLogo } from "@/components/ui/Logo";

export async function Footer({ info }: { info: AgencyInfo }) {
  const t = await getDict();
  const f = t.footer;
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-night-950 text-white/75">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <DiLogo className="h-28" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            {t.brand.slogan} {f.text}
          </p>
          <div className="mt-6 flex gap-3">
            <a href={`https://instagram.com/${info.instagram}`} target="_blank" rel="noreferrer" aria-label={f.instagram} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500">
              <InstagramIcon />
            </a>
            {site.tiktok && (
              <a href={`https://www.tiktok.com/@${site.tiktok}`} target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500">
                <TikTokIcon />
              </a>
            )}
            <a href={whatsappUrl(info.phone)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div>
          <p className="font-label text-xl font-bold text-gold-500">{f.explore}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/passeios" className="hover:text-gold-400">{f.allTours}</Link></li>
            <li><Link href="/galeria" className="hover:text-gold-400">{f.gallery}</Link></li>
            <li><Link href="/termos" className="hover:text-gold-400">{f.terms}</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-label text-xl font-bold text-gold-500">{f.contact}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold-500" />
              <a href={whatsappUrl(info.phone)} target="_blank" rel="noreferrer" className="hover:text-gold-400">{info.phone}</a>
            </li>
            {site.secondaryWhatsapp && (
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-500" />
                <a href={whatsappUrl(site.secondaryWhatsapp)} target="_blank" rel="noreferrer" className="hover:text-gold-400">{site.secondaryWhatsapp}</a>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <InstagramIcon size={16} className="mt-0.5 shrink-0 text-gold-500" />
              <a href={`https://instagram.com/${info.instagram}`} target="_blank" rel="noreferrer" className="hover:text-gold-400">@{info.instagram}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" />
              <span>{site.address}</span>
            </li>
            {info.cadasturUrl && (
              <li className="flex items-start gap-2.5">
                <BadgeCheck size={16} className="mt-0.5 shrink-0 text-gold-500" />
                <a href={info.cadasturUrl} target="_blank" rel="noreferrer" className="hover:text-gold-400">{f.cadastur}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            {fmt(f.rights, { year: new Date().getFullYear(), name: info.legalName ?? site.name })}
            {info.cnpj ? ` · CNPJ ${info.cnpj}` : ""}
          </p>
          <p>
            {f.madeBy}{" "}
            <a href="https://dunastour.com.br" target="_blank" rel="noreferrer" className="font-semibold text-gold-500 hover:text-white">
              DunasTour
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
