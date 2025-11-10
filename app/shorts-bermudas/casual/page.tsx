"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function ShortsBermudasCasualPage() {
  const config = getCategoryConfig('casual-short')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="casual-short" />
    </div>
  )
}