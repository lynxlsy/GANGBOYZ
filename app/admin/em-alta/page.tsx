"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProductTemplate } from "@/components/product-template"
import { FooterV2 } from "@/components/footer-v2"
import { useProducts } from "@/lib/products-context-simple"
import { ArrowLeft, Plus, X, Save, Download, Upload, Trash2, Edit, Flame } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AdminProductFilters } from "@/components/admin-product-filters"

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

export default function AdminEmAltaPage() {
  const { products } = useProducts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<AdminProduct>({
    id: "",
    name: "",
    price: 0,
    originalPrice: 0,
    color: "",
    image: "/placeholder-default.svg",
    category: "Em Alta",
    subcategory: "Promoção",
    label: "HOT",
    labelType: "promocao"
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [productsCount, setProductsCount] = useState(0)
  const [hasBackup, setHasBackup] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<AdminProduct | null>(null)

  // Filtrar produtos marcados como "Promoção" ou com label "HOT"
  const emAlta = products.filter(product => 
    product.isPromotion === true || 
    product.label === "HOT" || 
    product.labelType === "promocao" ||
    product.categories?.some(cat => cat.toLowerCase().includes("em alta"))
  )

  // Carregar produtos automaticamente quando a página abrir
  useEffect(() => {
    const loadProductsOnMount = () => {
      if (typeof window !== 'undefined') {
        const testProducts = localStorage.getItem("gang-boyz-test-products")
        if (testProducts) {
          window.dispatchEvent(new CustomEvent('testProductCreated'))
        }
        updateCounters()
      }
    }

    const updateCounters = () => {
      if (typeof window !== 'undefined') {
        const testProducts = localStorage.getItem("gang-boyz-test-products")
        const backup = localStorage.getItem("gang-boyz-products-backup")
        
        setProductsCount(testProducts ? JSON.parse(testProducts).length : 0)
        setHasBackup(!!backup)
      }
    }

    loadProductsOnMount()
  }, [])

  // Escutar eventos de atualização para refresh em tempo real
  useEffect(() => {
    const handleProductUpdate = () => {
      setRefreshTrigger(prev => prev + 1)
    }

    window.addEventListener('testProductCreated', handleProductUpdate)
    window.addEventListener('forceProductsReload', handleProductUpdate)
    
    return () => {
      window.removeEventListener('testProductCreated', handleProductUpdate)
      window.removeEventListener('forceProductsReload', handleProductUpdate)
    }
  }, [])

  const handleAddToCart = (product: any) => {
    // Função não implementada para admin
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
    if (!newProduct.id || !newProduct.name || !newProduct.color || newProduct.price <= 0) {
      toast.error("Preencha todos os campos obrigatórios!")
      return
    }

    const product: AdminProduct = {
      ...newProduct,
      id: newProduct.id.toUpperCase()
    }

    if (typeof window !== 'undefined') {
      const existingProducts = JSON.parse(localStorage.getItem("gang-boyz-test-products") || "[]")
      const updatedProducts = [...existingProducts, product]
      localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
      
      setProductsCount(updatedProducts.length)
      window.dispatchEvent(new CustomEvent('testProductCreated'))
    }
    
    setIsModalOpen(false)
    
    setNewProduct({
      id: "",
      name: "",
      price: 0,
      originalPrice: 0,
      color: "",
      image: "/placeholder-default.svg",
      category: "Em Alta",
      subcategory: "Promoção",
      label: "HOT",
      labelType: "promocao"
    })
    setSelectedImage(null)
    setImagePreview("")
    
    toast.success(`Produto criado com sucesso na categoria ${product.category}!`)
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
      const backupProducts = localStorage.getItem("gang-boyz-products-backup")
      if (backupProducts) {
        localStorage.setItem("gang-boyz-test-products", backupProducts)
        window.dispatchEvent(new CustomEvent('testProductCreated'))
        setProductsCount(JSON.parse(backupProducts).length)
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
          const blob = new Blob([testProducts], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          
          const downloadAnchorNode = document.createElement('a')
          downloadAnchorNode.setAttribute("href", url)
          downloadAnchorNode.setAttribute("download", "gang-boyz-products.json")
          downloadAnchorNode.style.display = 'none'
          document.body.appendChild(downloadAnchorNode)
          downloadAnchorNode.click()
          
          document.body.removeChild(downloadAnchorNode)
          URL.revokeObjectURL(url)
          
          toast.success("Produtos exportados com sucesso!")
        } catch (error) {
          console.error("Erro ao exportar produtos:", error)
          toast.error("Erro ao exportar produtos!")
        }
      } else {
        toast.error("Nenhum produto para exportar!")
      }
    }
  }

  const handleDeleteProduct = (product: any) => {
    const adminProduct: AdminProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: product.color,
      image: product.image,
      category: product.categories?.[0] || "Em Alta",
      subcategory: product.categories?.[1] || "Promoção",
      label: product.label || "HOT",
      labelType: product.labelType || "promocao"
    }
    
    setProductToDelete(adminProduct)
    setDeleteModalOpen(true)
  }

  const confirmDeleteProduct = () => {
    if (productToDelete && typeof window !== 'undefined') {
      const testProducts = localStorage.getItem("gang-boyz-test-products")
      
      if (testProducts) {
        const products = JSON.parse(testProducts)
        const updatedProducts = products.filter((product: AdminProduct) => product.id !== productToDelete.id)
        
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
        
        setProductsCount(updatedProducts.length)
        setRefreshTrigger(prev => prev + 1)
        
        window.dispatchEvent(new CustomEvent('testProductCreated'))
        window.dispatchEvent(new CustomEvent('forceProductsReload'))
        
        toast.success(`Produto "${productToDelete.name}" excluído com sucesso! Recarregue a página para ver as mudanças.`)
      } else {
        toast.error("Nenhum produto encontrado para excluir!")
      }
    }
    
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleEditProduct = (product: any) => {
    const adminProduct: AdminProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: product.color,
      image: product.image,
      category: product.categories?.[0] || "Em Alta",
      subcategory: product.categories?.[1] || "Promoção",
      label: product.label || "HOT",
      labelType: product.labelType || "promocao"
    }
    
    setProductToEdit(adminProduct)
    setEditModalOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!productToEdit?.id || !productToEdit?.name || !productToEdit?.color || productToEdit?.price <= 0) {
      toast.error("Preencha todos os campos obrigatórios!")
      return
    }

    if (typeof window !== 'undefined') {
      const testProducts = localStorage.getItem("gang-boyz-test-products")
      
      if (testProducts) {
        const products = JSON.parse(testProducts)
        const updatedProducts = products.map((product: AdminProduct) => {
          if (product.id === productToEdit.id) {
            return productToEdit
          }
          return product
        })
        
        localStorage.setItem("gang-boyz-test-products", JSON.stringify(updatedProducts))
        
        setRefreshTrigger(prev => prev + 1)
        
        window.dispatchEvent(new CustomEvent('testProductCreated'))
        window.dispatchEvent(new CustomEvent('forceProductsReload'))
        
        toast.success(`Produto "${productToEdit.name}" atualizado com sucesso!`)
      }
    }
    
    setEditModalOpen(false)
    setProductToEdit(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-0">
        <div className="flex">
          {/* Sidebar de Filtros Admin */}
          <AdminProductFilters category="Em Alta" subcategory="Promoção" />
          
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
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Flame className="h-10 w-10 text-red-400" />
                    Admin - Em Alta
                  </h1>
                  <p className="text-gray-300 text-lg">Gerencie os produtos mais vendidos e em alta demanda</p>
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
                  onClick={() => {
                    if (confirm("Tem certeza que deseja excluir TODOS os produtos? Esta ação não pode ser desfeita!\n\n⚠️ Ao excluir, favor recarregue a página")) {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem("gang-boyz-test-products")
                        setProductsCount(0)
                        setRefreshTrigger(prev => prev + 1)
                        window.dispatchEvent(new CustomEvent('testProductCreated'))
                        window.dispatchEvent(new CustomEvent('forceProductsReload'))
                        toast.success("Todos os produtos foram excluídos! Recarregue a página para ver as mudanças.")
                      }
                    }
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Excluir Todos
                </Button>
                
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Produto em Alta
                </Button>
              </div>
            </div>
            
            {/* Informações dos Produtos */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-4">📊 Status dos Produtos em Alta</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="text-red-400 font-semibold">Produtos Salvos</div>
                  <div className="text-white text-2xl font-bold">{productsCount}</div>
                </div>
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                  <div className="text-orange-400 font-semibold">Em Alta</div>
                  <div className="text-white text-2xl font-bold">{emAlta.length}</div>
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
            <div className="flex flex-wrap gap-8 justify-center">
              {emAlta.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductTemplate
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                  
                  {/* Botões de Ação */}
                  <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Botão de Editar */}
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg hover:scale-110 transition-all duration-300"
                      title="Editar produto"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    {/* Botão de Excluir */}
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg hover:scale-110 transition-all duration-300"
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Adicionar Produto em Alta</h2>
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
                        isNew: false,
                        isPromotion: true,
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
                    placeholder="Ex: EA001"
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
                    placeholder="Ex: Produto Gang BoyZ em Alta"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Preço */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Preço Atual *
                  </Label>
                  <Input
                    type="number" 
                    step="0.01"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="Ex: 99.90"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Preço Original */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Preço Original (opcional)
                  </Label>
                  <Input
                    type="number" 
                    step="0.01"
                    value={newProduct.originalPrice || ""}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || undefined }))}
                    placeholder="Ex: 149.90"
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
                    placeholder="Ex: HOT, Em Alta, etc."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    disabled={!newProduct.labelType}
                  />
                </div>
              </div>
              
              {/* Informação da Categoria */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    Produto será automaticamente categorizado como: <strong>Em Alta - Promoção</strong>
                  </span>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                >
                  Criar Produto em Alta
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Excluir Produto em Alta
              </h2>
              
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir o produto <strong>"{productToDelete.name}"</strong>?
                <br />
                <span className="text-red-400 text-sm">Esta ação não pode ser desfeita!</span>
                <br />
                <span className="text-yellow-400 text-sm font-semibold">⚠️ Ao excluir, favor recarregue a página</span>
              </p>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setDeleteModalOpen(false)
                    setProductToDelete(null)
                  }}
                  variant="outline"
                  className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
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
