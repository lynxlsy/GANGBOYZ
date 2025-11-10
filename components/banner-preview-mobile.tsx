"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { BannerData } from "@/hooks/use-banner"
import { BannerConfig } from "@/lib/banner-config"
import { Crop, Eye, Maximize2 } from "lucide-react"

interface BannerPreviewMobileProps {
  banner: BannerData
  config: BannerConfig
  onEdit: () => void
  className?: string
}

export function BannerPreviewMobile({ banner, config, onEdit, className = "" }: BannerPreviewMobileProps) {
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 })

  useEffect(() => {
    const calculateDimensions = () => {
      const aspectRatio = config.aspectRatio.includes(':') 
        ? config.aspectRatio.split(':').map(Number).reduce((a, b) => a / b)
        : parseFloat(config.aspectRatio)
      
      // Use more of the screen width for better mobile visualization
      const maxWidth = Math.min(300, window.innerWidth - 32) // 16px padding on each side
      const width = maxWidth
      const height = Math.round(width / aspectRatio)
      
      setDimensions({ width, height })
    }

    calculateDimensions()
    window.addEventListener('resize', calculateDimensions)
    
    return () => window.removeEventListener('resize', calculateDimensions)
  }, [config.aspectRatio])

  if (!banner.currentImage) {
    return (
      <div 
        className={`relative bg-gray-100 rounded border border-dashed border-gray-300 cursor-pointer group ${className}`}
        style={{ width: dimensions.width, height: dimensions.height }}
        onClick={onEdit}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Eye className="h-4 w-4 mx-auto mb-0.5" />
            <p className="text-xs font-medium">Nenhuma imagem</p>
            <p className="text-xs">Toque para editar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative bg-gray-100 rounded border border-dashed border-gray-300 cursor-pointer group overflow-hidden ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
      onClick={onEdit}
    >
      <Image
        src={banner.currentImage}
        alt={banner.name}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        style={{
          transform: banner.cropMetadata ?
            `translate(${(banner.cropMetadata as any).x || (banner.cropMetadata as any).tx || 0}px, ${(banner.cropMetadata as any).y || (banner.cropMetadata as any).ty || 0}px) scale(${(banner.cropMetadata as any).scale || 1})` :
            undefined
        }}
        unoptimized={true}
      />
      
      {/* Overlay de hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/95 text-gray-900 px-1 py-0.5 rounded text-xs font-medium shadow-xl border border-gray-200">
            <Crop className="h-2 w-2 inline mr-0.5" />
            Editar
          </div>
        </div>
      </div>
      
      {/* Badge de dimensões */}
      <div className="absolute top-0.5 right-0.5 bg-black/70 text-white px-0.5 py-0.5 rounded text-xs">
        {config.dimensions}
      </div>
      
      {/* Indicador de recorte */}
      {banner.cropMetadata && (
        <div className="absolute top-0.5 left-0.5 bg-blue-500 text-white px-0.5 py-0.5 rounded text-xs">
          <Crop className="h-2 w-2 inline mr-0.5" />
          Recortado
        </div>
      )}
    </div>
  )
}