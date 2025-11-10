"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MoletonsSemCapuzPage() {
  const config = getCategoryConfig('sem-capuz')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="sem-capuz" />
    </div>
  )
}