# Destino Ideal Turismo — site

Next.js 16 + Tailwind 4. Mesma base dos sites da Mister K, NOMA e RS Adventure (passeios, preços, fotos e contato vêm do
**DunasTour**), com identidade própria: tema claro (creme + azul-marinho + ciano + ouro), títulos em Tenor Sans, textos em Inter,
fotos em arco como o da logo.

## Rodar

```bash
cp .env.example .env.local
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção
```

## A agência ainda não está no DunasTour

Enquanto a API não devolver passeios para o slug (`DUNASTOUR_AGENCY_SLUG`), o site usa o **catálogo local** em
`src/lib/local/tours.ts` (os passeios e preços do site antigo, com as fotos em `public/fotos`). Cada passeio vira dois cards:
coletivo (por pessoa) e privativo (por veículo).

Quando a Dunas Tour criar a conta:

1. Ajuste `DUNASTOUR_AGENCY_SLUG` no `.env.local`/hospedagem para o slug real (`dunastour.com.br/<slug>`).
2. Cadastre os passeios no painel. Em até 5 min o site passa a mostrar **só** os do DunasTour (cache de 5 min) — nada a mexer no código.
3. Opcional: apague `src/lib/local/tours.ts` (e as referências em `server.ts`/`gallery.ts`) e religue a compra pelo site com
   `onlineBooking: true` em `src/config/site.ts`.
4. Se os títulos dos passeios de "nascer do sol" e "estrelas" casarem com `site.featured[].match`, os destaques da home apontam pra eles.

## Conteúdo editável

`src/config/site.ts`: textos, contatos, CNPJ/Cadastur, destaques, FAQ, "Por que a gente", fatos do destino.

## Compartilhamento do link

`src/app/layout.tsx` define Open Graph/Twitter; a imagem é `public/og.jpg` (1200×630, logo + foto). Defina
`NEXT_PUBLIC_SITE_URL=https://destinoidealturismo.com.br` em produção pra os links absolutos saírem certos.
