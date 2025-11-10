"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { CardProduct } from "@/lib/cards-context"

interface ProductCardProps {
  product: CardProduct
  onAddToCart?: (product: CardProduct) => void
  className?: string
}

export function ProductCard({ product, onAddToCart, className = "" }: ProductCardProps) {
  const [showSizes, setShowSizes] = useState(false)

  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  const calculateDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return product.discountPercentage || 0
  }

  const discountPercentage = calculateDiscountPercentage()

  return (
    <div className={`bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-80 h-[427px] ${className}`}>
      {/* Foto grande do produto */}
      <div className="relative">
        <img
          src={product.image || "/placeholder-default.svg"}
          alt={product.name}
          className="w-full h-64 object-cover"
          style={{ borderRadius: 0 }} // Sem bordas arredondadas conforme especificado
        />
        
        {/* Badge de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-2 py-1">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Badge de estoque esgotado */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-gray-600 text-white text-sm font-bold px-2 py-1">
            ESGOTADO
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Nome do produto */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Preço */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              R$ {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                R$ {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* ID do produto */}
        <div className="text-xs text-gray-400 mb-3">
          #{product.id}
        </div>

        {/* Tamanhos disponíveis */}
        <div className="mb-3">
          <button
            onClick={() => setShowSizes(!showSizes)}
            className="flex items-center justify-between w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>Tamanhos disponíveis</span>
            {showSizes ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {showSizes && (
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                // Verificar estoque para este tamanho, se disponível
                const sizeStock = product.sizeStock?.[size]
                const isAvailable = sizeStock === undefined || sizeStock > 0
                
                return (
                  <span
                    key={size}
                    className={`px-2 py-1 text-xs border ${
                      isAvailable
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size}
                    {sizeStock !== undefined && (
                      <span className="ml-1">({sizeStock})</span>
                    )}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Cor */}
        <div className="mb-3">
          <span className="text-sm text-gray-600">Cor: </span>
          <span className="text-sm font-medium text-gray-900">{product.color}</span>
        </div>

        {/* Categorias */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">Categorias: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {product.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Botão de adicionar ao carrinho */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-2 px-4 transition-colors font-medium mt-auto ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {product.stock === 0 ? 'Esgotado' : 'Compre agora'}
          </button>
        )}
      </div>
    </div>
  )
}