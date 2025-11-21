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
import { getContentById } from "@/lib/editable-content-utils"
import { editableContentSyncService } from '@/lib/editable-content-sync';
import { useEditMode } from "@/lib/edit-mode-context"
import MobileHeaderLiteral from "@/components/mobile-header-literal"

export function HeaderHomepage({ hideMobileHeader = false }: { hideMobileHeader?: boolean }) {
  const { state, openCart } = useCart()
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isBannerAtTop, setIsBannerAtTop] = useState(true)
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/5511999999999")
  const { isProductPage, isProductDetailPage } = useProductPage()
  const { user } = useUser()
  const { isEditMode, toggleEditMode } = useEditMode()
  
  const cartItemsCount = state.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

  const menuItems = [
    { label: "Camisetas", href: "/camisetas", icon: null, hasSubmenu: true, key: "camisetas" },
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

  // Verificar se o banner está no topo
  useEffect(() => {
    const checkBannerPosition = () => {
      if (typeof window !== 'undefined') {
        const bannerAtTop = localStorage.getItem('gang-boyz-banner-at-top') === 'true'
        setIsBannerAtTop(bannerAtTop)
      }
    }

    // Verificar inicialmente
    checkBannerPosition()

    // Adicionar listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gang-boyz-banner-at-top') {
        setIsBannerAtTop(e.newValue === 'true')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Também verificar periodicamente para garantir sincronização
    const interval = setInterval(checkBannerPosition, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
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

  // Firebase integration for WhatsApp link
  useEffect(() => {
    // Carregar link do WhatsApp do Firebase ou localStorage
    const loadWhatsAppLink = () => {
      if (typeof window !== 'undefined') {
        // Try Firebase first
        const firebaseContent = getContentById("whatsapp-link")
        if (firebaseContent) {
          setWhatsappLink(firebaseContent)
          return;
        }
        
        // Try localStorage as fallback
        const savedContacts = localStorage.getItem("gang-boyz-contacts")
        if (savedContacts) {
          try {
            const contacts = JSON.parse(savedContacts)
            const whatsappContact = contacts.find((contact: any) => contact.id === 'whatsapp')
            if (whatsappContact && whatsappContact.isActive) {
              setWhatsappLink(whatsappContact.url)
            }
          } catch (error) {
            console.error('Erro ao fazer parse dos contatos:', error)
          }
        }
      }
    }

    loadWhatsAppLink()

    // Firebase real-time listener for WhatsApp link
    const unsubscribeWhatsApp = editableContentSyncService.listenToContentChanges("whatsapp-link", (content) => {
      if (content) {
        setWhatsappLink(content)
        // Also save to localStorage for offline access
        const contacts = [{
          id: 'whatsapp',
          url: content,
          isActive: true
        }]
        localStorage.setItem("gang-boyz-contacts", JSON.stringify(contacts))
      }
    });

    return () => {
      // Clean up Firebase listener
      unsubscribeWhatsApp()
    }
  }, [])

  const handleWhatsApp = () => {
    window.open(whatsappLink, '_blank')
  }

  return (
    <>
      {/* Header Desktop - With black background */}
      <div className="hidden md:block relative top-0 left-0 right-0 z-[60] bg-black">
        <div className="flex items-center justify-between px-[80px] py-6">
          
          {/* Logo - Responsivo */}
          <div className="flex items-center">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center group"
            >
              <img
                src="/logo-gang-boyz-new.svg"
                alt="Gang BoyZ"
                className="cursor-pointer transition-all duration-300 group-hover:scale-105 w-[230px]"
              />
            </button>
          </div>

          {/* Empty space to maintain layout - removed all other elements */}
          <div className="flex-1"></div>

          {/* Only the logo, no other icons */}
        </div>
      </div>

      {/* Header Mobile - With black background */}
      {!(hideMobileHeader || isProductDetailPage) && (
        <div className="md:hidden absolute top-0 left-0 right-0 z-[60] bg-black py-3">
          <div className="flex justify-center">
            <button 
              onClick={() => handleNavigation("/")}
              className="flex items-center group"
            >
              <img
                src="/logo-gang-boyz-new.svg"
                alt="Gang BoyZ"
                className="cursor-pointer transition-all duration-300 group-hover:scale-105 w-[180px]"
              />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Apenas Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

    </>
  )
}