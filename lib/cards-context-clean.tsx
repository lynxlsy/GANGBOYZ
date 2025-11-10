"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore"
// import { db } from "./firebase-config"

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

  // Conectar ao Firebase em tempo real
  // useEffect(() => {
  //   let isMounted = true
  //   let unsubscribe: (() => void) | null = null
  //   
  //   const connectToFirebase = async () => {
  //     try {
  //       setLoading(true)
  //       
  //       const q = query(collection(db, 'cardProducts'), orderBy('createdAt', 'desc'))
  //       
  //       unsubscribe = onSnapshot(q, (querySnapshot) => {
  //         if (!isMounted) return
  //         
  //         const firebaseProducts: CardProduct[] = querySnapshot.docs.map(doc => ({
  //           id: doc.id,
  //           ...doc.data(),
  //           createdAt: doc.data().createdAt?.toDate() || new Date(),
  //           updatedAt: doc.data().updatedAt?.toDate() || new Date()
  //         })) as CardProduct[]
  //         
  //         setCardProducts(firebaseProducts)
  //         setLoading(false)
  //       }, (error) => {
  //         if (!isMounted) return
  //         console.error('Erro ao carregar card products do Firebase:', error)
  //         setLoading(false)
  //       })
  //     } catch (error) {
  //       if (!isMounted) return
  //       console.error('Erro ao conectar com Firebase:', error)
  //       setLoading(false)
  //     }
  //   }

  //   connectToFirebase()

  //   return () => {
  //     isMounted = false
  //     if (unsubscribe) {
  //       try {
  //         unsubscribe()
  //       } catch (error) {
  //         console.error('Erro ao desconectar do Firebase:', error)
  //       }
  //     }
  //   }
  // }, [])

  // Migrar dados do localStorage para Firebase na primeira execução
  // useEffect(() => {
  //   const migrateFromLocalStorage = async () => {
  //     try {
  //       const savedProducts = localStorage.getItem("gang-boyz-card-products")
  //       if (savedProducts) {
  //         const parsedProducts = JSON.parse(savedProducts)
  //         
  //         // Verificar se já existem produtos no Firebase
  //         if (cardProducts.length === 0) {
  //           console.log('Migrando card products do localStorage para Firebase...')
  //           
  //           for (const product of parsedProducts) {
  //             await addDoc(collection(db, 'cardProducts'), {
  //               ...product,
  //               createdAt: serverTimestamp(),
  //               updatedAt: serverTimestamp()
  //             })
  //           }
  //           
  //           // Limpar localStorage após migração
  //           localStorage.removeItem("gang-boyz-card-products")
  //           console.log('Migração de card products concluída!')
  //         }
  //       } else {
  //         // Sem produtos iniciais - aguardando configuração pelo admin
  //         console.log('Nenhum card product encontrado. Aguardando configuração pelo admin.')
  //       }
  //     } catch (error) {
  //       console.error('Erro na migração de card products:', error)
  //     }
  //   }

  //   // Aguardar um pouco para garantir que o Firebase carregou
  //   const timer = setTimeout(migrateFromLocalStorage, 2000)
  //   return () => clearTimeout(timer)
  // }, [cardProducts.length])

  // const addCardProduct = async (product: Omit<CardProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
  //   try {
  //     await addDoc(collection(db, 'cardProducts'), {
  //       ...product,
  //       createdAt: serverTimestamp(),
  //       updatedAt: serverTimestamp()
  //     })
  //   } catch (error) {
  //     console.error('Erro ao adicionar card product:', error)
  //     throw error
  //   }
  // }

  // const updateCardProduct = async (id: string, updates: Partial<CardProduct>) => {
  //   try {
  //     const productRef = doc(db, 'cardProducts', id)
  //     await updateDoc(productRef, {
  //       ...updates,
  //       updatedAt: serverTimestamp()
  //     })
  //   } catch (error) {
  //     console.error('Erro ao atualizar card product:', error)
  //     throw error
  //   }
  // }

  // const deleteCardProduct = async (id: string) => {
  //   try {
  //     await deleteDoc(doc(db, 'cardProducts', id))
  //   } catch (error) {
  //     console.error('Erro ao deletar card product:', error)
  //     throw error
  //   }
  // }

  const getCardProductsByCategory = (category: string): CardProduct[] => {
    return cardProducts.filter(product => 
      product.categories.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    )
  }

  // Dummy functions for local storage only
  const addCardProduct = async (product: Omit<CardProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Add card product (localStorage only):', product);
    // Implementation would go here for localStorage only
  };

  const updateCardProduct = async (id: string, updates: Partial<CardProduct>) => {
    console.log('Update card product (localStorage only):', id, updates);
    // Implementation would go here for localStorage only
  };

  const deleteCardProduct = async (id: string) => {
    console.log('Delete card product (localStorage only):', id);
    // Implementation would go here for localStorage only
  };

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





