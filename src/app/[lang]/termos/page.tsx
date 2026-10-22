import type { Metadata } from "next";
import { getAgency } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { getI18n } from "@/i18n/server";
import { fmt, strong } from "@/i18n/text";

export const revalidate = 3600;
export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getI18n()).t.meta.termsTitle };
}

/** Mesmo texto do link do DunasTour (dunas-tour-web/components/checkout/terms-texts.tsx), nos três idiomas. */
export default async function TermsPage() {
  const [{ t }, agency] = await Promise.all([getI18n(), getAgency()]);
  const x = t.terms;
  const name = agency?.tradeName ?? "Destino Ideal Turismo";
  const phone = agencyInfo(agency).phone;
  const vars = { name, phone };
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-32">
      <article className="rounded-[2rem] bg-white p-6 text-[15px] leading-relaxed text-ink/75 ring-1 ring-ink/10 sm:p-10 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="mb-6 font-display text-4xl text-ink">{x.title}</h1>
        <p>{strong(fmt(x.intro, vars))}</p>
        {x.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{strong(s.p)}</p>
          </section>
        ))}
        <p>{x.forum}</p>

        <h1 id="privacidade" className="mb-6 mt-14 scroll-mt-28 font-display text-4xl text-ink">
          {x.privacy}
        </h1>
        <p>{strong(fmt(x.privacyIntro, vars))}</p>
        {x.privacyBlocks.map((b) => (
          <section key={b.h}>
            <h2>{b.h}</h2>
            {"list" in b && b.list ? (
              <ul>
                {b.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p>{fmt("p" in b ? (b.p ?? "") : "", vars)}</p>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
