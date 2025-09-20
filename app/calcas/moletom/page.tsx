"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CalcasMoletomPage() {
  const config = getCategoryConfig('moletom')
  
  return <ProductCategoryPage config={config} subcategoryKey="moletom" />
}
