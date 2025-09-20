"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function JaquetasCasualPage() {
  const config = getCategoryConfig('casual')
  
  return <ProductCategoryPage config={config} subcategoryKey="casual" />
}
