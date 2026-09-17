import type { Metadata } from "next";
import Link from "next/link";
import { copyrightNotice, LICENSE, LICENSE_URL, SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Licensing & Copyright",
  description:
    "The illustrations of Ahmet Faruk Özdemir are licensed CC BY-NC-ND 4.0. Share with credit, no commercial use, no derivatives. Commercial licensing available on request.",
  alternates: { canonical: SITE.licensePath },
  other: {
    license: LICENSE.url,
  },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm sm:text-base leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="text-accent select-none">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const CC_BADGES = [
  ["BY", "Attribution — credit required"],
  ["NC", "NonCommercial — no commercial use"],
  ["ND", "NoDerivatives — no modified versions"],
];

export default function LicensingPage() {
  return (
    <main className="px-6 py-24 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-[11px] tracking-widest uppercase font-heading text-muted hover:text-accent transition-colors"
      >
        ← Back to portfolio
      </Link>

      <h1 className="mt-8 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        Licensing &amp; Copyright
      </h1>

      <p className="mt-6 text-base leading-relaxed text-muted">
        Every artwork on this site is an original work by{" "}
        <strong className="text-foreground font-medium">{SITE.author}</strong> and
        is licensed to you under a{" "}
        <a
          href={LICENSE.url}
          target="_blank"
          rel="noopener noreferrer license"
          className="text-accent hover:underline"
        >
          Creative Commons licence
        </a>
        . It is not free stock. Sharing is welcome — using it to sell something
        is not.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-surface p-5 text-sm">
        <dl className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-x-4 gap-y-2">
          <dt className="text-muted/70">Licence</dt>
          <dd className="text-foreground">
            <a
              href={LICENSE.url}
              target="_blank"
              rel="noopener noreferrer license"
              className="hover:underline"
            >
              {LICENSE.name}
            </a>
          </dd>
          <dt className="text-muted/70">Copyright</dt>
          <dd className="text-foreground">{copyrightNotice()}</dd>
          <dt className="text-muted/70">You may</dt>
          <dd className="text-foreground">
            Share, repost and redistribute — with credit, non-commercially, unmodified
          </dd>
          <dt className="text-muted/70">You may not</dt>
          <dd className="text-foreground">
            Sell, use commercially, edit, or build anything new from it
          </dd>
          <dt className="text-muted/70">Commercial</dt>
          <dd className="text-foreground">
            Written licence available on request
          </dd>
          <dt className="text-muted/70">AI training</dt>
          <dd className="text-foreground">Not permitted — reserved separately</dd>
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {CC_BADGES.map(([code, label]) => (
          <div
            key={code}
            className="flex items-center gap-2 rounded border border-border px-3 py-2"
          >
            <span className="font-heading text-sm font-bold text-foreground">
              {code}
            </span>
            <span className="text-[11px] tracking-wide text-muted/70">
              {label}
            </span>
          </div>
        ))}
      </div>

      <Section title="What you are free to do">
        <List
          items={[
            <>
              <strong className="text-foreground">Share</strong> — copy and
              redistribute the artwork in any medium or format, online or offline.
            </>,
            <>
              <strong className="text-foreground">Repost</strong> on social
              media, blogs, video essays, moodboards and other non-commercial
              contexts.
            </>,
            <>
              <strong className="text-foreground">Use it personally</strong> —
              wallpaper, personal reference, study, practice, private use.
            </>,
          ]}
        />
      </Section>

      <Section title="Under these conditions">
        <List
          items={[
            <>
              <strong className="text-foreground">Attribution (BY)</strong> —
              credit <em>Ahmet Faruk Özdemir</em> or <em>@runicmelody</em>, link
              to this page, and link to the licence. Do not crop out, cover or
              obscure my signature.
            </>,
            <>
              <strong className="text-foreground">NonCommercial (NC)</strong> —
              you may not use the work for commercial purposes or for
              commercial advantage, and you may not sell it, sublicense it, or
              put it on merchandise, print-on-demand or stock marketplaces.
            </>,
            <>
              <strong className="text-foreground">NoDerivatives (ND)</strong> —
              if you remix, transform, recolour, trace, repaint or build upon
              the work, you may not share or distribute the result.
            </>,
            <>
              <strong className="text-foreground">No additional restrictions</strong>{" "}
              — you may not apply legal terms or technological measures that
              legally restrict others from doing anything the licence permits.
            </>,
          ]}
        />
      </Section>

      <Section title="Commercial use and licensing">
        <p>
          Commercial licences are available, and so are commissions. To get a
          quote, email{" "}
          <a
            href={`mailto:${SITE.email}?subject=Licence%20request`}
            className="text-accent hover:underline"
          >
            {SITE.email}
          </a>{" "}
          and include:
        </p>
        <List
          items={[
            "What the artwork will be used for, and where it will be published.",
            "Whether it is commercial or personal.",
            "Duration and territory of the licence you need.",
            "Print run, impressions or expected audience, if relevant.",
          ]}
        />
        <p>
          A commercial licence is only valid if it is in writing. Invoices and
          written confirmations are always provided.
        </p>
      </Section>

      <Section title="AI, scraping and text & data mining">
        <p>
          No permission is granted for the use of these works as training data
          for machine learning or generative AI systems, for text and data
          mining (TDM), or for image-to-image / style-transfer generation. The
          NonCommercial condition already excludes commercial AI training; this
          reservation extends that exclusion to all AI training regardless of
          purpose, and is asserted independently of the Creative Commons licence.
        </p>
        <p>
          This reservation is expressed technically on this site via{" "}
          <code className="text-foreground">tdm-reservation</code> HTTP headers,{" "}
          <code className="text-foreground">noai</code> robots directives, and
          copyright and licence metadata embedded inside the image files
          themselves. These signals are a declaration of intent, not a technical
          lock — disregarding them does not make the use permitted.
        </p>
      </Section>

      <Section title="If you find my work used without permission">
        <p>
          Tell me. Send the link to{" "}
          <a
            href={`mailto:${SITE.email}?subject=Unauthorised%20use`}
            className="text-accent hover:underline"
          >
            {SITE.email}
          </a>
          . If I have ever used someone else&apos;s work here without proper
          credit or permission, the same applies in reverse — contact me and it
          will be corrected or removed promptly.
        </p>
        <p>
          Unauthorised use may be pursued through DMCA takedown notices to the
          hosting provider and to search engines, and through the legal
          remedies available to me.
        </p>
      </Section>

      <Section title="Legal basis">
        <p>
          Under Turkish Law No. 5846 on Intellectual and Artistic Works (FSEK)
          and the Berne Convention, copyright arises automatically when a work
          is created. Registration is not required. The license above is
          governed by its own terms;{" "}
          <a
            href={LICENSE.legalCode}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            the full legal code is here
          </a>
          .
        </p>
        <p>
          Moral rights (authorship, integrity of the work) are inalienable and
          remain with me even when economic rights are licensed. The names
          &ldquo;Ahmet&rdquo; and &ldquo;Runicc&rdquo; are not licensed for use
          as trademarks or as a designation of endorsement.
        </p>
      </Section>

      <Section title="Türkçe özet">
        <List
          items={[
            "Bu sitedeki tüm çizimler Ahmet Faruk Özdemir'e aittir ve CC BY-NC-ND 4.0 lisansıyla sunulur.",
            "Paylaşabilirsin — ama adını (@runicmelody) belirterek, bu sayfaya ve lisans linkine atıf yaparak, ticari olmayan amaçla ve eseri DEĞİŞTİRMEDEN.",
            "İmzayı kırpmak, eseri düzenlemek (recolor, trace, crop), ürün/merch/NFT olarak satmak ve her türlü ticari kullanım lisans dışıdır.",
            "Yapay zekâ eğitimi ve veri madenciliği için ayrıca izin verilmez.",
            "Ticari lisans ve komisyon için: " + SITE.email,
          ]}
        />
      </Section>

      <div className="mt-16 h-px w-full bg-border" />
      <p className="mt-6 text-xs text-muted/50 tracking-wider">
        {copyrightNotice()} ·{" "}
        <a
          href={LICENSE.url}
          target="_blank"
          rel="noopener noreferrer license"
          className="underline hover:text-muted"
        >
          {LICENSE.name}
        </a>
      </p>
      <p className="mt-2 text-xs text-muted/40 break-all">{LICENSE_URL}</p>
    </main>
  );
}
