// Firebase Categories Service - Sincronização de Categorias
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
import { FirebaseErrorHandler } from "./firebase-error-handler"

export interface FirebaseCategory {
  id: string
  name: string
  image: string
  href: string
  description: string
  isActive: boolean
  order?: number
  createdAt: any
  updatedAt: any
}

class FirebaseCategoriesService {
  private categoriesCollection = collection(db, 'categories')

  // Adicionar categoria
  async addCategory(category: Omit<FirebaseCategory, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(this.categoriesCollection, {
        ...category,
        isActive: category.isActive !== undefined ? category.isActive : true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error: any) {
      const handledError = FirebaseErrorHandler.handleAddCategoryError(error, category);
      throw handledError;
    }
  }

  // Atualizar categoria
  async updateCategory(categoryId: string, updates: Partial<FirebaseCategory>) {
    try {
      const categoryRef = doc(this.categoriesCollection, categoryId)
      await updateDoc(categoryRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error: any) {
      // Se for um erro de documento não encontrado, lançar um erro específico
      if (error.code === 'not-found') {
        const customError = new Error(`Categoria com ID ${categoryId} não encontrada`);
        (customError as any).code = 'not-found';
        const handledError = FirebaseErrorHandler.handleUpdateCategoryError(customError as any, categoryId, updates);
        throw handledError;
      }
      
      const handledError = FirebaseErrorHandler.handleUpdateCategoryError(error, categoryId, updates);
      throw handledError;
    }
  }

  // Deletar categoria
  async deleteCategory(categoryId: string) {
    try {
      const categoryRef = doc(this.categoriesCollection, categoryId)
      await deleteDoc(categoryRef)
    } catch (error: any) {
      const handledError = FirebaseErrorHandler.handleDeleteCategoryError(error, categoryId);
      throw handledError;
    }
  }

  // Buscar todas as categorias ativas
  async getCategories() {
    try {
      const q = query(
        this.categoriesCollection, 
        where('isActive', '==', true),
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseCategory[]
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }
  }

  // Buscar categoria por ID
  async getCategoryById(categoryId: string) {
    try {
      const categoryRef = doc(this.categoriesCollection, categoryId)
      const categoryDoc = await getDocs(query(this.categoriesCollection, where('__name__', '==', categoryId)))
      
      if (categoryDoc.empty) {
        return null
      }
      
      return {
        id: categoryDoc.docs[0].id,
        ...categoryDoc.docs[0].data()
      } as FirebaseCategory
    } catch (error) {
      console.error('Erro ao buscar categoria por ID:', error)
      throw error
    }
  }
}

export const firebaseCategoriesService = new FirebaseCategoriesService()

// Hook para usar o serviço de categorias
export function useFirebaseCategories() {
  const [categories, setCategories] = useState<FirebaseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Query para categorias ativas
  const categoriesQuery = useMemo(() => {
    try {
      console.log('🔍 Criando query de categorias...');
      // Tentar uma query mais simples primeiro
      const simpleQuery = query(
        collection(db, 'categories'),
        where('isActive', '==', true)
      );
      console.log('✅ Query de categorias simples criada com sucesso');
      return simpleQuery;
    } catch (err) {
      console.error('❌ Erro ao criar query de categorias:', err);
      // Tentar uma query ainda mais simples
      try {
        console.log('🔄 Tentando query básica de todas as categorias...');
        const basicQuery = query(collection(db, 'categories'));
        console.log('✅ Query básica criada com sucesso');
        return basicQuery;
      } catch (basicErr) {
        console.error('❌ Erro ao criar query básica:', basicErr);
        setError('Erro ao criar query de categorias');
        setLoading(false);
        return null;
      }
    }
  }, [])

  // Usar o hook de listener seguro
  // Listener para atualizações em tempo real
  useEffect(() => {
    // Se a query não foi criada, definir como não carregando
    if (!categoriesQuery) {
      console.log('⚠️ Query de categorias não disponível, definindo loading como false');
      setLoading(false);
      return;
    }
    
    console.log('📡 Configurando listener para categorias...');
    
    // Timeout para evitar carregamento infinito
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout atingido, definindo loading como false');
        setLoading(false);
      }
    }, 10000); // 10 segundos
    
    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      console.log(`📊 Snapshot recebido com ${snapshot.size} documentos`);
      const newCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseCategory[];
      
      setCategories(newCategories);
      setLoading(false);
      setError(null);
      console.log('✅ Categorias atualizadas:', newCategories);
      
      // Limpar timeout
      clearTimeout(timeoutId);
    }, (error) => {
      console.error('❌ Erro no listener de categorias:', error);
      setError('Erro ao carregar categorias');
      setLoading(false);
      
      // Limpar timeout
      clearTimeout(timeoutId);
    });
    
    return () => {
      console.log('🧹 Limpando listener de categorias');
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [categoriesQuery, loading]);



  const addCategory = async (category: Omit<FirebaseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      await firebaseCategoriesService.addCategory(category)
    } catch (error) {
      setError('Erro ao adicionar categoria')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateCategory = async (categoryId: string, updates: Partial<FirebaseCategory>) => {
    try {
      setLoading(true)
      await firebaseCategoriesService.updateCategory(categoryId, updates)
    } catch (error) {
      setError('Erro ao atualizar categoria')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      setLoading(true)
      await firebaseCategoriesService.deleteCategory(categoryId)
    } catch (error) {
      setError('Erro ao deletar categoria')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory
  }
}