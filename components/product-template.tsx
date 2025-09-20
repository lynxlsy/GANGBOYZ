"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Heart, ShoppingCart } from "lucide-react"
import { Product } from "@/lib/products-context-simple"

interface ProductTemplateProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
  isEditable?: boolean
  onEdit?: (product: Product) => void
}

export function ProductTemplate({ product, onAddToCart, className = "", isEditable = false, onEdit }: ProductTemplateProps) {
  const [showSizes, setShowSizes] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isInCart, setIsInCart] = useState(false)

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
    <div className={`w-[240px] bg-black ${className}`}>
      {/* FOTO - Compacta */}
      <div className="w-[240px] h-[280px] bg-gray-800 flex items-center justify-center overflow-hidden relative group">
        {product.image && product.image !== "/placeholder-default.svg" ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-1">🖼️</div>
            <div className="text-xs font-medium">ADICIONE SUA IMAGEM</div>
            <div className="text-xs">240x280px</div>
          </div>
        )}
        
        {/* Etiqueta */}
        {(product as any).label && (
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white ${
            (product as any).labelType === 'promocao' ? 'bg-red-500' :
            (product as any).labelType === 'esgotado' ? 'bg-gray-600' :
            'bg-blue-500'
          }`}>
            {(product as any).label}
          </div>
        )}
        
        {/* Botões de Ação */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Botão Curtir */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
            }`}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 ${
                isLiked ? 'fill-current' : ''
              }`} 
            />
          </button>
          
          {/* Botão Carrinho */}
          <button
            onClick={() => {
              setIsInCart(!isInCart)
              if (onAddToCart) {
                onAddToCart(product)
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isInCart 
                ? 'bg-green-500 text-white scale-110' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'
            }`}
          >
            <ShoppingCart 
              className={`w-4 h-4 transition-all duration-300 ${
                isInCart ? 'fill-current' : ''
              }`} 
            />
          </button>
        </div>
      </div>
      
      {/* INFORMAÇÕES - Compactas */}
      <div className="p-2 bg-black text-left">
        <h3 className="text-sm font-semibold text-white mb-1 text-left line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2 text-left">
          <span className="text-base font-bold text-white">R$ {formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && product.originalPrice > 0 && (
            <span className="text-xs text-gray-400 line-through">R$ {formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mb-1 text-left">#{product.id}</div>
        <div className="text-xs text-gray-400 mb-1 text-left">Cor: {product.color}</div>
        

        {/* Botão de editar (apenas se for editável) */}
        {isEditable && onEdit && (
          <button
            onClick={() => onEdit(product)}
            className="w-full bg-blue-500 text-white py-1.5 px-3 hover:bg-blue-600 transition-colors font-medium mt-1 text-sm"
          >
            Editar Produto
          </button>
        )}
      </div>
    </div>
  )
}

