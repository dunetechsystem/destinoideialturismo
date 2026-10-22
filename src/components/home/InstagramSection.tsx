"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { site } from "@/config/site";
import { useT } from "@/i18n/client";
import { fmt, rich } from "@/i18n/text";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { Reveal } from "@/components/ui/Reveal";
import { DiMark } from "@/components/ui/Logo";

/** "https://www.instagram.com/reel/ABC123/?igsh=…" → URL do embed oficial. */
function embedUrl(url: string) {
  const m = url.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
  if (!m) return null;
  const kind = m[1].toLowerCase() === "p" ? "p" : "reel";
  return `https://www.instagram.com/${kind}/${m[2]}/embed`;
}

/** Vídeo vertical estilo stories: toca mudo quando aparece na tela; tocar liga o som. */
function StoryVideo({ src, poster, title, handle }: { src: string; poster?: string; title: string; handle: string }) {
  const t = useT().instagram;
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().then(() => setPlaying(true)).catch(() => {});
        else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="group relative aspect-[9/16] w-[240px] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-gold-500 shadow-2xl sm:w-[270px]">
      <video ref={ref} src={src} poster={poster} muted={muted} loop playsInline preload="metadata" className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-night-950/30" />
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-night-900 ring-2 ring-amber-300">
          <DiMark className="h-6 w-6" />
        </span>
        <span className="text-xs font-bold text-ink">{handle}</span>
      </div>
      {!playing && (
        <Play className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 fill-white/90 text-ink/90" />
      )}
      <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-bold text-ink">{title}</p>
      <button
        onClick={() => {
          setMuted((m) => !m);
          ref.current?.play().catch(() => {});
        }}
        aria-label={muted ? t.soundOn : t.soundOff}
        className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-ink/20 text-ink backdrop-blur"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}

export function InstagramSection({
  instagram,
  photos,
  videos,
}: {
  instagram: string;
  /** Fotos pros celulares quando não há reels/vídeos. */
  photos: string[];
  /** Vídeos vindos do DunasTour (fotos/vídeos dos lugares). */
  videos: { src: string; title: string }[];
}) {
  const t = useT().instagram;
  const reels = site.instagramReels.map(embedUrl).filter((u): u is string => !!u);
  const stories = [...site.videos, ...videos];
  const profile = `https://instagram.com/${instagram}`;
  const grid = photos.slice(0, 6);

  return (
    <section id="instagram" className="scroll-mt-20 overflow-hidden bg-sand py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-brand sm:text-sm">{t.eyebrow}</p>
          <h2 className="mt-3 text-balance font-display text-4xl leading-[1.1] text-ink sm:text-5xl">{rich(t.title)}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">{t.text}</p>
          <div className="mt-8 flex gap-3">
            <a href={profile} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-white transition hover:bg-night-600">
              <InstagramIcon size={18} /> {fmt(t.follow, { handle: instagram })}
            </a>
            {site.tiktok && (
              <a href={`https://www.tiktok.com/@${site.tiktok}`} target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/15 transition hover:bg-gold-500">
                <TikTokIcon />
              </a>
            )}
          </div>
        </Reveal>

        {reels.length === 0 && stories.length === 0 && (
          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-white p-4 shadow-[0_30px_70px_-40px_rgba(12,35,64,0.5)] ring-1 ring-ink/10 sm:p-5">
              <a href={profile} target="_blank" rel="noreferrer" className="flex items-center gap-3 pb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper p-1 ring-2 ring-gold-500">
                  <DiMark className="w-full" />
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <strong className="block truncate text-sm text-ink">{instagram}</strong>
                  <span className="text-xs text-ink/55">{t.place}</span>
                </span>
                <span className="rounded-full bg-cyan-brand px-4 py-2 text-xs font-semibold text-white">{t.followShort}</span>
              </a>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <a key={i} href={profile} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-xl bg-sand sm:rounded-2xl">
                    {grid[i] ? (
                      <Image src={grid[i]} alt="" fill sizes="(max-width: 640px) 30vw, 190px" className="object-cover transition duration-700 group-hover:scale-110" />
                    ) : (
                      <DuneScene id={`g${i}`} />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/45 opacity-0 transition group-hover:opacity-100">
                      <InstagramIcon size={26} className="text-white" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {(reels.length > 0 || stories.length > 0) && (
        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {stories.map((v) => (
            <StoryVideo key={v.src} {...v} handle={instagram} />
          ))}
          {reels.map((src) => (
            <div key={src} className="w-[328px] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink/5">
              <iframe src={src} title={t.reelTitle} loading="lazy" allowFullScreen className="h-[600px] w-full border-0" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
