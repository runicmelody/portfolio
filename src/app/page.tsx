import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Gallery />
        <About />
      </main>
    </>
  );
}
