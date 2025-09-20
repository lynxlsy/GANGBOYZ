"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Product } from "@/lib/demo-products"
import { useCart } from "@/lib/cart-context"

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem, openCart } = useCart()

  useEffect(() => {
    // Carregar produtos do localStorage
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    if (savedCategories) {
      const categories = JSON.parse(savedCategories)
      const allProducts = categories.flatMap((category: any) => category.products)
      setProducts(allProducts)
    }
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder-default.svg",
    })
    openCart()
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Card 1 (Card Completo) - Produtos
          </h2>
          <p className="text-gray-600 text-lg">
            Modelo padrão do site para exibir roupas
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
