// Firebase Products Service - Sincronização de Produtos
import { useState, useEffect, useMemo } from "react"
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  where
} from "firebase/firestore"
import { db } from "./firebase-config"
import { useFirebaseListener } from '@/hooks/use-firebase-listener'

export interface FirebaseProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isActive: boolean
  isNew?: boolean
  isPromotion?: boolean
  stock?: number
  sizes?: string[]
  createdAt: any
  updatedAt: any
}

export interface ProductFilters {
  category?: string
  isActive?: boolean
  isNew?: boolean
  isPromotion?: boolean
  minPrice?: number
  maxPrice?: number
}

class FirebaseProductsService {
  private productsCollection = collection(db, 'products')

  // Adicionar produto
  async addProduct(product: Omit<FirebaseProduct, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(this.productsCollection, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
      throw error
    }
  }

  // Atualizar produto
  async updateProduct(productId: string, updates: Partial<FirebaseProduct>) {
    try {
      const productRef = doc(this.productsCollection, productId)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }
  }

  // Deletar produto
  async deleteProduct(productId: string) {
    try {
      const productRef = doc(this.productsCollection, productId)
      await deleteDoc(productRef)
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      throw error
    }
  }

  // Buscar produtos com filtros
  async getProducts(filters: ProductFilters = {}) {
    try {
      let q = query(this.productsCollection, orderBy('createdAt', 'desc'))
      
      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }
      
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive))
      }
      
      if (filters.isNew !== undefined) {
        q = query(q, where('isNew', '==', filters.isNew))
      }
      
      if (filters.isPromotion !== undefined) {
        q = query(q, where('isPromotion', '==', filters.isPromotion))
      }

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProduct[]
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }
  }

  // Buscar produto por ID
  async getProductById(productId: string) {
    try {
      const productRef = doc(this.productsCollection, productId)
      const productDoc = await getDocs(query(this.productsCollection, where('__name__', '==', productId)))
      
      if (productDoc.empty) {
        return null
      }
      
      return {
        id: productDoc.docs[0].id,
        ...productDoc.docs[0].data()
      } as FirebaseProduct
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error)
      throw error
    }
  }

  // Buscar produtos por categoria
  async getProductsByCategory(category: string) {
    try {
      const q = query(
        this.productsCollection, 
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProduct[]
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error)
      throw error
    }
  }

  // Buscar produtos em promoção
  async getPromotionProducts() {
    try {
      const q = query(
        this.productsCollection, 
        where('isPromotion', '==', true),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProduct[]
    } catch (error) {
      console.error('Erro ao buscar produtos em promoção:', error)
      throw error
    }
  }

  // Buscar produtos novos
  async getNewProducts() {
    try {
      const q = query(
        this.productsCollection, 
        where('isNew', '==', true),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProduct[]
    } catch (error) {
      console.error('Erro ao buscar produtos novos:', error)
      throw error
    }
  }

  // Buscar produtos por termo
  async searchProducts(searchTerm: string) {
    try {
      const q = query(
        this.productsCollection, 
        where('isActive', '==', true),
        orderBy('name')
      )
      
      const snapshot = await getDocs(q)
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseProduct[]
      
      // Filtrar por termo de busca (Firestore não suporta busca por texto completo)
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }
  }
}

export const firebaseProductsService = new FirebaseProductsService()

// Hook para usar o serviço de produtos
export function useFirebaseProducts() {
  const [products, setProducts] = useState<FirebaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Query para produtos ativos
  const productsQuery = useMemo(() => {
    try {
      return query(
        collection(db, 'products'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
    } catch (err) {
      console.error('Erro ao criar query de produtos:', err)
      return null
    }
  }, [])

  // Usar o hook de listener seguro
  const { data, loading: listenerLoading, error: listenerError } = useFirebaseListener<FirebaseProduct>({
    query: productsQuery,
    onData: (newProducts) => {
      setProducts(newProducts)
      setLoading(false)
      setError(null)
    },
    onError: (err) => {
      console.error('Erro no listener de produtos:', err)
      setError('Erro ao carregar produtos')
      setLoading(false)
    }
  })

  // Sincronizar estados
  useEffect(() => {
    setProducts(data)
    setLoading(listenerLoading)
    if (listenerError) {
      setError('Erro ao carregar produtos')
    }
  }, [data, listenerLoading, listenerError])

  const addProduct = async (product: Omit<FirebaseProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      await firebaseProductsService.addProduct(product)
    } catch (error) {
      setError('Erro ao adicionar produto')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (productId: string, updates: Partial<FirebaseProduct>) => {
    try {
      setLoading(true)
      await firebaseProductsService.updateProduct(productId, updates)
    } catch (error) {
      setError('Erro ao atualizar produto')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true)
      await firebaseProductsService.deleteProduct(productId)
    } catch (error) {
      setError('Erro ao deletar produto')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async (searchTerm: string) => {
    try {
      setLoading(true)
      return await firebaseProductsService.searchProducts(searchTerm)
    } catch (error) {
      setError('Erro ao buscar produtos')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  }
}


