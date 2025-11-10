"use client"

import { useState, useEffect, useCallback } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { useBanner, BannerData } from "@/hooks/use-banner"

interface HeroProps {
  onEditBannerImage?: (bannerId: string) => void
}

export function Hero({ onEditBannerImage }: HeroProps) {
  const [heroBanners, setHeroBanners] = useState<Array<{
    id: string
    imageSrc: string
    alt: string
  }>>([])

  // Function to detect if we're on mobile
  const isMobileDevice = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 || 
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  }, []);

  // Function to get the appropriate image for the current device
  const getDeviceSpecificImage = useCallback((banner: BannerData) => {
    const isMobile = isMobileDevice();
    
    // If we have device-specific images, use them
    if (isMobile && banner.mobileImage) {
      return banner.mobileImage;
    } else if (!isMobile && banner.desktopImage) {
      return banner.desktopImage;
    }
    
    // Fallback to currentImage if device-specific images don't exist
    return banner.currentImage;
  }, [isMobileDevice]);

  // Hooks para banners locais
  const heroBanner1 = useBanner('hero-banner-1')
  const heroBanner2 = useBanner('hero-banner-2')

  // Carregar banners do localStorage
  useEffect(() => {
    const loadBanners = () => {
      const localBanners = []
      
      // Carregar banner 1
      if (heroBanner1.banner) {
        // Get device-specific image
        const deviceImage = getDeviceSpecificImage(heroBanner1.banner);
        // Check if the image is a data URL (base64) - don't add cache buster
        const banner1Src = deviceImage.startsWith('data:') 
          ? deviceImage 
          : `${deviceImage}?v=${Date.now()}`
        console.log('Hero banner 1 data:', heroBanner1.banner, 'Image src:', banner1Src)
        localBanners.push({
          id: "hero-banner-1",
          imageSrc: banner1Src,
          alt: heroBanner1.banner.name || "Gang BoyZ Hero Banner 1"
        })
      } else {
        // Adicionar banner padrão se não houver dados
        localBanners.push({
          id: "hero-banner-1",
          imageSrc: "/placeholder-default.svg",
          alt: "Gang BoyZ Hero Banner 1 (Padrão)"
        })
      }
      
      // Carregar banner 2
      if (heroBanner2.banner) {
        // Get device-specific image
        const deviceImage = getDeviceSpecificImage(heroBanner2.banner);
        // Check if the image is a data URL (base64) - don't add cache buster
        const banner2Src = deviceImage.startsWith('data:') 
          ? deviceImage 
          : `${deviceImage}?v=${Date.now()}`
        console.log('Hero banner 2 data:', heroBanner2.banner, 'Image src:', banner2Src)
        localBanners.push({
          id: "hero-banner-2", 
          imageSrc: banner2Src,
          alt: heroBanner2.banner.name || "Gang BoyZ Hero Banner 2"
        })
      } else {
        // Adicionar banner padrão se não houver dados
        localBanners.push({
          id: "hero-banner-2",
          imageSrc: "/placeholder-default.svg",
          alt: "Gang BoyZ Hero Banner 2 (Padrão)"
        })
      }

      console.log('Using local banners:', localBanners)
      setHeroBanners(localBanners)
    }

    // Carregar inicialmente
    loadBanners()

    // Escutar atualizações de sincronização
    const handleBannerSyncUpdate = (event: CustomEvent) => {
      console.log('🔄 Atualização de sincronização recebida:', event.detail)
      loadBanners()
    }

    // Escutar atualizações específicas da homepage
    const handleHomepageBannerUpdate = (event: CustomEvent) => {
      console.log('🏠 Atualização de banner da homepage:', event.detail)
      // Add a small delay to ensure localStorage is updated
      setTimeout(() => {
        loadBanners()
      }, 100)
    }

    // Escutar sincronização forçada
    const handleForceSync = (event: CustomEvent) => {
      console.log('🔄 Sincronização forçada recebida:', event.detail)
      loadBanners()
    }

    // Escutar eventos de sincronização
    window.addEventListener('bannerSyncUpdate', handleBannerSyncUpdate as EventListener)
    window.addEventListener('homepageBannerUpdate', handleHomepageBannerUpdate as EventListener)
    window.addEventListener('forceBannerSync', handleForceSync as EventListener)
    window.addEventListener('bannerUpdated', handleHomepageBannerUpdate as EventListener)

    return () => {
      window.removeEventListener('bannerSyncUpdate', handleBannerSyncUpdate as EventListener)
      window.removeEventListener('homepageBannerUpdate', handleHomepageBannerUpdate as EventListener)
      window.removeEventListener('forceBannerSync', handleForceSync as EventListener)
      window.removeEventListener('bannerUpdated', handleHomepageBannerUpdate as EventListener)
    }
  }, [heroBanner1.banner, heroBanner2.banner, heroBanner1.loading, heroBanner2.loading])

  return <HeroCarousel banners={heroBanners} autoPlayInterval={5000} onEditBannerImage={onEditBannerImage} />
}