"use client"

import { Product } from "@/lib/demo-products"

interface ProductCardSimpleWideProps {
  product: Product
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCardSimpleWide({ product, onAddToCart, className = "" }: ProductCardSimpleWideProps) {
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
    <div className={`bg-black text-white cursor-pointer hover:opacity-90 transition-opacity duration-300 w-80 h-[427px] ${className}`}>
      {/* Imagem do produto - Larga */}
      <div className="relative">
        <img
          src={product.image || "/placeholder-default.svg"}
          alt={product.name}
          className="w-full h-64 object-cover"
          onClick={() => onAddToCart?.(product)}
        />
        
        {/* Badge de desconto */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-2 py-1">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="mt-2 p-2 flex-1 flex flex-col">
        {/* Nome do produto */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Preço */}
        <div className="mb-1">
          <div className="flex items-center gap-2">
            <span className="red-text font-bold text-xl">
              R$ {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-sm line-through">
                R$ {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* ID do produto */}
        <div className="text-gray-400 text-sm">
          ID: {product.id}
        </div>
      </div>
    </div>
  )
}
