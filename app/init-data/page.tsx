"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function InitDataPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const initData = async () => {
      try {
        setProgress(10)
        
        // Simular delay para mostrar progresso
        await new Promise(resolve => setTimeout(resolve, 500))
        setProgress(30)
    // Banners de demonstração
    const demoBanners = [
      {
        id: "hero-banner-1",
        name: "Banner Principal 1 (Hero)",
        description: "Primeiro banner do carrossel principal da página inicial",
        currentImage: "/banner-hero.svg",
        mediaType: "image",
        dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Background da seção hero (abaixo da faixa de aviso)"
      },
      {
        id: "hero-banner-2",
        name: "Banner Principal 2 (Hero)",
        description: "Segundo banner do carrossel principal da página inicial",
        currentImage: "/banner-hero.svg",
        mediaType: "image",
        dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Background da seção hero (abaixo da faixa de aviso)"
      },
      {
        id: "hot-banner",
        name: "Banner HOT",
        description: "Banner da seção HOT, exibido acima dos produtos mais vendidos",
        currentImage: "/banner-hero.svg",
        mediaType: "image",
        dimensions: "1920x650px (≈2.95:1) - Otimizado para seção HOT",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Seção HOT (abaixo do header)"
      },
      {
        id: "footer-banner",
        name: "Banner Footer",
        description: "Banner que aparece antes do footer em todas as páginas",
        currentImage: "/banner-hero.svg",
        mediaType: "image",
        dimensions: "1920x650px (≈2.95:1) - Padrão para banners de seção",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Antes do Footer (em todas as páginas)"
      }
    ]

    // Produtos de demonstração para ofertas especiais
    const demoStandaloneProducts = [
      {
        id: "OFERTA001",
        name: "Camiseta Oversized Gang",
        price: 89.90,
        originalPrice: 129.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "3x de R$ 29.97",
        brand: "Gang Boyz"
      },
      {
        id: "OFERTA002", 
        name: "Moletom Premium",
        price: 199.90,
        originalPrice: 279.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "6x de R$ 33.32",
        brand: "Gang Boyz"
      },
      {
        id: "OFERTA003",
        name: "Calça Cargo Street",
        price: 179.90,
        originalPrice: 229.90,
        image: "/placeholder-default.svg",
        isNew: true,
        isPromotion: true,
        installments: "5x de R$ 35.98",
        brand: "Gang Boyz"
      },
      {
        id: "OFERTA004",
        name: "Boné Snapback",
        price: 79.90,
        originalPrice: 99.90,
        image: "/placeholder-default.svg",
        isNew: false,
        isPromotion: true,
        installments: "2x de R$ 39.95",
        brand: "Gang Boyz"
      }
    ]

    // Categorias de demonstração
    const demoCategories = [
      {
        id: "MOLETONS",
        name: "MOLETONS",
        icon: "/placeholder-logo.svg",
        products: [
          {
            id: "MOL001",
            name: "Moletom Hoodie Gang",
            price: 199.90,
            originalPrice: 249.90,
            image: "/placeholder-default.svg",
            isNew: true,
            isPromotion: true,
            installments: "6x de R$ 33.32",
            brand: "Gang Boyz"
          },
          {
            id: "MOL002",
            name: "Moletom Básico",
            price: 149.90,
            originalPrice: 199.90,
            image: "/placeholder-default.svg",
            isNew: false,
            isPromotion: true,
            installments: "5x de R$ 29.98",
            brand: "Gang Boyz"
          },
          {
            id: "MOL003",
            name: "Moletom Premium",
            price: 279.90,
            originalPrice: 349.90,
            image: "/placeholder-default.svg",
            isNew: true,
            isPromotion: true,
            installments: "8x de R$ 34.99",
            brand: "Gang Boyz"
          },
          {
            id: "MOL004",
            name: "Moletom Oversized",
            price: 229.90,
            originalPrice: 299.90,
            image: "/placeholder-default.svg",
            isNew: false,
            isPromotion: true,
            installments: "7x de R$ 32.84",
            brand: "Gang Boyz"
          }
        ]
      },
      {
        id: "CAMISETAS",
        name: "CAMISETAS",
        icon: "/placeholder-logo.svg",
        products: [
          {
            id: "CAM001",
            name: "Camiseta Básica Gang",
            price: 69.90,
            originalPrice: 99.90,
            image: "/placeholder-default.svg",
            isNew: true,
            isPromotion: true,
            installments: "2x de R$ 34.95",
            brand: "Gang Boyz"
          },
          {
            id: "CAM002",
            name: "Camiseta Oversized",
            price: 89.90,
            originalPrice: 129.90,
            image: "/placeholder-default.svg",
            isNew: false,
            isPromotion: true,
            installments: "3x de R$ 29.97",
            brand: "Gang Boyz"
          },
          {
            id: "CAM003",
            name: "Camiseta Manga Longa",
            price: 99.90,
            originalPrice: 139.90,
            image: "/placeholder-default.svg",
            isNew: true,
            isPromotion: true,
            installments: "3x de R$ 33.30",
            brand: "Gang Boyz"
          },
          {
            id: "CAM004",
            name: "Camiseta Estampada",
            price: 79.90,
            originalPrice: 119.90,
            image: "/placeholder-default.svg",
            isNew: false,
            isPromotion: true,
            installments: "2x de R$ 39.95",
            brand: "Gang Boyz"
          }
        ]
      },
      {
        id: "CALCAS",
        name: "CALÇAS",
        icon: "/placeholder-logo.svg",
        products: [
          {
            id: "CAL001",
            name: "Calça Cargo Street",
            price: 179.90,
            originalPrice: 229.90,
            image: "/placeholder-default.svg",
            isNew: true,
            isPromotion: true,
            installments: "5x de R$ 35.98",
            brand: "Gang Boyz"
          },
          {
            id: "CAL002",
            name: "Calça Jeans Oversized",
            price: 199.90,
            originalPrice: 279.90,
            image: "/placeholder-default.svg",
            isNew: false,
            isPromotion: true,
            installments: "6x de R$ 33.32",
            brand: "Gang Boyz"
          },
          {
            id: "CAL003",
            name: "Calça Básica",
            price: 149.90,
            originalPrice: 199.90,
            image: "/placeholder-default.svg",
            isNew: true,
            isPromotion: true,
            installments: "4x de R$ 37.48",
            brand: "Gang Boyz"
          },
          {
            id: "CAL004",
            name: "Calça Jogger",
            price: 159.90,
            originalPrice: 219.90,
            image: "/placeholder-default.svg",
            isNew: false,
            isPromotion: true,
            installments: "5x de R$ 31.98",
            brand: "Gang Boyz"
          }
        ]
      }
    ]

    // Produtos HOT de demonstração
    const demoHotProducts = [
      {
        id: "HOT001",
        name: "Jaqueta Oversized Premium",
        description: "Jaqueta streetwear com design exclusivo e tecido premium",
        price: 299.90,
        originalPrice: 399.90,
        image: "/placeholder-default.svg",
        category: "Jaquetas",
        isActive: true
      },
      {
        id: "HOT002", 
        name: "Moletom Hoodie Gang",
        description: "Moletom com logo bordado e capuz ajustável",
        price: 199.90,
        originalPrice: 249.90,
        image: "/placeholder-default.svg",
        category: "Moletons",
        isActive: true
      },
      {
        id: "HOT003",
        name: "Camiseta Oversized",
        description: "Camiseta confortável com design urbano",
        price: 89.90,
        originalPrice: 129.90,
        image: "/placeholder-default.svg",
        category: "Camisetas",
        isActive: true
      },
      {
        id: "HOT004",
        name: "Calça Cargo Street",
        description: "Calça cargo com bolsos funcionais",
        price: 179.90,
        originalPrice: 229.90,
        image: "/placeholder-default.svg",
        category: "Calças",
        isActive: true
      }
    ]

        // Salvar no localStorage
        localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(demoBanners))
        setProgress(50)
        
        await new Promise(resolve => setTimeout(resolve, 300))
        localStorage.setItem("gang-boyz-standalone-products", JSON.stringify(demoStandaloneProducts))
        setProgress(70)
        
        await new Promise(resolve => setTimeout(resolve, 300))
        localStorage.setItem("gang-boyz-categories", JSON.stringify(demoCategories))
        setProgress(85)
        
        await new Promise(resolve => setTimeout(resolve, 300))
        localStorage.setItem("gang-boyz-hot-products", JSON.stringify(demoHotProducts))
        setProgress(100)
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirecionar para a homepage
        router.push("/")
      } catch (error) {
        console.error("Erro ao inicializar dados:", error)
        setProgress(0)
      }
    }

    initData()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-white text-xl font-bold mb-2">Inicializando Dados</h2>
        <p className="text-gray-300 text-sm mb-6">Preparando conteúdo de demonstração...</p>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-gray-400 text-xs">{progress}% concluído</p>
        
        {progress === 100 && (
          <p className="text-green-400 text-sm mt-4 animate-pulse">
            ✅ Dados carregados com sucesso!
          </p>
        )}
      </div>
    </div>
  )
}
