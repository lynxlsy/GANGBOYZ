"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Edit, Save, X, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface OfferProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  isNew: boolean
  isPromotion: boolean
  installments: string
  brand: string
}

export default function OfertasPage() {
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<OfferProduct>>({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "/placeholder-default.svg",
    isNew: true,
    isPromotion: true,
    installments: "",
    brand: "Gang Boyz"
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Carregar produtos de oferta do localStorage
  useEffect(() => {
    const loadOfferProducts = () => {
      const savedProducts = localStorage.getItem("gang-boyz-standalone-products")
      if (savedProducts) {
        setOfferProducts(JSON.parse(savedProducts))
      }
    }
    loadOfferProducts()
  }, [])

  // Salvar produtos de oferta no localStorage
  const saveOfferProducts = (products: OfferProduct[]) => {
    localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(products))
    setOfferProducts(products)
    // Disparar evento para atualizar componentes
    window.dispatchEvent(new CustomEvent('productsUpdated'))
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

    const product: OfferProduct = {
      id: `OFFER${String(offerProducts.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      description: newProduct.description || "",
      price: newProduct.price,
      originalPrice: newProduct.originalPrice || newProduct.price,
      image: newProduct.image,
      isNew: newProduct.isNew || true,
      isPromotion: newProduct.isPromotion || true,
      installments: newProduct.installments || "",
      brand: newProduct.brand || "Gang Boyz"
    }

    saveOfferProducts([...offerProducts, product])
    
    // Limpar campos
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      isNew: true,
      isPromotion: true,
      installments: "",
      brand: "Gang Boyz"
    })
    setSelectedFile(null)
    setImagePreview("")
    
    toast.success("Produto adicionado com sucesso!")
  }

  // Editar produto
  const startEdit = (product: OfferProduct) => {
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

    const updatedProducts = offerProducts.map(product =>
      product.id === editingProduct
        ? {
            ...product,
            name: newProduct.name,
            description: newProduct.description || "",
            price: newProduct.price,
            originalPrice: newProduct.originalPrice || newProduct.price,
            image: newProduct.image,
            isNew: newProduct.isNew || true,
            isPromotion: newProduct.isPromotion || true,
            installments: newProduct.installments || "",
            brand: newProduct.brand || "Gang Boyz"
          }
        : product
    )

    saveOfferProducts(updatedProducts)
    setEditingProduct(null)
    
    // Limpar campos
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      isNew: true,
      isPromotion: true,
      installments: "",
      brand: "Gang Boyz"
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
      isNew: true,
      isPromotion: true,
      installments: "",
      brand: "Gang Boyz"
    })
    setSelectedFile(null)
    setImagePreview("")
  }

  // Deletar produto
  const deleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      const updatedProducts = offerProducts.filter(product => product.id !== id)
      saveOfferProducts(updatedProducts)
      toast.success("Produto deletado com sucesso!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">Ofertas Especiais</h1>
            <p className="text-gray-300">Gerencie os produtos exibidos na seção "OFERTAS"</p>
          </div>
        </div>

        {/* Formulário de Nova Oferta */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Editar Oferta' : 'Adicionar Nova Oferta'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Ex: Kit Completo Streetwear"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Breve descrição da oferta"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                placeholder="Ex: Gang Boyz"
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
                placeholder="499.90"
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
                placeholder="699.90"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="installments">Parcelamento</Label>
              <Input
                id="installments"
                value={newProduct.installments}
                onChange={(e) => setNewProduct({...newProduct, installments: e.target.value})}
                placeholder="Ex: 12x de R$ 41,66"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct({...newProduct, isNew: e.target.checked})}
                  className="mr-2"
                />
                <Label htmlFor="isNew">Produto Novo</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPromotion"
                  checked={newProduct.isPromotion}
                  onChange={(e) => setNewProduct({...newProduct, isPromotion: e.target.checked})}
                  className="mr-2"
                />
                <Label htmlFor="isPromotion">Em Promoção</Label>
              </div>
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
                Adicionar Oferta
              </Button>
            )}
          </div>
        </Card>

        {/* Lista de Ofertas - Mesma proporção da homepage */}
        <div className="grid grid-cols-6 gap-3 md:gap-4">
          {offerProducts.map((product) => (
            <div key={product.id} className="w-full">
              {/* Preview da Oferta - Mesma altura da homepage */}
              <div className="relative h-64 md:h-72 rounded-lg overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.isNew && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                      NOVO
                    </div>
                  )}
                  {product.isPromotion && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      PROMOÇÃO
                    </div>
                  )}
                </div>
              </div>

              {/* Informações da Oferta - Mesmo estilo da homepage */}
              <div className="text-white">
                <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                <div className="text-red-500 font-bold text-lg md:text-xl">R$ {product.price.toFixed(2)}</div>
                {product.originalPrice > product.price && (
                  <div className="text-gray-400 line-through text-sm">R$ {product.originalPrice.toFixed(2)}</div>
                )}
                {product.installments && (
                  <div className="text-gray-400 text-xs">{product.installments}</div>
                )}
                <div className="text-gray-400 text-xs">ID: {product.id}</div>
                <div className="text-gray-400 text-xs">Marca: {product.brand}</div>
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

        {offerProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhuma oferta cadastrada</p>
            <p className="text-gray-500 text-sm">Adicione ofertas para exibir na seção "OFERTAS"</p>
          </div>
        )}
      </div>
    </div>
  )
}