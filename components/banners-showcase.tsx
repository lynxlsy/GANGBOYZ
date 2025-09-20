"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

interface ShowcaseBanner {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  mediaType?: 'image' | 'video' | 'gif'
  link?: string
  buttonText: string
  overlayColor: string
}

export function BannersShowcase() {
  const [banners, setBanners] = useState<ShowcaseBanner[]>([])
  const [config, setConfig] = useState({
    title: "DESTAQUES DA TEMPORADA",
    description: "Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
  })

  // Carregar banners do localStorage
  useEffect(() => {
    const loadBanners = () => {
      const savedBanners = localStorage.getItem("gang-boyz-showcase-banners")
      if (savedBanners) {
        setBanners(JSON.parse(savedBanners))
      } else {
        // Banners padrão de demonstração
        const defaultBanners: ShowcaseBanner[] = [
          {
            id: "showcase-1",
            title: "NOVA COLEÇÃO",
            subtitle: "Streetwear Premium",
            description: "Descubra os lançamentos mais ousados da temporada com qualidade premium e design exclusivo",
            image: "/banner-hero.svg",
            mediaType: "image",
            link: "/produtos",
            buttonText: "EXPLORAR COLEÇÃO",
            overlayColor: "from-red-600/80 to-black/60"
          },
          {
            id: "showcase-2",
            title: "OFERTAS ESPECIAIS",
            subtitle: "Até 50% OFF",
            description: "Aproveite nossas ofertas limitadas em peças selecionadas. Não perca essa oportunidade!",
            image: "/banner-ofertas-especiais.svg",
            mediaType: "image",
            link: "/ofertas",
            buttonText: "VER OFERTAS",
            overlayColor: "from-yellow-500/80 to-red-600/60"
          },
          {
            id: "showcase-3",
            title: "MOLETONS",
            subtitle: "Conforto Urbano",
            description: "Qualidade premium para o dia a dia. Conforto e estilo em uma única peça",
            image: "/banner-hero.svg",
            mediaType: "image",
            link: "/moletons",
            buttonText: "CONFIRA",
            overlayColor: "from-gray-800/80 to-black/60"
          }
        ]
        setBanners(defaultBanners)
        localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(defaultBanners))
      }
    }

    // Carregar configuração do título e descrição
    const loadConfig = () => {
      const savedConfig = localStorage.getItem("gang-boyz-destaques-config")
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }

    // Carregar inicialmente
    loadBanners()
    loadConfig()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-showcase-banners") {
        loadBanners()
      }
      if (e.key === "gang-boyz-destaques-config") {
        loadConfig()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadBanners()
    }

    const handleConfigChange = () => {
      loadConfig()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('showcaseBannersUpdated', handleCustomStorageChange)
    window.addEventListener('destaquesConfigUpdated', handleConfigChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('showcaseBannersUpdated', handleCustomStorageChange)
      window.removeEventListener('destaquesConfigUpdated', handleConfigChange)
    }
  }, [])

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-4">
            {config.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative h-[400px] overflow-hidden group cursor-pointer bg-gray-900 rounded-lg"
              onClick={() => banner.link && (window.location.href = banner.link)}
            >
              {/* Background Media */}
              <div className="absolute inset-0">
                {banner.mediaType === 'video' ? (
                  <video
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${banner.overlayColor} opacity-90`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="text-xs font-bold tracking-wider text-white/90 uppercase bg-white/20 px-3 py-1 rounded-full">
                      {banner.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">
                    {banner.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {banner.description}
                  </p>
                </div>

                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 w-fit shadow-lg hover:shadow-red-500/25 transition-all duration-300 group-hover:scale-105"
                >
                  {banner.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Play Icon for Video */}
              {banner.mediaType === 'video' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Play className="h-8 w-8 text-white" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold px-8 py-3 transition-all duration-300"
          >
            VER TODAS AS COLEÇÕES
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}





