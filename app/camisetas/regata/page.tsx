"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CamisetasRegataPage() {
  const config = getCategoryConfig('regata')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="regata" />
    </div>
  )
}