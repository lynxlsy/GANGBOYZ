"use client"

import { useState } from "react"

interface ProductFiltersProps {
  category: string
  subcategory?: string
}

export function ProductFilters({ category, subcategory }: ProductFiltersProps) {
  const getBreadcrumb = () => {
    if (subcategory) {
      return `Início . ${category.toUpperCase()} / ${subcategory.toUpperCase()}`
    }
    return `Início . ${category.toUpperCase()}`
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
            <select className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 pr-8 appearance-none focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200">
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
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Preto (157)</span>
              <div className="w-4 h-4 rounded-full bg-black border border-gray-400"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Azul (5)</span>
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Rosa (1)</span>
              <div className="w-4 h-4 rounded-full bg-pink-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Verde (2)</span>
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Branco (88)</span>
              <div className="w-4 h-4 rounded-full bg-white border border-gray-400"></div>
            </label>
            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">Ver mais</button>
          </div>
        </div>

        {/* Tamanho */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Tamanho</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">38 (32)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">40 (34)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">42 (35)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">44 (34)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">46 (30)</span>
            </label>
            <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">Ver mais</button>
          </div>
        </div>

        {/* Etiquetas */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Etiquetas</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Promoção</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Esgotado</span>
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
              <span className="text-white group-hover:text-red-400 transition-colors duration-200">Personalizada</span>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 bg-gray-900 border border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2 rounded" />
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
                  defaultValue="0"
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white text-sm mb-2 font-medium">Até</label>
                <input
                  type="number"
                  defaultValue="399.9"
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200"
                  placeholder="399.9"
                />
              </div>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 transition-all duration-200 font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/25">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
