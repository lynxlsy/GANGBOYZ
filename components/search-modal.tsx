"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Search, 
  X, 
  Filter, 
  Grid, 
  List,
  Star,
  ShoppingCart,
  Heart
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@/lib/user-context"
import { useFirebaseProducts } from "@/lib/firebase-products-service"
import { toast } from "sonner"
import Image from "next/image"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    isNew: false,
    isPromotion: false
  })
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const { addItem, openCart } = useCart()
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useUser()
  const { products, searchProducts } = useFirebaseProducts()

  // Buscar produtos quando o termo de busca muda
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsSearching(true)
      const timeoutId = setTimeout(async () => {
        try {
          const results = await searchProducts(searchTerm)
          setSearchResults(results)
        } catch (error) {
          console.error('Erro ao buscar produtos:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, searchProducts])

  // Aplicar filtros aos resultados
  const filteredResults = searchResults.filter(product => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false
    if (filters.isNew && !product.isNew) return false
    if (filters.isPromotion && !product.isPromotion) return false
    return true
  })

  const handleAddToCart = (product: any) => {
    if (!user) {
      toast.info("Faça login para adicionar produtos ao carrinho")
      return
    }

    addItem({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    
    openCart()
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  const handleToggleFavorite = (productId: string) => {
    if (!user) {
      toast.info("Faça login para curtir produtos")
      return
    }

    if (isFavorite(productId)) {
      removeFromFavorites(productId)
      toast.success("Removido dos favoritos")
    } else {
      addToFavorites(productId)
      toast.success("Adicionado aos favoritos")
    }
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      isNew: false,
      isPromotion: false
    })
  }

  const categories = Array.from(new Set(products.map(p => p.category)))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3 flex-1">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              autoFocus
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Preço Mínimo</label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1 block">Preço Máximo</label>
                <Input
                  type="number"
                  placeholder="R$ 1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isNew}
                    onChange={(e) => setFilters(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Novos</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isPromotion}
                    onChange={(e) => setFilters(prev => ({ ...prev, isPromotion: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Promoção</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="p-4">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Buscando...</span>
            </div>
          ) : searchTerm.length < 2 ? (
            <div className="text-center py-8 text-gray-500">
              Digite pelo menos 2 caracteres para buscar
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto encontrado
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {filteredResults.length} produto(s) encontrado(s)
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Grid/List */}
              <div className={viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-4"
              }>
                {filteredResults.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className={viewMode === "grid" ? "p-4" : "p-4 flex items-center space-x-4"}>
                      <div className={viewMode === "grid" ? "relative" : "relative w-20 h-20 flex-shrink-0"}>
                        <Image
                          src={product.image || "/placeholder-default.svg"}
                          alt={product.name}
                          width={viewMode === "grid" ? 200 : 80}
                          height={viewMode === "grid" ? 200 : 80}
                          className="w-full h-full object-cover rounded"
                        />
                        {product.isNew && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Novo
                          </span>
                        )}
                        {product.isPromotion && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Promoção
                          </span>
                        )}
                      </div>
                      
                      <div className={viewMode === "grid" ? "mt-4" : "flex-1"}>
                        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              R$ {product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFavorite(product.id)}
                            className={isFavorite(product.id) ? "text-red-500" : "text-gray-500"}
                          >
                            <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}




