import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import { HeroUIProvider } from "@heroui/system"
import Testimonials2 from "@/components/component/Testimonials"
import Pricing2 from "@/components/component/Pricing"

export default function Home() {
  return (
    <HeroUIProvider>
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Navbar />
          <CTA />
          <Hero />
          <Features />
          <Pricing2 />
          <Testimonials2 />
          <Footer />
        </div>
      </div>
    </HeroUIProvider>
  )
}

