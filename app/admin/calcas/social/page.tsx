"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminCalcasSocialPage() {
  const config = getCategoryConfig('social-calca')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="social-calca" />
}
