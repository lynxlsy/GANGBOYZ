"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { SleeveCardsShowcase } from "@/components/sleeve-cards-showcase"
import { 
  SquarePen, 
  Package, 
  Heart, 
  ShoppingCart, 
  ChevronDown,
  Image as ImageIcon,
  Tag,
  Palette,
  Ruler,
  Bell,
  Settings,
  Clock,
  Users,
  Save,
  RefreshCw,
  Eye,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  X
} from "lucide-react"

// Componentes simples para substituir os componentes do UI
const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <label className={className}>{children}</label>
)

const Switch = ({ 
  checked, 
  onCheckedChange,
  className
}: { 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) => (
  <button
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${className || ''}`}
    role="switch"
    aria-checked={checked}
  >
    <span className="sr-only">Toggle</span>
    <span
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </span>
  </button>
)

export default function ActPage() {
  const [activeTab, setActiveTab] = useState("regata")
  
  // Mock data for product preview
  const [productPreview, setProductPreview] = useState({
    id: "",
    name: "",
    currentPrice: "",
    originalPrice: "",
    color: "",
    image: "",
    labelType: "",
    labelText: "",
    // Added new fields for recommendations
    availableUnits: "",
    availableSizes: [] as string[],
    sizeQuantities: {} as Record<string, string>, // Add size quantities
    recommendationCategory: "",
    recommendationSubcategory: "" // Added subcategory field
  })

  // Handle input changes for product preview
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProductPreview(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle size selection for recommendations
  const handleSizeSelection = (size: string) => {
    setProductPreview(prev => {
      const currentSizes = prev.availableSizes || []
      const newSizes = currentSizes.includes(size)
        ? currentSizes.filter(s => s !== size)
        : [...currentSizes, size]
      
      // If we're removing a size, also remove its quantity
      const newSizeQuantities = { ...prev.sizeQuantities }
      if (currentSizes.includes(size)) {
        delete newSizeQuantities[size]
      }
      
      return { 
        ...prev, 
        availableSizes: newSizes,
        sizeQuantities: newSizeQuantities
      }
    })
  }

  // Handle size quantity change for recommendations
  const handleSizeQuantityChange = (size: string, quantity: string) => {
    setProductPreview(prev => ({
      ...prev,
      sizeQuantities: {
        ...prev.sizeQuantities,
        [size]: quantity
      }
    }))
  }

  // Handle recommendation category selection
  const handleRecommendationCategoryChange = (category: string) => {
    setProductPreview(prev => ({ 
      ...prev, 
      recommendationCategory: category,
      recommendationSubcategory: "" // Reset subcategory when category changes
    }))
  }

  // Handle recommendation subcategory selection
  const handleRecommendationSubcategoryChange = (subcategory: string) => {
    setProductPreview(prev => ({ ...prev, recommendationSubcategory: subcategory }))
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductPreview(prev => ({
            ...prev,
            image: event.target?.result as string
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Save product to localStorage
  const saveProduct = () => {
    try {
      // Validate required fields
      if (!productPreview.name) {
        alert("Por favor, preencha o nome do produto.")
        return
      }
      
      if (!productPreview.currentPrice) {
        alert("Por favor, preencha o preço do produto.")
        return
      }
      
      if (!productPreview.color) {
        alert("Por favor, selecione a cor do produto.")
        return
      }
      
      // For recommendations, validate additional fields
      if (activeTab === "recomendacoes") {
        if (!productPreview.availableSizes || productPreview.availableSizes.length === 0) {
          alert("Por favor, selecione pelo menos um tamanho disponível.")
          return
        }
        
        if (!productPreview.recommendationCategory) {
          alert("Por favor, selecione a categoria do produto.")
          return
        }
        
        if (!productPreview.recommendationSubcategory) {
          alert("Por favor, selecione a subcategoria do produto.")
          return
        }
      }
      
      // Create product object
      const product = {
        id: productPreview.id || `PROD${Date.now()}`,
        name: productPreview.name,
        price: parseFloat(productPreview.currentPrice),
        originalPrice: productPreview.originalPrice ? parseFloat(productPreview.originalPrice) : undefined,
        color: productPreview.color,
        image: productPreview.image || "/placeholder-default.svg",
        category: "Camisetas",
        subcategory: activeTab === "manga-curta" ? "manga-curta" : 
                     activeTab === "manga-longa" ? "manga-longa" : 
                     activeTab === "regata" ? "regata" : 
                     activeTab === "recomendacoes" ? productPreview.recommendationCategory : 
                     activeTab,
        sizes: activeTab === "recomendacoes" ? productPreview.availableSizes : ["P", "M", "G", "GG"],
        stock: activeTab === "recomendacoes" ? 
          Object.values(productPreview.sizeQuantities || {}).reduce((sum, qty) => sum + (parseInt(qty as string) || 0), 0) : 
          10,
        sizeStock: activeTab === "recomendacoes" ? 
          Object.keys(productPreview.sizeQuantities || {}).reduce((acc, size) => {
            acc[size] = parseInt((productPreview.sizeQuantities || {})[size] as string) || 0
            return acc
          }, {} as Record<string, number>) : 
          undefined,
        // Recommendation specific fields
        ...(activeTab === "recomendacoes" && {
          availableSizes: productPreview.availableSizes,
          sizeQuantities: productPreview.sizeQuantities,
          recommendationCategory: productPreview.recommendationCategory,
          recommendationSubcategory: productPreview.recommendationSubcategory
        })
      }
      
      // Load existing products
      const existingProducts = localStorage.getItem("gang-boyz-test-products")
      let products = existingProducts ? JSON.parse(existingProducts) : []
      
      // Add new product
      products.push(product)
      
      // Save to localStorage
      localStorage.setItem("gang-boyz-test-products", JSON.stringify(products))
      
      // Dispatch event to notify products context
      window.dispatchEvent(new CustomEvent('testProductCreated'))
      
      // Reset form
      setProductPreview({
        id: "",
        name: "",
        currentPrice: "",
        originalPrice: "",
        color: "",
        image: "",
        labelType: "",
        labelText: "",
        availableUnits: "",
        availableSizes: [],
        sizeQuantities: {},
        recommendationCategory: "",
        recommendationSubcategory: ""
      })
      
      alert("Produto salvo com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      alert("Erro ao salvar produto. Por favor, tente novamente.")
    }
  }

  // Tabs configuration
  const tabs = [
    { id: "regata", name: "Regata" },
    { id: "manga-curta", name: "Manga Curta" },
    { id: "manga-longa", name: "Manga Longa" },
    { id: "recomendacoes", name: "⭐ Recomendações" }, // Added recommendations tab
    { id: "unified-cards", name: "🗃️ Cards Unificados" },
    { id: "notificacoes", name: "🔔 Notificações" },
    { id: "welcome-modal", name: "🎉 Modal de Boas-Vindas" },
    { id: "design", name: "🎨 Central de Design" }
  ]

  // Estado para configurações de notificações
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    interval: 8,
    duration: 3,
    maxNotifications: 10,
    showProductId: true,
    showPrice: true,
    showNickname: true,
    customMessage: ""
  })

  // Estado para configurações do modal de boas-vindas
  const [welcomeModalConfig, setWelcomeModalConfig] = useState({
    enabled: true,
    displayTime: 4,
    title: "Seja bem-vindo",
    description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
    buttonText: "Explorar Loja"
  })

  // Estado para controlar a exibição do modal de teste
  const [showTestModal, setShowTestModal] = useState(false)

  // Estado para temas de design
  const [themes, setThemes] = useState([
    {
      id: "red-blood",
      name: "Vermelho Sangue",
      description: "Vermelho escuro e elegante, perfeito para streetwear",
      active: true,
      colors: {
        primary: "#dc2626",
        hover: "#b91c1c",
        gradientStart: "#dc2626",
        gradientEnd: "#991b1b"
      }
    },
    {
      id: "vibrant-red",
      name: "Vermelho Vibrante",
      description: "Vermelho vibrante e chamativo, ideal para chamar atenção",
      active: false,
      colors: {
        primary: "#ef4444",
        hover: "#dc2626",
        gradientStart: "#ef4444",
        gradientEnd: "#b91c1c"
      }
    }
  ])

  // Função para selecionar um tema
  const selectTheme = (themeId: string) => {
    setThemes(prevThemes => 
      prevThemes.map(theme => ({
        ...theme,
        active: theme.id === themeId
      }))
    )
  }

  // Função para obter o tema ativo
  const getActiveTheme = () => {
    return themes.find(theme => theme.active) || themes[0]
  }

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem("gang-boyz-notification-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setNotificationSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }
  }, [])

  // Carregar configurações do modal de boas-vindas
  useEffect(() => {
    const savedConfig = localStorage.getItem('welcome-modal-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setWelcomeModalConfig(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Erro ao carregar configurações do modal:", error)
      }
    }
  }, [])

  // Salvar configurações
  const saveNotificationSettings = async () => {
    try {
      localStorage.setItem("gang-boyz-notification-settings", JSON.stringify(notificationSettings))
      
      // Disparar evento para atualizar o sistema de notificações
      window.dispatchEvent(new CustomEvent('notificationSettingsChanged', { 
        detail: notificationSettings 
      }))
      
      // Mostrar feedback visual
      const saveButton = document.getElementById('save-button')
      if (saveButton) {
        const originalText = saveButton.textContent
        saveButton.textContent = '✅ Salvo!'
        setTimeout(() => {
          saveButton.textContent = originalText
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
    }
  }

  // Resetar para padrão
  const resetToDefault = () => {
    const defaultSettings = {
      enabled: true,
      interval: 8,
      duration: 3,
      maxNotifications: 10,
      showProductId: true,
      showPrice: true,
      showNickname: true,
      customMessage: ""
    }
    setNotificationSettings(defaultSettings)
  }

  // Testar notificação
  const testNotification = () => {
    window.dispatchEvent(new CustomEvent('testNotification', { 
      detail: {
        nickname: "Usuário Teste",
        productName: "Produto de Teste",
        productId: "TEST001",
        price: 99.90
      }
    }))
  }

  // Atualizar configuração do modal
  const updateWelcomeModalConfig = (key: string, value: any) => {
    setWelcomeModalConfig(prev => ({ ...prev, [key]: value }))
  }

  // Salvar configurações do modal de boas-vindas
  const saveWelcomeModalConfig = () => {
    try {
      localStorage.setItem('welcome-modal-config', JSON.stringify(welcomeModalConfig))
      
      // Mostrar feedback visual
      const saveButton = document.getElementById('save-welcome-modal-button')
      if (saveButton) {
        const originalText = saveButton.textContent
        saveButton.textContent = '✅ Salvo!'
        setTimeout(() => {
          saveButton.textContent = originalText
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao salvar configurações do modal:", error)
    }
  }

  // Resetar configurações do modal para padrão
  const resetWelcomeModalConfig = () => {
    const defaultConfig = {
      enabled: true,
      displayTime: 4,
      title: "Seja bem-vindo",
      description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
      buttonText: "Explorar Loja"
    }
    setWelcomeModalConfig(defaultConfig)
  }

  // Limpar histórico de visualização
  const clearWelcomeModalHistory = () => {
    localStorage.removeItem('gang-boyz-welcome-seen')
    localStorage.removeItem('welcome-modal-disabled')
  }

  const updateNotificationSetting = (key: string, value: any) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  // Available sizes for recommendations
  const availableSizes = ["P", "M", "G", "GG", "XG", "XXG"]

  // Available categories for recommendations
  const recommendationCategories = [
    "Camisetas",
    "Calças",
    "Jaquetas",
    "Moletons",
    "Shorts/Bermudas"
  ]

  // Available subcategories based on selected category
  const getSubcategories = (category: string) => {
    switch (category) {
      case "Camisetas":
        return ["Regata", "Manga Curta", "Manga Longa", "Polo", "Tank Top", "Básica"]
      case "Calças":
        return ["Jeans", "Moletom", "Social"]
      case "Jaquetas":
        return ["Casual", "Esportiva", "Social"]
      case "Moletons":
        return ["Com Capuz", "Sem Capuz", "Ziper"]
      case "Shorts/Bermudas":
        return ["Casual", "Esportivo", "Praia"]
      default:
        return []
    }
  }

  // Function to get the correct subcategory key based on category and subcategory
  const getSubcategoryKey = (category: string, subcategory: string): string => {
    // Handle special cases first
    if (category === "Calças" && subcategory === "Social") {
      return "social-calca";
    }
    if (category === "Shorts/Bermudas" && subcategory === "Casual") {
      return "casual-short";
    }
    
    // Handle general cases
    switch (subcategory) {
      // Camisetas
      case "Regata": return "regata";
      case "Manga Curta": return "manga-curta";
      case "Manga Longa": return "manga-longa";
      case "Polo": return "polo";
      case "Tank Top": return "tank-top";
      case "Básica": return "basica";
      
      // Moletons
      case "Com Capuz": return "com-capuz";
      case "Sem Capuz": return "sem-capuz";
      case "Ziper": return "ziper";
      
      // Jaquetas
      case "Casual": return "casual";
      case "Esportiva": return "esportiva";
      case "Social": return "social";
      
      // Calças
      case "Jeans": return "jeans";
      case "Moletom": return "moletom";
      
      // Shorts/Bermudas
      case "Esportivo": return "esportivo";
      case "Praia": return "praia";
      
      // Default case - convert to lowercase and replace spaces with hyphens
      default: return subcategory.toLowerCase().replace(/\s+/g, '-');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Cards</h1>
            <p className="text-gray-600">Gerencie os cards dos produtos</p>
          </div>
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
          >
            Voltar ao Admin
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-3xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
          {activeTab === "unified-cards" ? (
            <div className="space-y-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black bg-gradient-to-r from-white via-red-200 to-blue-200 bg-clip-text text-transparent">
                        Sistema de Cards Unificados
                      </h2>
                      <p className="text-white/80 text-sm">Visualização unificada de Regata, Manga Curta e Manga Longa</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <SleeveCardsShowcase />
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-2xl p-6 mb-8 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <SquarePen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black bg-gradient-to-r from-white via-red-200 to-blue-200 bg-clip-text text-transparent">
                        Adicionar Produto - {tabs.find(tab => tab.id === activeTab)?.name}
                      </h2>
                      <p className="text-white/80 text-sm">Crie um novo produto</p>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-6 w-6">
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {/* Preview Card - Apenas para guias de produtos */}
                {(activeTab === "regata" || activeTab === "manga-curta" || activeTab === "manga-longa" || activeTab === "recomendacoes") && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg">Preview do Card</h3>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-[240px] bg-black cursor-pointer">
                          <div className="w-[240px] h-[280px] bg-gray-800 flex items-center justify-center overflow-hidden relative group">
                            {productPreview.image ? (
                              <img 
                                src={productPreview.image} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center text-gray-400">
                                <div className="text-2xl mb-1">🖼️</div>
                                <div className="text-xs font-medium">ADICIONE SUA IMAGEM</div>
                                <div className="text-xs">240x280px</div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-white/90 text-gray-700 hover:bg-white hover:scale-105">
                                <Heart className="w-4 h-4 transition-all duration-300" />
                              </button>
                              <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-white/90 text-gray-700 hover:bg-white hover:scale-105">
                                <ShoppingCart className="w-4 h-4 transition-all duration-300" />
                              </button>
                            </div>
                          </div>
                          <div className="p-2 bg-black text-left">
                            <h3 className="text-sm font-semibold text-white mb-1 text-left line-clamp-2">
                              {productPreview.name || "Nome do Produto"}
                            </h3>
                            <div className="flex items-center gap-2 mb-2 text-left">
                              <span className="text-base font-bold text-white">
                                R$ {productPreview.currentPrice || "0,00"}
                              </span>
                              {productPreview.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  R$ {productPreview.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mb-1 text-left">
                              #{productPreview.id || "ID"}
                            </div>
                            <div className="text-xs text-gray-400 mb-1 text-left">
                              Cor: {productPreview.color || "Não definida"}
                            </div>
                            
                            {/* Display additional information for recommendations */}
                            {activeTab === "recomendacoes" && productPreview.availableSizes && productPreview.availableSizes.length > 0 && (
                              <div className="text-xs text-gray-400 mb-1 text-left">
                                Estoque: {Object.entries(productPreview.sizeQuantities || {})
                                  .filter(([size, qty]) => productPreview.availableSizes?.includes(size) && qty)
                                  .map(([size, qty]) => `${size}: ${qty}`)
                                  .join(', ') || "Nenhum tamanho selecionado"}
                              </div>
                            )}
                            {activeTab === "recomendacoes" && productPreview.recommendationCategory && (
                              <div className="text-xs text-gray-400 mb-1 text-left">
                                Categoria: {productPreview.recommendationCategory}
                              </div>
                            )}
                            
                            <div className="mb-2">
                              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                                <span>Tamanhos:</span>
                                <span className="text-gray-300">
                                  {productPreview.availableSizes.length > 0 
                                    ? `${productPreview.availableSizes.slice(0, 3).join(", ")}${productPreview.availableSizes.length > 3 ? ` +${productPreview.availableSizes.length - 3}` : ''}`
                                    : "P, M, G +3"}
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulário de Produto ou Notificações */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  {activeTab === "notificacoes" ? (
                    // Interface de Notificações
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Bell className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-gray-800 font-bold text-lg">🔔 Central de Notificações</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6">
                        Configure as notificações de compras do site
                      </p>

                      {/* Status */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                          notificationSettings.enabled ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">
                          Status: {notificationSettings.enabled ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Controle Principal */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Controle Principal
                          </h4>
                          
                          {/* Ativar/Desativar */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-gray-900">Ativar Notificações</Label>
                              <p className="text-xs text-gray-500">
                                Liga ou desliga o sistema de notificações
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.enabled}
                              onCheckedChange={(checked) => updateNotificationSetting('enabled', checked)}
                            />
                          </div>

                          {/* Intervalo */}
                          <div className="space-y-2 mb-4">
                            <Label className="text-sm font-medium flex items-center gap-2 text-gray-900">
                              <Clock className="h-4 w-4" />
                              Intervalo entre Notificações
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="3"
                                max="60"
                                value={notificationSettings.interval}
                                onChange={(e) => updateNotificationSetting('interval', parseInt(e.target.value) || 8)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className="text-sm text-gray-500">segundos</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Tempo entre cada notificação (3-60 segundos)
                            </p>
                          </div>

                          {/* Duração */}
                          <div className="space-y-2 mb-4">
                            <Label className="text-sm font-medium text-gray-900">Duração da Notificação</Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={notificationSettings.duration}
                                onChange={(e) => updateNotificationSetting('duration', parseInt(e.target.value) || 3)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className="text-sm text-gray-500">segundos</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Tempo que a notificação fica visível (1-10 segundos)
                            </p>
                          </div>

                          {/* Máximo de Notificações */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2 text-gray-900">
                              <Users className="h-4 w-4" />
                              Máximo de Notificações
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                min="5"
                                max="50"
                                value={notificationSettings.maxNotifications}
                                onChange={(e) => updateNotificationSetting('maxNotifications', parseInt(e.target.value) || 10)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className="text-sm text-gray-500">notificações</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Número máximo de notificações no ciclo (5-50)
                            </p>
                          </div>
                        </div>

                        {/* Configurações de Exibição */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Configurações de Exibição
                          </h4>
                          
                          {/* Mostrar Nickname */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-gray-900">Mostrar Nome do Comprador</Label>
                              <p className="text-xs text-gray-500">
                                Exibe o nome/nickname de quem comprou
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.showNickname}
                              onCheckedChange={(checked) => updateNotificationSetting('showNickname', checked)}
                            />
                          </div>

                          {/* Mostrar ID do Produto */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-gray-900">Mostrar ID do Produto</Label>
                              <p className="text-xs text-gray-500">
                                Exibe o código/ID do produto comprado
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.showProductId}
                              onCheckedChange={(checked) => updateNotificationSetting('showProductId', checked)}
                            />
                          </div>

                          {/* Mostrar Preço */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-gray-900">Mostrar Preço</Label>
                              <p className="text-xs text-gray-500">
                                Exibe o preço do produto comprado
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.showPrice}
                              onCheckedChange={(checked) => updateNotificationSetting('showPrice', checked)}
                            />
                          </div>

                          {/* Mensagem Personalizada */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900">Mensagem Personalizada</Label>
                            <input
                              placeholder="Ex: Acabou de comprar"
                              value={notificationSettings.customMessage}
                              onChange={(e) => updateNotificationSetting('customMessage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <p className="text-xs text-gray-500">
                              Texto personalizado para as notificações (opcional)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Ações</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Teste e gerencie as configurações de notificações
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={testNotification}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Bell className="h-4 w-4" />
                            Testar Notificação
                          </button>
                          
                          <button
                            onClick={resetToDefault}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Resetar Padrão
                          </button>
                          
                          <button
                            id="save-button"
                            onClick={saveNotificationSettings}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Save className="h-4 w-4" />
                            Salvar Configurações
                          </button>
                        </div>
                      </div>

                      {/* Status Atual */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Status Atual</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-900">
                              {notificationSettings.enabled ? "✅" : "❌"}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Sistema</p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">
                              {notificationSettings.interval}s
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Intervalo</p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">
                              {notificationSettings.duration}s
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Duração</p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-purple-600">
                              {notificationSettings.maxNotifications}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Máximo</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === "welcome-modal" ? (
                    // Interface do Modal de Boas-Vindas
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">🎉</span>
                        </div>
                        <h3 className="text-gray-800 font-bold text-lg">🎉 Modal de Boas-Vindas</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-6">
                        Configure a mensagem que aparece quando visitantes acessam o site
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Modo Visualização */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Modo Visualização
                          </h4>
                          
                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                // Mostrar o modal de boas-vindas de verdade
                                setShowTestModal(true)
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <Eye className="h-4 w-4" />
                              Testar Modal
                            </button>
                            
                            <button
                              onClick={resetWelcomeModalConfig}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Resetar Modal
                            </button>
                            
                            <button
                              id="save-welcome-modal-button"
                              onClick={saveWelcomeModalConfig}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Save className="h-4 w-4" />
                              Editar Configurações
                            </button>
                          </div>
                        </div>

                        {/* Configurações */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            ⚙️ Configurações
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Ativar/Desativar */}
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-gray-900">Modal Ativo</Label>
                              <Switch
                                checked={welcomeModalConfig.enabled}
                                onCheckedChange={(checked) => updateWelcomeModalConfig('enabled', checked)}
                              />
                            </div>

                            {/* Tempo de Exibição */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-2 text-gray-900">
                                <Clock className="h-4 w-4" />
                                Tempo de Exibição (segundos)
                              </Label>
                              <input
                                type="number"
                                min="1"
                                max="30"
                                value={welcomeModalConfig.displayTime}
                                onChange={(e) => updateWelcomeModalConfig('displayTime', parseInt(e.target.value) || 4)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                            </div>

                            {/* Título */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-900">Título Principal</Label>
                              <input
                                value={welcomeModalConfig.title}
                                onChange={(e) => updateWelcomeModalConfig('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Ex: Seja bem-vindo"
                              />
                            </div>

                            {/* Descrição */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-900">Descrição</Label>
                              <textarea
                                value={welcomeModalConfig.description}
                                onChange={(e) => updateWelcomeModalConfig('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                rows={3}
                                placeholder="Descrição do modal..."
                              />
                            </div>

                            {/* Texto do Botão */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-900">Texto do Botão</Label>
                              <input
                                value={welcomeModalConfig.buttonText}
                                onChange={(e) => updateWelcomeModalConfig('buttonText', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Ex: Explorar Loja"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status do Modal */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">🎯 Status do Modal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-900">
                              {welcomeModalConfig.enabled ? "✅ Ativo" : "❌ Inativo"}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Status</p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-blue-600">
                              {welcomeModalConfig.displayTime}s
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Tempo de Exibição</p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-bold text-purple-600 truncate" title={welcomeModalConfig.title}>
                              {welcomeModalConfig.title}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Título</p>
                          </div>
                        </div>
                      </div>

                      {/* Preview do Modal */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">👁️ Preview do Modal</h4>
                        <p className="text-sm text-gray-600 mb-4">Como aparece para os visitantes</p>
                        
                        {/* Preview do modal de boas-vindas */}
                        <div className="border border-gray-300 rounded-lg p-6 max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black text-white">
                          <div className="text-center space-y-4">
                            <div className="flex justify-center">
                              <img
                                src="/IMG_2586 2.svg"
                                alt="Gang BoyZ"
                                width={160}
                                height={80}
                                className="drop-shadow-[0_0_30px_rgba(239,68,68,0.3)] mx-auto"
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{welcomeModalConfig.title}</h3>
                              <div className="w-12 h-1 bg-red-600 mx-auto rounded-full my-2"></div>
                            </div>
                            <p className="text-sm text-white/80">
                              {welcomeModalConfig.description}
                            </p>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 has-[>svg]:px-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25">
                              {welcomeModalConfig.buttonText}
                            </button>
                            <div className="pt-4">
                              <div className="w-20 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                                <div 
                                  className="h-full bg-red-600 rounded-full"
                                  style={{ width: `${100 - (100 / welcomeModalConfig.displayTime) * 2}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                Fechará automaticamente em {welcomeModalConfig.displayTime}s
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : activeTab === "design" ? (
                    // Interface da Central de Design
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">🎨</span>
                        </div>
                        <div>
                          <h3 className="text-gray-800 font-bold text-lg">🎨 Central de Design</h3>
                          <p className="text-gray-600 text-sm">Personalize as cores e temas do seu site</p>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="font-semibold text-gray-900">Tema Ativo: {getActiveTheme().name}</h4>
                            <p className="text-sm text-gray-600">{getActiveTheme().description}</p>
                          </div>
                          <div 
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: getActiveTheme().colors.primary }}
                          ></div>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-4">🌈 Temas Disponíveis</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {themes.map((theme) => (
                            <div 
                              key={theme.id}
                              className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                                theme.active 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => selectTheme(theme.id)}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-900">{theme.name}</h5>
                                {theme.active ? (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    Ativo
                                  </span>
                                ) : (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      selectTheme(theme.id)
                                    }}
                                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
                                  >
                                    Escolher Tema
                                  </button>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                              
                              <div className="space-y-2">
                                <h6 className="text-xs font-medium text-gray-700">Paleta de Cores</h6>
                                <div className="flex gap-2">
                                  <div className="flex flex-col items-center">
                                    <div 
                                      className="w-8 h-8 rounded border border-gray-300"
                                      style={{ backgroundColor: theme.colors.primary }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-1">Principal</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div 
                                      className="w-8 h-8 rounded border border-gray-300"
                                      style={{ backgroundColor: theme.colors.hover }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-1">Hover</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div 
                                      className="w-8 h-8 rounded border border-gray-300"
                                      style={{ 
                                        background: `linear-gradient(to right, ${theme.colors.gradientStart}, ${theme.colors.gradientEnd})`
                                      }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-1">Gradiente</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-4">⚡ Como Funciona</h4>
                          <p className="text-gray-600 text-sm mb-4">Entenda como os temas afetam seu site</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                <span>🎯</span> Elementos Afetados
                              </h5>
                              <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Botões principais e secundários</li>
                                <li>• Gradientes e efeitos visuais</li>
                                <li>• Links e elementos interativos</li>
                                <li>• Efeitos de hover e focus</li>
                              </ul>
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                                <span>⚡</span> Sincronização
                              </h5>
                              <ul className="text-sm text-green-800 space-y-1">
                                <li>• Mudanças aplicadas instantaneamente</li>
                                <li>• Salvo automaticamente no navegador</li>
                                <li>• Preview antes de salvar</li>
                                <li>• Funciona em todas as páginas</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Formulário de Produto (existente)
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <SquarePen className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-gray-800 font-bold text-lg">Informações do Produto</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            ID do Produto *
                          </label>
                          <input
                            name="id"
                            value={productPreview.id}
                            onChange={handleInputChange}
                            className="flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                            placeholder="Ex: RE001"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Nome do Produto *
                          </label>
                          <input
                            name="name"
                            value={productPreview.name}
                            onChange={handleInputChange}
                            className="flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                            placeholder="Ex: Regata Gang BoyZ Classic"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Preço Atual *
                          </label>
                          <input
                            name="currentPrice"
                            value={productPreview.currentPrice}
                            onChange={handleInputChange}
                            className="flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                            step="0.01"
                            placeholder="Ex: 39.90"
                            type="number"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Preço Original (opcional)
                          </label>
                          <input
                            name="originalPrice"
                            value={productPreview.originalPrice}
                            onChange={handleInputChange}
                            className="flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                            step="0.01"
                            placeholder="Ex: 59.90"
                            type="number"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Cor <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="color"
                            value={productPreview.color}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-xl px-3 py-3 focus:border-blue-500 focus:outline-none h-11"
                          >
                            <option value="">Selecione uma cor</option>
                            <option value="Preto">Preto</option>
                            <option value="Branco">Branco</option>
                            <option value="Azul">Azul</option>
                            <option value="Rosa">Rosa</option>
                            <option value="Bege">Bege</option>
                            <option value="Cinza">Cinza</option>
                            <option value="Vermelho">Vermelho</option>
                            <option value="Verde">Verde</option>
                            <option value="Amarelo">Amarelo</option>
                            <option value="Roxo">Roxo</option>
                            <option value="Laranja">Laranja</option>
                            <option value="Marrom">Marrom</option>
                            <option value="Outro">Outro</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Imagem do Produto
                          </label>
                          <div className="space-y-3">
                            <input
                              onChange={handleImageUpload}
                              className="flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                              accept="image/*"
                              type="file"
                            />
                            <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                              {productPreview.image ? (
                                <img 
                                  src={productPreview.image} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Tipo de Etiqueta <span className="text-gray-400 text-sm">(Opcional)</span>
                          </label>
                          <select
                            name="labelType"
                            value={productPreview.labelType}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-xl px-3 py-3 focus:border-blue-500 focus:outline-none h-11"
                          >
                            <option value="">Sem etiqueta</option>
                            <option value="promocao">Promoção</option>
                            <option value="esgotado">Esgotado</option>
                            <option value="personalizada">Personalizada</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                            Texto da Etiqueta <span className="text-gray-400 text-sm">(Opcional)</span>
                          </label>
                          <input
                            name="labelText"
                            value={productPreview.labelText}
                            onChange={handleInputChange}
                            className="flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-11"
                            placeholder="Ex: -50%, Esgotado, Novo, etc."
                            disabled={!productPreview.labelType}
                          />
                        </div>

                        {/* Additional fields for recommendations */}
                        {activeTab === "recomendacoes" && (
                          <>
                            {/* Tamanhos Disponíveis com Quantidades */}
                            <div className="md:col-span-2">
                              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                                Tamanhos Disponíveis <span className="text-red-500">*</span>
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                {availableSizes.map(size => (
                                  <div key={size} className="flex flex-col">
                                    <button
                                      type="button"
                                      onClick={() => handleSizeSelection(size)}
                                      className={`py-3 px-2 rounded-lg border transition-colors flex flex-col items-center ${
                                        productPreview.availableSizes?.includes(size)
                                          ? "bg-blue-500 text-white border-blue-600"
                                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      <span className="font-medium">{size}</span>
                                    </button>
                                    {productPreview.availableSizes?.includes(size) && (
                                      <input
                                        type="number"
                                        min="0"
                                        name={`quantity-${size}`}
                                        value={productPreview.sizeQuantities?.[size] || ""}
                                        onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                                        className="mt-2 flex w-full border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-10"
                                        placeholder="Qtd"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                              {productPreview.availableSizes && productPreview.availableSizes.length > 0 && (
                                <div className="mt-3 text-sm text-gray-500">
                                  Selecione a quantidade para cada tamanho acima
                                </div>
                              )}
                            </div>

                            {/* Categoria do Produto */}
                            <div>
                              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                                Categoria do Produto <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="recommendationCategory"
                                value={productPreview.recommendationCategory}
                                onChange={(e) => handleRecommendationCategoryChange(e.target.value)}
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-3 py-3 focus:border-blue-500 focus:outline-none h-11"
                              >
                                <option value="">Selecione uma categoria</option>
                                {recommendationCategories.map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </div>

                            {/* Subcategoria do Produto */}
                            <div>
                              <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 font-semibold mb-2 block">
                                Subcategoria do Produto <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="recommendationSubcategory"
                                value={productPreview.recommendationSubcategory}
                                onChange={(e) => handleRecommendationSubcategoryChange(e.target.value)}
                                disabled={!productPreview.recommendationCategory}
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-3 py-3 focus:border-blue-500 focus:outline-none h-11"
                              >
                                <option value="">Selecione uma subcategoria</option>
                                {productPreview.recommendationCategory && getSubcategories(productPreview.recommendationCategory).map(subcategory => (
                                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Display additional information for recommendations in preview */}
                      {activeTab === "recomendacoes" && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-6">
                          <div className="flex items-center gap-3 text-blue-700">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Tag className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold">Informações da Recomendação</h4>
                              <p className="text-sm">
                                {productPreview.recommendationCategory && productPreview.recommendationSubcategory 
                                  ? `Categoria: ${productPreview.recommendationCategory} > ${productPreview.recommendationSubcategory}`
                                  : "Selecione categoria e subcategoria para ver onde o produto aparecerá"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mt-6">
                        <div className="flex items-center gap-3 text-blue-700">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Tag className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold">Dica de Preenchimento</h4>
                            <p className="text-sm">
                              Preencha todos os campos obrigatórios (*) para visualizar o card completo
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-4 mt-8">
                        <button className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                          Cancelar
                        </button>
                        <button 
                          onClick={saveProduct}
                          className="px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                        >
                          Salvar Produto
                        </button>
                      </div>
                    </>
                  )} 
                </div>

                {/* Modal de Boas-Vindas de Teste */}
                {showTestModal && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-neutral-900/95 to-black/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                      {/* Close button */}
                      <button
                        onClick={() => setShowTestModal(false)}
                        className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <div className="relative p-8 md:p-10 text-center">
                        {/* Background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-600/5" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-6">
                          {/* Logo */}
                          <div className="flex justify-center mb-8">
                            <div className="relative">
                              <img
                                src="/IMG_2586 2.svg"
                                alt="Gang BoyZ"
                                width={160}
                                height={80}
                                className="drop-shadow-[0_0_30px_rgba(239,68,68,0.3)] mx-auto"
                              />
                            </div>
                          </div>

                          {/* Welcome message */}
                          <div className="space-y-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                              {welcomeModalConfig.title}
                            </h1>
                            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
                          </div>

                          {/* Description */}
                          <p className="text-base text-white/80 max-w-sm mx-auto leading-relaxed">
                            {welcomeModalConfig.description}
                          </p>

                          {/* Action button */}
                          <div className="pt-4">
                            <button
                              onClick={() => setShowTestModal(false)}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 has-[>svg]:px-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
                            >
                              {welcomeModalConfig.buttonText}
                            </button>
                          </div>

                          {/* Never show again option */}
                          <div className="pt-4">
                            <label className="flex items-center justify-center space-x-2 text-sm text-white/60 hover:text-white/80 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only"
                              />
                              <div className="w-4 h-4 border-2 border-white/40 rounded flex items-center justify-center hover:border-white/60 transition-all duration-200">
                              </div>
                              <span>Nunca mais mostrar este modal</span>
                            </label>
                          </div>

                          {/* Auto-close indicator */}
                          <div className="pt-4">
                            <div className="w-20 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                              <div
                                className="h-full bg-red-600 rounded-full"
                                style={{
                                  animation: `shrink ${welcomeModalConfig.displayTime}s linear forwards`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-white/50 mt-2">
                              Fechará automaticamente em {welcomeModalConfig.displayTime}s
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <style jsx>{`
                        @keyframes shrink {
                          from { width: 100%; }
                          to { width: 0%; }
                        }
                      `}</style>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}