import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { UseCases } from "@/components/use-cases";
import { HowItWorks } from "@/components/how-it-works";
import { EverythingIncluded } from "@/components/everything-included";
import { CtaSection } from "@/components/cta-section";
import { BoldFooter } from "@/components/footer-bold";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <UseCases />
      <HowItWorks />
      <EverythingIncluded />
      <CtaSection />
      <BoldFooter />
    </main>
  );
}
