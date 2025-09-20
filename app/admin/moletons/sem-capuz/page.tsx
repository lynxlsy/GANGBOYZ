"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminMoletonsSemCapuzPage() {
  const config = getCategoryConfig('sem-capuz')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="sem-capuz" />
}
