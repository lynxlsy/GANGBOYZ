"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductTemplate } from "@/components/product-template"
import { FooterV2 } from "@/components/footer-v2"
import { useProducts } from "@/lib/products-context-simple"
import { ArrowLeft, Plus, X, Save, Download, Upload, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AdminProductFilters } from "@/components/admin-product-filters"
import { CategoryConfig } from "@/lib/category-config"

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
  const { products, getActiveProductsByCategory } = useProducts()
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

    window.addEventListener('testProductCreated', handleProductCreated)
    window.addEventListener('forceProductsReload', handleForceReload)
    
    return () => {
      window.removeEventListener('testProductCreated', handleProductCreated)
      window.removeEventListener('forceProductsReload', handleForceReload)
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
      window.dispatchEvent(new CustomEvent('testProductCreated'))
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

  const handleSaveProducts = () => {
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
  }

  const handleLoadProducts = () => {
    if (typeof window !== 'undefined') {
      const backup = localStorage.getItem("gang-boyz-products-backup")
      if (backup) {
        localStorage.setItem("gang-boyz-test-products", backup)
        window.dispatchEvent(new CustomEvent('forceProductsReload'))
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
        window.dispatchEvent(new CustomEvent('forceProductsReload'))
        
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
      window.dispatchEvent(new CustomEvent('forceProductsReload'))
      
      toast.success("Todos os produtos foram excluídos!")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-0">
        <div className="flex">
          {/* Sidebar de Filtros Admin */}
          <AdminProductFilters category={config.category} subcategory={config.subcategory} />
          
          {/* Conteúdo Principal */}
          <div className="flex-1 px-6 py-12">
            {/* Header da Página Admin */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 hover:border-red-400/50 hover:bg-white/20 transition-all duration-500">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-1.5 shadow-lg shadow-red-500/25">
                        <ArrowLeft className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-medium">Voltar ao Admin</span>
                    </div>
                  </div>
                </Link>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">
                    {config.adminTitle}
                  </h1>
                  <p className="text-gray-300 text-lg">{config.adminDescription}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveProducts}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Salvar
                </Button>
                
                <Button
                  onClick={handleLoadProducts}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Carregar
                </Button>
                
                <Button
                  onClick={handleExportProducts}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar
                </Button>
                
                <Button
                  onClick={handleDeleteAll}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Excluir Todos
                </Button>
                
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            </div>
            
            {/* Informações dos Produtos */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-blue-400 font-semibold">Produtos Salvos</div>
                  <div className="text-white text-2xl font-bold">{productsCount}</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-400 font-semibold">{config.subcategory}</div>
                  <div className="text-white text-2xl font-bold">{categoryProducts.length}</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-purple-400 font-semibold">Backup</div>
                  <div className="text-white text-2xl font-bold">
                    {hasBackup ? "✅" : "❌"}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categoryProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductTemplate
                    product={product}
                    onAddToCart={() => {}}
                  />
                  
                  {/* Botão de Excluir */}
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    title="Excluir produto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <FooterV2 />

      {/* Modal de Criação de Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Adicionar Produto - {config.subcategory}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Preview do Card */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-4">Preview do Card:</h3>
                <div className="flex justify-center">
                <div className="relative">
                  <ProductTemplate
                    product={{
                      id: newProduct.id,
                      name: newProduct.name,
                      price: newProduct.price,
                      originalPrice: newProduct.originalPrice,
                      color: newProduct.color,
                      image: newProduct.image,
                      categories: [newProduct.category, newProduct.subcategory].filter(Boolean) as string[],
                      sizes: ["P", "M", "G", "GG"],
                      discountPercentage: newProduct.originalPrice && newProduct.originalPrice > newProduct.price 
                        ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
                        : undefined,
                      installments: "3x sem juros",
                      brand: "Gang BoyZ",
                      isNew: true,
                      isPromotion: !!(newProduct.originalPrice && newProduct.originalPrice > newProduct.price),
                      description: `${newProduct.name} - Cor: ${newProduct.color}`,
                      status: "ativo" as const,
                      stock: 10
                    }}
                    onAddToCart={() => {}}
                  />
                  
                  {/* Etiqueta de Preview */}
                  {newProduct.label && newProduct.labelType && (
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white ${
                      newProduct.labelType === 'promocao' ? 'bg-red-500' :
                      newProduct.labelType === 'esgotado' ? 'bg-gray-600' :
                      'bg-blue-500'
                    }`}>
                      {newProduct.label}
                    </div>
                  )}
                </div>
                </div>
              </div>
              
              {/* Formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID do Produto */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    ID do Produto *
                  </Label>
                  <Input
                    value={newProduct.id}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="Ex: CC003"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Nome do Produto */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Nome do Produto *
                  </Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Camiseta Oversized White"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                {/* Preço */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Preço *
                  </Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="Ex: 54.90"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                {/* Preço Original */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Preço Original
                  </Label>
                  <Input
                    type="number"
                    value={newProduct.originalPrice || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: Number(e.target.value) || 0 }))}
                    placeholder="Ex: 84.90"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                  </div>
                  
                {/* Cor */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Cor <span className="text-red-500">*</span>
                  </Label>
                  <select
                    value={newProduct.color}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Selecione uma cor</option>
                    <option value="Preto">Preto</option>
                    <option value="Branco">Branco</option>
                    <option value="Azul">Azul</option>
                    <option value="Rosa">Rosa</option>
                    <option value="Bege">Bege</option>
                    <option value="Cinza">Cinza</option>
                    <option value="Vermelho">Vermelho</option>
                    <option value="Verde">Verde</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Roxo">Roxo</option>
                    <option value="Laranja">Laranja</option>
                    <option value="Marrom">Marrom</option>
                    <option value="Outro">Outro</option>
                  </select>
                  {newProduct.color === "Outro" && (
                    <Input
                      value={newProduct.color}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="Digite a cor personalizada"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 mt-2"
                    />
                  )}
                </div>
                  
                {/* Upload de Imagem */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Imagem do Produto
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                    {imagePreview && (
                      <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tipo de Etiqueta */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Tipo de Etiqueta <span className="text-gray-400 text-sm">(Opcional)</span>
                  </Label>
                  <select
                    value={newProduct.labelType || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, labelType: e.target.value as 'promocao' | 'esgotado' | 'personalizada' || undefined }))}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Sem etiqueta</option>
                    <option value="promocao">Promoção</option>
                    <option value="esgotado">Esgotado</option>
                    <option value="personalizada">Personalizada</option>
                  </select>
                </div>

                {/* Texto da Etiqueta */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Texto da Etiqueta <span className="text-gray-400 text-sm">(Opcional)</span>
                  </Label>
                  <Input
                    value={newProduct.label || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Ex: -50%, Esgotado, Novo, etc."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    disabled={!newProduct.labelType}
                  />
                </div>
                </div>
                
              {/* Informação da Categoria */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    Produto será automaticamente categorizado como: <strong>{config.category} - {config.subcategory}</strong>
                  </span>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                >
                  Criar Produto
                </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {deleteModalOpen && productToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">
                  Excluir Produto
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Tem certeza que deseja excluir o produto <strong>{productToDelete.name}</strong>?
                </p>
                
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
                  <p className="text-yellow-400 text-sm font-medium">
                    ⚠️ Ao excluir, favor recarregue a página
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => setDeleteModalOpen(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={confirmDeleteProduct}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
