"use client"

import { useState, useEffect, useMemo } from "react"
import { useProducts } from "@/lib/products-context-simple"

interface ProductFiltersProps {
  category: string
  subcategory?: string
  onFiltersChange?: (filters: any) => void
}

export function ProductFilters({ category, subcategory, onFiltersChange }: ProductFiltersProps) {
  const { products } = useProducts()
  
  // Filter states
  const [sortOption, setSortOption] = useState("mais-vendidos")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableSizes, setAvailableSizes] = useState<string[]>([])

  // Memoize color counts to prevent re-calculating on every render
  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(product => {
      if (product.color) {
        counts[product.color] = (counts[product.color] || 0) + 1
      }
    })
    return counts
  }, [products])

  // Memoize size counts to prevent re-calculating on every render
  const sizeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(product => {
      product.sizes.forEach(size => {
        counts[size] = (counts[size] || 0) + 1
      })
    })
    return counts
  }, [products])

  // Get breadcrumb text
  const getBreadcrumb = () => {
    if (subcategory) {
      return `Início . ${category.toUpperCase()} / ${subcategory.toUpperCase()}`
    }
    return `Início . ${category.toUpperCase()}`
  }

  // Extract available filter options from products
  useEffect(() => {
    if (products.length > 0) {
      // Get unique colors
      const colors = [...new Set(products
        .filter(p => p.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase() || 
          cat.toLowerCase().includes(category.toLowerCase())
        ))
        .map(p => p.color)
        .filter(Boolean)
      )] as string[]
      setAvailableColors(colors)

      // Get unique sizes (using clothing sizes)
      const sizes = ["P", "M", "G", "GG", "XG", "XXG"]
      setAvailableSizes(sizes)
    }
  }, [products, category])

  // Handle color filter change
  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors(prev => [...prev, color])
    } else {
      setSelectedColors(prev => prev.filter(c => c !== color))
    }
  }

  // Handle size filter change
  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes(prev => [...prev, size])
    } else {
      setSelectedSizes(prev => prev.filter(s => s !== size))
    }
  }

  // Handle label filter change
  const handleLabelChange = (label: string, checked: boolean) => {
    if (checked) {
      setSelectedLabels(prev => [...prev, label])
    } else {
      setSelectedLabels(prev => prev.filter(l => l !== label))
    }
  }

  // Handle price range change
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }))
  }

  // Apply filters
  const applyFilters = () => {
    const filters = {
      sortOption,
      colors: selectedColors,
      sizes: selectedSizes,
      labels: selectedLabels,
      priceRange
    }
    
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedLabels([])
    setPriceRange({ min: 0, max: 500 })
    setSortOption("mais-vendidos")
  }

  return (
    <div className="w-80 bg-black text-white min-h-screen">
      {/* Breadcrumb */}
      <div className="p-6 pb-0">
        <p className="text-sm text-gray-400 font-medium">{getBreadcrumb()}</p>
      </div>

      {/* Conteúdo da sidebar */}
      <div className="px-6 pb-6">
        {/* Título Principal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            {category}
          </h1>
        </div>

        {/* Ordenar por */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Ordenar por</h3>
          <div className="relative">
            <select 
              className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 pr-8 appearance-none focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
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
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1">Camisetas</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1">Jaquetas / Moletons</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1">Bermudas</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1">Calças</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1">Inverno</div>
          </div>
        </div>

        {/* Cor */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Cor</h3>
          <div className="space-y-3">
            {availableColors.map((color) => (
              <label key={color} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                  checked={selectedColors.includes(color)}
                  onChange={(e) => handleColorChange(color, e.target.checked)}
                />
                <span className="text-white group-hover:text-red-400 transition-colors duration-200">
                  {color} ({colorCounts[color] || 0})
                </span>
                <div 
                  className="w-4 h-4 rounded-full border border-gray-400"
                  style={{ 
                    backgroundColor: color.toLowerCase() === 'preto' ? 'black' : 
                                   color.toLowerCase() === 'branco' ? 'white' : 
                                   color.toLowerCase() === 'azul' ? 'blue' : 
                                   color.toLowerCase() === 'rosa' ? 'pink' : 
                                   color.toLowerCase() === 'verde' ? 'green' : 'gray'
                  }}
                ></div>
              </label>
            ))}
            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">Ver mais</button>
          </div>
        </div>

        {/* Tamanho */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Tamanho</h3>
          <div className="space-y-3">
            {availableSizes.map((size) => (
              <label key={size} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                  checked={selectedSizes.includes(size)}
                  onChange={(e) => handleSizeChange(size, e.target.checked)}
                />
                <span className="text-white group-hover:text-red-400 transition-colors duration-200">
                  {size} ({sizeCounts[size] || 0})
                </span>
              </label>
            ))}
            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">Ver mais</button>
          </div>
        </div>

        {/* Etiquetas */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Etiquetas</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                checked={selectedLabels.includes("Promoção")}
                onChange={(e) => handleLabelChange("Promoção", e.target.checked)}
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Promoção</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                checked={selectedLabels.includes("Esgotado")}
                onChange={(e) => handleLabelChange("Esgotado", e.target.checked)}
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Esgotado</span>
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                checked={selectedLabels.includes("Personalizada")}
                onChange={(e) => handleLabelChange("Personalizada", e.target.checked)}
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Personalizada</span>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                checked={selectedLabels.includes("Sem Etiqueta")}
                onChange={(e) => handleLabelChange("Sem Etiqueta", e.target.checked)}
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Sem Etiqueta</span>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </label>
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
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white text-sm mb-2 font-medium">Até</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                  placeholder="399.9"
                />
              </div>
            </div>
            <button 
              className="w-full red-bg hover:red-bg-hover text-white py-3 px-4 transition-all duration-200 font-semibold rounded-lg hover:shadow-lg red-glow"
              onClick={applyFilters}
            >
              Aplicar
            </button>
            <button 
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 transition-all duration-200 font-semibold rounded-lg"
              onClick={resetFilters}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
