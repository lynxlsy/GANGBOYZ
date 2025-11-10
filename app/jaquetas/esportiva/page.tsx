"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function JaquetasEsportivaPage() {
  const config = getCategoryConfig('esportiva')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="esportiva" />
    </div>
  )
}