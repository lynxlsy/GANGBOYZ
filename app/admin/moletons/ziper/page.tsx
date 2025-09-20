"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminMoletonsZiperPage() {
  const config = getCategoryConfig('ziper')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="ziper" />
}
