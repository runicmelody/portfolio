import Link from "next/link";
import { copyrightNotice, LICENSE, LICENSE_URL, SITE } from "@/data/site";

/**
 * Footer: telif bildirimi + lisans bağlantısı.
 * Görünür © ve lisans bildirimi, ihlal durumunda "bilerek ihlal" iddiasını güçlendirir.
 */
export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs tracking-wider text-muted/70">
          {copyrightNotice()}
        </p>

        <nav className="flex items-center gap-5" aria-label="Legal">
          <a
            href={LICENSE.url}
            target="_blank"
            rel="noopener noreferrer license"
            className="text-[11px] tracking-widest uppercase font-heading text-muted hover:text-foreground transition-colors"
          >
            {LICENSE.name}
          </a>
          <Link
            href={SITE.licensePath}
            className="text-[11px] tracking-widest uppercase font-heading text-muted hover:text-foreground transition-colors"
          >
            Licensing
          </Link>
          <a
            href={`mailto:${SITE.email}?subject=Licence%20request`}
            className="text-[11px] tracking-widest uppercase font-heading text-muted hover:text-foreground transition-colors"
          >
            Permissions
          </a>
        </nav>
      </div>
      <p className="mx-auto max-w-7xl mt-3 text-[11px] leading-relaxed text-muted/40">
        Sharing is welcome with attribution. Commercial use and derivative works
        require written permission — see{" "}
        <a href={LICENSE_URL} className="underline hover:text-muted/70">
          the licensing page
        </a>
        .
      </p>
    </footer>
  );
}
