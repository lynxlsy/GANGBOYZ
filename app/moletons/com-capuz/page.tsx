"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MoletonsComCapuzPage() {
  const config = getCategoryConfig('com-capuz')
  
  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey="com-capuz" />
    </div>
  )
}