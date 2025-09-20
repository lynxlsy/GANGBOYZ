"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BannerStrip } from "@/components/banner-strip"
import { BannerGrid } from "@/components/banner-grid"
import { HotSection } from "@/components/hot-section"
import { RecommendationsSection } from "@/components/recommendations-section"
import { ExploreCategories } from "@/components/explore-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { BannersShowcase } from "@/components/banners-showcase"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { FooterV2 } from "@/components/footer-v2"
import { CartDrawer } from "@/components/cart-drawer"
import { WelcomeModal } from "@/components/welcome-modal"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CardsShowcase } from "@/components/cards-showcase"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function HomePage() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    // Mostrar modal de boas-vindas apenas uma vez
    const hasSeenWelcome = localStorage.getItem('gang-boyz-welcome-seen')
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true)
      localStorage.setItem('gang-boyz-welcome-seen', 'true')
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="relative">
        <Hero />
        <BannerStrip />
        <BannerGrid />
        <ExploreCategories />
        <RecommendationsSection />
        <FeaturedProducts />
        <BannersShowcase />
        <CardsShowcase />
        <HotSection />
        <AboutSection />
        <ServicesSection />
      </main>
      <FooterV2 />
      <CartDrawer />
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  )
}
