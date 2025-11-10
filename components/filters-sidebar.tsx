"use client"

import { useState } from "react"
import { X, Filter } from "lucide-react"

interface FiltersSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function FiltersSidebar({ isOpen, onClose }: FiltersSidebarProps) {
  const [sortBy, setSortBy] = useState("mais-vendidos")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 399.9 })

  const categories = [
    "Camisetas",
    "Jaquetas / Moletons", 
    "Bermudas",
    "Calças",
    "Inverno"
  ]

  const colors = [
    { name: "Preto", count: 157, color: "bg-black" },
    { name: "Azul", count: 5, color: "bg-blue-500" },
    { name: "Rosa", count: 1, color: "bg-pink-500" },
    { name: "Verde", count: 2, color: "bg-green-500" },
    { name: "Branco", count: 88, color: "bg-white border border-gray-400" }
  ]

  const sizes = [
    { size: "38", count: 32 },
    { size: "40", count: 34 },
    { size: "42", count: 35 },
    { size: "44", count: 34 },
    { size: "46", count: 30 }
  ]

  const tags = [
    { name: "Promoção", color: "bg-red-500" },
    { name: "Esgotado", color: "bg-gray-600" },
    { name: "Personalizada", color: "bg-blue-500" },
    { name: "Sem Etiqueta", color: "bg-gray-400" }
  ]

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleApplyFilters = () => {
    // Aqui você pode implementar a lógica de filtros
    console.log("Aplicando filtros:", {
      sortBy,
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      tags: selectedTags,
      priceRange
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[80] md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="md:hidden fixed left-0 top-0 h-full w-full max-w-sm bg-black/95 backdrop-blur-md border-r border-white/20 z-[90] transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white" />
              <h2 className="text-white font-bold text-lg">Filtros</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors duration-200 group"
            >
              <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Ordenar por */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Ordenar por</h3>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 pr-8 appearance-none focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <option value="mais-vendidos" className="bg-gray-900">Mais Vendidos</option>
                  <option value="menor-preco" className="bg-gray-900">Menor Preço</option>
                  <option value="maior-preco" className="bg-gray-900">Maior Preço</option>
                  <option value="mais-recentes" className="bg-gray-900">Mais Recentes</option>
                  <option value="melhor-avaliados" className="bg-gray-900">Melhor Avaliados</option>
                </select>
              </div>
            </div>

            {/* Categorias */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Categorias</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div 
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-2 px-2 rounded ${
                      selectedCategories.includes(category) ? 'bg-red-500/20 text-red-400' : ''
                    }`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Cor</h3>
              <div className="space-y-3">
                {colors.map((color) => (
                  <label key={color.name} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={selectedColors.includes(color.name)}
                      onChange={() => handleColorToggle(color.name)}
                      className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded"
                    />
                    <span className="text-white group-hover:text-red-400 transition-colors duration-200">
                      {color.name} ({color.count})
                    </span>
                    <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                  </label>
                ))}
                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
                  Ver mais
                </button>
              </div>
            </div>

            {/* Tamanho */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Tamanho</h3>
              <div className="space-y-3">
                {sizes.map((size) => (
                  <label key={size.size} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={selectedSizes.includes(size.size)}
                      onChange={() => handleSizeToggle(size.size)}
                      className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded"
                    />
                    <span className="text-white group-hover:text-red-400 transition-colors duration-200">
                      {size.size} ({size.count})
                    </span>
                  </label>
                ))}
                <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
                  Ver mais
                </button>
              </div>
            </div>

            {/* Etiquetas */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Etiquetas</h3>
              <div className="space-y-3">
                {tags.map((tag) => (
                  <label key={tag.name} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => handleTagToggle(tag.name)}
                      className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded"
                    />
                    <span className="text-white group-hover:text-red-400 transition-colors duration-200">
                      {tag.name}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${tag.color}`}></div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Preço</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-white text-sm mb-2 font-medium">De</label>
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-white text-sm mb-2 font-medium">Até</label>
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                      placeholder="399.9"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleApplyFilters}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 transition-all duration-200 font-semibold rounded-lg hover:shadow-lg"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



