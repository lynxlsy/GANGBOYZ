"use client"

import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"
import { useCookieConsent } from "@/hooks/use-cookie-consent"

export function CookieBanner() {
  const { hasConsent, acceptCookies, rejectCookies, isLoading } = useCookieConsent()

  // Não mostrar se ainda está carregando ou se já tem consentimento
  if (isLoading || hasConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/20 z-[100] p-4 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Texto */}
          <div className="flex items-center space-x-3 text-white">
            <Cookie className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm md:text-base">
              Deseja continuar no site? Permita cookies e aprimore sua experiência conosco.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectCookies}
              className="text-black border-white/30 hover:bg-white/10 text-sm px-4 transition-all duration-200"
            >
              Recusar
            </Button>
            
            <Button
              size="sm"
              onClick={acceptCookies}
              className="bg-white text-black hover:bg-gray-200 text-sm px-6 font-semibold transition-all duration-200 hover:scale-105"
            >
              Aceitar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}