"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { useProducts } from "@/lib/products-context-simple"
import { useTheme } from "@/lib/theme-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductTemplate } from "@/components/product-template"
import { CartDrawer } from "@/components/cart-drawer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { NotificationSystem } from "@/components/notification-system"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"

export default function FavoritosPage() {
  const { user, favorites, removeFromFavorites, isLoading } = useUser()
  const { products } = useProducts()
  const { addItem } = useCart()
  const { activeTheme } = useTheme()
  const router = useRouter()
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([])

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, isLoading, router])

  // Carregar produtos favoritos
  useEffect(() => {
    // Removido console.log para evitar loop de logs
    if (favorites.length > 0 && products.length > 0) {
      const favoriteProductsList = products.filter(product => favorites.includes(product.id))
      // Removido console.log para evitar loop de logs
      setFavoriteProducts(favoriteProductsList)
    } else {
      setFavoriteProducts([])
    }
  }, [favorites, products])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder-default.svg",
    })
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-900">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver logado, não renderizar nada (será redirecionado)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Espaçamento para o header */}
      <div className="h-[180px]"></div>
      
      <main className="pt-0">
        {/* Hero Section */}
        <div className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-8">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm red-glow"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 mr-3 red-text" />
                Meus Favoritos
              </h1>
              <p className="text-xl text-gray-300">
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto' : 'produtos'} favoritado{favoriteProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6 red-pulse" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Nenhum produto favoritado
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Comece a curtir produtos para vê-los aqui! Explore nossa coleção e encontre seus favoritos.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors red-glow"
              >
                Explorar Produtos
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8">
              {favoriteProducts.map((product) => (
                <ProductTemplate
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <ScrollToTop />
      <WhatsAppButton />
      <NotificationSystem />
    </div>
  )
}