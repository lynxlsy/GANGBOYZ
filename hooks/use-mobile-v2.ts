import { useState, useEffect } from 'react'

export function useMobileV2() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      
      // Detectar dispositivos móveis
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      const isMobileDevice = mobileRegex.test(userAgent)
      
      // Detectar por tamanho de tela
      const isSmallScreen = window.innerWidth <= 768
      
      // Detectar por touch
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Considerar mobile se for dispositivo móvel OU tela pequena com touch
      const mobile = isMobileDevice || (isSmallScreen && isTouchDevice)
      
      setIsMobile(mobile)
    }

    // Verificar imediatamente
    checkMobile()

    // Verificar quando a tela redimensionar
    window.addEventListener('resize', checkMobile)
    
    // Verificar quando a orientação mudar
    window.addEventListener('orientationchange', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  return isMobile
}

