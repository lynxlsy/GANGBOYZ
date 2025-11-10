"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { ProductFilters } from "@/components/product-filters"

interface MobileFiltersButtonProps {
  category: string
  subcategory?: string
}

export function MobileFiltersButton({ category, subcategory = "Todos" }: MobileFiltersButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão de Filtros - Mobile */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
        </button>
      </div>

      {/* Sidebar de Filtros Mobile */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[80] md:hidden animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar - Direita */}
          <div className="md:hidden fixed right-0 top-0 h-full w-full max-w-sm bg-black/95 backdrop-blur-md border-l border-white/20 z-[90] transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-300 transition-colors duration-200 group"
                >
                  <X className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-white" />
                  <h2 className="text-white font-bold text-lg">Filtros</h2>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <ProductFilters category={category} subcategory={subcategory} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}



