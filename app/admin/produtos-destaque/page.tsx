"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Edit, Save, X, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AdminLayout } from "@/components/admin-layout"

interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export default function ProdutosDestaquePage() {
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<HotProduct>>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Carregar produtos HOT do localStorage
  useEffect(() => {
    const loadHotProducts = () => {
      const savedProducts = localStorage.getItem("gang-boyz-hot-products")
      if (savedProducts) {
        setHotProducts(JSON.parse(savedProducts))
      }
    }
    loadHotProducts()
  }, [])

  // Salvar produtos HOT no localStorage
  const saveHotProducts = (products: HotProduct[]) => {
    localStorage.setItem("gang-boyz-hot-products", JSON.stringify(products))
    setHotProducts(products)
    // Disparar evento para atualizar componentes
    window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
  }

  // Selecionar imagem
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setNewProduct({...newProduct, image: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  // Adicionar produto
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Nome, preço e imagem são obrigatórios!")
      return
    }

    const product: HotProduct = {
      id: `HOT${String(hotProducts.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      description: newProduct.description || "",
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || newProduct.price,
      image: newProduct.image,
      category: newProduct.category || "Produtos",
      isActive: true
    }

    saveHotProducts([...hotProducts, product])
    
    // Limpar campos
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      category: "Produtos",
      isActive: true
    })
    setSelectedFile(null)
    setImagePreview("")
    
    toast.success("Produto adicionado com sucesso!")
  }

  // Editar produto
  const startEdit = (product: HotProduct) => {
    setEditingProduct(product.id)
    setNewProduct(product)
    setImagePreview(product.image)
  }

  // Salvar edição
  const saveEdit = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Nome, preço e imagem são obrigatórios!")
      return
    }

    const updatedProducts = hotProducts.map(product =>
      product.id === editingProduct
        ? {
            ...product,
            name: newProduct.name,
            description: newProduct.description || "",
            price: newProduct.price,
            originalPrice: newProduct.originalPrice || newProduct.price,
            image: newProduct.image,
            category: newProduct.category || "Produtos"
          }
        : product
    )

    saveHotProducts(updatedProducts)
    setEditingProduct(null)
    
    // Limpar campos
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      category: "Produtos",
      isActive: true
    })
    setSelectedFile(null)
    setImagePreview("")
    
    toast.success("Produto atualizado com sucesso!")
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingProduct(null)
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      category: "Produtos",
      isActive: true
    })
    setSelectedFile(null)
    setImagePreview("")
  }

  // Deletar produto
  const deleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      const updatedProducts = hotProducts.filter(product => product.id !== id)
      saveHotProducts(updatedProducts)
      toast.success("Produto deletado com sucesso!")
    }
  }

  return (
    <AdminLayout 
      title="Produtos em Destaque" 
      subtitle="Gerencie os produtos exibidos na seção HOT"
    >

        {/* Formulário de Novo Produto */}
        <Card className="p-6 mb-8 bg-white border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">Nome do Produto *</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Ex: Jaqueta Oversized Premium"
                className="mt-1 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-700 font-medium">Descrição</Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Breve descrição do produto"
                className="mt-1 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                placeholder="Ex: Produtos"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price">Preço *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                placeholder="299.90"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Preço Original</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value)})}
                placeholder="399.90"
                className="mt-1"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="image">Imagem do Produto *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              <strong>Formato ideal:</strong> JPG ou PNG, proporção 3:4 (vertical), resolução mínima 320x427px, tamanho máximo 5MB.
            </p>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {editingProduct ? (
              <>
                <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={addProduct} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            )}
          </div>
        </Card>

        {/* Lista de Produtos - Mesma proporção da homepage */}
        <div className="grid grid-cols-6 gap-3 md:gap-4">
          {hotProducts.map((product) => (
            <div key={product.id} className="w-full">
              {/* Preview do Produto - Mesma altura da homepage */}
              <div className="relative h-64 md:h-72 rounded-lg overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  HOT
                </div>
              </div>

              {/* Informações do Produto - Mesmo estilo da homepage */}
              <div className="text-white">
                <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                <div className="text-red-500 font-bold text-lg md:text-xl">R$ {product.price.toFixed(2)}</div>
                {product.originalPrice > product.price && (
                  <div className="text-gray-400 line-through text-sm">R$ {product.originalPrice.toFixed(2)}</div>
                )}
                <div className="text-gray-400 text-xs">ID: {product.id}</div>
                <div className="text-gray-400 text-xs">Categoria: {product.category}</div>
              </div>

              {/* Botões de Ação - Compactos */}
              <div className="flex gap-1 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(product)}
                  className="flex-1 text-xs px-2 py-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteProduct(product.id)}
                  className="px-2 py-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {hotProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhum produto em destaque cadastrado</p>
            <p className="text-gray-500 text-sm">Adicione produtos para exibir na seção "PRODUTOS EM DESTAQUE"</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
