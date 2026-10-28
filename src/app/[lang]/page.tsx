import Link from "@/i18n/link";
import { getI18n } from "@/i18n/server";
import { rich } from "@/i18n/text";
import { ArrowRight } from "lucide-react";
import { getAgency, getLagoons, getPackages, getReviews, getTours } from "@/lib/dunastour/server";
import { getGallery } from "@/lib/dunastour/gallery";
import { agencyInfo } from "@/lib/agency-info";
import { site } from "@/config/site";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Featured } from "@/components/home/Featured";
import { TourSections } from "@/components/home/TourSections";
import { Destination } from "@/components/home/Destination";
import { Services } from "@/components/home/Services";
import { Location } from "@/components/home/Location";
import { About } from "@/components/home/About";
import { Credentials } from "@/components/home/Credentials";
import { InstagramSection } from "@/components/home/InstagramSection";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

export const revalidate = 300;

export default async function Home() {
  const { t, lang } = await getI18n();
  const [agency, tours, packages, reviews, lagoons, gallery] = await Promise.all([
    getAgency(),
    getTours(),
    getPackages(),
    getReviews(),
    getLagoons(),
    getGallery(),
  ]);
  const info = agencyInfo(agency);
  const photos = gallery.filter((g) => !g.video).map((g) => g.url);
  const heroImages = [...new Set([agency?.coverImageUrl, ...tours.map((t) => t.coverImageUrl), ...photos])]
    .filter((u): u is string => !!u)
    .slice(0, 6);
  const videos = gallery.filter((g) => g.video).map((g) => ({ src: g.url, title: g.place }));
  const googleRatings = (agency?.checkoutPage?.googleReviews ?? []).map((r) => r.rating);
  const ratingCount = (reviews?.count ?? 0) + googleRatings.length;
  const rating = ratingCount
    ? { average: ((reviews?.average ?? 0) * (reviews?.count ?? 0) + googleRatings.reduce((a, b) => a + b, 0)) / ratingCount, count: ratingCount }
    : null;
  const faqs = agency?.checkoutPage?.faqs.length ? [...agency.checkoutPage.faqs, ...t.faq.items] : t.faq.items;

  // Nome do site e logo nos resultados do Google.
  const card = `${site.url}/og.jpg`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, inLanguage: lang },
    { "@context": "https://schema.org", "@type": "WebPage", url: `${site.url}/${lang}`, name: site.name, primaryImageOfPage: card },
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/mark.png`,
      image: card,
      telephone: info.phone,
      address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: info.city, addressRegion: "MA", addressCountry: "BR" },
      geo: { "@type": "GeoCoordinates", latitude: site.coords.lat, longitude: site.coords.lng },
      sameAs: [`https://www.instagram.com/${info.instagram}`, site.airbnb, site.tiktok && `https://www.tiktok.com/@${site.tiktok}`].filter(Boolean),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero
        images={heroImages}
        tourCount={tours.length + packages.length}
        phone={info.phone}
        lagoonLevel={lagoons?.level ?? null}
        rating={rating}
        cadasturUrl={info.cadasturUrl}
      />
      <Marquee items={t.destinations} />
      <TourSections tours={tours} packages={packages} phone={info.phone} />
      <Featured tours={tours} phone={info.phone} />
      <Services />
      <Destination />
      <About description={info.description} instagram={info.instagram} />
      <Credentials cadasturUrl={info.cadasturUrl} cnpj={info.cnpj} legalName={info.legalName} rating={rating} />

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow={t.gallery.eyebrow}
              title={rich(t.gallery.title)}
            />
            <Reveal>
              <Link href="/galeria" className="group flex items-center gap-2 text-sm font-semibold text-ink underline decoration-gold-500 decoration-2 underline-offset-4">
                {t.gallery.seeAll} <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <GalleryGrid items={gallery} limit={12} filters={false} />
        </section>
      )}

      <InstagramSection instagram={info.instagram} photos={photos.slice(6)} videos={videos} />
      <Reviews reviews={reviews} page={agency?.checkoutPage} />
      <Faq items={faqs} />
      <Location instagram={info.instagram} phone={info.phone} />
      <FinalCta images={photos.slice(4)} phone={info.phone} />
    </>
  );
}
