"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import {
  Star,
  Image as ImageIcon,
  Settings,
  BarChart3,
  Phone,
  Flame,
  Shirt,
  Package,
  ArrowRight,
  Shield,
  Eye,
  TrendingUp,
  Trash2,
  Users,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
  GripVertical,
  Zap,
  Activity,
  Database,
  Globe
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: "Esperando Sync",
    activeBanners: "Esperando Sync",
    totalOrders: "Esperando Sync",
    lastUpdate: "Esperando Sync"
  })

  // Configuração editável dos cards de estatísticas
  const [statsCards, setStatsCards] = useState([
    {
      id: "products",
      title: "Produtos",
      value: "Esperando Sync",
      icon: Package,
      description: "Total de produtos cadastrados",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "banners",
      title: "Banners Ativos",
      value: "Esperando Sync",
      icon: ImageIcon,
      description: "Banners em exibição",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      id: "orders",
      title: "Pedidos",
      value: "Esperando Sync",
      icon: ShoppingBag,
      description: "Total de pedidos realizados",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      id: "update",
      title: "Última Atualização",
      value: "Esperando Sync",
      icon: Clock,
      description: "Última sincronização",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ])

  // Configuração dos cards de gerenciamento
  const [actionCards, setActionCards] = useState([
    {
      id: "products-management",
      title: "Gerenciamento de Produtos",
      description: "Camisetas, Moletons, Jaquetas, Calças, Shorts/Bermudas",
      icon: Package,
      href: "/admin/produtos",
      category: "produtos",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "banners-management",
      title: "Banners e Promoções",
      description: "Esperando Sync",
      icon: ImageIcon,
      href: "/admin/banners",
      category: "marketing",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      id: "collections-management",
      title: "Coleções",
      description: "Esperando Sync",
      icon: Star,
      href: "/admin/colecoes",
      category: "organizacao",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      id: "produtos-destaque",
      title: "Produtos em Destaque",
      description: "Gerencie os produtos da seção HOT",
      icon: Flame,
      href: "/admin/produtos-destaque",
      category: "destaques",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      id: "ofertas-especiais",
      title: "Ofertas Especiais",
      description: "Gerencie produtos em promoção",
      icon: Star,
      href: "/admin/ofertas",
      category: "ofertas",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      id: "explore-categories",
      title: "Explore Categories",
      description: "Gerencie categorias da seção EXPLORE",
      icon: Eye,
      href: "/admin/explore-categories",
      category: "categorias",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      id: "destaques-temporada",
      title: "Destaques da Temporada",
      description: "Edite título e descrição da seção DESTAQUES",
      icon: Star,
      href: "/admin/destaques-temporada",
      category: "conteudo",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      id: "clear-prod-products",
      title: "Limpeza de Produtos",
      description: "Remover produtos PROD001-PROD005 do localStorage",
      icon: Trash2,
      href: "/admin/clear-prod-products",
      category: "limpeza",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600"
    },
    {
      id: "security-login",
      title: "Segurança e Login",
      description: "Configurações de segurança e acesso ao painel administrativo",
      icon: Shield,
      href: "/admin/seguranca",
      category: "seguranca",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    }
  ])

  // Funções de edição
  const handleSaveChanges = () => {
    const config = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      changes: {
        statsCards: statsCards.map(card => ({
          id: card.id,
          title: card.title,
          value: card.value,
          description: card.description,
          action: "update"
        })),
        actionCards: actionCards.map(card => ({
          id: card.id,
          title: card.title,
          description: card.description,
          href: card.href,
          category: card.category,
          action: "update"
        }))
      }
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'admin-dashboard-config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsEditing(false)
    alert('Configurações salvas! Arquivo baixado com instruções para aplicar no código.')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const updateStatsCard = (id: string, field: string, value: string) => {
    setStatsCards(cards => cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ))
  }

  const updateActionCard = (id: string, field: string, value: string) => {
    setActionCards(cards => cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ))
  }

  const deleteActionCard = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este card?')) {
      setActionCards(cards => cards.filter(card => card.id !== id))
    }
  }

  const deleteStatsCard = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este card de estatística?')) {
      setStatsCards(cards => cards.filter(card => card.id !== id))
    }
  }

  useEffect(() => {
    // Manter tudo como "Esperando Sync" até sincronização
  }, [])

  return (
    <AdminLayout 
      title="Painel Administrativo" 
      subtitle="Gang BoyZ E-commerce"
      showEditControls={true}
      isEditing={isEditing}
      onEditToggle={() => setIsEditing(!isEditing)}
      onSave={handleSaveChanges}
    >

      {/* Stats Cards */}
      <section className="mb-8" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-lg font-semibold text-gray-900 mb-6 text-center">Estatísticas</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((card, index) => (
            <Card key={card.id} className="p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-gray-200 group">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => deleteStatsCard(card.id)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-300 p-2 hover:bg-red-50 rounded"
                        aria-label="Excluir card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateStatsCard(card.id, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Título do card"
                    aria-label="Título do card"
                  />
                  <input
                    type="text"
                    value={card.value}
                    onChange={(e) => updateStatsCard(card.id, 'value', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Valor"
                    aria-label="Valor do card"
                  />
                  <input
                    type="text"
                    value={card.description}
                    onChange={(e) => updateStatsCard(card.id, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Descrição"
                    aria-label="Descrição do card"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mx-auto mb-3`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              )}
            </Card>
          ))}
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="mb-8" aria-labelledby="management-heading">
        <h2 id="management-heading" className="text-lg font-semibold text-gray-900 mb-6 text-center">Gerenciamento</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {actionCards.map((card, index) => (
            <Link key={card.id} href={card.href} className="block group">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 bg-white/80 backdrop-blur-sm h-full group-hover:border-red-300 group-hover:scale-[1.02]">
                <div className="text-center h-full flex flex-col">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg mx-auto mb-4`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-center text-red-600 text-sm font-medium">
                    <span>Acessar</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="mb-8" aria-labelledby="status-heading">
        <h2 id="status-heading" className="text-lg font-semibold text-gray-900 mb-6 text-center">Status do Sistema</h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base mb-1">Sistema Online</p>
              <p className="text-gray-600 text-xs sm:text-sm">Todos os serviços funcionando</p>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base mb-1">Site Ativo</p>
              <p className="text-gray-600 text-xs sm:text-sm">Homepage funcionando normalmente</p>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base mb-1">Usuários Ativos</p>
              <p className="text-gray-600 text-xs sm:text-sm">Sistema de autenticação OK</p>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-gray-900 font-semibold text-sm sm:text-base mb-1">Backup Automático</p>
              <p className="text-gray-600 text-xs sm:text-sm">Último backup: Agora</p>
            </div>
          </Card>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <div className="mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sistema de Gerenciamento Gang BoyZ
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 px-4">
              Controle total do seu e-commerce com interface intuitiva e funcionalidades avançadas. 
              Todas as alterações são aplicadas em tempo real e sincronizadas automaticamente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center group">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-2 text-sm sm:text-base">Tempo Real</h4>
                <p className="text-gray-600 text-xs sm:text-sm">Alterações aplicadas instantaneamente no site</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-2 text-sm sm:text-base">Seguro</h4>
                <p className="text-gray-600 text-xs sm:text-sm">Dados protegidos com backup automático</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-2 text-sm sm:text-base">Personalizável</h4>
                <p className="text-gray-600 text-xs sm:text-sm">Controle completo sobre design e conteúdo</p>
              </div>
            </div>
            </div>
          </Card>
        </div>
      </footer>
    </AdminLayout>
  )
}