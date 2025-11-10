"use client"

import { TestProductID } from "@/components/test-product-id"

export default function TestProductIDPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Teste de Geração Automática de ID de Produto</h1>
        <TestProductID />
      </div>
    </div>
  )
}