import { site } from "@/config/site";
import type { AgencyInfo } from "@/lib/agency-info";
import { whatsappUrl } from "@/lib/format";
import { AirbnbIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

/** Atalhos flutuantes à direita, empilhados acima do lançador do chat (coluna da mesma largura, centralizados). */
export function SocialDock({ info }: { info: AgencyInfo }) {
  const links = [
    { label: "WhatsApp", href: whatsappUrl(info.phone), icon: <WhatsAppIcon size={26} />, className: "bg-[#25D366]" },
    {
      label: "Instagram",
      href: `https://www.instagram.com/${info.instagram}/`,
      icon: <InstagramIcon size={24} />,
      className: "bg-[linear-gradient(45deg,#feda75,#fa7e1e_25%,#d62976_55%,#962fbf_80%,#4f5bd5)]",
    },
    site.airbnb && { label: "Airbnb", href: site.airbnb, icon: <AirbnbIcon size={24} />, className: "bg-[#FF385C]" },
  ].filter((l) => !!l);

  return (
    <div className="fixed bottom-28 right-4 z-30 flex w-16 flex-col items-center gap-3 sm:right-6">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          title={l.label}
          className={`flex h-13 w-13 items-center justify-center rounded-full text-white shadow-[0_12px_30px_-10px_rgba(12,35,64,0.6)] transition hover:scale-110 active:scale-95 ${l.className}`}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
