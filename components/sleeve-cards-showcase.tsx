"use client"

import { UnifiedSleeveCard } from "@/components/unified-sleeve-card"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"

export function SleeveCardsShowcase() {
  const { products } = useProducts()
  const { addItem } = useCart()

  // Filter products to only show sleeve-related items (regata, manga curta, manga longa)
  const sleeveProducts = products.filter(product => {
    const name = product.name.toLowerCase()
    const categories = product.categories.map(cat => cat.toLowerCase())
    
    return (
      name.includes("regata") || 
      name.includes("manga curta") || 
      name.includes("manga longa") ||
      categories.some(cat => 
        cat.includes("regata") || 
        cat.includes("manga curta") || 
        cat.includes("manga longa")
      )
    )
  })

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  if (sleeveProducts.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Camisetas por Tipo de Manga</h2>
            <p className="text-gray-400">Nenhum produto encontrado</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Camisetas por Tipo de Manga
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore nossa coleção de camisetas organizadas por tipo de manga
          </p>
        </div>

        {/* Grid de Cards Unificados */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {sleeveProducts.map((product) => (
            <UnifiedSleeveCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Estatísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {sleeveProducts.filter(p => p.categories.some(c => c.toLowerCase().includes("regata"))).length}
            </div>
            <div className="text-gray-400">Regatas</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {sleeveProducts.filter(p => p.categories.some(c => c.toLowerCase().includes("manga curta"))).length}
            </div>
            <div className="text-gray-400">Manga Curta</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {sleeveProducts.filter(p => p.categories.some(c => c.toLowerCase().includes("manga longa"))).length}
            </div>
            <div className="text-gray-400">Manga Longa</div>
          </div>
        </div>
      </div>
    </section>
  )
}