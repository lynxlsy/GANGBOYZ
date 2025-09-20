"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FooterV2 } from "@/components/footer-v2"
import { ProductTemplate } from "@/components/product-template"
import { ProductFilters } from "@/components/product-filters"
import { DemoBanner } from "@/components/demo-banner"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CategoryConfig } from "@/lib/category-config"

interface ProductCategoryPageProps {
  config: CategoryConfig
  subcategoryKey: string
}

export function ProductCategoryPage({ config, subcategoryKey }: ProductCategoryPageProps) {
  const { products, getActiveProductsByCategory } = useProducts()
  const { addToCart } = useCart()

  const categoryProducts = getActiveProductsByCategory(config.subcategory)

  // Escutar eventos de produtos criados e carregar automaticamente
  useEffect(() => {
    const handleProductCreated = () => {
      console.log("🔄 Produto criado detectado na página padrão")
      // Forçar atualização do contexto
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
    }

    // Carregar produtos automaticamente quando a página carregar
    const loadProductsOnMount = () => {
      console.log("🔄 Carregando produtos automaticamente na página padrão")
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
    }

    // Carregar produtos quando a página ganhar foco
    const handleFocus = () => {
      console.log("🔄 Página ganhou foco, recarregando produtos")
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
    }

    // Event listeners
    window.addEventListener('testProductCreated', handleProductCreated)
    window.addEventListener('focus', handleFocus)
    
    // Carregar produtos no mount
    loadProductsOnMount()

    // Cleanup
    return () => {
      window.removeEventListener('testProductCreated', handleProductCreated)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Espaçamento para o header */}
      <div className="h-[180px]"></div>
      
      {/* Faixa de Aviso */}
      <DemoBanner />
      
      <main className="pt-0">
        <div className="flex">
          {/* Sidebar de Filtros */}
          <div className="w-80 bg-black pt-0 ml-[40px]">
            <ProductFilters category={config.category} subcategory={config.subcategory} />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 py-4 pl-8">
            {/* Header da Categoria */}
            <div className="px-8 py-8">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white">{config.displayName}</h1>
                <p className="text-gray-400">{config.description}: {categoryProducts.length}</p>
              </div>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-8">
              {categoryProducts.map((product) => (
                <ProductTemplate
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Mensagem quando não há produtos */}
            {categoryProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-lg">
                  Nenhum produto encontrado nesta categoria.
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  Os produtos aparecerão aqui quando forem adicionados.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <FooterV2 />
    </div>
  )
}
