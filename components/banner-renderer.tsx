"use client"

import { useBanner } from '@/hooks/use-banner'
import { BannerConfig } from '@/lib/banner-config'
import Image from 'next/image'

interface BannerRendererProps {
  bannerId: string
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  showOverlay?: boolean
  overlayContent?: React.ReactNode
  fallbackContent?: React.ReactNode
}

export function BannerRenderer({
  bannerId,
  className = "",
  style = {},
  onClick,
  showOverlay = false,
  overlayContent,
  fallbackContent
}: BannerRendererProps) {
  const { banner, loading, error, config } = useBanner(bannerId)
  
  // Removido console.log para evitar loop de logs
  // console.log('BannerRenderer - bannerId:', bannerId)
  // console.log('BannerRenderer - banner:', banner)
  // console.log('BannerRenderer - cropMetadata:', banner?.cropMetadata)

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} style={style}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    )
  }

  if (error || !banner) {
    return fallbackContent || (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={style}>
        <div className="text-gray-500 text-center p-4">
          <p>Banner não encontrado</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const aspectRatio = config?.aspectRatio || "16:9"
  const [width, height] = aspectRatio.split(':').map(Number)
  const aspectRatioStyle = { aspectRatio: `${width}/${height}` }

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${onClick ? 'cursor-pointer hover:scale-105' : ''} transition-transform duration-300 ${className}`}
      style={{ ...aspectRatioStyle, ...style }}
      onClick={onClick}
    >
      {banner.mediaType === 'video' ? (
        <video
          src={banner.currentImage}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={banner.currentImage}
          alt={banner.name}
          fill
          className="object-cover"
          style={{
            transform: banner.cropMetadata ? 
              `translate(${banner.cropMetadata.tx || 0}px, ${banner.cropMetadata.ty || 0}px) scale(${banner.cropMetadata.scale || 1})` : 
              undefined
          }}
          priority
        />
      )}
      
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent">
          {overlayContent}
        </div>
      )}
    </div>
  )
}

// Componente específico para banner de ofertas
export function OffersBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer
      bannerId="offers-banner"
      className={`shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-none ${className}`}
      style={{ aspectRatio: '1248/624' }}
    />
  )
}

// Componente específico para banner footer
export function FooterBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer
      bannerId="footer-banner"
      className={`w-full h-[650px] ${className}`}
      style={{ aspectRatio: '1920/650' }}
      showOverlay={true}
      overlayContent={
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      }
    />
  )
}

// Componente específico para banner hero
export function HeroBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer
      bannerId="hero-banner-1"
      className={`w-full h-full ${className}`}
      style={{ aspectRatio: '1507/1333' }}
    />
  )
}

// Componente específico para banner de serviços
export function ServicesBanner({ className = "" }: { className?: string }) {
  return (
    <BannerRenderer
      bannerId="services-banner"
      className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      style={{ aspectRatio: '1248/624' }}
    />
  )
}
