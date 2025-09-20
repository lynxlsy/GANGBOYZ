"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCards } from "@/lib/cards-context"
import { CardProduct } from "@/lib/cards-context"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

export default function CardsManagementPage() {
  const { cardProducts, addCardProduct, updateCardProduct, deleteCardProduct } = useCards()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<CardProduct>>({
    name: "",
    price: 0,
    originalPrice: 0,
    image: "/placeholder-default.svg",
    color: "",
    categories: [],
    sizes: [],
    discountPercentage: 0,
    installments: "",
    brand: "Gang Boyz",
    isNew: false,
    isPromotion: false
  })

  const handleAdd = () => {
    if (formData.name && formData.price && formData.color) {
      const newProduct: CardProduct = {
        id: `CARD${Date.now()}`,
        name: formData.name,
        price: formData.price,
        originalPrice: formData.originalPrice,
        image: formData.image || "/placeholder-default.svg",
        color: formData.color,
        categories: formData.categories || [],
        sizes: formData.sizes || [],
        discountPercentage: formData.discountPercentage,
        installments: formData.installments,
        brand: formData.brand || "Gang Boyz",
        isNew: formData.isNew || false,
        isPromotion: formData.isPromotion || false
      }
      addCardProduct(newProduct)
      resetForm()
      setIsAdding(false)
    }
  }

  const handleEdit = (product: CardProduct) => {
    setFormData(product)
    setEditingId(product.id)
    setIsAdding(true)
  }

  const handleUpdate = () => {
    if (editingId && formData.name && formData.price && formData.color) {
      updateCardProduct(editingId, formData)
      resetForm()
      setIsAdding(false)
      setEditingId(null)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteCardProduct(id)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      color: "",
      categories: [],
      sizes: [],
      discountPercentage: 0,
      installments: "",
      brand: "Gang Boyz",
      isNew: false,
      isPromotion: false
    })
  }

  const cancelForm = () => {
    resetForm()
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-red-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Gerenciamento de Cards
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gerencie os produtos que aparecem nas páginas de categorias e homepage
            </p>
          </div>
        </div>

        {/* Botão de Adicionar */}
        <div className="mb-8">
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Novo Produto
          </Button>
        </div>

        {/* Formulário */}
        {isAdding && (
          <Card className="mb-8 bg-white/5 backdrop-blur-md border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5" />
                    Editar Produto
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Novo Produto
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Ex: Camiseta Oversized Gang Boyz"
                  />
                </div>
                <div>
                  <Label htmlFor="color" className="text-white">Cor</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Ex: Preto"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-white">Preço Atual</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="89.90"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice" className="text-white">Preço Original (opcional)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="129.90"
                  />
                </div>
                <div>
                  <Label htmlFor="image" className="text-white">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="/placeholder-default.svg"
                  />
                </div>
                <div>
                  <Label htmlFor="installments" className="text-white">Parcelamento</Label>
                  <Input
                    id="installments"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="3x de R$ 29.97"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="categories" className="text-white">Categorias (separadas por vírgula)</Label>
                  <Input
                    id="categories"
                    value={formData.categories?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, categories: e.target.value.split(",").map(c => c.trim()).filter(c => c) })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Camisetas, Oversized"
                  />
                </div>
                <div>
                  <Label htmlFor="sizes" className="text-white">Tamanhos (separados por vírgula)</Label>
                  <Input
                    id="sizes"
                    value={formData.sizes?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="P, M, G, GG"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded"
                  />
                  Produto Novo
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.isPromotion || false}
                    onChange={(e) => setFormData({ ...formData, isPromotion: e.target.checked })}
                    className="rounded"
                  />
                  Em Promoção
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Atualizar" : "Adicionar"}
                </Button>
                <Button
                  onClick={cancelForm}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardProducts.map((product) => (
            <Card key={product.id} className="bg-white/5 backdrop-blur-md border border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                    <p className="text-gray-400 text-sm">#{product.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">R$ {product.originalPrice.toFixed(2).replace(".", ",")}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-white border-white/20">
                      {product.color}
                    </Badge>
                    {product.isNew && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        Novo
                      </Badge>
                    )}
                    {product.isPromotion && (
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                        Promoção
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-400">
                    <div>Categorias: {product.categories.join(", ")}</div>
                    <div>Tamanhos: {product.sizes.join(", ")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estatísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">{cardProducts.length}</div>
            <div className="text-gray-400">Total de Produtos</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {cardProducts.filter(p => p.isPromotion).length}
            </div>
            <div className="text-gray-400">Em Promoção</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {cardProducts.filter(p => p.isNew).length}
            </div>
            <div className="text-gray-400">Lançamentos</div>
          </div>
          <div className="text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">
              {new Set(cardProducts.flatMap(p => p.categories)).size}
            </div>
            <div className="text-gray-400">Categorias</div>
          </div>
        </div>
      </div>
    </div>
  )
}






