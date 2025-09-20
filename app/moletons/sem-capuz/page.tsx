"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MoletonsSemCapuzPage() {
  const config = getCategoryConfig('sem-capuz')
  
  return <ProductCategoryPage config={config} subcategoryKey="sem-capuz" />
}
