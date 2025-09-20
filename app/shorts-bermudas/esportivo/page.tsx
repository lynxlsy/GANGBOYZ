"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function ShortsBermudasEsportivoPage() {
  const config = getCategoryConfig('esportivo')
  
  return <ProductCategoryPage config={config} subcategoryKey="esportivo" />
}
