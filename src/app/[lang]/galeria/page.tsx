import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { fmt, rich } from "@/i18n/text";
import { getGallery } from "@/lib/dunastour/gallery";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).t.meta.galleryTitle };
}

export default async function GalleryPage() {
  const { t } = await getI18n();
  const gallery = await getGallery();
  const cover = gallery.find((g) => !g.video)?.url;
  return (
    <>
      <PageHero
        image={cover}
        eyebrow={fmt(t.gallery.pageEyebrow, { n: gallery.length })}
        title={rich(t.gallery.pageTitle)}
        crumbs={[{ href: "/", label: t.common.home }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {gallery.length > 0 ? (
          <GalleryGrid items={gallery} />
        ) : (
          <p className="py-20 text-center text-ink/50">{t.gallery.empty}</p>
        )}
      </div>
    </>
  );
}
