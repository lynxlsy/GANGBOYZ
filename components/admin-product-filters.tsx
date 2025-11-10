"use client"

import { useState } from "react"

interface AdminProductFiltersProps {
  category: string
  subcategory?: string
  onFilterChange?: (filters: any) => void
}

export function AdminProductFilters({ category, subcategory, onFilterChange }: AdminProductFiltersProps) {
  const [filters, setFilters] = useState({
    labels: {
      promocao: false,
      esgotado: false,
      personalizada: false,
      semEtiqueta: false
    },
    sortBy: "mais-recentes",
    priceRange: {
      min: 0,
      max: 1000
    }
  })

  const handleLabelFilter = (labelType: string) => {
    const newFilters = {
      ...filters,
      labels: {
        ...filters.labels,
        [labelType]: !filters.labels[labelType as keyof typeof filters.labels]
      }
    }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const getBreadcrumb = () => {
    if (subcategory) {
      return `Admin . ${category.toUpperCase()} / ${subcategory.toUpperCase()}`
    }
    return `Admin . ${category.toUpperCase()}`
  }

  return (
    <div className="w-80 bg-black text-white min-h-screen border-r border-gray-800">
      {/* Breadcrumb */}
      <div className="p-6 pb-0">
        <p className="text-sm text-gray-400 font-medium">{getBreadcrumb()}</p>
      </div>

      {/* Conteúdo da sidebar */}
      <div className="px-6 pb-6">
        {/* Título Principal */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
            Admin - {category}
          </h1>
          <p className="text-gray-400 text-sm mt-2">Filtros e Controles</p>
        </div>

        {/* Ordenar por */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Ordenar por</h3>
          <div className="relative">
            <select 
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 pr-8 appearance-none focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
            >
              <option value="mais-recentes" className="bg-gray-900">Mais Recentes</option>
              <option value="mais-vendidos" className="bg-gray-900">Mais Vendidos</option>
              <option value="menor-preco" className="bg-gray-900">Menor Preço</option>
              <option value="maior-preco" className="bg-gray-900">Maior Preço</option>
              <option value="alfabetica" className="bg-gray-900">Ordem Alfabética</option>
            </select>
          </div>
        </div>

        {/* Etiquetas */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Filtrar por Etiquetas</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.labels.promocao}
                onChange={() => handleLabelFilter('promocao')}
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Promoção</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.labels.esgotado}
                onChange={() => handleLabelFilter('esgotado')}
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Esgotado</span>
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.labels.personalizada}
                onChange={() => handleLabelFilter('personalizada')}
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Personalizada</span>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={filters.labels.semEtiqueta}
                onChange={() => handleLabelFilter('semEtiqueta')}
                className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
              />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Sem Etiqueta</span>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </label>
          </div>
        </div>

        {/* Status dos Produtos */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Status</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Ativos</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Inativos</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Todos</span>
            </label>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 transition-all duration-200 font-semibold rounded-lg text-sm">
              Limpar Filtros
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 transition-all duration-200 font-semibold rounded-lg text-sm">
              Exportar Filtrados
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

