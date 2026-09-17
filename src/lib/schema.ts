import { artworks } from "@/data/artworks";
import { copyrightNotice, LICENSE, LICENSE_URL, SITE } from "@/data/site";

/**
 * Site geneli JSON-LD: yazar (Person) + site (WebSite).
 * Google ve yapay zekâ tarayıcıları, eserlerin kime ait olduğunu buradan okur.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: SITE.author,
        alternateName: SITE.name,
        url: SITE.url,
        email: SITE.email,
        jobTitle: "Illustrator & Developer",
        sameAs: [
          SITE.instagram,
          "https://www.instagram.com/runicmodeller/",
          "https://www.linkedin.com/in/ahmet-faruk-ozdemir/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: `${SITE.name} — Illustration Portfolio`,
        inLanguage: "en",
        author: { "@id": `${SITE.url}/#person` },
        creator: { "@id": `${SITE.url}/#person` },
        copyrightHolder: { "@id": `${SITE.url}/#person` },
        copyrightNotice: copyrightNotice(),
        license: LICENSE.url,
        usageInfo: LICENSE_URL,
        copyrightYear: new Date().getFullYear(),
      },
    ],
  };
}

/**
 * Galerideki her eser için ImageObject içeren ItemList JSON-LD.
 * `license`, `copyrightNotice` ve `acquireLicensePage` alanları;
 * eserin hangi lisansla sunulduğunu makinelere de bildirir.
 */
export function artworkListJsonLd() {
  const year = new Date().getFullYear();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Original illustrations by " + SITE.author,
    numberOfItems: artworks.length,
    itemListElement: artworks.map((artwork, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ImageObject",
        "@id": `${SITE.url}/#${artwork.id}`,
        contentUrl: `${SITE.url}/artworks/${encodeURIComponent(artwork.filename)}`,
        name: artwork.id.replace(/-/g, " "),
        width: artwork.width,
        height: artwork.height,
        keywords: artwork.tags.join(", "),
        creator: { "@type": "Person", name: SITE.author, url: SITE.url },
        copyrightHolder: { "@type": "Person", name: SITE.author },
        copyrightNotice: copyrightNotice(),
        copyrightYear: year,
        creditText: `${SITE.author} — ${SITE.instagram}`,
        license: LICENSE.url,
        acquireLicensePage: LICENSE_URL,
        usageInfo: LICENSE_URL,
        isFamilyFriendly: true,
      },
    })),
  };
}
