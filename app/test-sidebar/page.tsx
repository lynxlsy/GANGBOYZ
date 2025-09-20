"use client"

import { ProductFilters } from "@/components/product-filters"

export default function TestSidebarPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <ProductFilters category="Camisetas" subcategory="Mangas Curtas" />
        <div className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-white mb-8">Teste da Sidebar</h1>
          <p className="text-gray-400">Se você está vendo isso, a sidebar deve estar funcionando!</p>
        </div>
      </div>
    </div>
  )
}






