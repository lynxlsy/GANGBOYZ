"use client"

import { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingCart, Sparkles, Flame, ChevronDown, Menu, X, Home, Bell, Truck } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { MobileLogoSection } from "@/components/mobile-logo-section"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useProductPage } from "@/hooks/use-product-page"
import { SearchBar } from "@/components/search-bar"
import { UserDropdown } from "@/components/user-dropdown"
import { useUser } from "@/lib/user-context"
import { useEditMode } from "@/lib/edit-mode-context"

export function HeaderCentered({ hideMobileLogo = false, forceBlackBackground = false }: { hideMobileLogo?: boolean, forceBlackBackground?: boolean }) {
  const { state, openCart } = useCart()
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isProductPage } = useProductPage()
  const { user } = useUser()
  const { isEditMode, toggleEditMode } = useEditMode()

  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  const menuItems = [
    { label: "Camisetas", href: "/camisetas/basica", icon: null, hasSubmenu: true, key: "camisetas" },
    { label: "Moletons", href: "/moletons", icon: null, hasSubmenu: true, key: "moletons" },
    { label: "Jaquetas", href: "/jaquetas", icon: null, hasSubmenu: true, key: "jaquetas" },
    { label: "Calças", href: "/calcas", icon: null, hasSubmenu: true, key: "calcas" },
    { label: "Shorts/Bermudas", href: "/shorts-bermudas", icon: null, hasSubmenu: true, key: "shorts" },
    { label: "Lançamentos", href: "/lancamentos", icon: Sparkles, isBlue: true },
    { label: "Em alta", href: "/em-alta", icon: Flame, isHot: true }
  ]

  const submenus = {
    camisetas: [
      { label: "Manga Longa", href: "/camisetas/manga-longa" },
      { label: "Manga Curta", href: "/camisetas/manga-curta" },
      { label: "Regata", href: "/camisetas/regata" },
      { label: "Tank Top", href: "/camisetas/tank-top" },
      { label: "Polo", href: "/camisetas/polo" },
      { label: "Básica", href: "/camisetas/basica" }
    ],
    moletons: [
      { label: "Com Capuz", href: "/moletons/com-capuz" },
      { label: "Sem Capuz", href: "/moletons/sem-capuz" },
      { label: "Zíper", href: "/moletons/ziper" }
    ],
    jaquetas: [
      { label: "Casual", href: "/jaquetas/casual" },
      { label: "Esportiva", href: "/jaquetas/esportiva" },
      { label: "Social", href: "/jaquetas/social" }
    ],
    calcas: [
      { label: "Jeans", href: "/calcas/jeans" },
      { label: "Moletom", href: "/calcas/moletom" },
      { label: "Social", href: "/calcas/social" }
    ],
    shorts: [
      { label: "Esportivo", href: "/shorts-bermudas/esportivo" },
      { label: "Casual", href: "/shorts-bermudas/casual" },
      { label: "Praia", href: "/shorts-bermudas/praia" }
    ]
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    setOpenDropdown(null)
    setIsSidebarOpen(false)
  }

  // Detectar scroll para header fixo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  // Fechar barra de pesquisa ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showSearchBar && !target.closest('.search-container')) {
        setShowSearchBar(false)
      }
    }

    if (showSearchBar) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSearchBar])

  // Fechar sidebar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
        setShowSearchBar(false)
        setOpenDropdown(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Header Desktop - Com logo à esquerda e menu centralizado */}
      <div className={`hidden md:block absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${
        forceBlackBackground 
          ? 'bg-black' 
          : isScrolled 
            ? 'bg-black/90 backdrop-blur-md' 
            : 'bg-transparent'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isProductPage 
            ? 'px-[80px] py-4' 
            : 'px-[80px] py-6'
        }`}>
          
          {/* Logo - À esquerda */}
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center group touch-manipulation"
            >
              <img
                src="/logo-gang-boyz-new.svg"
                alt="Gang BoyZ"
                className={`cursor-pointer transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? 'w-[200px]' : 'w-[230px]'
                }`}
              />
            </button>
          </div>

          {/* Menu Centralizado */}
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {/* Botão Início */}
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer text-white touch-manipulation"
            >
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Início</span>
            </button>
            
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isOpen = openDropdown === item.key
              
              if (item.hasSubmenu) {
                return (
                  <div key={item.label} className="relative group">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                      className={`flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer ${
                        item.isHot 
                          ? 'text-red-500 font-bold' 
                          : item.isBlue
                          ? 'text-blue-500 font-bold'
                          : 'text-white'
                      } touch-manipulation`}
                      style={{ 
                        fontFamily: item.isHot 
                          ? 'Inter, Work Sans, sans-serif, cursive' 
                          : 'Inter, Work Sans, sans-serif' 
                      }}
                    >
                      <span className="hidden lg:inline">{item.label}</span>
                      <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Submenu Dropdown - Melhorado */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-2">
                          {submenus[item.key as keyof typeof submenus]?.map((subItem, index) => (
                            <button
                              key={subItem.label}
                              onClick={() => handleNavigation(subItem.href)}
                              className={`w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer transform translate-y-[-10px] opacity-0 animate-fadeInDown touch-manipulation`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <span className="font-medium">{subItem.label}</span>
                              <div className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer ${
                    item.isHot 
                      ? 'text-red-500 font-bold' 
                      : item.isBlue
                      ? 'text-blue-500 font-bold'
                      : 'text-white'
                  } touch-manipulation`}
                  style={{ 
                    fontFamily: item.isHot 
                      ? 'Inter, Work Sans, sans-serif, cursive' 
                      : 'Inter, Work Sans, sans-serif' 
                  }}
                >
                  {IconComponent && (
                    <IconComponent className={`h-5 w-5 transition-colors duration-200 ${
                      item.isHot 
                        ? 'text-red-500 group-hover:text-red-400' 
                        : item.isBlue
                        ? 'text-blue-500 group-hover:text-blue-400'
                        : 'group-hover:text-yellow-400'
                    }`} />
                  )}
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </nav>

          {/* Ícones - Direita */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Botão de Pesquisa */}
            <button 
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer search-container group touch-manipulation"
              title="Pesquisar"
            >
              <Search className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
            
            {/* Usuário Logado ou Botão de Login */}
            {user ? (
              <div className="touch-manipulation">
                <UserDropdown />
              </div>
            ) : (
              <button 
                onClick={() => handleNavigation('/auth/signin')}
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group touch-manipulation"
                title="Entrar / Criar Conta"
              >
                <User className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
            
            {/* Favoritos */}
            <button 
              onClick={() => handleNavigation('/favoritos')}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group relative touch-manipulation"
              title="Favoritos"
            >
              <Heart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {/* Indicador de favoritos */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
            
            {/* Carrinho */}
            <button 
              onClick={openCart}
              className="relative text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group touch-manipulation"
              title="Carrinho"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse touch-manipulation">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Desktop - Melhorada */}
        {showSearchBar && (
          <div className="px-[80px] pb-4 animate-in slide-in-from-top duration-300 search-container">
            <SearchBar className="hidden md:block" />
          </div>
        )}
      </div>

      {/* Header Mobile - Otimizado */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="flex md:hidden items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-md border-b border-white/10 relative">
          {/* Menu Hamburguer */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-2 touch-manipulation"
            title="Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Ícones - Centro Mobile */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            {/* Busca */}
            <button 
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-0.5 px-1 py-0.5 rounded-md hover:bg-white/10 touch-manipulation"
              title="Buscar"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-medium text-white">Busca</span>
            </button>

            {/* Favoritos */}
            <button 
              onClick={() => handleNavigation('/favoritos')}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-0.5 px-1 py-0.5 rounded-md hover:bg-white/10 touch-manipulation"
              title="Favoritos"
            >
              <Heart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-medium text-white">Favoritos</span>
            </button>

            {/* Contato */}
            <button 
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-0.5 px-1 py-0.5 rounded-md hover:bg-white/10 touch-manipulation"
              title="Contato"
            >
              <img 
                src="/icons8-whatsapp-64.png" 
                alt="WhatsApp" 
                className="h-4 w-4 group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xs font-medium text-white">Contato</span>
            </button>

            {/* Login */}
            {user ? (
              <div className="touch-manipulation">
                <UserDropdown />
              </div>
            ) : (
              <button 
                onClick={() => handleNavigation('/auth/signin')}
                className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex flex-col items-center space-y-0.5 px-1 py-0.5 rounded-md hover:bg-white/10 touch-manipulation"
                title="Entrar / Criar Conta"
              >
                <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-medium text-white">Login</span>
              </button>
            )}
          </div>

          {/* Ícones - Direita Mobile */}
          <div className="flex items-center space-x-3">
            
            {/* Carrinho */}
            <button 
              onClick={openCart}
              className="relative text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer group flex-shrink-0 p-2 touch-manipulation"
              title="Carrinho"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse text-[10px] touch-manipulation">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Container próprio para a logo mobile - totalmente transparente */}
        {!hideMobileLogo && (
          <div className="flex md:hidden justify-center py-4 absolute inset-x-0 top-full z-[-1]">
            <div className="w-[210px] flex justify-center">
              <button 
                onClick={() => router.push("/")}
                className="flex items-center group focus:outline-none touch-manipulation"
                aria-label="Voltar para a página inicial"
              >
                <img
                  src="/logo-gang-boyz-new.svg"
                  alt="Gang BoyZ"
                  className="cursor-pointer transition-all duration-300 group-hover:scale-105 w-[210px] opacity-100"
                />
              </button>
            </div>
          </div>
        )}

        {/* Barra de Pesquisa Mobile */}
        {showSearchBar && (
          <div className="px-4 pb-3 animate-in slide-in-from-top duration-300 search-container">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Sidebar - Apenas Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    </>
  )
}