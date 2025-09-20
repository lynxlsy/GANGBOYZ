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

  // Dados iniciais de demonstração baseados nos produtos do admin
  const initialProducts: Product[] = [
        // MOLETONS
        {
          id: "MO001",
          name: "Moletom Gang BoyZ Classic",
          price: 89.90,
          originalPrice: 129.90,
          image: "/placeholder-moletom.jpg",
          color: "Preto",
          categories: ["Moletons"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 31,
          installments: "3x de R$ 29.97",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Moletom clássico com logo Gang BoyZ bordado",
          status: "ativo",
          stock: 15
        },
        {
          id: "MO002",
          name: "Moletom Oversized Black",
          price: 99.90,
          originalPrice: 149.90,
          image: "/placeholder-moletom.jpg",
          color: "Preto",
          categories: ["Moletons"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 33,
          installments: "3x de R$ 33.30",
          brand: "Gang BoyZ",
          isNew: true,
          isPromotion: true,
          description: "Moletom oversized preto com corte moderno",
          status: "ativo",
          stock: 8
        },
        {
          id: "MO003",
          name: "Moletom Hoodie Red",
          price: 109.90,
          originalPrice: 159.90,
          image: "/placeholder-moletom.jpg",
          color: "Vermelho",
          categories: ["Moletons"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 31,
          installments: "4x de R$ 27.48",
          brand: "Gang BoyZ",
          isNew: true,
          isPromotion: true,
          description: "Moletom com capuz vermelho e bolsos",
          status: "ativo",
          stock: 12
        },

        // CAMISETAS MANGA LONGA
        {
          id: "CL001",
          name: "Camiseta Manga Longa Gang BoyZ Black",
          price: 59.90,
          originalPrice: 89.90,
          image: "/placeholder-camiseta.jpg",
          color: "Preto",
          categories: ["Camisetas", "Manga Longa"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 33,
          installments: "2x de R$ 29.95",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Camiseta manga longa preta com logo Gang BoyZ bordado",
          status: "ativo",
          stock: 12
        },
        {
          id: "CL002",
          name: "Camiseta Manga Longa Oversized White",
          price: 64.90,
          originalPrice: 94.90,
          image: "/placeholder-camiseta.jpg",
          color: "Branco",
          categories: ["Camisetas", "Manga Longa"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 32,
          installments: "2x de R$ 32.45",
          brand: "Gang BoyZ",
          isNew: true,
          isPromotion: true,
          description: "Camiseta manga longa oversized branca com corte moderno",
          status: "ativo",
          stock: 8
        },


        // REGATAS
        {
          id: "RG001",
          name: "Regata Gang BoyZ Classic Black",
          price: 39.90,
          originalPrice: 59.90,
          image: "/placeholder-camiseta.jpg",
          color: "Preto",
          categories: ["Camisetas", "Regata"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 33,
          installments: "1x de R$ 39.90",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Regata preta com logo Gang BoyZ estampado",
          status: "ativo",
          stock: 18
        },

        // CALÇAS
        {
          id: "CA002",
          name: "Calça Cargo Black",
          price: 79.90,
          originalPrice: 119.90,
          image: "/placeholder-calca.jpg",
          color: "Preto",
          categories: ["Calças"],
          sizes: ["38", "40", "42", "44"],
          discountPercentage: 33,
          installments: "3x de R$ 26.63",
          brand: "Gang BoyZ",
          isNew: true,
          isPromotion: true,
          description: "Calça cargo preta com bolsos laterais",
          status: "ativo",
          stock: 8
        },

        // SHORTS/BERMUDAS
        {
          id: "SH001",
          name: "Short Gang BoyZ Classic",
          price: 59.90,
          originalPrice: 89.90,
          image: "/placeholder-short.jpg",
          color: "Preto",
          categories: ["Shorts/Bermudas"],
          sizes: ["38", "40", "42", "44"],
          discountPercentage: 33,
          installments: "2x de R$ 29.95",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Short clássico com logo Gang BoyZ bordado",
          status: "ativo",
          stock: 20
        },
        {
          id: "SH002",
          name: "Bermuda Cargo Black",
          price: 69.90,
          originalPrice: 99.90,
          image: "/placeholder-short.jpg",
          color: "Preto",
          categories: ["Shorts/Bermudas"],
          sizes: ["38", "40", "42", "44"],
          discountPercentage: 30,
          installments: "2x de R$ 34.95",
          brand: "Gang BoyZ",
          isNew: true,
          isPromotion: true,
          description: "Bermuda cargo preta com bolsos laterais",
          status: "ativo",
          stock: 15
        }
      ]
  
  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedProducts = localStorage.getItem("gang-boyz-products")
    
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } catch (error) {
        console.error("Error parsing products from localStorage:", error)
        setProducts(initialProducts)
        localStorage.setItem("gang-boyz-products", JSON.stringify(initialProducts))
      }
    } else {
      setProducts(initialProducts)
      localStorage.setItem("gang-boyz-products", JSON.stringify(initialProducts))
    }
  }, [])

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    localStorage.setItem("gang-boyz-products", JSON.stringify(products))
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
    return products.filter(product => 
      product.status === "ativo" &&
      product.categories.some(cat => 
        cat.toLowerCase() === category.toLowerCase() || 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
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
