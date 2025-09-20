"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FooterV2 } from "@/components/footer-v2"
import { ProductTemplate } from "@/components/product-template"
import { ProductFilters } from "@/components/product-filters"
import { DemoBanner } from "@/components/demo-banner"
import { useProducts } from "@/lib/products-context-simple"
import { useCart } from "@/lib/cart-context"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function LancamentosPage() {
  const { products } = useProducts()
  const { addToCart } = useCart()

  // Filtrar produtos marcados como "Novo" ou com label "NEW"
  const lancamentos = products.filter(product => 
    product.isNew === true || 
    product.label === "NEW" || 
    product.labelType === "promocao" ||
    product.categories?.some(cat => cat.toLowerCase().includes("lançamento"))
  )

  // Escutar eventos de produtos criados e carregar automaticamente
  useEffect(() => {
    const handleProductCreated = () => {
      console.log("🔄 Produto criado detectado na página de lançamentos")
      // Forçar atualização do contexto
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
    }

    // Carregar produtos automaticamente quando a página carregar
    const loadProductsOnMount = () => {
      console.log("🔄 Carregando produtos automaticamente na página de lançamentos")
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
    }

    // Carregar imediatamente
    loadProductsOnMount()

    // Carregar quando a página ganhar foco (voltar da admin)
    const handleFocus = () => {
      console.log("🔄 Página em foco - recarregando produtos automaticamente")
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
    }

    window.addEventListener('testProductCreated', handleProductCreated)
    window.addEventListener('focus', handleFocus)
    
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
      
      {/* Espaçamento para mover a faixa mais 2cm para baixo */}
      <div className="h-[180px]"></div>
      
      {/* Faixa de Aviso - Site Demonstrativo (separada do header) */}
      <DemoBanner />
      
      <main className="pt-0">
        <div className="flex min-h-screen">
          {/* Sidebar de Filtros */}
          <div className="w-80 bg-black pt-0 ml-[40px]">
            <ProductFilters category="Lançamentos" subcategory="Novos" />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 bg-black">
            {/* Header da Categoria */}
            <div className="px-8 py-8">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-blue-400" />
                  Lançamentos
                </h1>
                <p className="text-gray-400">Produtos encontrados: {lancamentos.length}</p>
              </div>
            </div>

            {/* Grid de Cards */}
            <div className="py-4 pl-8">
              {lancamentos.length > 0 ? (
                <div className="flex flex-wrap gap-8">
                  {lancamentos.map((product) => (
                    <ProductTemplate
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
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

            {/* Estatísticas */}
            {lancamentos.length > 0 && (
              <div className="px-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">{lancamentos.length}</div>
                    <div className="text-gray-400">Lançamentos</div>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {lancamentos.filter(p => p.isPromotion).length}
                    </div>
                    <div className="text-gray-400">Em Promoção</div>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {lancamentos.filter(p => p.isNew).length}
                    </div>
                    <div className="text-gray-400">Novos</div>
                  </div>
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