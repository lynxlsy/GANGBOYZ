"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function ShortsBermudasPraiaPage() {
  const config = getCategoryConfig('praia')
  
  return <ProductCategoryPage config={config} subcategoryKey="praia" />
}
