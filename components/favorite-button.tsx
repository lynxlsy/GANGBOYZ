"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FavoriteButtonProps {
  productId: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function FavoriteButton({ productId, className = "", size = "md" }: FavoriteButtonProps) {
  const { user, isFavorite, addToFavorites, removeFromFavorites } = useUser()
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const isFav = isFavorite(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.info("Faça login para curtir produtos")
      router.push('/auth/signin')
      return
    }

    setIsAnimating(true)
    
    try {
      if (isFav) {
        removeFromFavorites(productId)
        toast.success("Removido dos favoritos")
      } else {
        addToFavorites(productId)
        toast.success("Adicionado aos favoritos")
      }
    } catch (error) {
      toast.error("Erro ao atualizar favoritos")
    } finally {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  return (
    <button
      onClick={handleClick}
      className={`group transition-all duration-200 ${className}`}
      aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart 
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isFav 
            ? "text-red-500 fill-red-500" 
            : "text-gray-400 group-hover:text-red-500"
        } ${
          isAnimating ? "scale-125" : "scale-100"
        }`}
      />
    </button>
  )
}


