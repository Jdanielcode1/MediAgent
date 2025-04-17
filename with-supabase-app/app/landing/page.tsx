import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/navbar"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import Testimonials from "@/components/landing/testimonials"
import Pricing from "@/components/landing/pricing"
import FAQ from "@/components/landing/faq"
import CTA from "@/components/landing/cta"
import Footer from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}