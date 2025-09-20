"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export function HotSection() {
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const { activeTheme } = useTheme()

  // Carregar produtos HOT do localStorage
  useEffect(() => {
    const loadHotProducts = () => {
      const savedProducts = localStorage.getItem("gang-boyz-hot-products")
      if (savedProducts) {
        const products: HotProduct[] = JSON.parse(savedProducts)
        const activeProducts = products.filter(product => product.isActive)
        setHotProducts(activeProducts)
      } else {
        // Não carregar produtos padrão automaticamente
        setHotProducts([])
      }
    }

    // Carregar inicialmente
    loadHotProducts()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-hot-products") {
        loadHotProducts()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadHotProducts()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('hotProductsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('hotProductsUpdated', handleCustomStorageChange)
    }
  }, [])

  return (
    <section className="pt-24 pb-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Título Hot */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PRODUTOS EM DESTAQUE
          </h2>
          <div 
            className="w-32 h-1 mx-auto rounded"
            style={{ backgroundColor: `var(--primary-color)` }}
          ></div>
          <p className="text-neutral-400 mt-4 text-lg">
            Os produtos mais vendidos e em alta
          </p>
        </div>

        {/* Produtos em Destaque */}
        {hotProducts.length > 0 && (
          <div className="py-16">
            <div className="grid grid-cols-6 gap-3 md:gap-4">
              {hotProducts.map((product, index) => (
                <div key={product.id} className="w-full">
                  <img
                    src={product.image || "/placeholder-default.svg"}
                    alt={product.name}
                    className="w-full h-64 md:h-72 object-cover cursor-pointer"
                  />
                  <div className="mt-2 text-white">
                    <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                    <div className="text-red-500 font-bold text-lg md:text-xl">R$ {product.price.toFixed(2)}</div>
                    <div className="text-gray-400 text-xs">ID: {product.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}