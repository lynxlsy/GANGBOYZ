"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, Heart, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
    )
  }

  if (session) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
        >
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">{session.user?.name}</p>
                  <p className="text-gray-400 text-sm">{session.user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Link
                href="/profile"
                className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <User className="h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
              
              <Link
                href="/favorites"
                className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Favoritos</span>
              </Link>
              
              <Link
                href="/orders"
                className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Meus Pedidos</span>
              </Link>
              
              <Link
                href="/settings"
                className="flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>
              
              <div className="border-t border-white/10 my-2"></div>
              
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                  setShowDropdown(false)
                }}
                className="flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors w-full"
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

  return (
    <div className="flex items-center space-x-3">
      <Button
        onClick={() => router.push('/auth/signin')}
        variant="outline"
        className="bg-transparent border-white/20 text-white hover:bg-white/10 cursor-pointer"
      >
        Entrar
      </Button>
      <Button
        onClick={() => router.push('/auth/signup')}
        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
      >
        Criar Conta
      </Button>
    </div>
  )
}

