"use client"

import { usePathname } from "next/navigation"

export function useProductPage() {
  const pathname = usePathname()
  
  // Páginas que têm sidebar de produtos
  const productPages = [
    '/camisetas',
    '/moletons', 
    '/jaquetas',
    '/calcas',
    '/shorts-bermudas',
    '/lancamentos',
    '/em-alta'
  ]
  
  const isProductPage = productPages.some(page => pathname.startsWith(page))
  
  return { isProductPage, pathname }
}






