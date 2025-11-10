"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, Clock, Wifi, WifiOff } from "lucide-react"

interface BannerSyncStatusProps {
  className?: string
}

export function BannerSyncStatus({ className = "" }: BannerSyncStatusProps) {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'syncing'>('syncing')
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    // Simular verificação de conexão
    const checkConnection = () => {
      // Verificar se Firebase está disponível
      if (typeof window !== 'undefined') {
        try {
          // Simular verificação de conectividade
          setStatus('connected')
          setLastSync(new Date())
        } catch (error) {
          setStatus('disconnected')
        }
      }
    }

    checkConnection()
    
    // Verificar conexão a cada 30 segundos
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />
      case 'syncing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Sincronizado'
      case 'disconnected':
        return 'Desconectado'
      case 'syncing':
        return 'Sincronizando...'
      default:
        return 'Status desconhecido'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-red-600'
      case 'syncing':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {lastSync && status === 'connected' && (
        <span className="text-xs text-gray-500">
          • {lastSync.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}