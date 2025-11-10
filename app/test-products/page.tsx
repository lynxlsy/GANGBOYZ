"use client"

import { useCards } from "@/lib/cards-context"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/lib/cart-context"

export default function TestProductsPage() {
  const { cardProducts, getCardProductsByCategory } = useCards()
  const { addItem } = useCart()

  const clearLocalStorage = () => {
    localStorage.removeItem("gang-boyz-card-products")
    window.location.reload()
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  const mangaLongaProducts = getCardProductsByCategory("Manga Longa")
  const mangaCurtaProducts = getCardProductsByCategory("Manga Curta")

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Teste de Produtos</h1>
        <button 
          onClick={clearLocalStorage}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Limpar localStorage e Recarregar
        </button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Total de Produtos: {cardProducts.length}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 p-4 rounded">
              <p><strong>ID:</strong> {product.id}</p>
              <p><strong>Nome:</strong> {product.name}</p>
              <p><strong>Categorias:</strong> {product.categories.join(", ")}</p>
              <p><strong>Preço:</strong> R$ {product.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Manga Longa: {mangaLongaProducts.length}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mangaLongaProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Manga Curta: {mangaCurtaProducts.length}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mangaCurtaProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
