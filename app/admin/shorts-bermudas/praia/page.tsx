"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminShortsBermudasPraiaPage() {
  const config = getCategoryConfig('praia')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="praia" />
}
