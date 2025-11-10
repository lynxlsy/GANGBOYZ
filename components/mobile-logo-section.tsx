"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface MobileLogoProps {
  position?: 'top-center' | 'top-left' | 'top-right' | 'center' | 'bottom-center'
  size?: 'small' | 'medium' | 'large'
  className?: string
  showOnScroll?: boolean
}

export function MobileLogoSection({ 
  position = 'top-center', 
  size = 'medium',
  className = '',
  showOnScroll = true
}: MobileLogoProps = {}) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll para otimizar logo mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)
    }
    
    if (showOnScroll) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [showOnScroll])

  // Posicionamento baseado na prop (posição padrão)
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      default: // top-center (posição padrão)
        return 'top-4 left-1/2 transform -translate-x-1/2'
    }
  }

  // Tamanho baseado na prop (tamanhos originais)
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-[150px]' // Tamanho original
      case 'large':
        return 'w-[270px]' // Tamanho original
      default: // medium
        return 'w-[210px]' // Tamanho original
    }
  }

  return (
    <div 
      className={`md:hidden absolute ${getPositionClasses()} z-10 transition-all duration-300 pointer-events-auto ${className}`}
    >
      <button 
        onClick={() => router.push("/")}
        className="flex items-center group focus:outline-none"
        aria-label="Voltar para a página inicial"
        style={{ margin: '0 20px' }} // Add 20px margin on left and right
      >
        <img
          src="/logo-gang-boyz-new.svg"
          alt="Gang BoyZ"
          className={`cursor-pointer transition-all duration-300 group-hover:scale-105 ${getSizeClasses()} ${
            showOnScroll && isScrolled ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </button>
    </div>
  )
}
