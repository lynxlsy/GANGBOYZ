"use client"

import { useState, useEffect } from "react"
import { HeroCarousel } from "@/components/hero-carousel"

interface Banner {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: any
}

export function Hero() {
  const [heroBanners, setHeroBanners] = useState<Array<{
    id: string
    imageSrc: string
    alt: string
  }>>([
    {
      id: "hero-banner-1",
      imageSrc: "/banner-hero-1.svg",
      alt: "Gang BoyZ Hero Banner 1"
    }
  ])

  // Carregar banners do localStorage
  useEffect(() => {
    const loadBanners = () => {
      const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
      if (savedBanners) {
        try {
          const banners: Banner[] = JSON.parse(savedBanners)
          
          // Converter banners hero para formato do carrossel
          const heroBanner1 = banners.find(banner => banner.id === "hero-banner-1")
          const heroBanner2 = banners.find(banner => banner.id === "hero-banner-2")
          
          const formattedBanners = []
          if (heroBanner1) {
            formattedBanners.push({
              id: heroBanner1.id,
              imageSrc: heroBanner1.currentImage || "/banner-hero-1.svg",
              alt: heroBanner1.name || "Gang BoyZ Hero Banner 1"
            })
          }
          if (heroBanner2) {
            formattedBanners.push({
              id: heroBanner2.id,
              imageSrc: heroBanner2.currentImage || "/banner-hero-2.svg",
              alt: heroBanner2.name || "Gang BoyZ Hero Banner 2"
            })
          }
          
          if (formattedBanners.length > 0) {
            setHeroBanners(formattedBanners)
          }
        } catch (error) {
          console.error("Erro ao carregar banners:", error)
        }
      }
    }

    // Carregar inicialmente
    loadBanners()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-homepage-banners") {
        loadBanners()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadBanners()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('bannerUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bannerUpdated', handleCustomStorageChange)
    }
  }, [])

  return <HeroCarousel banners={heroBanners} autoPlayInterval={5000} />
}