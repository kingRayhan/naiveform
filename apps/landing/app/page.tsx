import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { BoldFooter } from "@/components/footer-bold";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <CtaSection />
      <BoldFooter />
    </main>
  );
}
