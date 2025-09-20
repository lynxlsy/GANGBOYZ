"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function MoletonsComCapuzPage() {
  const config = getCategoryConfig('com-capuz')
  
  return <ProductCategoryPage config={config} subcategoryKey="com-capuz" />
}
