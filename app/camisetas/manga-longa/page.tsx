"use client"

import { ProductCategoryPage } from "@/components/product-category-page"
import { getCategoryConfig } from "@/lib/category-config"

export default function CamisetasMangaLongaPage() {
  const config = getCategoryConfig('manga-longa')
  
  return <ProductCategoryPage config={config} subcategoryKey="manga-longa" />
}