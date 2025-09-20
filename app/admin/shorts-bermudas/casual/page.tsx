"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminShortsBermudasCasualPage() {
  const config = getCategoryConfig('casual-short')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="casual-short" />
}
