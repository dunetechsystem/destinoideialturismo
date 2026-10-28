/**
 * Configuração do site — o que não é texto traduzido (textos ficam em src/i18n/dictionaries) nem vem do
 * DunasTour (passeios, preços, fotos e contato vêm da API; ver lib/dunastour). Enquanto a agência não tem
 * passeios no DunasTour, valem os de lib/local/tours.ts.
 */
export const site = {
  name: "Destino Ideal Turismo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Base em Barreirinhas (pino do mapa). */
  coords: { lat: -2.7696492671966553, lng: -42.84977340698242 },
  address: "Rua 11, Quadra 17, Casa 33, Mundico Cosme, Barreirinhas/MA, 65500-000",

  /** Usados se a API não devolver telefone/Instagram da agência. */
  fallbackWhatsapp: "+55 (98) 98480-8852",
  /** Segundo número da agência (rodapé, chat e localização). */
  secondaryWhatsapp: "+55 (98) 99109-7552",
  fallbackInstagram: "destino_ideal_turismo",
  /** Experiência da agência no Airbnb (botão flutuante). Vazio = esconde o botão. */
  airbnb: "https://www.airbnb.com.br/experiences/7278942",
  /** Vazio = esconde o ícone do TikTok. */
  tiktok: "",

  cnpj: "68.705.745/0001-90",
  legalName: "Destino Ideal Turismo",
  /** Registro no Cadastur (Min. do Turismo) — o DunasTour, quando cadastrado, tem prioridade. */
  cadasturUrl: "https://cadastur.turismo.gov.br/cadastur/#!/public/qrcode/68705745000190",

  /** Reels do Instagram (URL do reel/post). Vazio = a seção mostra a grade de fotos. */
  instagramReels: [] as string[],

  /** Vídeos próprios em formato vertical — arquivos em /public/videos. */
  videos: [] as { src: string; poster?: string; title: string }[],

  /** Fotos do bloco "Sobre" (arquivos em /public/fotos). */
  aboutPhotos: ["vehicle4x4Sunset", "lagoonGoldenHour", "dunesLagoonVehicle"],

  /**
   * Cards "Experiências exclusivas" (textos em dictionaries/*.featured). Se houver um passeio que case com
   * `match` pelo título, o card leva pra ele; senão, abre o WhatsApp.
   */
  featured: [
    { match: /nascer do sol|sunrise|amanecer/i, photo: "sunriseDeus" },
    { match: /estrelas|stargazing|estrellas/i, photo: "milkyWayDunes" },
  ],
};

export type SiteConfig = typeof site;
