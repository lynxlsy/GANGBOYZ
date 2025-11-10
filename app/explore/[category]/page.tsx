"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { generateDynamicCategoryConfig } from "@/lib/dynamic-category-generator"
import { useMemo } from "react"

export default function DynamicExploreCategoryPage({ params }: { params: { category: string } }) {
  // Generate dynamic config for this category
  const config = useMemo(() => {
    const categoryName = params.category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
    
    return generateDynamicCategoryConfig(categoryName, params.category)
  }, [params.category])

  return (
    <div className="min-h-screen bg-black text-white">
      <ProductCategoryPage config={config} subcategoryKey={params.category} />
    </div>
  )
}
