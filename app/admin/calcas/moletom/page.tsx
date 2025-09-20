"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminCalcasMoletomPage() {
  const config = getCategoryConfig('moletom')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="moletom" />
}
