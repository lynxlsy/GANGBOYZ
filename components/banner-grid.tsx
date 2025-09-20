"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Collection {
  id: string
  brand: string
  name: string
  subtitle: string
  description: string
  icon: string
  link?: string
  image: string
  mediaType?: 'image' | 'video' | 'gif'
  color: string
}

export function BannerGrid() {
  const [collections, setCollections] = useState<Collection[]>([])

  // Carregar coleções do localStorage
  useEffect(() => {
    const loadCollections = () => {
      const savedCollections = localStorage.getItem("gang-boyz-collections")
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections))
      } else {
        // Coleções padrão de demonstração
        const defaultCollections: Collection[] = [
          {
            id: "1",
            brand: "GANG BOYZ",
            name: "NOVA COLEÇÃO",
            subtitle: "Streetwear Premium",
            description: "Descubra os lançamentos mais ousados da temporada",
            icon: "",
            link: "",
            image: "/banner-hero.svg",
            mediaType: "image",
            color: "from-red-600/90 to-black/70"
          },
          {
            id: "2",
            brand: "SHADOW",
            name: "MOLETONS",
            subtitle: "Conforto Urbano",
            description: "Qualidade premium para o dia a dia",
            icon: "",
            link: "",
            image: "/banner-hero.svg",
            mediaType: "image",
            color: "from-gray-800/90 to-black/70"
          },
          {
            id: "3",
            brand: "CHAIN",
            name: "ACESSÓRIOS",
            subtitle: "Detalhes Únicos",
            description: "Complete seu look com nossos acessórios exclusivos",
            icon: "",
            link: "",
            image: "/banner-hero.svg",
            mediaType: "image",
            color: "from-red-600/90 to-black/70"
          },
          {
            id: "4",
            brand: "SALE",
            name: "PROMOÇÕES",
            subtitle: "Ofertas Limitadas",
            description: "Até 50% de desconto em peças selecionadas",
            icon: "",
            link: "",
            image: "/banner-hero.svg",
            mediaType: "image",
            color: "from-red-500/90 to-black/70"
          }
        ]
        setCollections(defaultCollections)
        localStorage.setItem("gang-boyz-collections", JSON.stringify(defaultCollections))
      }
    }

    // Carregar inicialmente
    loadCollections()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-collections") {
        loadCollections()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadCollections()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('collectionsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('collectionsUpdated', handleCustomStorageChange)
    }
  }, [])
  return (
    <section className="pt-0 pb-0 bg-black">
      <div className="w-full">

        <div className="grid grid-cols-4 gap-0 mb-0">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative h-[600px] overflow-hidden group cursor-pointer bg-gray-900"
              onClick={() => collection.link && (window.location.href = collection.link)}
            >
              {/* Background Media */}
              <div className="absolute inset-0">
                {collection.mediaType === 'video' ? (
                  <video
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-80`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <span className="text-xs font-bold tracking-wider text-white/90 uppercase bg-white/20 px-3 py-1">
                      {collection.brand}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-white/90 font-semibold mb-2">
                    {collection.subtitle}
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {collection.description}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 w-fit shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  {collection.link ? 'EXPLORAR' : 'CONFIRA'}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
