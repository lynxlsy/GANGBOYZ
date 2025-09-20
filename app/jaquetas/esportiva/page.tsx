"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function JaquetasEsportivaPage() {
  const config = getCategoryConfig('esportiva')
  
  return <ProductCategoryPage config={config} subcategoryKey="esportiva" />
}
