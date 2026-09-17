/**
 * Site geneli + telif/lisans bilgileri (tek merkezden yönetilir).
 *
 * Alan adı burada SABİT DEĞİL: çalışma zamanında ortam değişkenlerinden çözülür.
 * Vercel'de `VERCEL_PROJECT_PRODUCTION_URL` otomatik geldiği için site kendi
 * adresini kendi bulur. Özel alan adı kullanıyorsan Vercel'de
 * NEXT_PUBLIC_SITE_URL tanımlaman yeterli.
 *
 * Bu değer; canonical link, Open Graph, JSON-LD ve lisans bağlantılarında kullanılır.
 */

/**
 * Alan adını çalışma zamanında çözer — kod hiçbir zaman yanlış bir alan adına
 * sabitlenmez. Öncelik sırası:
 *   1) NEXT_PUBLIC_SITE_URL          → Vercel: Settings → Environment Variables
 *   2) VERCEL_PROJECT_PRODUCTION_URL → Vercel build sırasında otomatik verir
 *   3) VERCEL_URL                    → preview deployment'ın kendi adresi
 *   4) yerel geliştirme
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const withScheme = candidate.startsWith("http")
      ? candidate
      : `https://${candidate}`;
    return withScheme.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export const SITE = {
  name: "Ahmet",
  author: "Ahmet Faruk Özdemir",
  email: "flatearth4423@gmail.com",
  url: resolveSiteUrl(),
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
