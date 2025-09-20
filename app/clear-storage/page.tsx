"use client"

import { useEffect } from "react"

export default function ClearStoragePage() {
  useEffect(() => {
    // Limpar todo o localStorage
    localStorage.clear()
    
    // Limpar sessionStorage também
    sessionStorage.clear()
    
    console.log("🧹 localStorage e sessionStorage limpos!")
    
    // Redirecionar para a página principal após 2 segundos
    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">🧹 Limpando Cache...</h1>
        <p className="text-gray-400">Redirecionando para a página principal...</p>
      </div>
    </div>
  )
}
