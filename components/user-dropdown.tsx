"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut, Heart, ShoppingBag } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UserDropdown() {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    try {
      // Remove user data from localStorage
      localStorage.removeItem("gang-boyz-user")
      
      // Reload the page to reset the user context
      window.location.reload()
      
      toast.success("Logout realizado com sucesso!")
      setIsOpen(false)
    } catch (error) {
      toast.error("Erro ao fazer logout")
    }
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do usuário */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-8 w-8 rounded-full border-2 border-white/20"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">{user.name || user.email}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header do usuário */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-12 w-12 rounded-full border-2 border-white/20"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.name || 'Usuário'}</p>
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu de opções */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/favoritos')
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Heart className="h-4 w-4" />
              <span>Meus Favoritos</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                // router.push('/pedidos') // Página de pedidos removida
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Meus Pedidos</span>
            </button>

            <div className="border-t border-white/10 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}