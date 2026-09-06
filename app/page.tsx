import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { HeroSection } from '@/components/home/hero-section'
import { SafetyLegendSection } from '@/components/home/safety-legend-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { PopularDestinationsSection } from '@/components/home/popular-destinations-section'
import { EmergencySection } from '@/components/home/emergency-section'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <SafetyLegendSection />
        <HowItWorksSection />
        <section id="reviews">
          <PopularDestinationsSection />
        </section>
        <EmergencySection />
      </main>
      <SiteFooter />
    </div>
  )
}
