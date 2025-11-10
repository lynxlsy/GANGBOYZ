"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { safeSetItem, safeGetItem, cleanupLocalStorage, monitorLocalStorageUsage } from "@/lib/localStorage-utils"
import { eventManager } from "@/lib/event-manager"
import { runDuringIdle } from "@/lib/idle-callback"
import { CATEGORY_CONFIGS } from "@/lib/category-config"

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
  // Adicionando estoque por tamanho
  sizeStock?: Record<string, number>
  // Adicionando campos extras que estavam faltando
  rating?: number
  reviews?: number
  weight?: string
  dimensions?: string
  material?: string
  care?: string
  origin?: string
  warranty?: string
  // Added missing shipping information fields
  freeShippingText?: string
  freeShippingThreshold?: string
  pickupText?: string
  pickupStatus?: string
  // Added new fields for recommendations
  availableUnits?: number
  availableSizes?: string[]
  recommendationCategory?: string
  // Added new fields for highlighting
  destacarEmRecomendacoes?: boolean
  destacarEmOfertas?: boolean
  destacarEmAlta?: boolean
  destacarLancamentos?: boolean
  // Added label fields
  label?: string
  labelType?: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductsByCategory: (category: string) => Product[]
  getActiveProductsByCategory: (category: string) => Product[]
  saveProducts: () => Promise<void> // Added save function
  updateProductStock: (id: string, size: string, quantity: number) => void // Added stock update function
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isSaving, setIsSaving] = useState(false) // Added saving state

  // Dados iniciais simplificados
  const initialProducts: Product[] = [
    // CALÇAS
  ]

  // Carregar dados na inicialização
  useEffect(() => {
    const loadProducts = () => {
      // Carregar produtos do admin (gang-boyz-test-products)
      const adminProducts = safeGetItem("gang-boyz-test-products")
      let allProducts = [...initialProducts]
      
      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts)
          const convertedProducts = parsedAdminProducts.map((adminProduct: any) => ({
            id: adminProduct.id || `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`, // Ensure ID exists
            name: adminProduct.name,
            price: adminProduct.price,
            originalPrice: adminProduct.originalPrice,
            image: adminProduct.image,
            color: adminProduct.color,
            categories: [adminProduct.category, adminProduct.subcategory].filter(Boolean),
            sizes: adminProduct.sizes || ["P", "M", "G", "GG"],
            discountPercentage: adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price 
              ? Math.round(((adminProduct.originalPrice - adminProduct.price) / adminProduct.originalPrice) * 100)
              : undefined,
            installments: "3x sem juros",
            brand: "Gang BoyZ",
            isNew: adminProduct.destacarLancamentos || false,
            isPromotion: adminProduct.destacarEmAlta || !!(adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price),
            description: `${adminProduct.name} - Cor: ${adminProduct.color}`,
            status: "ativo" as const,
            stock: adminProduct.stock || 0,
            sizeStock: adminProduct.sizeStock || {},
            rating: adminProduct.rating || 4.5,
            reviews: adminProduct.reviews || Math.floor(Math.random() * 100) + 10,
            weight: adminProduct.weight || "300g",
            dimensions: adminProduct.dimensions || "70cm x 50cm",
            material: adminProduct.material || "100% Algodão",
            care: adminProduct.care || "Lavar à mão, não alvejar",
            origin: adminProduct.origin || "Brasil",
            warranty: adminProduct.warranty || "90 dias contra defeitos",
            // Added missing shipping information fields
            freeShippingText: adminProduct.freeShippingText || "Frete Grátis",
            freeShippingThreshold: adminProduct.freeShippingThreshold || "Acima de R$ 200",
            pickupText: adminProduct.pickupText || "Retire na Loja",
            pickupStatus: adminProduct.pickupStatus || "Disponível",
            // Highlighting fields
            destacarEmRecomendacoes: adminProduct.destacarEmRecomendacoes || false,
            destacarEmOfertas: adminProduct.destacarEmOfertas || false,
            destacarEmAlta: adminProduct.destacarEmAlta || false,
            destacarLancamentos: adminProduct.destacarLancamentos || false
          }))
          
          // Replace all products instead of adding to avoid duplicates
          allProducts = [...initialProducts, ...convertedProducts]
        } catch (error) {
          console.error("Erro ao fazer parse dos produtos do admin:", error)
        }
      }
      
      setProducts(allProducts)
      safeSetItem("gang-boyz-test-products", JSON.stringify(allProducts), 0) // No debounce for immediate save
      // Removido monitorLocalStorageUsage() para evitar loop de logs
    }
    
    loadProducts()
  }, [])

  // Salvar no localStorage com debounce para evitar operações frequentes
  useEffect(() => {
    if (products.length > 0 && !isSaving) {
      // Debounce localStorage updates to once every 3 seconds (increased from 2)
      const timer = setTimeout(() => {
        safeSetItem("gang-boyz-test-products", JSON.stringify(products), 0) // No debounce for immediate save
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [products, isSaving])

  // Escutar eventos de produtos criados no admin
  useEffect(() => {
    const handleAdminProductCreated = () => {
      // Recarregar produtos quando um novo produto for criado no admin
      const adminProducts = safeGetItem("gang-boyz-test-products")
      let allProducts = [...initialProducts]
      
      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts)
          // Limitar a 30 produtos para evitar problemas de performance (reduced from 50)
          const limitedProducts = parsedAdminProducts.slice(-30)
          
          const convertedProducts = limitedProducts.map((adminProduct: any) => ({
            id: adminProduct.id || `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`, // Ensure ID exists
            name: adminProduct.name,
            price: adminProduct.price,
            originalPrice: adminProduct.originalPrice,
            image: adminProduct.image,
            color: adminProduct.color,
            categories: [adminProduct.category, adminProduct.subcategory].filter(Boolean),
            sizes: adminProduct.sizes || ["P", "M", "G", "GG"],
            discountPercentage: adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price 
              ? Math.round(((adminProduct.originalPrice - adminProduct.price) / adminProduct.originalPrice) * 100)
              : undefined,
            installments: "3x sem juros",
            brand: "Gang BoyZ",
            isNew: adminProduct.destacarLancamentos || false,
            isPromotion: adminProduct.destacarEmAlta || !!(adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price),
            description: `${adminProduct.name} - Cor: ${adminProduct.color}`,
            status: "ativo" as const,
            stock: adminProduct.stock || 0,
            sizeStock: adminProduct.sizeStock || {},
            rating: adminProduct.rating || 4.5,
            reviews: adminProduct.reviews || Math.floor(Math.random() * 100) + 10,
            weight: adminProduct.weight || "300g",
            dimensions: adminProduct.dimensions || "70cm x 50cm",
            material: adminProduct.material || "100% Algodão",
            care: adminProduct.care || "Lavar à mão, não alvejar",
            origin: adminProduct.origin || "Brasil",
            warranty: adminProduct.warranty || "90 dias contra defeitos",
            // Added missing shipping information fields
            freeShippingText: adminProduct.freeShippingText || "Frete Grátis",
            freeShippingThreshold: adminProduct.freeShippingThreshold || "Acima de R$ 200",
            pickupText: adminProduct.pickupText || "Retire na Loja",
            pickupStatus: adminProduct.pickupStatus || "Disponível",
            // Highlighting fields
            destacarEmRecomendacoes: adminProduct.destacarEmRecomendacoes || false,
            destacarEmOfertas: adminProduct.destacarEmOfertas || false,
            destacarEmAlta: adminProduct.destacarEmAlta || false,
            destacarLancamentos: adminProduct.destacarLancamentos || false,
            // Added label fields
            label: adminProduct.label || "",
            labelType: adminProduct.labelType || ""
          }))
          
          // Replace all products instead of adding to avoid duplicates
          allProducts = [...initialProducts, ...convertedProducts]
        } catch (error) {
          console.error("Erro ao fazer parse dos produtos do admin:", error)
        }
      }
      
      setProducts(allProducts)
      safeSetItem("gang-boyz-test-products", JSON.stringify(allProducts), 0) // No debounce for immediate save
    }

    eventManager.subscribe('testProductCreated', handleAdminProductCreated)
    eventManager.subscribe('forceProductsReload', handleAdminProductCreated)
    
    // Load products immediately when component mounts, but don't emit events
    const loadProductsOnMount = () => {
      const adminProducts = safeGetItem("gang-boyz-test-products")
      let allProducts = [...initialProducts]
      
      if (adminProducts) {
        try {
          const parsedAdminProducts = JSON.parse(adminProducts)
          const convertedProducts = parsedAdminProducts.map((adminProduct: any) => ({
            id: adminProduct.id || `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
            name: adminProduct.name,
            price: adminProduct.price,
            originalPrice: adminProduct.originalPrice,
            image: adminProduct.image,
            color: adminProduct.color,
            categories: [adminProduct.category, adminProduct.subcategory].filter(Boolean),
            sizes: adminProduct.sizes || ["P", "M", "G", "GG"],
            discountPercentage: adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price 
              ? Math.round(((adminProduct.originalPrice - adminProduct.price) / adminProduct.originalPrice) * 100)
              : undefined,
            installments: "3x sem juros",
            brand: "Gang BoyZ",
            isNew: adminProduct.destacarLancamentos || false,
            isPromotion: adminProduct.destacarEmAlta || !!(adminProduct.originalPrice && adminProduct.originalPrice > adminProduct.price),
            description: `${adminProduct.name} - Cor: ${adminProduct.color}`,
            status: "ativo" as const,
            stock: adminProduct.stock || 0,
            sizeStock: adminProduct.sizeStock || {},
            rating: adminProduct.rating || 4.5,
            reviews: adminProduct.reviews || Math.floor(Math.random() * 100) + 10,
            weight: adminProduct.weight || "300g",
            dimensions: adminProduct.dimensions || "70cm x 50cm",
            material: adminProduct.material || "100% Algodão",
            care: adminProduct.care || "Lavar à mão, não alvejar",
            origin: adminProduct.origin || "Brasil",
            warranty: adminProduct.warranty || "90 dias contra defeitos",
            freeShippingText: adminProduct.freeShippingText || "Frete Grátis",
            freeShippingThreshold: adminProduct.freeShippingThreshold || "Acima de R$ 200",
            pickupText: adminProduct.pickupText || "Retire na Loja",
            pickupStatus: adminProduct.pickupStatus || "Disponível",
            destacarEmRecomendacoes: adminProduct.destacarEmRecomendacoes || false,
            destacarEmOfertas: adminProduct.destacarEmOfertas || false,
            destacarEmAlta: adminProduct.destacarEmAlta || false,
            destacarLancamentos: adminProduct.destacarLancamentos || false,
            label: adminProduct.label || "",
            labelType: adminProduct.labelType || ""
          }))
          
          allProducts = [...initialProducts, ...convertedProducts]
        } catch (error) {
          console.error("Erro ao fazer parse dos produtos do admin:", error)
        }
      }
      
      setProducts(allProducts)
    }
    
    // Load products on mount
    loadProductsOnMount()
    
    return () => {
      eventManager.unsubscribe('testProductCreated', handleAdminProductCreated)
      eventManager.unsubscribe('forceProductsReload', handleAdminProductCreated)
    }
  }, [initialProducts])

  const addProduct = (product: Product) => {
    // Ensure the product has an ID
    const productWithId = product.id 
      ? product 
      : { ...product, id: `PROD${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}` }
    
    setProducts(prev => [...prev, productWithId])
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
    // First, try to get the category config for this key
    const categoryConfig = CATEGORY_CONFIGS[category];
    
    return products.filter(product => 
      product.status === "ativo" &&
      product.categories.some(cat => {
        // Direct match with category key
        if (cat.toLowerCase() === category.toLowerCase()) return true;
        
        // Match with category name from config
        if (categoryConfig && cat.toLowerCase() === categoryConfig.category.toLowerCase()) return true;
        
        // Match with subcategory name from config
        if (categoryConfig && cat.toLowerCase() === categoryConfig.subcategory.toLowerCase()) return true;
        
        // Partial match for broader category searches
        if (cat.toLowerCase().includes(category.toLowerCase())) return true;
        
        // Match with the subcategory config if category is a key
        if (categoryConfig && categoryConfig.subcategory.toLowerCase() === cat.toLowerCase()) return true;
        
        return false;
      })
    )
  }

  // Added save function to properly handle saving products
  const saveProducts = async () => {
    if (isSaving) return; // Prevent multiple simultaneous saves
    
    setIsSaving(true)
    try {
      // Save to localStorage with immediate save (no debounce)
      safeSetItem("gang-boyz-test-products", JSON.stringify(products), 0)
      
      // Emit event to notify other components
      eventManager.emitThrottled('forceProductsReload')
      
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error("Error saving products:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Function to update product stock when purchased
  const updateProductStock = (id: string, size: string, quantity: number) => {
    setProducts(prev => {
      return prev.map(product => {
        if (product.id === id) {
          // Create a copy of the current product
          const updatedProduct = { ...product }
          
          // Update size-specific stock
          if (updatedProduct.sizeStock) {
            const newSizeStock = { ...updatedProduct.sizeStock }
            if (newSizeStock[size] !== undefined) {
              newSizeStock[size] = Math.max(0, newSizeStock[size] - quantity)
              updatedProduct.sizeStock = newSizeStock
            }
          }
          
          // Update total stock
          updatedProduct.stock = Math.max(0, (updatedProduct.stock || 0) - quantity)
          
          // If stock is 0, mark as esgotado
          if (updatedProduct.stock === 0) {
            // Update label to esgotado if it exists
            if ('label' in updatedProduct) {
              (updatedProduct as any).label = "ESGOTADO"
              ;(updatedProduct as any).labelType = "esgotado"
            }
          }
          
          return updatedProduct
        }
        return product
      })
    })
    
    // Also update in localStorage immediately
    if (typeof window !== 'undefined') {
      const existingProducts = localStorage.getItem("gang-boyz-test-products")
      if (existingProducts) {
        try {
          const productsArray = JSON.parse(existingProducts)
          const updatedProducts = productsArray.map((product: any) => {
            if (product.id === id) {
              // Create a copy of the current product
              const updatedProduct = { ...product }
              
              // Update size-specific stock
              if (updatedProduct.sizeStock) {
                const newSizeStock = { ...updatedProduct.sizeStock }
                if (newSizeStock[size] !== undefined) {
                  newSizeStock[size] = Math.max(0, newSizeStock[size] - quantity)
                  updatedProduct.sizeStock = newSizeStock
                }
              }
              
              // Update total stock
              updatedProduct.stock = Math.max(0, (updatedProduct.stock || 0) - quantity)
              
              // If stock is 0, mark as esgotado
              if (updatedProduct.stock === 0) {
                updatedProduct.label = "ESGOTADO"
                updatedProduct.labelType = "esgotado"
              }
              
              return updatedProduct
            }
            return product
          })
          
          localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
          
          // Emit events to force reload products in all pages
          // Use throttled emit to prevent infinite loops
          eventManager.emitThrottled('forceProductsReload')
        } catch (error) {
          console.error("Error updating product stock in localStorage:", error)
        }
      }
    }
  }

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategory,
      getActiveProductsByCategory,
      saveProducts, // Export the save function
      updateProductStock // Export the stock update function
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
