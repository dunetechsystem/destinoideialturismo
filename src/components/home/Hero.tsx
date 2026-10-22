"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useT } from "@/i18n/client";
import { fmt, rich } from "@/i18n/text";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, Compass, Droplets, Star } from "lucide-react";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { DiMark } from "@/components/ui/Logo";

/**
 * Abertura clara: título e botões à esquerda; à direita a foto em arco (o arco da logo) trocando sozinha,
 * com um círculo de foto e o selo da agência sobrepostos.
 */
export function Hero({
  images,
  tourCount,
  phone,
  lagoonLevel,
  rating,
  cadasturUrl,
}: {
  images: string[];
  tourCount: number;
  phone: string;
  lagoonLevel: number | null;
  rating: { average: number; count: number } | null;
  cadasturUrl: string | null;
}) {
  const t = useT();
  const h = t.hero;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5500);
    return () => clearInterval(id);
  }, [images.length]);

  const stats = [
    rating && { href: "/#avaliacoes", icon: Star, title: fmt(h.rating, { avg: rating.average.toFixed(1) }), text: fmt(h.ratingCount, { n: rating.count }) },
    cadasturUrl && { href: cadasturUrl, icon: BadgeCheck, title: h.cadastur, text: h.cadasturText },
    lagoonLevel != null && { href: "/#destino", icon: Droplets, title: fmt(h.lagoonsFull, { n: lagoonLevel }), text: h.lagoonsToday },
    tourCount > 0 && { href: "/#passeios", icon: Compass, title: fmt(h.toursCount, { n: tourCount }), text: h.bookWhatsapp },
  ].filter(Boolean) as { href: string; icon: typeof Star; title: string; text: string }[];

  const side = images[(index + 2) % Math.max(images.length, 1)];

  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-28 sm:pt-32 lg:pb-24">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-gold-300/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-brand sm:text-sm">
            {h.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-balance font-display text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[1.04] text-ink"
          >
            {rich(h.title)}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            {h.lead} {t.brand.slogan}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl(phone, h.waMessage)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-full bg-gold-500 px-8 py-4 text-base font-semibold text-night-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400"
            >
              <WhatsAppIcon size={20} /> {h.ctaWhatsapp}
            </a>
            <Link href="/#passeios" className="flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-ink ring-1 ring-ink/25 transition hover:bg-ink hover:text-white">
              {h.ctaTours}
            </Link>
          </motion.div>

          <motion.ul initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12 grid max-w-xl grid-cols-2 gap-3">
            {stats.map(({ href, icon: Icon, title, text }) => (
              <li key={title}>
                <Link href={href} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink/10 transition hover:ring-cyan-brand/50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-brand/10 text-cyan-brand">
                    <Icon size={20} />
                  </span>
                  <span className="leading-tight">
                    <strong className="block text-sm text-ink">{title}</strong>
                    <span className="text-xs text-ink/55">{text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-sand ring-1 ring-ink/10 shadow-[0_40px_80px_-40px_rgba(6,6,95,0.5)]">
            {images.length === 0 && <DuneScene id="hero" />}
            <AnimatePresence mode="sync">
              {images[index] && (
                <motion.div key={images[index]} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
                  <Image src={images[index]} alt="" fill priority sizes="(max-width: 1024px) 90vw, 520px" className="animate-kenburns object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {side && (
            <div className="absolute -bottom-6 -left-4 hidden h-36 w-36 overflow-hidden rounded-full ring-8 ring-paper sm:block sm:h-40 sm:w-40">
              <Image src={side} alt="" fill sizes="160px" className="object-cover" />
            </div>
          )}
          <div className="absolute -right-3 top-[18%] flex animate-float items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 ring-1 ring-ink/10 shadow-xl sm:-right-8">
            <DiMark className="w-9" />
            <span className="leading-tight">
              <strong className="block font-display text-sm text-ink">{h.fleet}</strong>
              <span className="text-xs text-ink/55">{h.fleetText}</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
