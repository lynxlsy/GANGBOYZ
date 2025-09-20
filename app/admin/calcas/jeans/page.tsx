"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminCalcasJeansPage() {
  const config = getCategoryConfig('jeans')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="jeans" />
}
