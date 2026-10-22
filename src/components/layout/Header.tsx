"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Globe, Menu, X } from "lucide-react";
import Link from "@/i18n/link";
import { useLang, useT } from "@/i18n/client";
import { localeInfo, locales, switchLocalePath } from "@/i18n/config";
import { whatsappUrl } from "@/lib/format";
import type { AgencyInfo } from "@/lib/agency-info";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DiLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

/** Seletor de idioma: troca o prefixo da rota (/pt → /en) e lembra a escolha num cookie pro próximo acesso. */
function LanguageSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest("[data-lang-menu]")) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", close);
    };
  }, [open]);
  return (
    <div className={cn("relative", className)} data-lang-menu>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.common.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
      >
        <Globe size={17} /> {localeInfo[lang].label} <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(12,35,64,0.45)] ring-1 ring-ink/10">
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === lang}>
              <a
                href={switchLocalePath(pathname, l)}
                hrefLang={localeInfo[l].tag}
                onClick={() => {
                  document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
                }}
                className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition hover:bg-sand", l === lang ? "font-semibold text-ink" : "text-ink/75")}
              >
                <span className="w-6 text-xs font-bold text-cyan-brand">{localeInfo[l].label}</span>
                {localeInfo[l].name}
                {l === lang && <Check size={15} className="ml-auto text-cyan-brand" />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Header({ info }: { info: AgencyInfo }) {
  const t = useT();
  const NAV = t.nav.items;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Trocou de página: fecha o menu.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled || menuOpen ? "bg-paper/95 py-2 shadow-[0_8px_30px_-16px_rgba(6,6,95,0.35)] backdrop-blur-xl" : "bg-paper/70 py-4 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="relative flex shrink-0 items-center gap-2" aria-label={t.nav.homeAria}>
          <DiLogo className="h-14 sm:h-16" />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium tracking-wide transition",
                "text-ink/80 hover:bg-ink/5 hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a
            href={`https://instagram.com/${info.instagram}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className={cn(
              "hidden h-10 w-10 items-center justify-center rounded-full transition sm:flex",
              "text-ink hover:bg-ink/5"
            )}
          >
            <InstagramIcon />
          </a>
          <LanguageSwitch />
          <a
            href={whatsappUrl(info.phone, t.nav.waMessage)}
            target="_blank"
            rel="noreferrer"
            className={cn("hidden h-10 items-center gap-2 whitespace-nowrap rounded-xl px-5 font-label text-lg font-bold transition md:flex", "bg-gold-500 text-night-900 hover:bg-gold-400")}
          >
            <WhatsAppIcon size={18} /> {t.nav.talkNow}
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              "text-ink hover:bg-ink/5"
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-5 pt-3">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={item.href} className="block rounded-2xl px-4 py-3 font-display text-xl text-ink hover:bg-sand">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={whatsappUrl(info.phone, t.nav.waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gold-500 py-3.5 font-semibold text-night-900"
              >
                <WhatsAppIcon /> {t.nav.talkWhatsapp}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
