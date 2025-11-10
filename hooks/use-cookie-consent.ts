"use client"

import { useState, useEffect } from 'react'

export interface CookieConsent {
  status: 'accepted' | 'rejected' | null
  timestamp: string | null
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>({
    status: null,
    timestamp: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Carregar preferências salvas
    const savedConsent = localStorage.getItem('gang-boyz-cookie-consent')
    const savedTimestamp = localStorage.getItem('gang-boyz-cookie-timestamp')


    setConsent({
      status: savedConsent as 'accepted' | 'rejected' | null,
      timestamp: savedTimestamp
    })
    
    setIsLoading(false)
  }, [])

  const acceptCookies = () => {
    if (typeof window === 'undefined') return
    
    const timestamp = new Date().toISOString()
    
    localStorage.setItem('gang-boyz-cookie-consent', 'accepted')
    localStorage.setItem('gang-boyz-cookie-timestamp', timestamp)
    
    setConsent({
      status: 'accepted',
      timestamp
    })

    // Ativar analytics ou outros cookies aqui
    console.log('🍪 Cookies aceitos pelo usuário')
  }

  const rejectCookies = () => {
    if (typeof window === 'undefined') return
    
    const timestamp = new Date().toISOString()
    
    localStorage.setItem('gang-boyz-cookie-consent', 'rejected')
    localStorage.setItem('gang-boyz-cookie-timestamp', timestamp)
    
    setConsent({
      status: 'rejected',
      timestamp
    })

    console.log('🍪 Cookies recusados pelo usuário')
  }

  const resetConsent = () => {
    localStorage.removeItem('gang-boyz-cookie-consent')
    localStorage.removeItem('gang-boyz-cookie-timestamp')
    
    setConsent({
      status: null,
      timestamp: null
    })

    console.log('🍪 Preferências de cookie resetadas')
  }

  const hasConsent = consent.status !== null
  const isAccepted = consent.status === 'accepted'
  const isRejected = consent.status === 'rejected'

  return {
    consent,
    isLoading,
    hasConsent,
    isAccepted,
    isRejected,
    acceptCookies,
    rejectCookies,
    resetConsent
  }
}
