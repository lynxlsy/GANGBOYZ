"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  color: string
  categories: string[]
  sizes: string[]
  discountPercentage?: number
  installments?: string
  brand?: string
  isNew?: boolean
  isPromotion?: boolean
  description: string
  status: "ativo" | "inativo"
  stock: number
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductsByCategory: (category: string) => Product[]
  getActiveProductsByCategory: (category: string) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])






  // Dados iniciais simplificados
  const initialProducts: Product[] = [
    // CALÇAS
  ]

  // Carregar dados na inicialização
  useEffect(() => {
    setProducts(initialProducts)
    localStorage.setItem("gang-boyz-products", JSON.stringify(initialProducts))
  }, [])

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("gang-boyz-products", JSON.stringify(products))
    }
  }, [products])

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    )
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.categories.some(cat => 
        cat.toLowerCase() === category.toLowerCase() || 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
  }

  const getActiveProductsByCategory = (category: string) => {
    console.log(`🔍 Buscando produtos para categoria "${category}"`)
    console.log("📋 Todos os produtos disponíveis:", products)
    
    const filtered = products.filter(product => 
      product.status === "ativo" &&
      product.categories.some(cat => 
        cat.toLowerCase() === category.toLowerCase() || 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
    
    console.log(`✅ Produtos encontrados para "${category}":`, filtered)
    console.log("🏷️ Categorias dos produtos encontrados:", filtered.map(p => p.categories))
    return filtered
  }

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategory,
      getActiveProductsByCategory
    }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}

