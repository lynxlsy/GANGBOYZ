"use client"

import { useState } from "react"
import { AdminProductModal } from "@/components/admin-product-modal"

export function TestRecommendations() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [product, setProduct] = useState<any>(null)

  const handleSave = (product: any) => {
    console.log("Product saved:", product)
    // In a real implementation, you would save this to your data store
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Recomendações</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Adicionar Recomendação
      </button>

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onSave={handleSave}
        title="Recomendações"
        subcategory="recomendacoes"
        mode="create"
      />
    </div>
  )
}