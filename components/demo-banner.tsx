"use client"

import { useState, useEffect } from "react"

interface DemoBannerProps {
  text?: string
  emoji?: string
  bgColor?: string
  height?: number
  speed?: number
  repetitions?: number
  isActive?: boolean
}

export function DemoBanner({ 
  text = "SITE DEMONSTRATIVO",
  emoji = "",
  bgColor = "black",
  height = 38,
  speed = 50,
  repetitions = 4,
  isActive = true
}: DemoBannerProps) {
  const [settings, setSettings] = useState({
    text,
    emoji,
    bgColor,
    height,
    speed,
    repetitions,
    isActive
  })

  // Carregar configurações do localStorage (sincronizado com admin)
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("demo-banner-settings")
      console.log("🔍 DemoBanner: Carregando configurações...", savedSettings)
      
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          console.log("✅ DemoBanner: Configurações carregadas:", parsed)
          setSettings(parsed)
        } catch (error) {
          console.error("❌ DemoBanner: Erro ao carregar configurações:", error)
        }
      } else {
        console.log("⚠️ DemoBanner: Nenhuma configuração encontrada, usando padrões")
      }
    }

    loadSettings()

    // Verificar mudanças no localStorage a cada 1 segundo
    const interval = setInterval(() => {
      const currentSettings = localStorage.getItem("demo-banner-settings")
      if (currentSettings) {
        try {
          const parsed = JSON.parse(currentSettings)
          setSettings(prevSettings => {
            const currentString = JSON.stringify(parsed)
            const settingsString = JSON.stringify(prevSettings)
            
            if (currentString !== settingsString) {
              console.log("🔄 DemoBanner: Mudança detectada via polling!")
              return parsed
            }
            return prevSettings
          })
        } catch (error) {
          console.error("❌ DemoBanner: Erro ao verificar configurações:", error)
        }
      }
    }, 1000)

    // Escutar mudanças no localStorage (para mesma aba)
    const handleStorageChange = () => {
      console.log("🔄 DemoBanner: Mudança detectada no localStorage")
      loadSettings()
    }

    // Escutar evento customizado de atualização
    const handleCustomEvent = () => {
      console.log("🎯 DemoBanner: Evento customizado recebido!")
      loadSettings()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("demoBannerSettingsUpdated", handleCustomEvent)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("demoBannerSettingsUpdated", handleCustomEvent)
    }
  }, [])

  if (!settings.isActive) {
    console.log("🚫 DemoBanner: Banner desativado")
    return null
  }

  const animationDuration = Math.max(5, 100 - settings.speed) // Converter velocidade para duração
  const textWithEmoji = settings.emoji ? `${settings.emoji} ${settings.text}` : settings.text

  console.log("🎨 DemoBanner: Aplicando configurações:", {
    text: settings.text,
    emoji: settings.emoji,
    bgColor: settings.bgColor,
    height: settings.height,
    speed: settings.speed,
    repetitions: settings.repetitions,
    animationDuration,
    textWithEmoji
  })

  // Função para obter cor de fundo
  const getBackgroundColor = () => {
    switch (settings.bgColor) {
      case 'black': return 'bg-black'
      case 'red': return 'bg-red-600'
      case 'blue': return 'bg-blue-600'
      case 'yellow': return 'bg-yellow-500'
      case 'green': return 'bg-green-600'
      case 'sync': return 'bg-gradient-to-r from-red-600 to-blue-600'
      default: return 'bg-black'
    }
  }

  return (
    <div 
      className={`${getBackgroundColor()} border-b border-gray-800 overflow-hidden`}
      style={{ height: `${settings.height}px` }}
    >
      <div className="flex items-center h-full">
        <div 
          className="flex text-white font-bold text-sm tracking-wider whitespace-nowrap" 
          style={{
            animation: `${animationDuration}s linear 0s infinite normal none running scroll`
          }}
        >
          {Array.from({ length: settings.repetitions }, (_, i) => (
            <span key={i} className="mr-16">
              {textWithEmoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
