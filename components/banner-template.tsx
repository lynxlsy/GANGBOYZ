"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface BannerTemplateProps {
  src?: string
  alt?: string
  className?: string
  onClick?: () => void
}

interface ProductBanner {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: {
    src: string
    ratio: string
    scale: number
    tx: number
    ty: number
  }
}

export function BannerTemplate({ 
  src = "/banner-hero.svg", 
  alt = "Banner Template",
  className = "",
  onClick
}: BannerTemplateProps) {
  const [bannerData, setBannerData] = useState<ProductBanner | null>(null)

  useEffect(() => {
    // Carregar dados do banner do localStorage
    const loadBannerData = () => {
      const savedBanners = localStorage.getItem("gang-boyz-product-banners")
      if (savedBanners) {
        const banners: ProductBanner[] = JSON.parse(savedBanners)
        const footerBanner = banners.find(banner => banner.id === "footer-banner-products")
        if (footerBanner) {
          setBannerData(footerBanner)
        }
      }
    }

    loadBannerData()

    // Escutar eventos de atualização
    const handleBannerUpdate = () => {
      loadBannerData()
    }

    window.addEventListener('productBannerUpdated', handleBannerUpdate)
    
    return () => {
      window.removeEventListener('productBannerUpdated', handleBannerUpdate)
    }
  }, [])

  // Usar dados do localStorage se disponível, senão usar props padrão
  const bannerSrc = bannerData?.currentImage || src
  const bannerAlt = bannerData?.name || alt

  return (
    <div className={`w-full bg-gray-900 ${className}`}>
      <div className="relative w-full h-[100px] overflow-hidden">
        <Image
          src={bannerSrc}
          alt={bannerAlt}
          width={1891}
          height={100}
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          style={{ width: "auto", height: "auto" }}
          onClick={onClick}
          priority
        />
      </div>
    </div>
  )
}
