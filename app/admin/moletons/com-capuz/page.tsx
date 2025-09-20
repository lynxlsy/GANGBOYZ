"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminMoletonsComCapuzPage() {
  const config = getCategoryConfig('com-capuz')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="com-capuz" />
}
