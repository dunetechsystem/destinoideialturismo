import { Compass } from "lucide-react";
import Link from "@/i18n/link";
import { getDict } from "@/i18n/server";

export default async function NotFound() {
  const t = (await getDict()).notFound;
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <Compass size={48} className="text-cyan-brand" />
      <h1 className="mt-6 font-display text-5xl text-ink">{t.title}</h1>
      <p className="mt-3 text-ink/60">{t.text}</p>
      <Link href="/passeios" className="mt-8 rounded-full bg-gold-500 px-6 py-3 font-semibold text-night-900">
        {t.cta}
      </Link>
    </div>
  );
}
