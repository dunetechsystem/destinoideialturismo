import type { Metadata } from "next";
import Link from "@/i18n/link";
import { getI18n } from "@/i18n/server";
import { fmt } from "@/i18n/text";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAgency, getPackage, getPackages, getTours } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { packageBase } from "@/lib/booking-base";
import { displayTitle } from "@/lib/format";
import { PageHero } from "@/components/layout/PageHero";
import { MediaMosaic } from "@/components/tour/MediaMosaic";
import { BookingPanel } from "@/components/tour/BookingPanel";
import { RichText } from "@/components/tour/RichText";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/pacotes/[id]">): Promise<Metadata> {
  const [pkg, { t }] = await Promise.all([getPackage((await params).id), getI18n()]);
  return { title: pkg ? displayTitle(pkg.title) : t.meta.packageNotFound };
}

export default async function PackagePage({ params }: PageProps<"/[lang]/pacotes/[id]">) {
  const { id } = await params;
  const { t, f } = await getI18n();
  const [pkg, packages, tours, agency] = await Promise.all([getPackage(id), getPackages(), getTours(), getAgency()]);
  if (!pkg) notFound();
  const card = packages.find((p) => p.id === id);
  const cover = pkg.mediaUrls[0] ?? card?.coverImageUrl ?? null;
  // Pacote com algum passeio de aventura: sem criança de colo (o termo de risco vem do servidor).
  const hasRisk = card?.hasRisk ?? pkg.tours.some((pt) => tours.find((x) => x.id === pt.id)?.riskType);
  const title = displayTitle(pkg.title);

  return (
    <>
      <PageHero
        image={cover}
        tall
        eyebrow={fmt(t.package.eyebrow, { n: pkg.tours.length, pct: pkg.discountPercent })}
        title={title}
        crumbs={[
          { href: "/", label: t.common.home },
          { href: "/passeios", label: t.common.tours },
        ]}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <MediaMosaic urls={pkg.mediaUrls} title={title} />
          <h2 className="mb-5 mt-12 font-display text-3xl text-ink">{t.package.included}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pkg.tours.map((tour) => (
              <Link key={tour.id} href={`/passeios/${tour.id}`} className="flex items-center gap-3 rounded-3xl bg-white p-3 ring-1 ring-ink/5 transition hover:ring-ink/20">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white">
                  {tour.coverImageUrl && <Image src={tour.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-ink">{displayTitle(tour.title)}</span>
                  <span className="text-sm text-ink/50 line-through">{f.money(tour.basePrice)}</span>
                </span>
              </Link>
            ))}
          </div>
          {pkg.description && (
            <div className="mt-12">
              <h2 className="mb-5 font-display text-3xl text-ink">{t.package.about}</h2>
              <RichText text={pkg.description} />
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel base={packageBase(pkg, cover, !!hasRisk)} phone={agencyInfo(agency).phone} />
        </aside>
      </div>
    </>
  );
}
