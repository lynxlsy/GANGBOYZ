"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X } from "lucide-react"
import nicknames from "@/data/nicknames.json"

interface PurchaseNotification {
  id: string
  nickname: string
  productName: string
  productId: string
  timestamp: string
  price?: number
}

interface NotificationSystemProps {
  className?: string
}

export function NotificationSystem({ className = "" }: NotificationSystemProps) {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lastShownIndex, setLastShownIndex] = useState(-1)
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([])
  const [settings, setSettings] = useState({
    enabled: false,
    interval: 8,
    duration: 3,
    maxNotifications: 10,
    showProductId: true,
    showPrice: true,
    showNickname: true,
    customMessage: ""
  })

  // Carregar configurações
  useEffect(() => {
    const savedSettings = localStorage.getItem("gang-boyz-notification-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }

    // Escutar mudanças nas configurações
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings(event.detail)
    }

    window.addEventListener('notificationSettingsChanged', handleSettingsChange as EventListener)
    
    return () => {
      window.removeEventListener('notificationSettingsChanged', handleSettingsChange as EventListener)
    }
  }, [])
  const generateNotification = (): PurchaseNotification => {
    const allProducts: any[] = []
    
    // Buscar produtos reais do localStorage
    const sections = [
      'gang-boyz-hot-products',
      'gang-boyz-standalone-products', 
      'gang-boyz-recommendations'
    ]
    
    sections.forEach(section => {
      try {
        const data = localStorage.getItem(section)
        if (data) {
          const products = JSON.parse(data)
          if (Array.isArray(products)) {
            allProducts.push(...products)
          }
        }
      } catch (error) {
        console.error(`Erro ao carregar ${section}:`, error)
      }
    })
    
    const activeProducts = allProducts.filter(product => product.isActive !== false)
    
    if (activeProducts.length === 0) {
      // Fallback se não houver produtos
      return {
        id: `NOTIFICATION_${Date.now()}`,
        nickname: nicknames.nicknames[Math.floor(Math.random() * nicknames.nicknames.length)],
        productName: "Produto Premium",
        productId: "PROD001",
        timestamp: new Date().toISOString(),
        price: 199.90
      }
    }
    
    const randomProduct = activeProducts[Math.floor(Math.random() * activeProducts.length)]
    const randomNickname = nicknames.nicknames[Math.floor(Math.random() * nicknames.nicknames.length)]
    
    return {
      id: `NOTIFICATION_${Date.now()}`,
      nickname: randomNickname,
      productName: randomProduct.name || randomProduct.title || "Produto",
      productId: randomProduct.id || "UNKNOWN",
      timestamp: new Date().toISOString(),
      price: randomProduct.price || 0
    }
  }

  // Preparar lista de notificações
  useEffect(() => {
    const fallbackNotifications: PurchaseNotification[] = []
    for (let i = 0; i < settings.maxNotifications; i++) {
      fallbackNotifications.push(generateNotification())
    }
    setNotifications(fallbackNotifications)
    console.log("Notificações carregadas:", fallbackNotifications.length)
  }, [settings.maxNotifications])

  // Mostrar notificação baseado nas configurações
  useEffect(() => {
    if (!settings.enabled || notifications.length === 0) return

    const interval = setInterval(() => {
      // Selecionar próxima notificação
      let nextIndex = lastShownIndex + 1
      if (nextIndex >= notifications.length) {
        nextIndex = 0 // Reiniciar do início
      }
      
      const nextNotification = notifications[nextIndex]
      if (nextNotification) {
        setCurrentNotification(nextNotification)
        setLastShownIndex(nextIndex)
        setIsVisible(true)
        
        console.log("Mostrando notificação:", nextNotification)
        
        // Esconder após tempo configurado
        setTimeout(() => {
          setIsVisible(false)
        }, settings.duration * 1000)
      }
    }, settings.interval * 1000) // Usar intervalo configurado

    return () => clearInterval(interval)
  }, [notifications, lastShownIndex, settings.enabled, settings.interval, settings.duration])

  // Escutar notificações de teste
  useEffect(() => {
    const handleTestNotification = (event: CustomEvent) => {
      const testData = event.detail
      const testNotification: PurchaseNotification = {
        id: `TEST_${Date.now()}`,
        nickname: testData.nickname,
        productName: testData.productName,
        productId: testData.productId,
        timestamp: new Date().toISOString(),
        price: testData.price
      }
      
      setCurrentNotification(testNotification)
      setIsVisible(true)
      
      setTimeout(() => {
        setIsVisible(false)
      }, settings.duration * 1000)
    }

    window.addEventListener('testNotification', handleTestNotification as EventListener)
    
    return () => {
      window.removeEventListener('testNotification', handleTestNotification as EventListener)
    }
  }, [settings.duration])

  // Fechar notificação manualmente
  const closeNotification = () => {
    setIsVisible(false)
  }

  if (!currentNotification || !isVisible) return null

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-black/80 backdrop-blur-sm border border-gray-600/30 rounded-lg shadow-lg p-3 max-w-xs animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-3 w-3 text-green-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 leading-tight">
              {settings.showNickname && (
                <span className="font-medium text-white">{currentNotification.nickname}</span>
              )}
              {settings.showNickname && " "}
              {settings.customMessage || "comprou"}{" "}
              <span className="text-gray-200">{currentNotification.productName}</span>
            </p>
            <div className="flex items-center space-x-1 mt-1">
              {settings.showProductId && (
                <span className="text-xs text-gray-400 font-mono bg-gray-700/50 px-1.5 py-0.5 rounded text-[10px]">
                  {currentNotification.productId}
                </span>
              )}
              {settings.showPrice && currentNotification.price && currentNotification.price > 0 && (
                <span className="text-xs font-medium text-green-400">
                  R$ {currentNotification.price.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={closeNotification}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        
        {/* Barra de progresso discreta */}
        <div className="mt-2 w-full bg-gray-700/30 rounded-full h-0.5">
          <div className="bg-green-400/60 h-0.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  )
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([])

  const addNotification = (notification: PurchaseNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)])
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    clearNotifications
  }
}

// Função para simular compra (para testes)
export function simulatePurchase(productId: string, productName: string, price?: number) {
  const randomNickname = nicknames.nicknames[Math.floor(Math.random() * nicknames.nicknames.length)]
  
  const purchase: PurchaseNotification = {
    id: `PURCHASE_${Date.now()}`,
    nickname: randomNickname,
    productName,
    productId,
    timestamp: new Date().toISOString(),
    price
  }
  
  // Disparar evento customizado
  window.dispatchEvent(new CustomEvent('purchaseNotification', { detail: purchase }))
  
  return purchase
}
