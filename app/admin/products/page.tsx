"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminProductForm } from "@/components/admin-product-form"
import { ProductCard } from "@/components/product-card"
import { Product } from "@/lib/demo-products"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    if (savedCategories) {
      const categories = JSON.parse(savedCategories)
      const allProducts = categories.flatMap((category: any) => category.products)
      setProducts(allProducts)
    }
  }

  const generateProductId = () => {
    const timestamp = Date.now()
    return `PROD${timestamp.toString().slice(-5)}`
  }

  const handleSaveProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: editingProduct?.id || generateProductId()
    }

    // Carregar categorias existentes
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    let categories = savedCategories ? JSON.parse(savedCategories) : []

    if (categories.length === 0) {
      // Criar categoria padrão se não existir
      categories = [{
        id: "cat001",
        name: "Produtos",
        icon: "👕",
        products: []
      }]
    }

    if (editingProduct) {
      // Editar produto existente
      categories.forEach((category: any) => {
        const productIndex = category.products.findIndex((p: Product) => p.id === editingProduct.id)
        if (productIndex !== -1) {
          category.products[productIndex] = newProduct
        }
      })
    } else {
      // Adicionar novo produto
      categories[0].products.push(newProduct)
    }

    // Salvar no localStorage
    localStorage.setItem("gang-boyz-categories", JSON.stringify(categories))
    
    // Recarregar produtos
    loadProducts()
    
    // Fechar formulário
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const savedCategories = localStorage.getItem("gang-boyz-categories")
      if (savedCategories) {
        const categories = JSON.parse(savedCategories)
        
        categories.forEach((category: any) => {
          category.products = category.products.filter((p: Product) => p.id !== productId)
        })

        localStorage.setItem("gang-boyz-categories", JSON.stringify(categories))
        loadProducts()
      }
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administração de Produtos
          </h1>
          <p className="text-gray-600">
            Gerencie os produtos do Card 1 (Card Completo)
          </p>
        </div>

        {!showForm ? (
          <>
            {/* Botão de adicionar produto */}
            <div className="mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            {/* Lista de produtos */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ProductCard product={product} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Nenhum produto cadastrado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comece adicionando seu primeiro produto usando o Card 1 (Card Completo).
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <AdminProductForm
            onSave={handleSaveProduct}
            onCancel={handleCancelForm}
            initialData={editingProduct || undefined}
          />
        )}
      </div>
    </div>
  )
}
