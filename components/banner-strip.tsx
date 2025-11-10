"use client"

import { useState, useEffect } from "react"

export function BannerStrip() {
  const [bannerText, setBannerText] = useState("SITE DEMONSTRATIVO")
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [bannerEmoji, setBannerEmoji] = useState("")
  const [bannerBgColor, setBannerBgColor] = useState("black")
  const [bannerHeight, setBannerHeight] = useState(38) // altura em pixels
  const [bannerSpeed, setBannerSpeed] = useState(50) // velocidade do scroll (1-100)
  const [bannerRepetitions, setBannerRepetitions] = useState(4) // quantidade de repetições do texto

  // Carregar configurações da faixa
  useEffect(() => {
    const loadBannerSettings = () => {
      const savedText = localStorage.getItem("gang-boyz-banner-text")
      const savedActive = localStorage.getItem("gang-boyz-banner-active")
      const savedEmoji = localStorage.getItem("gang-boyz-banner-emoji")
      const savedBgColor = localStorage.getItem("gang-boyz-banner-bg-color")
      const savedHeight = localStorage.getItem("gang-boyz-banner-height")
      const savedSpeed = localStorage.getItem("gang-boyz-banner-speed")
      const savedRepetitions = localStorage.getItem("gang-boyz-banner-repetitions")
      
      if (savedText) setBannerText(savedText)
      if (savedActive !== null) setIsBannerActive(savedActive === 'true')
      if (savedEmoji) setBannerEmoji(savedEmoji)
      if (savedBgColor) setBannerBgColor(savedBgColor)
      if (savedHeight) setBannerHeight(parseInt(savedHeight))
      if (savedSpeed) setBannerSpeed(parseInt(savedSpeed))
      if (savedRepetitions) setBannerRepetitions(parseInt(savedRepetitions))
    }

    loadBannerSettings()
    
    // Escutar mudanças nas configurações
    window.addEventListener('bannerSettingsUpdated', loadBannerSettings)
    
    return () => {
      window.removeEventListener('bannerSettingsUpdated', loadBannerSettings)
    }
  }, [])

  if (!isBannerActive) return null

  return (
    <div 
      className={`w-full overflow-hidden ${
        bannerBgColor === 'black' ? 'bg-black' :
        bannerBgColor === 'red' ? 'bg-red-600' :
        bannerBgColor === 'blue' ? 'bg-blue-600' :
        bannerBgColor === 'yellow' ? 'bg-yellow-500' :
        bannerBgColor === 'green' ? 'bg-green-600' :
        bannerBgColor === 'sync' ? 'bg-gradient-to-r from-red-600 to-blue-600' :
        'bg-black'
      }`}
      style={{ height: `${bannerHeight}px` }}
    >
      <div className="flex items-center h-full">
        <div 
          className="flex text-white font-bold text-sm tracking-wider whitespace-nowrap"
          style={{ 
            animation: `scroll ${Math.max(5, 20 - (bannerSpeed / 5))}s linear infinite` 
          }}
        >
          {Array.from({ length: bannerRepetitions }, (_, i) => (
            <span key={i} className="mr-16">{bannerEmoji} {bannerText} {bannerEmoji}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
