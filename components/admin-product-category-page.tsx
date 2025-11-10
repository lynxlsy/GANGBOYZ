"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductTemplate } from "@/components/product-template"
import { Footer } from "@/components/footer"
import { useProducts } from "@/lib/products-context-simple"
import { ArrowLeft, Plus, X, Save, Download, Upload, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AdminProductFilters } from "@/components/admin-product-filters"
import { AdminProductModal } from "@/components/admin-product-modal"
import { CategoryConfig } from "@/lib/category-config"
import { eventManager } from "@/lib/event-manager"

interface AdminProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  color: string
  image: string
  category: string
  subcategory?: string
  label?: string
  labelType?: 'promocao' | 'esgotado' | 'personalizada'
}

interface AdminProductCategoryPageProps {
  config: CategoryConfig
  subcategoryKey: string
}

export function AdminProductCategoryPage({ config, subcategoryKey }: AdminProductCategoryPageProps) {
  const { products, getActiveProductsByCategory, saveProducts } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<AdminProduct>({
    id: "",
    name: "",
    price: 0,
    originalPrice: 0,
    color: "",
    image: "/placeholder-default.svg",
    category: config.category,
    subcategory: config.subcategory,
    label: "",
    labelType: undefined
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [productsCount, setProductsCount] = useState(0)
  const [hasBackup, setHasBackup] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  // Estados para o novo sistema de modal
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false) // Added saving state

  const categoryProducts = getActiveProductsByCategory(config.subcategory)

  // Carregar produtos e atualizar contadores
  useEffect(() => {
    const loadProducts = () => {
      if (typeof window !== 'undefined') {
        const testProducts = localStorage.getItem("gang-boyz-test-products")
        if (testProducts) {
          const parsed = JSON.parse(testProducts)
          setProductsCount(parsed.length)
        }
        
        const backup = localStorage.getItem("gang-boyz-products-backup")
        setHasBackup(!!backup)
      }
    }

    loadProducts()
    
    // Escutar eventos de atualização
    const handleProductCreated = () => {
      console.log("🔄 Produto criado detectado na página admin")
      setRefreshTrigger(prev => prev + 1)
      loadProducts()
    }

    const handleForceReload = () => {
      console.log("🔄 Forçando reload na página admin")
      setRefreshTrigger(prev => prev + 1)
      loadProducts()
    }

    eventManager.subscribe('testProductCreated', handleProductCreated)
    eventManager.subscribe('forceProductsReload', handleForceReload)
    
    return () => {
      eventManager.unsubscribe('testProductCreated', handleProductCreated)
      eventManager.unsubscribe('forceProductsReload', handleForceReload)
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setNewProduct(prev => ({ ...prev, image: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateProduct = () => {
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      toast.error("Preencha todos os campos obrigatórios!")
      return
    }

    if (typeof window !== 'undefined') {
      const testProducts = localStorage.getItem("gang-boyz-test-products")
      const products = testProducts ? JSON.parse(testProducts) : []
      
      // Verificar se ID já existe
      if (products.some((p: any) => p.id === newProduct.id)) {
        toast.error("ID já existe! Use um ID diferente.")
        return
      }

      const product = {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        color: newProduct.color,
        image: newProduct.image,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        label: newProduct.label,
        labelType: newProduct.labelType
      }

      products.push(product)
      localStorage.setItem("gang-boyz-test-products", JSON.stringify(products))
      
      // Disparar eventos para atualizar outras páginas
      eventManager.emitThrottled('testProductCreated') // Use throttled emit
    }
    
    setIsModalOpen(false)
    
    // Reset form
    setNewProduct({
      id: "",
      name: "",
      price: 0,
      originalPrice: 0,
      color: "",
      image: "/placeholder-default.svg",
      category: config.category,
      subcategory: config.subcategory,
      label: "",
      labelType: undefined
    })
    setSelectedImage(null)
    setImagePreview("")
    
    toast.success(`Produto criado com sucesso na categoria ${config.category} - ${config.subcategory}!`)
  }

  const handleSaveProducts = async () => {
    setIsSaving(true)
    try {
      if (typeof window !== 'undefined') {
        const testProducts = localStorage.getItem("gang-boyz-test-products")
        if (testProducts) {
          localStorage.setItem("gang-boyz-products-backup", testProducts)
          setHasBackup(true)
          toast.success("Produtos salvos com sucesso!")
        } else {
          toast.error("Nenhum produto para salvar!")
        }
      }
    } catch (error) {
      toast.error("Erro ao salvar produtos!")
      console.error("Error saving products:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadProducts = () => {
    if (typeof window !== 'undefined') {
      const backup = localStorage.getItem("gang-boyz-products-backup")
      if (backup) {
        localStorage.setItem("gang-boyz-test-products", backup)
        eventManager.emitThrottled('forceProductsReload') // Use throttled emit
        toast.success("Produtos carregados com sucesso!")
      } else {
        toast.error("Nenhum backup encontrado!")
      }
    }
  }

  const handleExportProducts = () => {
    if (typeof window !== 'undefined') {
      const testProducts = localStorage.getItem("gang-boyz-test-products")
      if (testProducts) {
        try {
          const data = JSON.parse(testProducts)
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `produtos-${config.subcategory.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
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

  const handleDeleteProduct = (product: any) => {
    console.log("🖱️ Botão de excluir clicado para produto:", product)
    
    // Converter produto do contexto para formato admin
    const adminProduct: AdminProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: product.color,
      image: product.image,
      category: product.categories?.[0] || config.category,
      subcategory: product.categories?.[1] || config.subcategory,
      label: product.label || "",
      labelType: product.labelType || "promocao"
    }
    
    console.log("🔄 Produto convertido para formato admin:", adminProduct)
    
    setProductToDelete(adminProduct)
    setDeleteModalOpen(true)
    console.log("📱 Modal de exclusão aberto")
  }

  const confirmDeleteProduct = () => {
    console.log("🗑️ Iniciando exclusão do produto:", productToDelete)
    
    if (productToDelete && typeof window !== 'undefined') {
      const testProducts = localStorage.getItem("gang-boyz-test-products")
      if (testProducts) {
        const products = JSON.parse(testProducts)
        const filteredProducts = products.filter((p: any) => p.id !== productToDelete.id)
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(filteredProducts))
        
        setProductsCount(filteredProducts.length)
        setRefreshTrigger(prev => prev + 1)
        
        // Disparar eventos para atualizar outras páginas
        eventManager.emitThrottled('forceProductsReload') // Use throttled emit
        
        toast.success(`Produto ${productToDelete.name} excluído com sucesso!`)
        console.log("✅ Produto excluído com sucesso")
      }
    }
    
    setDeleteModalOpen(false)
    setProductToDelete(null)
    console.log("📱 Modal de exclusão fechado")
  }

  const handleDeleteAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("gang-boyz-test-products")
      setProductsCount(0)
      setRefreshTrigger(prev => prev + 1)
      
      // Disparar eventos para atualizar outras páginas
      eventManager.emitThrottled('forceProductsReload') // Use throttled emit
      
      toast.success("Todos os produtos foram excluídos!")
    }
  }

  // Função para salvar um produto usando o novo sistema de modal
  const handleSaveProduct = async (product: any) => {
    setIsSaving(true)
    try {
      if (isEditing) {
        // For editing, we would update an existing product
        // This is a simplified implementation - in a real app you would update the product
        console.log("Editing product:", product)
      } else {
        // Add new product to localStorage
        try {
          // Get existing products
          const existingProducts = localStorage.getItem("gang-boyz-test-products")
          let productsArray: any[] = []
          
          if (existingProducts) {
            productsArray = JSON.parse(existingProducts)
          }
          
          // Ensure the product has the correct categories array for proper filtering
          const productWithCategories = {
            ...product,
            categories: [product.category, product.subcategory].filter(Boolean)
          }
          
          // Add the new product
          productsArray.push(productWithCategories)
          
          // Save back to localStorage
          localStorage.setItem("gang-boyz-test-products", JSON.stringify(productsArray))
          
          // Dispatch event to force reload
          eventManager.emitThrottled('testProductCreated') // Use throttled emit
          eventManager.emitThrottled('forceProductsReload') // Use throttled emit
          
          console.log("Product saved:", productWithCategories)
        } catch (error) {
          console.error("Error saving product:", error)
          toast.error("Erro ao salvar produto!")
        }
      }
      
      toast.success("Produto salvo com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar produto!")
      console.error("Error saving product:", error)
    } finally {
      setIsSaving(false)
      // Close modal
      setIsModalOpen(false)
      setIsEditing(false)
      setCurrentProduct(null)
    }
  }
}