"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { safeSetItem, safeGetItem, safeRemoveItem, cleanupLocalStorage } from "@/lib/localStorage-utils"
import { eventManager } from "@/lib/event-manager"

interface AdminProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  color: string
  image: string
  category: string
  subcategory: string
  label?: string
  labelType?: 'promocao' | 'esgotado' | 'personalizada'
  sizeStock?: Record<string, number>
}

export function useAdminProducts(subcategory: string) {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [productsCount, setProductsCount] = useState(0)
  const [hasBackup, setHasBackup] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Carregar produtos do localStorage
  useEffect(() => {
    const loadProducts = () => {
      if (typeof window !== 'undefined') {
        const testProducts = safeGetItem("gang-boyz-test-products")
        if (testProducts) {
          try {
            const parsedProducts = JSON.parse(testProducts)
            const filteredProducts = parsedProducts.filter((product: AdminProduct) => 
              product.subcategory === subcategory
            )
            setProducts(filteredProducts)
            setProductsCount(parsedProducts.length)
          } catch (error) {
            console.error("Erro ao carregar produtos:", error)
          }
        }
      }
    }

    loadProducts()
    // Removido monitorLocalStorageUsage() para evitar loop de logs
  }, [subcategory, refreshTrigger])

  // Verificar backup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const backup = safeGetItem("gang-boyz-products-backup")
      setHasBackup(!!backup)
    }
  }, [])

  const createProduct = (product: AdminProduct) => {
    if (!product.id || !product.name || !product.color || product.price <= 0) {
      toast.error("Preencha todos os campos obrigatórios!")
      return
    }

    if (typeof window !== 'undefined') {
      const existingProducts = JSON.parse(safeGetItem("gang-boyz-test-products", "[]"))
      const updatedProducts = [...existingProducts, product]
      
      const success = safeSetItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
      
      if (success) {
        setProductsCount(updatedProducts.length)
        setRefreshTrigger(prev => prev + 1)
        window.dispatchEvent(new CustomEvent('testProductCreated'))
        toast.success(`Produto criado com sucesso na categoria ${product.subcategory}!`)
      } else {
        toast.error("Erro ao salvar produto. Espaço insuficiente no armazenamento.")
      }
    }
  }

  const updateProduct = (updatedProduct: AdminProduct) => {
    if (!updatedProduct.id || !updatedProduct.name || !updatedProduct.color || updatedProduct.price <= 0) {
      toast.error("Preencha todos os campos obrigatórios!")
      return
    }

    if (typeof window !== 'undefined') {
      const testProducts = safeGetItem("gang-boyz-test-products")
      
      if (testProducts) {
        const products = JSON.parse(testProducts)
        const updatedProducts = products.map((product: AdminProduct) => {
          if (product.id === updatedProduct.id) {
            return updatedProduct
          }
          return product
        })
        
        const success = safeSetItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
        
        if (success) {
          setRefreshTrigger(prev => prev + 1)
          eventManager.emit('testProductCreated')
          eventManager.emit('forceProductsReload')
          toast.success(`Produto "${updatedProduct.name}" atualizado com sucesso!`)
        } else {
          toast.error("Erro ao atualizar produto. Espaço insuficiente no armazenamento.")
        }
      }
    }
  }

  const deleteProduct = (productId: string) => {
    if (typeof window !== 'undefined') {
      const testProducts = safeGetItem("gang-boyz-test-products")
      
      if (testProducts) {
        const products = JSON.parse(testProducts)
        const updatedProducts = products.filter((product: AdminProduct) => product.id !== productId)
        
        const success = safeSetItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
        
        if (success) {
          setProductsCount(updatedProducts.length)
          setRefreshTrigger(prev => prev + 1)
          eventManager.emit('testProductCreated')
          eventManager.emit('forceProductsReload')
          toast.success("Produto excluído com sucesso!")
        } else {
          toast.error("Erro ao excluir produto. Espaço insuficiente no armazenamento.")
        }
      }
    }
  }

  const saveProducts = () => {
    if (typeof window !== 'undefined') {
      const testProducts = safeGetItem("gang-boyz-test-products")
      if (testProducts) {
        const success = safeSetItem("gang-boyz-products-backup", testProducts)
        if (success) {
          setHasBackup(true)
          toast.success("Produtos salvos com sucesso!")
        } else {
          toast.error("Erro ao salvar backup. Espaço insuficiente no armazenamento.")
        }
      } else {
        toast.error("Nenhum produto para salvar!")
      }
    }
  }

  const loadProducts = () => {
    if (typeof window !== 'undefined') {
      const backupProducts = safeGetItem("gang-boyz-products-backup")
      if (backupProducts) {
        const success = safeSetItem("gang-boyz-test-products", backupProducts)
        if (success) {
          window.dispatchEvent(new CustomEvent('testProductCreated'))
          setProductsCount(JSON.parse(backupProducts).length)
          setRefreshTrigger(prev => prev + 1)
          toast.success("Produtos carregados com sucesso!")
        } else {
          toast.error("Erro ao carregar backup. Espaço insuficiente no armazenamento.")
        }
      } else {
        toast.error("Nenhum backup encontrado!")
      }
    }
  }

  const exportProducts = () => {
    if (typeof window !== 'undefined') {
      const testProducts = safeGetItem("gang-boyz-test-products")
      if (testProducts) {
        try {
          const data = JSON.parse(testProducts)
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `produtos-${subcategory.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast.success("Produtos exportados com sucesso!")
        } catch (error) {
          toast.error("Erro ao exportar produtos!")
        }
      } else {
        toast.error("Nenhum produto para exportar!")
      }
    }
  }

  const deleteAllProducts = () => {
    if (typeof window !== 'undefined') {
      const success = safeRemoveItem("gang-boyz-test-products")
      if (success) {
        setProductsCount(0)
        setRefreshTrigger(prev => prev + 1)
        window.dispatchEvent(new CustomEvent('testProductCreated'))
        toast.success("Todos os produtos foram excluídos!")
      } else {
        toast.error("Erro ao excluir produtos!")
      }
    }
  }

  return {
    products,
    productsCount,
    hasBackup,
    createProduct,
    updateProduct,
    deleteProduct,
    saveProducts,
    loadProducts,
    exportProducts,
    deleteAllProducts
  }
}