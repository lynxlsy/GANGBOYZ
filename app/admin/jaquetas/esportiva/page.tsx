"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminJaquetasEsportivaPage() {
  const config = getCategoryConfig('esportiva')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="esportiva" />
}
