"use client"

import { AdminProductCategoryPage } from "@/components/admin-product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function AdminCamisetasMangaLongaPage() {
  const config = getCategoryConfig('manga-longa')
  
  return <AdminProductCategoryPage config={config} subcategoryKey="manga-longa" />
}