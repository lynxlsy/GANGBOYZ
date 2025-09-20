"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Menu, 
  X, 
  Home, 
  Settings, 
  Package, 
  Image as ImageIcon, 
  Star, 
  Flame, 
  Eye, 
  Trash2, 
  Shield,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Globe,
  Edit3,
  Save
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showEditControls?: boolean
  isEditing?: boolean
  onEditToggle?: () => void
  onSave?: () => void
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
    id: "products-management",
    title: "Produtos",
    icon: Package,
    href: "/admin/produtos",
    color: "text-green-600"
  },
  {
    id: "banners-management",
    title: "Banners",
    icon: ImageIcon,
    href: "/admin/banners",
    color: "text-purple-600"
  },
  {
    id: "collections-management",
    title: "Coleções",
    icon: Star,
    href: "/admin/colecoes",
    color: "text-orange-600"
  },
  {
    id: "produtos-destaque",
    title: "Destaques",
    icon: Flame,
    href: "/admin/produtos-destaque",
    color: "text-red-600"
  },
  {
    id: "ofertas-especiais",
    title: "Ofertas",
    icon: Star,
    href: "/admin/ofertas",
    color: "text-yellow-600"
  },
  {
    id: "explore-categories",
    title: "Explore",
    icon: Eye,
    href: "/admin/explore-categories",
    color: "text-indigo-600"
  },
  {
    id: "clear-prod-products",
    title: "Limpeza",
    icon: Trash2,
    href: "/admin/clear-prod-products",
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

export function AdminLayout({ 
  children, 
  title, 
  subtitle, 
  showEditControls = false,
  isEditing = false,
  onEditToggle,
  onSave
}: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
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
            
            {/* Logo */}
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/logo-gang-boyz-new.svg" 
                alt="Gang Boyz Logo" 
                className="w-full h-full object-contain filter brightness-0"
              />
            </div>
            
            {/* Title */}
            <div className="text-left">
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

      {/* Desktop Header - Design Único */}
      <header className="hidden lg:block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-red-600 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo + Title */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/logo-gang-boyz-new.svg" 
                  alt="Gang Boyz Logo" 
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              
              {/* Title with Gradient */}
              <div className="text-left">
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent mb-1">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-lg text-gray-300 font-medium">{subtitle}</p>
                )}
              </div>
            </div>


            {/* Right Section - Controls */}
            <div className="flex items-center space-x-4">
              {/* Edit Controls */}
              {showEditControls && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditToggle}
                    className={`border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm px-4 py-2 transition-all duration-300 ${
                      isEditing 
                        ? 'border-red-500 bg-red-900/30 text-red-300 hover:bg-red-800/50' 
                        : 'hover:border-red-500'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Editar Layout
                      </>
                    )}
                  </Button>

                  {isEditing && onSave && (
                    <Button
                      size="sm"
                      onClick={onSave}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm px-4 py-2 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 border border-red-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  )}
                </div>
              )}
              
              {/* Homepage Button */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2 transition-all duration-300 hover:border-white"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Ver Site</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu Admin</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-2">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            <nav className="space-y-2">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
