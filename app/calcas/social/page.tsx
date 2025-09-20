"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CalcasSocialPage() {
  const config = getCategoryConfig('social-calca')
  
  return <ProductCategoryPage config={config} subcategoryKey="social-calca" />
}
