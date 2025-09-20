"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MoletonsZiperPage() {
  const config = getCategoryConfig('ziper')
  
  return <ProductCategoryPage config={config} subcategoryKey="ziper" />
}
