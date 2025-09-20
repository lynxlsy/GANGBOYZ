"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminShortsBermudasEsportivoPage() {
  const config = getCategoryConfig('esportivo')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="esportivo" />
}
