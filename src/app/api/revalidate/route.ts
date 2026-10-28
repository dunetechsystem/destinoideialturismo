import { after, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPackages, getTours } from "@/lib/dunastour/server";
import { locales } from "@/i18n/config";

/**
 * Webhook do DunasTour: quando a agência salva um passeio/pacote, a API chama esta rota (SiteRevalidateService) e o
 * cache das leituras (tag "dunastour") expira na hora. Depois da resposta, as páginas principais dos três idiomas já
 * são renderizadas de novo em segundo plano — o próximo visitante pega a versão nova pronta, sem esperar a API.
 * Protegida por REVALIDATE_SECRET, no header `x-revalidate-secret` ou em `?secret=`.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret") ?? req.nextUrl.searchParams.get("secret");
  if (!secret || given !== secret) return Response.json({ message: "Não autorizado" }, { status: 401 });
  revalidateTag("dunastour", { expire: 0 });
  // As páginas geradas no build (sem acesso à API, com o catálogo local) expiram pelo caminho, não pela tag.
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");

  const origin = req.nextUrl.origin;
  after(async () => {
    const [tours, packages] = await Promise.all([getTours("pt"), getPackages()]);
    const pages = ["", "/passeios", "/galeria", ...tours.map((t) => `/passeios/${t.id}`), ...packages.map((p) => `/pacotes/${p.id}`)];
    const paths = locales.flatMap((l) => pages.map((p) => `/${l}${p}`));
    paths.push("/sitemap.xml");
    await Promise.allSettled(paths.map((p) => fetch(`${origin}${p}`, { cache: "no-store", signal: AbortSignal.timeout(20_000) })));
  });

  return Response.json({ revalidated: true, now: Date.now() });
}

export const GET = POST;
