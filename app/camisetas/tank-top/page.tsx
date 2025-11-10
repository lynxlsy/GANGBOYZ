"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CamisetasTankTopPage() {
  const config = getCategoryConfig('tank-top')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="tank-top" />
    </div>
  )
}