"use client"

import { useState } from "react"
import { AdminProductModal } from "@/components/admin-product-modal"

export function TestRecommendationForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [product, setProduct] = useState<any>(null)

  const handleSave = (product: any) => {
    console.log("Product saved:", product)
    // In a real implementation, you would save this to your data store
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Teste de Formulário de Recomendações</h1>
      <p className="mb-4">Este formulário testa a funcionalidade de adicionar/editar produtos de recomendações com os novos campos.</p>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
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
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Instruções de Teste</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Clique no botão "Adicionar Recomendação" para abrir o modal</li>
          <li>Preencha todos os campos obrigatórios (*)</li>
          <li>Verifique se os campos adicionais aparecem:
            <ul className="list-circle pl-5 mt-1">
              <li>Unidades Disponíveis</li>
              <li>Tamanhos Disponíveis</li>
              <li>Categoria do Produto</li>
              <li>Subcategoria do Produto</li>
            </ul>
          </li>
          <li>Verifique se o preview do card mostra as informações corretamente</li>
          <li>Tente salvar o produto e verifique se a validação funciona</li>
          <li>Verifique se ao selecionar uma categoria, as subcategorias disponíveis são atualizadas</li>
        </ul>
      </div>
    </div>
  )
}