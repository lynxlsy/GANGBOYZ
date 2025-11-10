"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { CardProduct, useCards } from "@/lib/cards-context"
import { useCart } from "@/lib/cart-context"

export function ProductShowcase() {
  const { cardProducts: products } = useCards()
  const { addItem, openCart } = useCart()

  const handleAddToCart = (product: CardProduct) => {
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </section>
  )
}
