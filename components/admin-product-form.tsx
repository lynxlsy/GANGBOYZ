"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/lib/demo-products"
import { Upload, X, Plus } from "lucide-react"

interface AdminProductFormProps {
  onSave: (product: Omit<Product, "id">) => void
  onCancel: () => void
  initialData?: Partial<Product>
}

const AVAILABLE_CATEGORIES = [
  "Camisetas",
  "Moletons", 
  "Jaquetas",
  "Calças",
  "Shorts/Bermudas",
  "Bonés",
  "Acessórios"
]

const AVAILABLE_COLORS = [
  "Preto",
  "Branco", 
  "Azul",
  "Vermelho",
  "Verde",
  "Amarelo",
  "Rosa",
  "Cinza",
  "Marrom",
  "Roxo"
]

const AVAILABLE_SIZES = [
  "PP", "P", "M", "G", "GG", "XG",
  "34", "36", "38", "40", "42", "44", "46", "48", "50"
]

export function AdminProductForm({ onSave, onCancel, initialData }: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || 0,
    image: initialData?.image || "",
    isNew: initialData?.isNew || false,
    isPromotion: initialData?.isPromotion || false,
    installments: initialData?.installments || "",
    brand: initialData?.brand || "Gang Boyz",
    sizes: initialData?.sizes || [],
    color: initialData?.color || "",
    categories: initialData?.categories || [],
    discountPercentage: initialData?.discountPercentage || 0,
    stock: initialData?.stock || 0
  })

  const [selectedSizes, setSelectedSizes] = useState<string[]>(formData.sizes)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(formData.categories)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
      
      setFormData(prevData => ({
        ...prevData,
        sizes: newSizes
      }))
      
      return newSizes
    })
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
      
      setFormData(prevData => ({
        ...prevData,
        categories: newCategories
      }))
      
      return newCategories
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.image) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    if (selectedSizes.length === 0) {
      alert("Selecione pelo menos um tamanho.")
      return
    }

    if (selectedCategories.length === 0) {
      alert("Selecione pelo menos uma categoria.")
      return
    }

    if (!formData.color) {
      alert("Selecione uma cor.")
      return
    }

    onSave({
      ...formData,
      sizes: selectedSizes,
      categories: selectedCategories
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Adicionar Produto - Card 1 (Card Completo)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Jaqueta Bomber Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="Gang Boyz"
              />
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Preço Atual *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                placeholder="299.90"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Preço Original</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange("originalPrice", parseFloat(e.target.value) || 0)}
                placeholder="399.90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installments">Parcelamento</Label>
              <Input
                id="installments"
                value={formData.installments}
                onChange={(e) => handleInputChange("installments", e.target.value)}
                placeholder="6x de R$ 49,98"
              />
            </div>
          </div>

          {/* Estoque */}
          <div className="space-y-2">
            <Label htmlFor="stock">Quantidade em Estoque</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
              placeholder="50"
            />
            <p className="text-sm text-gray-400">Digite a quantidade disponível deste produto (opcional)</p>
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem *</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="/imagem-produto.jpg"
                required
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              A foto deve ser retangular sem bordas arredondadas
            </p>
          </div>

          {/* Tamanhos */}
          <div className="space-y-2">
            <Label>Tamanhos Disponíveis *</Label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Selecione os tamanhos disponíveis para este produto
            </p>
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <Label>Cor *</Label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange("color", color)}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    formData.color === color
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-2">
            <Label>Categorias *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AVAILABLE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Status do Produto */}
          <div className="flex gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => handleInputChange("isNew", e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Produto Novo</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPromotion}
                onChange={(e) => handleInputChange("isPromotion", e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Em Promoção</span>
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Produto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
