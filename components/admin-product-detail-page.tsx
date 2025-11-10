"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { AdminProductFilters } from "@/components/admin-product-filters"
import { ProductTemplate } from "@/components/product-template"
import { AdminProductModal } from "@/components/admin-product-modal"
import { AdminDeleteModal } from "@/components/admin-delete-modal"
import { useAdminProducts } from "@/hooks/use-admin-products"
import { useCart } from "@/lib/cart-context"
import { 
  Plus, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Edit, 
  Package,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight
} from "lucide-react"

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

interface AdminProductDetailPageProps {
  category: string
  subcategory: string
  title: string
  description: string
}

export function AdminProductDetailPage({ 
  category, 
  subcategory, 
  title, 
  description 
}: AdminProductDetailPageProps) {
  const { addItem } = useCart()
  const {
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
  } = useAdminProducts(subcategory)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<AdminProduct | null>(null)
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null)

  const handleAddToCart = (product: any) => {
    // Função não implementada para admin
  }

  const handleCreateProduct = (product: AdminProduct) => {
    createProduct(product)
    setIsModalOpen(false)
  }

  const handleUpdateProduct = (product: AdminProduct) => {
    updateProduct(product)
    setEditModalOpen(false)
    setProductToEdit(null)
  }

  const handleEditProduct = (product: AdminProduct) => {
    setProductToEdit(product)
    setEditModalOpen(true)
  }

  const handleDeleteProduct = (product: AdminProduct) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
      setDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  return (
    <AdminLayout 
      title={`${category} - ${title}`} 
      subtitle={`Gerencie os produtos da categoria ${title}`}
    >
      <div className="space-y-8">
        {/* Header Moderno */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-3xl p-8 lg:p-10 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-red-200 to-blue-200 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-white/80 text-lg">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros Admin */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <AdminProductFilters category={category} />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 space-y-8">
            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Adicionar Produto
              </Button>
              
              <Button
                onClick={saveProducts}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Salvar
              </Button>
              
              <Button
                onClick={loadProducts}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Carregar
              </Button>
              
              <Button
                onClick={exportProducts}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Exportar
              </Button>
              
              <Button
                onClick={deleteAllProducts}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Excluir Todos
              </Button>
            </div>

            {/* Status dos Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-blue-800 text-lg">Total de Produtos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 mb-2">{productsCount}</div>
                  <p className="text-blue-600 text-sm">Produtos cadastrados</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-green-800 text-lg">Produtos Ativos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 mb-2">{products.length}</div>
                  <p className="text-green-600 text-sm">Produtos em exibição</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-purple-800 text-lg">Backup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 mb-2">
                    {hasBackup ? "✅" : "❌"}
                  </div>
                  <p className="text-purple-600 text-sm">
                    {hasBackup ? "Backup disponível" : "Sem backup"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Grid de Produtos */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group relative">
                    <ProductTemplate
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        color: product.color,
                        image: product.image,
                        categories: [product.category, product.subcategory].filter(Boolean) as string[],
                        sizes: ["P", "M", "G", "GG", "XG", "XXG"],
                        discountPercentage: product.originalPrice && product.originalPrice > product.price 
                          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                          : undefined,
                        installments: "3x sem juros",
                        brand: "Gang BoyZ",
                        isNew: true,
                        isPromotion: !!(product.originalPrice && product.originalPrice > product.price),
                        description: `${product.name} - Cor: ${product.color}`,
                        status: "ativo" as const,
                        stock: 10,
                        sizeStock: product.sizeStock || {}
                      }}
                      onAddToCart={handleAddToCart}
                    />
                    
                    {/* Etiqueta */}
                    {product.label && product.labelType && (
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white ${
                        product.labelType === 'promocao' ? 'bg-red-500' :
                        product.labelType === 'esgotado' ? 'bg-gray-600' :
                        'bg-blue-500'
                      }`}>
                        {product.label}
                      </div>
                    )}
                    
                    {/* Botões de Ação */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-500/80 hover:bg-blue-500 text-white p-1.5 rounded-full transition-all duration-300 hover:scale-110"
                        title="Editar produto"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full transition-all duration-300 hover:scale-110"
                        title="Excluir produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece adicionando produtos para a categoria {title}
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar Primeiro Produto
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Criação de Produto */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={null}
        onSave={handleCreateProduct}
        title={title}
        subcategory={subcategory}
        mode="create"
      />

      {/* Modal de Edição de Produto */}
      <AdminProductModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setProductToEdit(null)
        }}
        product={productToEdit}
        onSave={handleUpdateProduct}
        title={title}
        subcategory={subcategory}
        mode="edit"
      />

      {/* Modal de Confirmação de Exclusão */}
      <AdminDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setProductToDelete(null)
        }}
        onConfirm={confirmDeleteProduct}
        productName={productToDelete?.name || ""}
      />
    </AdminLayout>
  )
}