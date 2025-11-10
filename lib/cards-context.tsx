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
  createdAt?: any
  updatedAt?: any
  // Adicionando campos de estoque
  stock?: number
  sizeStock?: Record<string, number>
}

interface CardsContextType {
  cardProducts: CardProduct[]
  addCardProduct: (product: Omit<CardProduct, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateCardProduct: (id: string, product: Partial<CardProduct>) => Promise<void>
  deleteCardProduct: (id: string) => Promise<void>
  getCardProductsByCategory: (category: string) => CardProduct[]
  loading: boolean
}

const CardsContext = createContext<CardsContextType | undefined>(undefined)

export function CardsProvider({ children }: { children: ReactNode }) {
  const [cardProducts, setCardProducts] = useState<CardProduct[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar produtos do localStorage
  useEffect(() => {
    const loadCardProducts = () => {
      try {
        const savedProducts = localStorage.getItem("gang-boyz-card-products")
        if (savedProducts) {
          setCardProducts(JSON.parse(savedProducts))
        } else {
          // Inicializar com array vazio se não houver produtos
          setCardProducts([])
          localStorage.setItem("gang-boyz-card-products", JSON.stringify([]))
        }
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar card products:', error)
        setLoading(false)
      }
    }

    loadCardProducts()
  }, [])

  const addCardProduct = async (product: Omit<CardProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct: CardProduct = {
        ...product,
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const updatedProducts = [...cardProducts, newProduct]
      setCardProducts(updatedProducts)
      localStorage.setItem("gang-boyz-card-products", JSON.stringify(updatedProducts))
    } catch (error) {
      console.error('Erro ao adicionar card product:', error)
      throw error
    }
  }

  const updateCardProduct = async (id: string, updates: Partial<CardProduct>) => {
    try {
      const updatedProducts = cardProducts.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...updates, 
              updatedAt: new Date(),
              id: product.id // Preservar o ID original
            } 
          : product
      )
      
      setCardProducts(updatedProducts)
      localStorage.setItem("gang-boyz-card-products", JSON.stringify(updatedProducts))
    } catch (error) {
      console.error('Erro ao atualizar card product:', error)
      throw error
    }
  }

  const deleteCardProduct = async (id: string) => {
    try {
      const updatedProducts = cardProducts.filter(product => product.id !== id)
      setCardProducts(updatedProducts)
      localStorage.setItem("gang-boyz-card-products", JSON.stringify(updatedProducts))
    } catch (error) {
      console.error('Erro ao deletar card product:', error)
      throw error
    }
  }

  const getCardProductsByCategory = (category: string): CardProduct[] => {
    return cardProducts.filter(product => 
      product.categories.some(cat => 
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
      getCardProductsByCategory,
      loading
    }}>
      {children}
    </CardsContext.Provider>
  )
}

export function useCards() {
  const context = useContext(CardsContext)
  if (context === undefined) {
    throw new Error('useCards deve ser usado dentro de um CardsProvider')
  }
  return context
}