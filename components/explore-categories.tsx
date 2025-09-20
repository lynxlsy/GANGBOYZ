"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CategoryItem {
  id: string
  name: string
  image: string
  description: string
  link: string
}

export function ExploreCategories() {
  const [exploreCategories, setExploreCategories] = useState<CategoryItem[]>([])

  // Carregar categorias do localStorage
  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("gang-boyz-explore-categories")
      if (savedCategories) {
        setExploreCategories(JSON.parse(savedCategories))
      } else {
        // Categorias padrão
        const defaultCategories: CategoryItem[] = [
          {
            id: "oversized",
            name: "Oversized",
            image: "/placeholder-default.svg",
            description: "Looks confortáveis e despojados",
            link: "/camisetas"
          },
          {
            id: "estampas",
            name: "Estampas",
            image: "/placeholder-default.svg", 
            description: "Designs únicos e exclusivos",
            link: "/camisetas"
          },
          {
            id: "lisos",
            name: "Lisos",
            image: "/placeholder-default.svg",
            description: "Cores sólidas e minimalistas",
            link: "/camisetas"
          },
          {
            id: "shorts",
            name: "Shorts",
            image: "/placeholder-default.svg",
            description: "Conforto para o dia a dia",
            link: "/roupas"
          },
          {
            id: "verao",
            name: "Verão",
            image: "/placeholder-default.svg",
            description: "Pieces para dias quentes",
            link: "/camisetas"
          },
          {
            id: "inverno",
            name: "Inverno", 
            image: "/placeholder-default.svg",
            description: "Aquecimento com estilo",
            link: "/roupas"
          }
        ]
        setExploreCategories(defaultCategories)
        localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(defaultCategories))
      }
    }

    // Carregar inicialmente
    loadCategories()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-explore-categories") {
        loadCategories()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadCategories()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('exploreCategoriesUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('exploreCategoriesUpdated', handleCustomStorageChange)
    }
  }, [])
  return (
    <section className="py-16 bg-gray-200">
      <div className="container mx-auto px-4">
        {/* Título Principal */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-12">
            EXPLORE NA GANG BOYZ
          </h2>
        </div>

        {/* Categorias em linha horizontal */}
        <div className="flex justify-center items-center gap-20 md:gap-24 lg:gap-28 xl:gap-32">
          {exploreCategories.map((category) => (
            <Link key={category.id} href={category.link} className="group cursor-pointer">
              <div className="text-center">
                {/* Imagem Circular */}
                <div className="relative mb-4 mx-auto w-32 h-32">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                {/* Nome da Categoria */}
                <h3 className="text-xl font-bold text-black">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
