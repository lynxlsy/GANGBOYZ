"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Menu, 
  X, 
  Home, 
  Settings, 
  Image as ImageIcon, 
  Star, 
  Flame, 
  Eye, 
  Shield,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Globe,
  ShoppingBag,
  MessageSquare,
  Palette,
  Info,
  Trash2,
  Bell
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollToTop } from "@/components/scroll-to-top"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

const adminMenuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    href: "/admin",
    color: "text-blue-600"
  },
  {
    id: "banners-management",
    title: "Banners",
    icon: ImageIcon,
    href: "/admin/banners",
    color: "text-purple-600"
  },
  {
    id: "act-system",
    title: "Sistema ACT",
    icon: Settings,
    href: "/act",
    color: "text-green-600"
  },
  {
    id: "orders-management",
    title: "Pedidos",
    icon: ShoppingBag,
    href: "#",
    color: "text-indigo-600"
  },
  {
    id: "modal-boas-vindas",
    title: "Modal Boas-Vindas",
    icon: MessageSquare,
    href: "/admin/modal-boas-vindas",
    color: "text-red-600"
  },
  {
    id: "design",
    title: "Design",
    icon: Palette,
    href: "/admin/design",
    color: "text-purple-600"
  },
  {
    id: "notificacoes",
    title: "Notificações",
    icon: Bell,
    href: "/admin/notificacoes",
    color: "text-orange-600"
  },
      {
        id: "sobre",
        title: "Sobre",
        icon: Info,
        href: "/admin/sobre",
        color: "text-blue-600"
      },
      {
        id: "limpeza",
        title: "Limpeza",
        icon: Trash2,
        href: "/admin/limpeza-armazenamento",
        color: "text-red-600"
      },
  {
    id: "security-login",
    title: "Segurança",
    icon: Shield,
    href: "/admin/seguranca",
    color: "text-emerald-600"
  }
]

const productMenuItems = [
  {
    id: "camisetas",
    title: "Camisetas",
    emoji: "👕",
    href: "/admin/camisetas",
    color: "text-blue-600"
  },
  {
    id: "moletons",
    title: "Moletons",
    emoji: "🧥",
    href: "/admin/moletons",
    color: "text-green-600"
  },
  {
    id: "jaquetas",
    title: "Jaquetas",
    emoji: "🧥",
    href: "/admin/jaquetas",
    color: "text-purple-600"
  },
  {
    id: "calcas",
    title: "Calças",
    emoji: "👖",
    href: "/admin/calcas",
    color: "text-orange-600"
  },
  {
    id: "shorts-bermudas",
    title: "Shorts/Bermudas",
    emoji: "🩳",
    href: "/admin/shorts-bermudas",
    color: "text-red-600"
  }
]

export function AdminLayout({ 
  children, 
  title, 
  subtitle
}: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
            
            {/* Title */}
            <div className="text-center flex-1">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            
            {/* Homepage Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="p-2 hover:bg-gray-100"
            >
              <Link href="/">
                <Globe className="h-4 w-4 text-gray-600" />
              </Link>
            </Button>
          </div>
        </div>
      </header>


      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-full max-w-80 bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 flex items-center justify-center">
                    <img 
                      src="/logo-gang-boyz-new.svg" 
                      alt="Gang Boyz Logo" 
                      className="w-full h-full object-contain filter brightness-0"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 scroll-smooth">
                {/* Botão Ver Site Mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Link href="/" className="flex items-center justify-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Ver Site</span>
                  </Link>
                </Button>

                {/* Menu de Navegação Mobile */}
                <nav className="space-y-2">
                  {/* Seção Principal */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Principal</h3>
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Seção Produtos */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Produtos</h3>
                    {productMenuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            {/* Logo e Título */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                <img 
                  src="/logo-gang-boyz-new.svg" 
                  alt="Gang Boyz Logo" 
                  className="w-full h-full object-contain filter brightness-0"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            </div>


            {/* Botão Ver Site */}
            <div className="mb-6">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Link href="/" className="flex items-center justify-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Ver Site</span>
                </Link>
              </Button>
            </div>

            {/* Menu de Navegação */}
            <nav className="space-y-1">
              {/* Seção Principal */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Principal</h3>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Seção Produtos */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Produtos</h3>
                {productMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50">
          <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <ScrollToTop />
    </div>
  )
}
