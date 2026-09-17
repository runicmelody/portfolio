import { NextResponse, type NextRequest } from "next/server";

/**
 * Hotlink koruması.
 *
 * Başka bir sitenin <img src="https://ahmet-portfolio.vercel.app/artworks/...">
 * şeklinde görselleri gömüp bant genişliğini kullanmasını engeller.
 *
 * Kasıtlı olarak GÜVENLİ tasarlandı — bunlar ENGELLENMEZ:
 *   • doğrudan ziyaret / yer imi / yeni sekmede açma (Referer yok → serbest)
 *   • sitenin kendi sayfaları ve tüm Vercel preview deployment'ları
 *   • arama motoru görsel önizlemeleri (Google Images trafiği korunur)
 *   • sunucu tarafı istekler: next/image optimizasyonu, sosyal önizleme botları
 *
 * Yani normal ziyaretçi hiçbir şey fark etmez; yalnızca başka sitelerden
 * gömülen görseller 403 alır.
 */

/** Sabit olarak izin verilen alan adları (alan adı değişirse burayı güncelle). */
const OWN_HOSTS = ["ahmet-portfolio.vercel.app"];

/** Yerel geliştirme. */
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

/** Arama motoru önizlemeleri — görsel keşfi kaybolmasın diye serbest. */
const SEARCH_ENGINE_REFERERS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yandex.",
  "search.brave.",
  "ecosia.",
  "qwant.",
  "startpage.",
  "yahoo.",
];

/** Vercel'in çalışma zamanında sağladığı kendi alan adları (preview dahil). */
function vercelOwnHosts(): string[] {
  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ]
    .filter(Boolean)
    .map((value) => {
      try {
        return new URL(value!.startsWith("http") ? value! : `https://${value}`)
          .hostname;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

export default function proxy(request: NextRequest) {
  const referer = request.headers.get("referer");

  // Referer yok: doğrudan ziyaret, yer imi, bot crawl'ı veya sunucu tarafı istek.
  if (!referer) return NextResponse.next();

  let refererHostname: string;
  try {
    refererHostname = new URL(referer).hostname.toLowerCase();
  } catch {
    return NextResponse.next();
  }

  const selfHostname = (request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  // Port farkını yok say: aynı alan adı = kendi sayfamız.
  if (refererHostname === selfHostname) return NextResponse.next();
  if (LOCAL_HOSTS.includes(refererHostname)) return NextResponse.next();
  if (OWN_HOSTS.includes(refererHostname)) return NextResponse.next();
  if (vercelOwnHosts().includes(refererHostname)) return NextResponse.next();
  if (
    SEARCH_ENGINE_REFERERS.some((engine) => refererHostname.includes(engine))
  ) {
    return NextResponse.next();
  }

  return new NextResponse(
    "Hotlinking is not permitted.\n\n" +
      "This image is © Ahmet Faruk Özdemir, licensed CC BY-NC-ND 4.0.\n" +
      "Terms: https://ahmet-portfolio.vercel.app/lisans\n\n" +
      "Sharing is welcome — please link to the site instead of embedding the file.",
    {
      status: 403,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex",
      },
    }
  );
}

export const config = {
  matcher: ["/artworks/:path*"],
};
