"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function JaquetasSocialPage() {
  const config = getCategoryConfig('social')
  
  return <ProductCategoryPage config={config} subcategoryKey="social" />
}
