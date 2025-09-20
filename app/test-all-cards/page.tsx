"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductCardSimpleWide } from "@/components/product-card-simple-wide"
import { ProductCardSimpleNarrow } from "@/components/product-card-simple-narrow"
import { Product, HotProduct } from "@/lib/demo-products"
import { useCart } from "@/lib/cart-context"

export default function TestAllCardsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const { addItem, openCart } = useCart()

  useEffect(() => {
    // Carregar produtos do localStorage
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    if (savedCategories) {
      const categories = JSON.parse(savedCategories)
      const allProducts = categories.flatMap((category: any) => category.products)
      setProducts(allProducts)
    }

    const savedHotProducts = localStorage.getItem("gang-boyz-hot-products")
    if (savedHotProducts) {
      setHotProducts(JSON.parse(savedHotProducts))
    }
  }, [])

  const handleAddToCart = (product: Product | HotProduct) => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder-default.svg",
    })
    openCart()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comparação dos Três Cards Gang BoyZ
          </h1>
          <p className="text-gray-600 text-lg">
            Visualização lado a lado dos diferentes modelos de cards
          </p>
        </div>

        {/* Card 1 - Card Completo */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Card 1 (Card Completo)
            </h2>
            <p className="text-gray-600">
              Modelo padrão para exibição completa de produtos com todas as informações
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum produto disponível para Card 1</p>
            </div>
          )}
        </section>

        {/* Card 2 - Simples e Largo */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Card 2 (Simples e Largo)
            </h2>
            <p className="text-gray-600">
              Usado exclusivamente para ofertas na homepage - Layout mais largo
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <ProductCardSimpleWide
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum produto disponível para Card 2</p>
            </div>
          )}
        </section>

        {/* Card 3 - Simples e Estreito */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Card 3 (Simples e Estreito)
            </h2>
            <p className="text-gray-600">
              Usado para produtos em destaque - Layout mais estreito e compacto
            </p>
          </div>

          {hotProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {hotProducts.slice(0, 6).map((product) => (
                <ProductCardSimpleNarrow
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum produto disponível para Card 3</p>
            </div>
          )}
        </section>

        {/* Comparação Visual */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comparação Visual dos Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Card 1 (Completo)</h3>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 h-96 flex flex-col justify-center">
                <div className="bg-gray-200 h-48 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 rounded"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/3"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/4"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Altura: ~400px<br/>
                Informações: Completas<br/>
                Uso: Catálogo geral
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Card 2 (Largo)</h3>
              <div className="bg-black border-2 border-gray-300 rounded-lg p-4 h-96 flex flex-col justify-center">
                <div className="bg-gray-600 h-48 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-500 h-4 rounded"></div>
                  <div className="bg-gray-500 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-500 h-3 rounded w-1/2"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Altura: ~350px<br/>
                Informações: Básicas<br/>
                Uso: Ofertas homepage
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Card 3 (Estreito)</h3>
              <div className="bg-black border-2 border-gray-300 rounded-lg p-2 h-96 flex flex-col justify-center">
                <div className="bg-gray-600 h-40 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="bg-gray-500 h-3 rounded"></div>
                  <div className="bg-gray-500 h-3 rounded w-3/4"></div>
                  <div className="bg-gray-500 h-2 rounded w-1/2"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Altura: ~300px<br/>
                Informações: Mínimas<br/>
                Uso: Produtos em destaque
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
