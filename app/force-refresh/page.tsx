"use client"

import { useEffect } from "react"

export default function ForceRefreshPage() {
  useEffect(() => {
    // Limpar TUDO
    localStorage.clear()
    sessionStorage.clear()
    
    // Limpar cache do navegador se possível
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    // Adicionar timestamp para quebrar cache
    const timestamp = Date.now()
    
    // Redirecionar para a página principal com timestamp
    setTimeout(() => {
      window.location.href = `/?v=${timestamp}&nocache=true`
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🔄 Forçando Refresh...</h1>
        <p className="text-gray-400 mb-2">Limpando cache do navegador...</p>
        <p className="text-gray-500 text-sm">Redirecionando em 1 segundo...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
