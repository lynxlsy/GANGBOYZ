"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CardProduct {
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
}

interface CardsContextType {
  cardProducts: CardProduct[]
  addCardProduct: (product: CardProduct) => void
  updateCardProduct: (id: string, product: Partial<CardProduct>) => void
  deleteCardProduct: (id: string) => void
  getCardProductsByCategory: (category: string) => CardProduct[]
}

const CardsContext = createContext<CardsContextType | undefined>(undefined)

export function CardsProvider({ children }: { children: ReactNode }) {
  const [cardProducts, setCardProducts] = useState<CardProduct[]>([])

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedProducts = localStorage.getItem("gang-boyz-card-products")
    if (savedProducts) {
      setCardProducts(JSON.parse(savedProducts))
    } else {
      // Dados iniciais de demonstração
      const initialProducts: CardProduct[] = [
        {
          id: "CARD001",
          name: "Camiseta Oversized Gang Boyz",
          price: 89.90,
          originalPrice: 129.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Camisetas"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 22,
          installments: "3x de R$ 29.97",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: true
        },
        {
          id: "CARD002",
          name: "Moletom Hoodie Premium",
          price: 199.90,
          originalPrice: 279.90,
          image: "/placeholder-default.svg",
          color: "Cinza",
          categories: ["Moletons"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 25,
          installments: "6x de R$ 33.32",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD003",
          name: "Jaqueta Oversized Street",
          price: 299.90,
          originalPrice: 399.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Jaquetas"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 25,
          installments: "8x de R$ 37.49",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: true
        },
        {
          id: "CARD004",
          name: "Calça Cargo Oversized",
          price: 179.90,
          originalPrice: 229.90,
          image: "/placeholder-default.svg",
          color: "Bege",
          categories: ["Calças"],
          sizes: ["38", "40", "42", "44"],
          discountPercentage: 22,
          installments: "5x de R$ 35.98",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD005",
          name: "Short Cargo Street",
          price: 129.90,
          originalPrice: 179.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Shorts/Bermudas"],
          sizes: ["38", "40", "42", "44"],
          discountPercentage: 28,
          installments: "4x de R$ 32.48",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: true
        },

        // MANGAS LONGAS
        {
          id: "CARD006",
          name: "Camiseta Manga Longa Estampada",
          price: 109.90,
          originalPrice: 149.90,
          image: "/placeholder-default.svg",
          color: "Branco",
          categories: ["Camisetas", "Manga Longa"],
          sizes: ["M", "G"],
          discountPercentage: 27,
          installments: "3x de R$ 36.63",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD007",
          name: "Camiseta Manga Longa Oversized",
          price: 129.90,
          originalPrice: 179.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Camisetas", "Manga Longa"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 28,
          installments: "4x de R$ 32.48",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: true
        },
        {
          id: "CARD008",
          name: "Camiseta Manga Longa Street Style",
          price: 99.90,
          originalPrice: 139.90,
          image: "/placeholder-default.svg",
          color: "Cinza",
          categories: ["Camisetas", "Manga Longa"],
          sizes: ["M", "G"],
          discountPercentage: 29,
          installments: "3x de R$ 33.30",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: false
        },

        // MANGAS CURTAS
        {
          id: "CARD009",
          name: "Camiseta Manga Curta Estampada",
          price: 79.90,
          originalPrice: 109.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Camisetas", "Manga Curta"],
          sizes: ["P", "M", "G"],
          discountPercentage: 27,
          installments: "2x de R$ 39.95",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD010",
          name: "Camiseta Dani Teans",
          price: 89.90,
          originalPrice: 119.90,
          image: "/placeholder-default.svg",
          color: "Azul Marinho",
          categories: ["Camisetas", "Manga Curta"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 25,
          installments: "3x de R$ 29.97",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: true
        },
        {
          id: "CARD011",
          name: "Camiseta Manga Curta Vintage",
          price: 69.90,
          originalPrice: 99.90,
          image: "/placeholder-default.svg",
          color: "Verde Militar",
          categories: ["Camisetas", "Manga Curta"],
          sizes: ["M", "G"],
          discountPercentage: 30,
          installments: "2x de R$ 34.95",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: false
        },

        // REGATAS
        {
          id: "CARD012",
          name: "Camiseta Regata Esportiva",
          price: 59.90,
          originalPrice: 79.90,
          image: "/placeholder-default.svg",
          color: "Azul",
          categories: ["Camisetas", "Regata"],
          sizes: ["P", "M", "G"],
          discountPercentage: 25,
          installments: "2x de R$ 29.95",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: false
        },
        {
          id: "CARD013",
          name: "Regata Muscle Fit",
          price: 79.90,
          originalPrice: 109.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Camisetas", "Regata"],
          sizes: ["M", "G", "GG"],
          discountPercentage: 27,
          installments: "2x de R$ 39.95",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD014",
          name: "Regata Summer Vibes",
          price: 65.90,
          originalPrice: 89.90,
          image: "/placeholder-default.svg",
          color: "Branco",
          categories: ["Camisetas", "Regata"],
          sizes: ["P", "M", "G"],
          discountPercentage: 27,
          installments: "2x de R$ 32.95",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: false
        },

        // TANK TOPS
        {
          id: "CARD015",
          name: "Camiseta Tank Top Fitness",
          price: 69.90,
          originalPrice: 89.90,
          image: "/placeholder-default.svg",
          color: "Vermelho",
          categories: ["Camisetas", "Tank Top"],
          sizes: ["M", "G"],
          discountPercentage: 22,
          installments: "2x de R$ 34.95",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: false
        },
        {
          id: "CARD016",
          name: "Tank Top Gym Beast",
          price: 89.90,
          originalPrice: 119.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Camisetas", "Tank Top"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 25,
          installments: "3x de R$ 29.97",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD017",
          name: "Tank Top Summer Edition",
          price: 75.90,
          originalPrice: 99.90,
          image: "/placeholder-default.svg",
          color: "Azul Claro",
          categories: ["Camisetas", "Tank Top"],
          sizes: ["M", "G"],
          discountPercentage: 24,
          installments: "2x de R$ 37.95",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: false
        },

        // POLOS
        {
          id: "CARD018",
          name: "Camiseta Polo Clássica",
          price: 119.90,
          originalPrice: 159.90,
          image: "/placeholder-default.svg",
          color: "Verde",
          categories: ["Camisetas", "Polo"],
          sizes: ["M", "G", "GG"],
          discountPercentage: 25,
          installments: "4x de R$ 29.97",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD019",
          name: "Polo Premium Cotton",
          price: 149.90,
          originalPrice: 199.90,
          image: "/placeholder-default.svg",
          color: "Branco",
          categories: ["Camisetas", "Polo"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 25,
          installments: "5x de R$ 29.98",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: true
        },
        {
          id: "CARD020",
          name: "Polo Business Style",
          price: 129.90,
          originalPrice: 179.90,
          image: "/placeholder-default.svg",
          color: "Azul Marinho",
          categories: ["Camisetas", "Polo"],
          sizes: ["M", "G"],
          discountPercentage: 28,
          installments: "4x de R$ 32.48",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: false
        },

        // BÁSICAS
        {
          id: "CARD021",
          name: "Camiseta Básica Algodão",
          price: 49.90,
          originalPrice: 69.90,
          image: "/placeholder-default.svg",
          color: "Branco",
          categories: ["Camisetas", "Básica"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 29,
          installments: "1x de R$ 49.90",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: false
        },
        {
          id: "CARD022",
          name: "Camiseta Básica Essential",
          price: 59.90,
          originalPrice: 79.90,
          image: "/placeholder-default.svg",
          color: "Preto",
          categories: ["Camisetas", "Básica"],
          sizes: ["P", "M", "G", "GG"],
          discountPercentage: 25,
          installments: "2x de R$ 29.95",
          brand: "Gang Boyz",
          isNew: false,
          isPromotion: true
        },
        {
          id: "CARD023",
          name: "Camiseta Básica Comfort",
          price: 45.90,
          originalPrice: 65.90,
          image: "/placeholder-default.svg",
          color: "Cinza",
          categories: ["Camisetas", "Básica"],
          sizes: ["P", "M", "G"],
          discountPercentage: 30,
          installments: "1x de R$ 45.90",
          brand: "Gang Boyz",
          isNew: true,
          isPromotion: false
        }
      ]
      
      setCardProducts(initialProducts)
      localStorage.setItem("gang-boyz-card-products", JSON.stringify(initialProducts))
    }
  }, [])

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    localStorage.setItem("gang-boyz-card-products", JSON.stringify(cardProducts))
  }, [cardProducts])

  const addCardProduct = (product: CardProduct) => {
    setCardProducts(prev => [...prev, product])
  }

  const updateCardProduct = (id: string, updates: Partial<CardProduct>) => {
    setCardProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    )
  }

  const deleteCardProduct = (id: string) => {
    setCardProducts(prev => prev.filter(product => product.id !== id))
  }

  const getCardProductsByCategory = (category: string) => {
    return cardProducts.filter(product => 
      product.categories.some(cat => 
        cat.toLowerCase() === category.toLowerCase() || 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
  }

  return (
    <CardsContext.Provider value={{
      cardProducts,
      addCardProduct,
      updateCardProduct,
      deleteCardProduct,
      getCardProductsByCategory
    }}>
      {children}
    </CardsContext.Provider>
  )
}

export function useCards() {
  const context = useContext(CardsContext)
  if (context === undefined) {
    throw new Error("useCards must be used within a CardsProvider")
  }
  return context
}
