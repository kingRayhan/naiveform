import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CtaSection } from "@/components/cta-section";
import { BoldFooter } from "@/components/footer-bold";
import { GrowthPlans } from "@/components/growth-plans";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <GrowthPlans />
      <CtaSection />
      <BoldFooter />
    </main>
  );
}
