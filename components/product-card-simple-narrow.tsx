"use client"

import { HotProduct } from "@/lib/demo-products"

interface ProductCardSimpleNarrowProps {
  product: HotProduct
  onAddToCart?: (product: HotProduct) => void
  className?: string
}

export function ProductCardSimpleNarrow({ product, onAddToCart, className = "" }: ProductCardSimpleNarrowProps) {
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  const calculateDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return 0
  }

  const discountPercentage = calculateDiscountPercentage()

  return (
    <div className={`bg-black text-white cursor-pointer hover:opacity-90 transition-opacity duration-300 w-60 h-80 ${className}`}>
      {/* Imagem do produto - Estreita */}
      <div className="relative">
        <img
          src={product.image || "/placeholder-default.svg"}
          alt={product.name}
          className="w-full h-56 object-cover"
          onClick={() => onAddToCart?.(product)}
        />
        
        {/* Badge de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="mt-2 p-1 flex-1 flex flex-col">
        {/* Nome do produto */}
        <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Preço */}
        <div className="mb-1">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-lg md:text-xl">
              R$ {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">
                R$ {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* ID do produto */}
        <div className="text-gray-400 text-xs">
          ID: {product.id}
        </div>
      </div>
    </div>
  )
}
