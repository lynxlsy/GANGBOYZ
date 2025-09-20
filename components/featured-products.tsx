"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { StandardProductCard } from "@/components/standard-product-card"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  isNew: boolean
  isPromotion: boolean
  installments: string
  brand: string
}

interface Category {
  id: string
  name: string
  icon?: string
  products: Product[]
}

interface HotProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  isActive: boolean
}

export function FeaturedProducts() {
  const [likedProducts, setLikedProducts] = useState<number[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [standaloneProducts, setStandaloneProducts] = useState<Product[]>([])
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([])
  const { addItem, openCart } = useCart()

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("gang-boyz-categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
    
    const savedStandaloneProducts = localStorage.getItem("gang-boyz-standalone-products")
    if (savedStandaloneProducts) {
      setStandaloneProducts(JSON.parse(savedStandaloneProducts))
    } else {
      // Produtos padrão para preencher as linhas
      const defaultProducts: Product[] = [
        {
          id: "OF001",
          name: "Camiseta Oversized",
          price: 89.90,
          originalPrice: 129.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 29.97",
          brand: "Gang BoyZ"
        },
        {
          id: "OF002",
          name: "Moletom Hoodie",
          price: 199.90,
          originalPrice: 279.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 66.63",
          brand: "Gang BoyZ"
        },
        {
          id: "OF003",
          name: "Calça Cargo Street",
          price: 179.90,
          originalPrice: 229.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 59.97",
          brand: "Gang BoyZ"
        },
        {
          id: "OF004",
          name: "Boné Snapback Gang",
          price: 79.90,
          originalPrice: 99.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 26.63",
          brand: "Gang BoyZ"
        },
        {
          id: "OF005",
          name: "Colar de Corrente Prata",
          price: 59.90,
          originalPrice: 79.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 19.97",
          brand: "Gang BoyZ"
        },
        {
          id: "OF006",
          name: "Jaqueta Bomber",
          price: 299.90,
          originalPrice: 399.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 99.97",
          brand: "Gang BoyZ"
        },
        {
          id: "OF007",
          name: "Short Esportivo",
          price: 69.90,
          originalPrice: 89.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 23.30",
          brand: "Gang BoyZ"
        },
        {
          id: "OF008",
          name: "Tênis Streetwear",
          price: 249.90,
          originalPrice: 329.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 83.30",
          brand: "Gang BoyZ"
        },
        {
          id: "OF009",
          name: "Regata Premium",
          price: 49.90,
          originalPrice: 69.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 16.63",
          brand: "Gang BoyZ"
        },
        {
          id: "OF010",
          name: "Calça Jeans Skinny",
          price: 159.90,
          originalPrice: 199.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 53.30",
          brand: "Gang BoyZ"
        },
        {
          id: "OF011",
          name: "Blusa de Frio",
          price: 129.90,
          originalPrice: 179.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 43.30",
          brand: "Gang BoyZ"
        },
        {
          id: "OF012",
          name: "Cinto de Couro",
          price: 89.90,
          originalPrice: 119.90,
          image: "/placeholder-default.svg",
          isNew: true,
          isPromotion: true,
          installments: "3x de R$ 29.97",
          brand: "Gang BoyZ"
        }
      ]
      setStandaloneProducts(defaultProducts)
    }

    const savedHotProducts = localStorage.getItem("gang-boyz-hot-products")
    if (savedHotProducts) {
      setHotProducts(JSON.parse(savedHotProducts))
    }
  }, [])

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(Number(productId)) ? prev.filter((id) => id !== Number(productId)) : [...prev, Number(productId)],
    )
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder-default.svg",
    })
    openCart()
  }


  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4">
        {/* Banner acima do título */}
        <div className="text-center mb-8">
          <div className="mx-auto max-w-full">
            <img
              src="/banner-ofertas-especiais.svg"
              alt="Banner de Ofertas - Gang Boyz"
              className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ aspectRatio: '1200/600' }}
              onError={(e) => {
                // Fallback para banner com gradiente se a imagem não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 md:p-8 mx-auto max-w-4xl';
                fallbackDiv.innerHTML = `
                  <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">🎯 PROMOÇÕES IMPERDÍVEIS</h2>
                  <p class="text-white/90 text-lg md:text-xl">Aproveite nossas ofertas especiais com até 50% de desconto!</p>
                `;
                target.parentNode?.insertBefore(fallbackDiv, target);
              }}
            />
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            OFERTAS
          </h1>
          <div className="w-32 h-1 red-bg mx-auto rounded"></div>
        </div>

        {/* Produtos Avulsos integrados na seção OFERTAS */}
        {standaloneProducts.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-6 gap-3 md:gap-4">
              {standaloneProducts.map((product) => (
                <StandardProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Produtos das Categorias integrados na seção OFERTAS */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-6 gap-3 md:gap-4">
              {categories.map((category) => 
                category.products.map((product) => (
                  <StandardProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleAddToCart(product)}
                  />
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
