"use client"

import { useState, useEffect } from "react"
import { Search, User, Heart, ShoppingCart, Sparkles, Flame, ChevronDown, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useProductPage } from "@/hooks/use-product-page"

export function Header() {
  const { state } = useCart()
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { isProductPage } = useProductPage()

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
  }

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

  return (
    <>
      {/* Header Container - Ajustado baseado na página */}
        <div className={`absolute top-0 left-0 right-0 z-[60] flex items-center justify-between ${
          isProductPage 
            ? 'px-[80px]' // Páginas de produtos - espaçamento equilibrado
            : 'px-[80px]' // Homepage - espaçamento equilibrado
        }`}>
        
        {/* Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center"
          >
            <img
              src="/logo-gang-boyz-new.svg"
              alt="Gang BoyZ"
              className="h-auto w-[230px] cursor-pointer"
            />
          </button>
        </div>

        {/* Menu Centralizado */}
        <nav className="flex items-center space-x-6 relative">
          {/* Botão Início */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1 font-medium text-lg hover:text-gray-300 transition-all duration-300 hover:scale-105 group px-3 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm cursor-pointer text-white"
          >
            <span>Início</span>
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
                    }`}
                    style={{ 
                      fontFamily: item.isHot 
                        ? 'Inter, Work Sans, sans-serif, cursive' 
                        : 'Inter, Work Sans, sans-serif' 
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Submenu Dropdown */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-2">
                        {submenus[item.key as keyof typeof submenus]?.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => {
                              handleNavigation(subItem.href)
                              setOpenDropdown(null)
                            }}
                            className="w-full text-left px-4 py-3 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center justify-between group cursor-pointer"
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
                }`}
                style={{ 
                  fontFamily: item.isHot 
                    ? 'Inter, Work Sans, sans-serif, cursive' 
                    : 'Inter, Work Sans, sans-serif' 
                }}
              >
                {IconComponent && (
                  <IconComponent className={`h-5 w-5 transition-colors duration-300 ${
                    item.isHot 
                      ? 'text-red-500 group-hover:text-red-400' 
                      : item.isBlue
                      ? 'text-blue-500 group-hover:text-blue-400'
                      : 'group-hover:text-yellow-400'
                  }`} />
                )}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Ícones - Direita */}
        <div className="flex items-center space-x-6">
          <button 
            className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <Search className="h-6 w-6" />
          </button>
          <button 
            className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <User className="h-6 w-6" />
          </button>
          <button 
            className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <Heart className="h-6 w-6" />
          </button>
          <button 
            className="relative text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

    </>
  )
}