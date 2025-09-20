"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminJaquetasSocialPage() {
  const config = getCategoryConfig('social')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="social" />
}
