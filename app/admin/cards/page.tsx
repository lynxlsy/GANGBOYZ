"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet,
  Info,
  Code,
  Palette,
  Layout,
  ArrowRight,
  CheckCircle,
  Star,
  ShoppingCart
} from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { ProductCardSimpleWide } from "@/components/product-card-simple-wide"
import { ProductCardSimpleNarrow } from "@/components/product-card-simple-narrow"
import { Product, HotProduct } from "@/lib/demo-products"

export default function AdminCardsPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState("entrega")

  // Demo product data
  const demoProduct: Product = {
    id: "DEMO001",
    name: "Camiseta Oversized Gang Boyz",
    price: 89.90,
    originalPrice: 129.90,
    image: "/placeholder-default.svg",
    isNew: true,
    isPromotion: true,
    installments: "3x de R$ 29.97",
    brand: "Gang Boyz",
    color: "Preto",
    sizes: ["M", "G", "GG"],
    categories: ["Camisetas"]
  }

  const demoHotProduct: HotProduct = {
    id: "HOT001",
    name: "Jaqueta Oversized Premium",
    description: "Jaqueta streetwear com design exclusivo e tecido premium",
    price: 299.90,
    originalPrice: 399.90,
    image: "/placeholder-default.svg",
    category: "Produtos",
    isActive: true
  }

  const cardTypes = [
    {
      id: "card-1",
      name: "Card 1 (Card Completo)",
      description: "Card completo com todas as informações do produto",
      icon: Layout,
      color: "red"
    },
    {
      id: "card-2", 
      name: "Card 2 (Simples e Largo)",
      description: "Card simples e largo para ofertas especiais",
      icon: Monitor,
      color: "blue"
    },
    {
      id: "card-3",
      name: "Card 3 (Simples e Estreito)", 
      description: "Card simples e estreito para produtos em destaque",
      icon: Smartphone,
      color: "green"
    }
  ]

  const renderTotalPreview = (cardId: string) => {
    switch (cardId) {
      case 'card-1':
        return (
          <div className="w-[320px] bg-black border border-gray-600 shadow-lg hover:opacity-90 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
            {/* FOTO - 320x427px */}
            <div className="w-[320px] h-[427px] bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm font-medium">ADICIONE SUA IMAGEM AQUI</div>
                <div className="text-xs">320x427px - Clique para fazer upload</div>
              </div>
            </div>
            
            {/* INFORMAÇÕES - FUNDO PRETO */}
            <div className="p-4 bg-black text-left">
              <h3 className="text-lg font-semibold text-white mb-2 text-left">{demoProduct.name}</h3>
              <div className="flex items-center gap-2 mb-3 text-left">
                <span className="text-xl font-bold text-white">R$ {demoProduct.price.toFixed(2).replace(".", ",")}</span>
                <span className="text-sm text-gray-400 line-through">R$ {demoProduct.originalPrice?.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="text-xs text-gray-400 mb-3 text-left">#{demoProduct.id}</div>
              <div className="text-sm text-gray-400 mb-3 text-left">Tamanhos disponíveis</div>
              <div className="text-sm text-gray-400 mb-3 text-left">Cor: {demoProduct.color}</div>
              <div className="text-sm text-gray-400 mb-3 text-left">Categorias: {demoProduct.categories.join(", ")}</div>
              <button className="w-full bg-white text-black py-2 px-4 hover:bg-gray-200 transition-colors font-medium mt-4">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        )
      case 'card-2':
        return (
          <div className="w-[320px] bg-black border border-gray-600 shadow-lg hover:opacity-90 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            {/* FOTO - 320x427px */}
            <div className="w-[320px] h-[427px] bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm font-medium">ADICIONE SUA IMAGEM AQUI</div>
                <div className="text-xs">320x427px - Clique para fazer upload</div>
              </div>
            </div>
            
            {/* INFORMAÇÕES - FUNDO PRETO */}
            <div className="p-4 bg-black text-left">
              <h3 className="text-lg font-semibold text-white mb-2 text-left">{demoProduct.name}</h3>
              <div className="flex items-center gap-2 mb-3 text-left">
                <span className="text-xl font-bold text-white">R$ {demoProduct.price.toFixed(2).replace(".", ",")}</span>
                <span className="text-sm text-gray-400 line-through">R$ {demoProduct.originalPrice?.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="text-sm text-gray-400 mb-3 text-left">Pix: R$ {demoProduct.price.toFixed(2).replace(".", ",")}</div>
              <div className="text-sm text-gray-400 mb-3 text-left">{demoProduct.installments}</div>
            </div>
          </div>
        )
      case 'card-3':
        return (
          <div className="w-[240px] bg-black border border-gray-600 shadow-lg hover:opacity-90 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
            {/* FOTO - 240x320px */}
            <div className="w-[240px] h-[320px] bg-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm font-medium">ADICIONE SUA IMAGEM AQUI</div>
                <div className="text-xs">240x320px - Clique para fazer upload</div>
              </div>
            </div>
            
            {/* INFORMAÇÕES - FUNDO PRETO */}
            <div className="p-4 bg-black text-left">
              <h3 className="text-lg font-semibold text-white mb-2 text-left">{demoHotProduct.name}</h3>
              <div className="flex items-center gap-2 mb-3 text-left">
                <span className="text-xl font-bold text-white">R$ {demoHotProduct.price.toFixed(2).replace(".", ",")}</span>
                <span className="text-sm text-gray-400 line-through">R$ {demoHotProduct.originalPrice?.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="text-sm text-gray-400 mb-3 text-left">Pix: R$ {demoHotProduct.price.toFixed(2).replace(".", ",")}</div>
              <div className="text-sm text-gray-400 mb-3 text-left">12x de R$ {(demoHotProduct.price / 12).toFixed(2).replace(".", ",")}</div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (selectedCard) {
    const card = cardTypes.find(c => c.id === selectedCard)
    if (!card) return null

    return (
      <div className="min-h-screen -mt-20 pt-20">
        {/* Background que cobre toda a tela */}
        <div className="fixed inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 -z-10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)] -z-10"></div>
        
        <div className="container mx-auto px-8 py-16">
          {/* Header com Botão Voltar */}
          <div className="mb-12">
            <button 
              onClick={() => setSelectedCard(null)}
              className="group flex items-center gap-3 text-white/70 hover:text-white transition-all duration-300 mb-8"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
                <ArrowRight className="h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
              <span className="text-lg font-medium">Voltar para Cards</span>
            </button>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-red-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6 mb-8">
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  {card.name}
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {card.description}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações do Card */}
            <div className="space-y-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-4">
                <div className={`px-6 py-3 rounded-full text-sm font-bold ${
                  card.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  card.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  <card.icon className="w-4 h-4 mr-2 inline" />
                  {card.color === 'red' ? 'COMPLETO' : card.color === 'blue' ? 'OFERTAS' : 'DESTAQUE'}
                </div>
                <div className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full text-sm font-medium">
                  {card.id === 'card-1' || card.id === 'card-2' ? '320x427px' : '240x320px'}
                </div>
              </div>

              {/* Características */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  Características
                </h3>
                <ul className="space-y-4">
                  {[
                    'Design responsivo e moderno',
                    'Animações suaves no hover',
                    'Cores personalizáveis',
                    'Integração com sistema de carrinho',
                    'Fundo preto elegante',
                    'Textos alinhados à esquerda'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação */}
              <div>
                <Button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Abrir Modal de Compras
                </Button>
              </div>
            </div>

            {/* Pré-visualização Interativa */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Pré-visualização Interativa</h3>
                <p className="text-gray-400">Clique nos cards para abrir o modal de compras</p>
              </div>
              
              {/* Três seções de pré-visualização */}
              <div className="space-y-8">
                {/* Pré-visualização de Fotos */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-purple-400" />
                    </div>
                    Pré-visualização de Fotos
                  </h4>
                  <div className="flex justify-center">
                    {selectedCard === 'card-1' && (
                      <div className="w-[320px] h-[427px] bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div className="text-sm font-medium">ADICIONE SUA IMAGEM AQUI</div>
                          <div className="text-xs">320x427px - Clique para fazer upload</div>
                        </div>
                      </div>
                    )}
                    {selectedCard === 'card-2' && (
                      <div className="w-[320px] h-[427px] bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div className="text-sm font-medium">ADICIONE SUA IMAGEM AQUI</div>
                          <div className="text-xs">320x427px - Clique para fazer upload</div>
                        </div>
                      </div>
                    )}
                    {selectedCard === 'card-3' && (
                      <div className="w-[240px] h-[320px] bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div className="text-sm font-medium">ADICIONE SUA IMAGEM AQUI</div>
                          <div className="text-xs">240x320px - Clique para fazer upload</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pré-visualização das Informações */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg flex items-center justify-center">
                      <Info className="w-4 h-4 text-blue-400" />
                    </div>
                    Pré-visualização das Informações
                  </h4>
                  <div className="flex justify-center">
                    {selectedCard === 'card-1' && (
                      <div className="w-[320px] bg-black p-4 border border-gray-600 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2 text-left">{demoProduct.name}</h3>
                        <div className="flex items-center gap-2 mb-3 text-left">
                          <span className="text-xl font-bold text-white">R$ {demoProduct.price.toFixed(2).replace(".", ",")}</span>
                          <span className="text-sm text-gray-400 line-through">R$ {demoProduct.originalPrice?.toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div className="text-xs text-gray-400 mb-3 text-left">#{demoProduct.id}</div>
                        <div className="text-sm text-gray-400 mb-3 text-left">Tamanhos disponíveis</div>
                        <div className="text-sm text-gray-400 mb-3 text-left">Cor: {demoProduct.color}</div>
                        <div className="text-sm text-gray-400 mb-3 text-left">Categorias: {demoProduct.categories.join(", ")}</div>
                      </div>
                    )}
                    {selectedCard === 'card-2' && (
                      <div className="w-[320px] bg-black p-4 border border-gray-600 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2 text-left">{demoProduct.name}</h3>
                        <div className="flex items-center gap-2 mb-3 text-left">
                          <span className="text-xl font-bold text-white">R$ {demoProduct.price.toFixed(2).replace(".", ",")}</span>
                          <span className="text-sm text-gray-400 line-through">R$ {demoProduct.originalPrice?.toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div className="text-sm text-gray-400 mb-3 text-left">Pix: R$ {demoProduct.price.toFixed(2).replace(".", ",")}</div>
                        <div className="text-sm text-gray-400 mb-3 text-left">{demoProduct.installments}</div>
                      </div>
                    )}
                    {selectedCard === 'card-3' && (
                      <div className="w-[240px] bg-black p-4 border border-gray-600 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2 text-left">{demoHotProduct.name}</h3>
                        <div className="flex items-center gap-2 mb-3 text-left">
                          <span className="text-xl font-bold text-white">R$ {demoHotProduct.price.toFixed(2).replace(".", ",")}</span>
                          <span className="text-sm text-gray-400 line-through">R$ {demoHotProduct.originalPrice?.toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div className="text-sm text-gray-400 mb-3 text-left">Pix: R$ {demoHotProduct.price.toFixed(2).replace(".", ",")}</div>
                        <div className="text-sm text-gray-400 mb-3 text-left">12x de R$ {(demoHotProduct.price / 12).toFixed(2).replace(".", ",")}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pré-visualização Total */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg flex items-center justify-center">
                      <Layout className="w-4 h-4 text-green-400" />
                    </div>
                    Pré-visualização Total
                  </h4>
                  <div className="flex justify-center">
                    {renderTotalPreview(selectedCard)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen -mt-20 pt-20">
      {/* Background que cobre toda a tela */}
      <div className="fixed inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)] -z-10"></div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        
        <div className="relative container mx-auto px-8 py-16">

          {/* Cards Grid - Moderno */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cardTypes.map((card, index) => (
              <div 
                key={card.id}
                className="group cursor-pointer"
                onClick={() => setSelectedCard(card.id)}
              >
                <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:from-white/10 hover:to-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
                  
                  {/* Badge de Tipo */}
                  <div className="absolute -top-4 -right-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      card.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      card.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {card.color === 'red' ? 'COMPLETO' : card.color === 'blue' ? 'OFERTAS' : 'DESTAQUE'}
                    </div>
                  </div>

                  {/* Ícone Principal */}
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                      card.color === 'red' ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400' :
                      card.color === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400' :
                      'bg-gradient-to-br from-green-500/20 to-green-600/10 text-green-400'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                      {card.name}
                    </h3>
                    
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>

                  {/* Preview do Card */}
                  <div className="flex justify-center mb-6">
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      {renderTotalPreview(card.id)}
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-white/60 group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-medium">Ver Detalhes</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Efeito de Brilho no Hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-red-400 mb-2">3</div>
                <div className="text-gray-300">Modelos de Cards</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-gray-300">Responsivos</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
                <div className="text-gray-300">Customizáveis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
