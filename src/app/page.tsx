import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { artworkListJsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      {/*
        Galerideki her eser için ImageObject JSON-LD.
        Eserlerin "kime ait" ve "hangi lisansla" sunulduğunu arama motorlarına
        ve yapay zekâ tarayıcılarına makine-okunur biçimde bildirir.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artworkListJsonLd()) }}
      />
      <Navigation />
      <main>
        <Hero />
        <Gallery />
        <About />
      </main>
      <Footer />
    </>
  );
}
