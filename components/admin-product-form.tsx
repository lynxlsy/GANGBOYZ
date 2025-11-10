"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/lib/products-context-simple"
import { Upload, X, Plus } from "lucide-react"
import { generateID } from "@/lib/unified-id-system"
import { eventManager } from "@/lib/event-manager"

interface AdminProductFormProps {
  onSave: (product: Product) => void
  onCancel: () => void
  initialData?: Partial<Product>
}

// Adicionando interface para estoque por tamanho
interface SizeStock {
  [size: string]: number
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
    id: initialData?.id || generateID("product"),
    name: initialData?.name || "",
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || 0,
    stock: initialData?.stock || 0,
    image: initialData?.image || "/placeholder-default.svg",
    color: initialData?.color || "",
    material: initialData?.material || "",
    weight: initialData?.weight || "",
    dimensions: initialData?.dimensions || "",
    origin: initialData?.origin || "",
    care: initialData?.care || "",
    warranty: initialData?.warranty || "",
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    installments: initialData?.installments || "",
    sizes: initialData?.sizes || [] as string[],
    categories: initialData?.categories || [] as string[],
    isNew: initialData?.isNew || false,
    isPromotion: initialData?.isPromotion || false,
    status: initialData?.status || "ativo" as "ativo" | "inativo",
    sizeStock: initialData?.sizeStock || {} as Record<string, number>,
    discountPercentage: initialData?.discountPercentage || undefined,
    rating: initialData?.rating || undefined,
    reviews: initialData?.reviews || undefined,
    freeShippingText: initialData?.freeShippingText || "",
    freeShippingThreshold: initialData?.freeShippingThreshold || "",
    pickupText: initialData?.pickupText || "",
    pickupStatus: initialData?.pickupStatus || "",
    availableUnits: initialData?.availableUnits || undefined,
    availableSizes: initialData?.availableSizes || undefined,
    recommendationCategory: initialData?.recommendationCategory || "",
    destacarEmRecomendacoes: initialData?.destacarEmRecomendacoes || false,
    destacarEmOfertas: initialData?.destacarEmOfertas || false,
    destacarEmAlta: initialData?.destacarEmAlta || false,
    destacarLancamentos: initialData?.destacarLancamentos || false,
    label: initialData?.label || "",
    labelType: initialData?.labelType || ""
  })
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || [])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Função para atualizar estoque por tamanho
  const handleSizeStockChange = (size: string, stock: number) => {
    setFormData(prev => ({
      ...prev,
      sizeStock: {
        ...prev.sizeStock,
        [size]: stock
      }
    }))
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
      
      // Se remover um tamanho, também remove o estoque associado
      if (!newSizes.includes(size)) {
        setFormData(prevData => {
          const newSizeStock = { ...prevData.sizeStock }
          delete newSizeStock[size]
          return {
            ...prevData,
            sizes: newSizes,
            sizeStock: newSizeStock
          }
        })
      } else {
        setFormData(prevData => ({
          ...prevData,
          sizes: newSizes
        }))
      }
      
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
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.image || selectedSizes.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }
    
    // Create the product object
    const productToSave: Product = {
      ...formData,
      sizes: selectedSizes,
      categories: selectedCategories
    }

    onSave(productToSave)
    
    // Emitir evento para atualizar produtos em todas as páginas
    eventManager.emitThrottled('testProductCreated');
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
          {/* ID do Produto */}
          <div className="space-y-2">
            <Label htmlFor="id">ID do Produto</Label>
            <div className="relative">
              <Input
                id="id"
                value={formData.id}
                readOnly
                className="bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-400 rounded-xl h-11"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xs text-gray-500">Gerado automaticamente</span>
              </div>
            </div>
          </div>

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

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Produto</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o produto, suas características, benefícios..."
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Esta descrição aparecerá na página de detalhes do produto
            </p>
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

          {/* Estoque e Avaliações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                placeholder="10"
                required
              />
              <p className="text-sm text-gray-400">Quantidade disponível (opcional)</p>
            </div>

            {/* Removendo campos de avaliações
            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", parseFloat(e.target.value) || 0)}
                placeholder="4.5"
              />
              <p className="text-sm text-gray-400">Nota média do produto</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviews">Número de Avaliações</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => handleInputChange("reviews", parseInt(e.target.value) || 0)}
                placeholder="25"
              />
              <p className="text-sm text-gray-400">Total de avaliações</p>
            </div>
            */}
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

          {/* Estoque por tamanho */}
          {selectedSizes.length > 0 && (
            <div className="space-y-2">
              <Label>Estoque por Tamanho</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedSizes.map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <span className="w-12 text-sm font-medium text-gray-700">{size}:</span>
                    <Input
                      type="number"
                      min="0"
                      value={formData.sizeStock[size] || 0}
                      onChange={(e) => handleSizeStockChange(size, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorias */}
          <div className="space-y-2">
            <Label>Categorias</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange("color", color)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
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

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
                placeholder="100% Algodão"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="300g"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensões</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => handleInputChange("dimensions", e.target.value)}
                placeholder="70cm x 50cm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origem</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange("origin", e.target.value)}
                placeholder="Brasil"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="care">Instruções de Cuidado</Label>
            <Input
              id="care"
              value={formData.care}
              onChange={(e) => handleInputChange("care", e.target.value)}
              placeholder="Lavar à mão, não alvejar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warranty">Garantia</Label>
            <Input
              id="warranty"
              value={formData.warranty}
              onChange={(e) => handleInputChange("warranty", e.target.value)}
              placeholder="90 dias contra defeitos"
            />
          </div>

          {/* Destaques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Destaques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="isNew"
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => handleInputChange("isNew", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isNew">Novo Lançamento</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isPromotion"
                  type="checkbox"
                  checked={formData.isPromotion}
                  onChange={(e) => handleInputChange("isPromotion", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isPromotion">Em Promoção</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="destacarEmRecomendacoes"
                  type="checkbox"
                  checked={formData.destacarEmRecomendacoes}
                  onChange={(e) => handleInputChange("destacarEmRecomendacoes", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="destacarEmRecomendacoes">Destacar em Recomendações</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="destacarEmAlta"
                  type="checkbox"
                  checked={formData.destacarEmAlta}
                  onChange={(e) => handleInputChange("destacarEmAlta", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="destacarEmAlta">Destacar em "Em Alta"</Label>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}