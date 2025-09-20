"use client"

interface StandardProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    originalPrice?: number
  }
  onClick?: () => void
}

export function StandardProductCard({ product, onClick }: StandardProductCardProps) {
  return (
    <div key={product.id} className="w-full">
      <img
        src={product.image || "/placeholder-default.svg"}
        alt={product.name}
        className="w-full h-64 md:h-72 object-cover cursor-pointer"
        onClick={onClick}
      />
      <div className="mt-2 text-white">
        <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
        <div className="text-red-500 font-bold text-lg md:text-xl">R$ {product.price.toFixed(2)}</div>
        <div className="text-gray-400 text-xs">ID: {product.id}</div>
      </div>
    </div>
  )
}
