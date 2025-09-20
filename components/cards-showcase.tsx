"use client"

import { ProductTemplate } from "@/components/product-template"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"

export function CardsShowcase() {
  const { products } = useProducts()
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Cards de Produtos
          </h2>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {products.map((product) => (
            <ProductTemplate
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Estatísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">{products.length}</div>
            <div className="text-gray-400">Produtos Disponíveis</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {products.filter(p => p.isPromotion).length}
            </div>
            <div className="text-gray-400">Em Promoção</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {products.filter(p => p.isNew).length}
            </div>
            <div className="text-gray-400">Lançamentos</div>
          </div>
        </div>
      </div>
    </section>
  )
}
