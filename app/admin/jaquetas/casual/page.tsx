"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminJaquetasCasualPage() {
  const config = getCategoryConfig('casual')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="casual" />
}
