"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CalcasJeansPage() {
  const config = getCategoryConfig('jeans')
  
  return <ProductCategoryPage config={config} subcategoryKey="jeans" />
}
