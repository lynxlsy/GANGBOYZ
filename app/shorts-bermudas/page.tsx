"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

export default function ShortsBermudasPage() {
  const subcategories = [
    { 
      name: "Esportivo", 
      href: "/shorts-bermudas/esportivo",
      description: "Shorts para atividades físicas",
      image: "/placeholder-category-circle.png"
    },
    { 
      name: "Casual", 
      href: "/shorts-bermudas/casual",
      description: "Shorts para o dia a dia",
      image: "/placeholder-category-circle.png"
    },
    { 
      name: "Praia", 
      href: "/shorts-bermudas/praia",
      description: "Shorts para praia e piscina",
      image: "/placeholder-category-circle.png"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Espaçamento para o header */}
      <div className="h-[180px]"></div>
      
      <main className="pt-0">
        <div className="flex">
          {/* Conteúdo Principal */}
          <div className="flex-1 py-4 pl-0 md:pl-8">
            {/* Header da Categoria */}
            <div className="px-4 md:px-8 py-8">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">Shorts/Bermudas</h1>
                <p className="text-gray-400">Escolha seu estilo: {subcategories.length} categorias disponíveis</p>
              </div>
            </div>

            {/* Grid de Subcategorias */}
            <div className="px-4 md:px-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {subcategories.map((subcategory) => (
                  <Link 
                    key={subcategory.name}
                    href={subcategory.href}
                    className="group block bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer border border-gray-800 hover:border-gray-700"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Imagem da categoria */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 bg-gray-800 flex items-center justify-center">
                        <img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Nome da subcategoria */}
                      <h3 className="font-bold text-white text-sm md:text-base mb-1 group-hover:text-red-400 transition-colors">
                        {subcategory.name}
                      </h3>
                      
                      {/* Descrição */}
                      <p className="text-gray-400 text-xs md:text-sm mb-2 line-clamp-2">
                        {subcategory.description}
                      </p>
                      
                      {/* Ícone de navegação */}
                      <div className="mt-2 text-red-500 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}