"use client"

import { useRouter } from "next/navigation"

interface StandardProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    image: string
    originalPrice?: number
    // Adicionando descrição
    description?: string
    // Adicionando estoque
    stock?: number
  }
  onClick?: () => void
}

export function StandardProductCard({ product, onClick }: StandardProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/produto/${product.id}`)
    }
  }

  // Converter ID para string se for number
  const productId = typeof product.id === 'number' ? product.id.toString() : product.id

  return (
    <div key={productId} className="w-full">
      <div 
        className="bg-black overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation"
        onClick={handleClick}
      >
        {/* Imagem com proporção otimizada para mobile */}
        <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
          <img
            src={product.image || "/placeholder-default.svg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            loading="lazy"
          />
        </div>

        {/* Nome/Código embaixo da imagem - Otimizado para mobile */}
        <div className="text-white p-2 sm:p-3">
          <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 leading-tight">{product.name}</h3>
          {/* Exibir descrição se disponível */}
          {product.description && (
            <p className="text-gray-300 text-xs mb-1 line-clamp-2">{product.description}</p>
          )}
          <div className="red-text font-bold text-sm sm:text-lg md:text-xl mb-1">R$ {product.price.toFixed(2).replace('.', ',')}</div>
          <div className="text-gray-400 text-[10px] sm:text-xs">ID: {productId}</div>
          {product.stock !== undefined && (
            <div className="text-gray-400 text-[10px] sm:text-xs">
              Estoque: {product.stock} unid.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
