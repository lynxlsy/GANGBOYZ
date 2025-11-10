import { CategoryConfig } from "@/lib/category-config"

// Função para gerar configuração de categoria dinâmica
export function generateDynamicCategoryConfig(categoryName: string, categoryKey: string): CategoryConfig {
  return {
    category: categoryName,
    subcategory: categoryName,
    displayName: categoryName,
    breadcrumb: `Início . ${categoryName.toUpperCase()}`,
    description: 'Produtos encontrados',
    adminTitle: `Admin - ${categoryName}`,
    adminDescription: `Gerencie os produtos da categoria ${categoryName}`
  }
}

// Função para gerar o conteúdo da página de categoria dinâmica
export function generateDynamicCategoryPageContent(categoryKey: string): string {
  return `"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { generateDynamicCategoryConfig } from "@/lib/dynamic-category-generator"

export default function DynamicCategoryPage() {
  const config = generateDynamicCategoryConfig('${categoryKey}', '${categoryKey}')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="${categoryKey}" />
    </div>
  )
}
`
}