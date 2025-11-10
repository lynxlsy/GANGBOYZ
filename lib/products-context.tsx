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
  createdAt?: any
  updatedAt?: any
  // Added new fields for recommendations
  availableUnits?: number
  availableSizes?: string[]
  recommendationCategory?: string
  // Added missing shipping information fields
  freeShippingText?: string
  freeShippingThreshold?: string
  pickupText?: string
  pickupStatus?: string
  // Added technical information fields
  weight?: string
  dimensions?: string
  material?: string
  care?: string
  origin?: string
  warranty?: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProductsByCategory: (category: string) => Product[]
  getActiveProductsByCategory: (category: string) => Product[]
  loading: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Dados iniciais de demonstração baseados nos produtos do admin
  const initialProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
        // MOLETONS
        {
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
        },

        // CAMISETAS BÁSICAS
        {
          name: "Camiseta Básica Gang BoyZ Black",
          price: 39.90,
          originalPrice: 59.90,
          image: "/placeholder-camiseta.jpg",
          color: "Preto",
          categories: ["Camisetas", "Básica"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 33,
          installments: "1x de R$ 39.90",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Camiseta básica preta 100% algodão",
          status: "ativo",
          stock: 25
        },
        {
          name: "Camiseta Básica White",
          price: 39.90,
          originalPrice: 59.90,
          image: "/placeholder-camiseta.jpg",
          color: "Branco",
          categories: ["Camisetas", "Básica"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 33,
          installments: "1x de R$ 39.90",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Camiseta básica branca 100% algodão",
          status: "ativo",
          stock: 22
        },

        // CAMISETAS MANGA CURTA
        {
          name: "Camiseta Manga Curta Gang BoyZ Classic",
          price: 49.90,
          originalPrice: 79.90,
          image: "/placeholder-camiseta.jpg",
          color: "Preto",
          categories: ["Camisetas", "Manga Curta"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 38,
          installments: "1x de R$ 49.90",
          brand: "Gang BoyZ",
          isNew: false,
          isPromotion: true,
          description: "Camiseta manga curta preta com logo Gang BoyZ estampado",
          status: "ativo",
          stock: 30
        },
        {
          name: "Camiseta Manga Curta Oversized",
          price: 54.90,
          originalPrice: 84.90,
          image: "/placeholder-camiseta.jpg",
          color: "Branco",
          categories: ["Camisetas", "Manga Curta"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 35,
          installments: "2x de R$ 27.45",
          brand: "Gang BoyZ",
          isNew: true,
          isPromotion: true,
          description: "Camiseta manga curta oversized com corte moderno",
          status: "ativo",
          stock: 18
        }
  ]

  useEffect(() => {
    // Carregar produtos do localStorage
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("gang-boyz-products")
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts))
        } else {
          // Usar produtos iniciais se não houver no localStorage
          const productsWithIds = initialProducts.map((product, index) => ({
            ...product,
            id: `prod-${Date.now()}-${index}`,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
          setProducts(productsWithIds)
          localStorage.setItem("gang-boyz-products", JSON.stringify(productsWithIds))
        }
        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct: Product = {
        ...product,
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      localStorage.setItem("gang-boyz-products", JSON.stringify(updatedProducts))
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      throw error
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const updatedProducts = products.map(p => 
        p.id === id 
          ? { 
              ...p, 
              ...product, 
              updatedAt: new Date(),
              id: p.id // Preservar o ID original
            } 
          : p
      )
      
      setProducts(updatedProducts)
      localStorage.setItem("gang-boyz-products", JSON.stringify(updatedProducts))
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const updatedProducts = products.filter(p => p.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem("gang-boyz-products", JSON.stringify(updatedProducts))
    } catch (error) {
      console.error("Erro ao deletar produto:", error)
      throw error
    }
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.categories.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
  }

  const getActiveProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.status === "ativo" && 
      product.categories.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByCategory,
        getActiveProductsByCategory,
        loading
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}