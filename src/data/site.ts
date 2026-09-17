/**
 * Site geneli + telif/lisans bilgileri (tek merkezden yönetilir).
 *
 * ÖNEMLİ: Siteyi kendi alan adına taşıdığında ya buradaki `url` değerini değiştir,
 * ya da Vercel'de NEXT_PUBLIC_SITE_URL ortam değişkenini tanımla.
 *
 * Bu değer; canonical link, Open Graph, JSON-LD ve lisans bağlantılarında kullanılır.
 */
export const SITE = {
  name: "Ahmet",
  author: "Ahmet Faruk Özdemir",
  email: "flatearth4423@gmail.com",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmet-portfolio.vercel.app"
  ).replace(/\/+$/, ""),
  licensePath: "/lisans",
  instagram: "https://www.instagram.com/runicmelody/",
} as const;

/** Kullanılan lisans: Creative Commons Atıf-GayriTicari-TürevYok 4.0 Uluslararası */
export const LICENSE = {
  name: "CC BY-NC-ND 4.0",
  longName:
    "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International",
  url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
  legalCode: "https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.en",
  flags: {
    attribution: true, // BY  — atıf zorunlu
    nonCommercial: true, // NC  — ticari kullanım yasak
    noDerivatives: true, // ND  — türev eser yasak
  },
} as const;

/** Lisans sayfasının tam adresi (metadata ve JSON-LD için). */
export const LICENSE_URL = `${SITE.url}${SITE.licensePath}`;

/** Telif hakkı bildiriminin kısa hâli. */
export function copyrightNotice(): string {
  return `© ${new Date().getFullYear()} ${SITE.author}. Licensed ${LICENSE.name}.`;
}

/** Uzun/teknik telif bildirimi (görsel metadata'sı ve JSON-LD için). */
export function copyrightText(): string {
  return (
    `© ${new Date().getFullYear()} ${SITE.author}. ` +
    `Licensed under ${LICENSE.name} — ${LICENSE.url}. ` +
    `No AI training or text/data mining. ${LICENSE_URL}`
  );
}
