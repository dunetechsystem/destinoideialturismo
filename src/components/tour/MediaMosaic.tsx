"use client";

import Image from "next/image";
import { useState } from "react";
import { Images, Play } from "lucide-react";
import { isVideo, type GalleryItem } from "@/lib/media";
import { Lightbox } from "@/components/gallery/Lightbox";
import { useT } from "@/i18n/client";
import { fmt } from "@/i18n/text";
import { cn } from "@/lib/cn";

/** Mosaico de fotos do passeio (1 grande + até 2 empilhadas) com "Ver todas" abrindo o lightbox. */
export function MediaMosaic({ urls, title }: { urls: string[]; title: string }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const items: GalleryItem[] = urls.map((url) => ({ url, place: title, video: isVideo(url) }));
  const shown = items.slice(0, 3);
  if (!items.length) return null;
  return (
    <>
      <div className={cn("grid gap-2 sm:gap-3", shown.length > 1 ? "sm:h-[26rem] sm:grid-cols-3 sm:grid-rows-2" : "")}>
        {shown.map((item, i) => (
          <button
            key={item.url}
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden rounded-3xl bg-sand",
              shown.length === 1 && "aspect-video",
              shown.length > 1 && i === 0 && "aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto",
              shown.length > 1 && i > 0 && "hidden sm:block",
              // Com 2 fotos a segunda ocupa a coluna inteira; com 3+, empilha.
              shown.length === 2 && i === 1 && "sm:row-span-2"
            )}
          >
            {item.video ? (
              <>
                <video src={`${item.url}#t=0.5`} muted preload="metadata" className="h-full w-full object-cover" />
                <Play className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 fill-white text-ink" />
              </>
            ) : (
              <Image
                src={item.url}
                alt={title}
                fill
                priority={i === 0}
                sizes={i === 0 ? "(max-width: 640px) 100vw, 60vw" : "30vw"}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            )}
          </button>
        ))}
      </div>
      {items.length > 1 && (
        <button
          onClick={() => setOpen(0)}
          className="mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm ring-1 ring-ink/10 transition hover:ring-ink/30"
        >
          <Images size={16} /> {fmt(t.gallery.seeAllPhotos, { n: items.length })}
        </button>
      )}
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} />
    </>
  );
}
