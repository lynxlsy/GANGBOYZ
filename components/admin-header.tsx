"use client"

import { useState } from "react"
import { Search, User, Heart, ShoppingCart, Sparkles, Flame, ChevronDown, Settings, BarChart3, Mail, Palette, Shield, Link as LinkIcon, Home, X, Layout, Clock, AlertTriangle, Download, Globe, Package, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showPendentesModal, setShowPendentesModal] = useState(false)
  const [menuOrder, setMenuOrder] = useState([
    "Camisetas", "Moletons", "Jaquetas", "Calças", "Shorts/Bermudas", 
    "Lançamentos", "Em alta", "Admin"
  ])

  const menuItems = [
    { label: "Camisetas", href: "/admin/camisetas", icon: null, hasSubmenu: true, key: "camisetas" },
    { label: "Moletons", href: "/admin/moletons", icon: null, hasSubmenu: true, key: "moletons" },
    { label: "Jaquetas", href: "/admin/jaquetas", icon: null, hasSubmenu: true, key: "jaquetas" },
    { label: "Calças", href: "/admin/calcas", icon: null, hasSubmenu: true, key: "calcas" },
    { label: "Shorts/Bermudas", href: "/admin/shorts-bermudas", icon: null, hasSubmenu: true, key: "shorts" },
    { label: "Lançamentos", href: "/admin/lancamentos", icon: Sparkles, isBlue: true },
    { label: "Em alta", href: "/admin/em-alta", icon: Flame, isHot: true },
    { label: "Admin", href: "#", icon: Settings, hasSubmenu: true, isAdmin: true, key: "admin" }
  ]

  const submenus = {
    camisetas: [
      { label: "Manga Longa", href: "/admin/camisetas/manga-longa" },
      { label: "Manga Curta", href: "/admin/camisetas/manga-curta" },
      { label: "Regata", href: "/admin/camisetas/regata" },
      { label: "Tank Top", href: "/admin/camisetas/tank-top" },
      { label: "Polo", href: "/admin/camisetas/polo" },
      { label: "Básica", href: "/admin/camisetas/basica" }
    ],
    moletons: [
      { label: "Com Capuz", href: "/admin/moletons/com-capuz" },
      { label: "Sem Capuz", href: "/admin/moletons/sem-capuz" },
      { label: "Zíper", href: "/admin/moletons/ziper" }
    ],
    jaquetas: [
      { label: "Casual", href: "/admin/jaquetas/casual" },
      { label: "Esportiva", href: "/admin/jaquetas/esportiva" },
      { label: "Social", href: "/admin/jaquetas/social" }
    ],
    calcas: [
      { label: "Jeans", href: "/admin/calcas/jeans" },
      { label: "Moletom", href: "/admin/calcas/moletom" },
      { label: "Social", href: "/admin/calcas/social" }
    ],
    shorts: [
      { label: "Esportivo", href: "/admin/shorts-bermudas/esportivo" },
      { label: "Casual", href: "/admin/shorts-bermudas/casual" },
      { label: "Praia", href: "/admin/shorts-bermudas/praia" }
    ],
    admin: [
      { label: "Banners", href: "/admin/banners", icon: BarChart3 },
      { label: "Cards", href: "/admin/cards", icon: Layout },
      { label: "Contatos", href: "/admin/contatos", icon: Mail },
      { label: "Design", href: "/admin/design", icon: Palette },
      { label: "Linkar", href: "/admin/linkar", icon: LinkIcon },
      { label: "Modal Boas-vindas", href: "/admin/welcome-modal", icon: MessageSquare },
      { label: "Footer", href: "/admin/footer", icon: Settings },
      { label: "Análise de Deleção", href: "/delete", icon: AlertTriangle }
    ]
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }



  return (
    <>
      {/* Header Container - Centralizado e com mais espaçamento */}
      <div className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between pl-[45px] pr-[45px] py-4 bg-transparent">
        
        {/* Seção Início - Esquerda */}
        <div className="flex items-center">
          <button 
            onClick={() => router.push("/admin")}
            className="flex items-center space-x-2 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer text-white"
            title="Voltar ao Início do Admin"
          >
            <Home className="h-5 w-5 group-hover:text-blue-400 transition-colors duration-300" />
            <span>Início</span>
          </button>
        </div>

        {/* Menu Principal - Centro */}
        <nav className="flex items-center space-x-8">
          {menuOrder.map((itemLabel, index) => {
            const item = menuItems.find(menuItem => menuItem.label === itemLabel)
            if (!item) return null
            
            const isOpen = openDropdown === item.key
            
            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      setOpenDropdown(isOpen ? null : item.key)
                    } else {
                      handleNavigation(item.href)
                    }
                  }}
                  className={`flex items-center space-x-1 text-white hover:text-red-400 transition-colors duration-300 font-medium text-lg cursor-pointer ${
                    item.isBlue ? 'text-blue-400 hover:text-blue-300' : 
                    item.isHot ? 'text-red-400 hover:text-red-300' :
                    item.isAdmin ? 'text-yellow-400 hover:text-yellow-300' :
                    'text-white hover:text-red-400'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Submenu Dropdown */}
                {item.hasSubmenu && isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl py-2 z-50">
                    {submenus[item.key as keyof typeof submenus]?.map((subItem) => (
                      <button
                        key={subItem.label}
                        onClick={() => {
                          handleNavigation(subItem.href)
                          setOpenDropdown(null)
                        }}
                        className={`w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-300 cursor-pointer flex items-center space-x-2 ${
                          item.isAdmin ? 'hover:text-yellow-400' : 'hover:text-red-400'
                        }`}
                      >
                        {'icon' in subItem && subItem.icon && <subItem.icon className="h-4 w-4" />}
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Botões Direita */}
        <div className="flex items-center space-x-2 mr-12">
          {/* Ícone de Pendências */}
          <button 
            onClick={() => setShowPendentesModal(true)}
            className="relative flex items-center justify-center w-10 h-10 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-400/50 rounded-lg transition-all duration-300 group"
            title="Ver Pendências"
          >
            <AlertTriangle className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <button 
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-300 font-medium text-lg cursor-pointer"
            title="Ir para Homepage"
          >
            <Globe className="h-5 w-5" />
            <span>Homepage</span>
          </button>
        </div>
      </div>

      {/* Overlay para fechar submenu */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Modal de Pendências */}
      {showPendentesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-black/95 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">Pendências</h2>
                <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold border border-orange-500/30">
                  11 itens
                </span>
              </div>
              <button
                onClick={() => setShowPendentesModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300 p-2 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="space-y-4">
                {/* Firebase Sync */}
                <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Sincronizar com Firebase</h3>
                        <p className="text-gray-300 text-sm">Configurar conexão com banco de dados</p>
                      </div>
                    </div>
                    <span className="text-red-400 text-sm font-medium">Crítico</span>
                  </div>
                </div>

                {/* Admin Sync */}
                <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Sincronia de Administradores</h3>
                        <p className="text-gray-300 text-sm">Configurar permissões e usuários admin</p>
                      </div>
                    </div>
                    <span className="text-orange-400 text-sm font-medium">Alto</span>
                  </div>
                </div>

                {/* Orders Sync */}
                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Sincronia de Pedidos</h3>
                        <p className="text-gray-300 text-sm">Integrar sistema de pedidos com estoque</p>
                      </div>
                    </div>
                    <span className="text-yellow-400 text-sm font-medium">Médio</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Configurar Métodos de Pagamento</h3>
                        <p className="text-gray-300 text-sm">PIX, Cartão, Boleto e outras formas</p>
                      </div>
                    </div>
                    <span className="text-blue-400 text-sm font-medium">Médio</span>
                  </div>
                </div>

                {/* Hoodies Sizes */}
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Aguardando Tamanhos Exatos - Moletons</h3>
                        <p className="text-gray-300 text-sm">Definir medidas precisas para moletons</p>
                      </div>
                    </div>
                    <span className="text-purple-400 text-sm font-medium">Baixo</span>
                  </div>
                </div>

                {/* Jackets Sizes */}
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Aguardando Tamanhos Exatos - Jaquetas</h3>
                        <p className="text-gray-300 text-sm">Definir medidas precisas para jaquetas</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm font-medium">Baixo</span>
                  </div>
                </div>

                {/* SEO Config */}
                <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Configuração SEO</h3>
                        <p className="text-gray-300 text-sm">Meta tags, sitemap e otimizações</p>
                      </div>
                    </div>
                    <span className="text-cyan-400 text-sm font-medium">Médio</span>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border border-pink-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Google Analytics</h3>
                        <p className="text-gray-300 text-sm">Configurar tracking e relatórios</p>
                      </div>
                    </div>
                    <span className="text-pink-400 text-sm font-medium">Baixo</span>
                  </div>
                </div>

                {/* Payment Info Sync */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 border border-indigo-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Sincronizar Informações do Pagamento</h3>
                        <p className="text-gray-300 text-sm">Configurar valores, PIX, cartão, boleto</p>
                      </div>
                    </div>
                    <span className="text-indigo-400 text-sm font-medium">Alto</span>
                  </div>
                </div>

                {/* Unified Sidebar System */}
                <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/20 border border-teal-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Sistema Unificado de Sidebars</h3>
                        <p className="text-gray-300 text-sm">Integrar todas as sidebars de filtros para atualizações simultâneas</p>
                      </div>
                    </div>
                    <span className="text-teal-400 text-sm font-medium">Crítico</span>
                  </div>
                </div>

                {/* Unified Cards System */}
                <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="text-white font-semibold">Sistema Unificado de Cards</h3>
                        <p className="text-gray-300 text-sm">Unificar todos os cards de categoria para atualizações simultâneas</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Crítico</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => {
                    const pendentesData = {
                      timestamp: new Date().toISOString(),
                      total: 11,
                      items: [
                        { title: "Sincronizar com Firebase", priority: "Crítico", status: "Pendente" },
                        { title: "Sincronia de Administradores", priority: "Alto", status: "Pendente" },
                        { title: "Sincronia de Pedidos", priority: "Médio", status: "Pendente" },
                        { title: "Configurar Métodos de Pagamento", priority: "Médio", status: "Pendente" },
                        { title: "Aguardando Tamanhos Exatos - Moletons", priority: "Baixo", status: "Pendente" },
                        { title: "Aguardando Tamanhos Exatos - Jaquetas", priority: "Baixo", status: "Pendente" },
                        { title: "Configuração SEO", priority: "Médio", status: "Pendente" },
                        { title: "Google Analytics", priority: "Baixo", status: "Pendente" },
                        { title: "Sincronizar Informações do Pagamento", priority: "Alto", status: "Pendente" },
                        { title: "Sistema Unificado de Sidebars", priority: "Crítico", status: "Pendente" },
                        { title: "Sistema Unificado de Cards", priority: "Crítico", status: "Pendente" }
                      ]
                    }
                    
                    const blob = new Blob([JSON.stringify(pendentesData, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'pendencias-gang-boyz.json'
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Baixar Arquivo de Pendências
                </button>
                <p className="text-center text-gray-400 text-sm mt-2">
                  Arquivo JSON com todas as pendências para facilitar o acompanhamento
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
