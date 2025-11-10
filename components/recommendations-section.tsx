"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Edit3, Trash2, Save } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { useCart } from "@/lib/cart-context"
import { StandardProductCard } from "@/components/standard-product-card"
import { AdminProductModal } from "@/components/admin-product-modal"
import { useEditMode } from "@/lib/edit-mode-context"
import { toast } from "sonner"
import { useProducts } from "@/lib/products-context-simple"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Recommendation {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isActive: boolean
  availableUnits?: number
  availableSizes?: string[]
  sizeQuantities?: Record<string, number> // Add size quantities
  recommendationCategory?: string
  recommendationSubcategory?: string
}

// Função para gerar IDs únicos
function generateUniqueId(prefix: string = "REC"): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

// Função para limpar recomendações antigas quando o armazenamento está cheio
function cleanupOldRecommendations(recommendations: Recommendation[], maxItems: number = 30): Recommendation[] {
  // Se tivermos mais itens do que o máximo permitido, remover os mais antigos
  if (recommendations.length > maxItems) {
    // Ordenar por ID (que contém timestamp) e manter os mais recentes
    return recommendations
      .sort((a, b) => {
        // Extrair timestamp do ID
        const timestampA = parseInt(a.id.split('-')[1] || '0', 36)
        const timestampB = parseInt(b.id.split('-')[1] || '0', 36)
        return timestampB - timestampA // Mais recentes primeiro
      })
      .slice(0, maxItems)
  }
  return recommendations
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

// Reverse mapping function for display purposes
const getSubcategoryDisplayName = (subcategoryKey: string): string => {
  switch (subcategoryKey) {
    // Camisetas
    case "regata": return "Regata";
    case "manga-curta": return "Manga Curta";
    case "manga-longa": return "Manga Longa";
    case "polo": return "Polo";
    case "tank-top": return "Tank Top";
    case "basica": return "Básica";
    
    // Moletons
    case "com-capuz": return "Com Capuz";
    case "sem-capuz": return "Sem Capuz";
    case "ziper": return "Ziper";
    
    // Jaquetas
    case "casual": return "Casual";
    case "esportiva": return "Esportiva";
    case "social": return "Social";
    
    // Calças
    case "jeans": return "Jeans";
    case "moletom": return "Moletom";
    case "social-calca": return "Social";
    
    // Shorts/Bermudas
    case "casual-short": return "Casual";
    case "esportivo": return "Esportivo";
    case "praia": return "Praia";
    
    // Default case - convert hyphens to spaces and capitalize words
    default: 
      return subcategoryKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [highlightedProducts, setHighlightedProducts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const { activeTheme } = useTheme()
  const { addItem, openCart } = useCart()
  const { isEditMode } = useEditMode()
  const { addProduct, updateProduct, deleteProduct, products } = useProducts()
  const [editableTitle, setEditableTitle] = useState("RECOMENDAÇÕES")
  const [editingTitle, setEditingTitle] = useState("")

  // Carregar recomendações do localStorage
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return
    
    const loadRecommendations = async () => {
      // Try to fetch recommendations from backend first
      try {
        const response = await fetch('/api/content?id=gang-boyz-recommendations');
        if (response.ok) {
          const data = await response.json();
          if (data['gang-boyz-recommendations']) {
            const parsedRecommendations: Recommendation[] = JSON.parse(data['gang-boyz-recommendations']);
            // Limitar a 30 recomendações para evitar problemas de performance
            const limitedRecommendations = parsedRecommendations.slice(-30);
            
            // Filtrar apenas produtos ativos e remover o teste
            const activeRecommendations = limitedRecommendations.filter(rec => rec.isActive && rec.id !== "REC-TEST-001");
            setRecommendations(activeRecommendations);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching recommendations from backend:", error);
      }
      
      // Fallback to localStorage
      const savedRecommendations = localStorage.getItem("gang-boyz-recommendations");
      if (savedRecommendations) {
        try {
          const parsedRecommendations: Recommendation[] = JSON.parse(savedRecommendations);
          // Limitar a 30 recomendações para evitar problemas de performance
          const limitedRecommendations = parsedRecommendations.slice(-30);
          
          // Filtrar apenas produtos ativos e remover o teste
          const activeRecommendations = limitedRecommendations.filter(rec => rec.isActive && rec.id !== "REC-TEST-001");
          setRecommendations(activeRecommendations);
          
          // Atualizar localStorage se o teste foi removido ou se foi limitado
          if (parsedRecommendations.length !== activeRecommendations.length || parsedRecommendations.length > 30) {
            localStorage.setItem("gang-boyz-recommendations", JSON.stringify(activeRecommendations));
          }
        } catch (error) {
          console.error("Erro ao carregar recomendações:", error);
          // Se houver erro no parse, inicializar com array vazio
          localStorage.setItem("gang-boyz-recommendations", JSON.stringify([]));
          setRecommendations([]);
        }
      } else {
        // Inicializar com array vazio se não houver recomendações
        localStorage.setItem("gang-boyz-recommendations", JSON.stringify([]));
        setRecommendations([]);
      }
    }

    loadRecommendations();

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-recommendations") {
        loadRecommendations();
      }
    }

    // Escutar eventos customizados
    const handleCustomStorageChange = () => {
      loadRecommendations();
    }

    // Escutar mudanças nos conteúdos editáveis
    const handleEditableContentsChange = async () => {
      const titleContent = await getContentById("recommendations-title");
      if (titleContent) {
        setEditableTitle(titleContent);
        setEditingTitle(titleContent);
      }
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('recommendationsUpdated', handleCustomStorageChange);
    window.addEventListener('editableContentsUpdated', handleEditableContentsChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('recommendationsUpdated', handleCustomStorageChange);
      window.removeEventListener('editableContentsUpdated', handleEditableContentsChange);
    }
  }, []);

  // Carregar produtos destacados para recomendações
  useEffect(() => {
    const loadHighlightedProducts = () => {
      // Filtrar produtos marcados para aparecer em recomendações
      const highlighted = products.filter(product => 
        product.destacarEmRecomendacoes === true
      );
      setHighlightedProducts(highlighted);
    };

    loadHighlightedProducts();

    // Escutar eventos de atualização de produtos
    const handleProductsUpdate = () => {
      loadHighlightedProducts();
    };

    window.addEventListener('forceProductsReload', handleProductsUpdate);
    window.addEventListener('testProductCreated', handleProductsUpdate);

    return () => {
      window.removeEventListener('forceProductsReload', handleProductsUpdate);
      window.removeEventListener('testProductCreated', handleProductsUpdate);
    };
  }, [products]);

  // Combinar recomendações regulares com produtos destacados
  const allRecommendations = [
    ...recommendations,
    ...highlightedProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || `${product.name} - Cor: ${product.color}`,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Recomendações",
      isActive: true,
      availableUnits: product.stock || 0,
      availableSizes: product.sizes || [],
      sizeQuantities: product.sizeStock || {},
      recommendationCategory: product.recommendationCategory || "",
      recommendationSubcategory: ""
    }))
  ]
  const displayRecommendations = allRecommendations.slice(0, 12) // Limitar a 12 imagens (2 linhas de 6)

  // Função para adicionar produto ao carrinho e abrir sidebar
  const handleAddToCart = (recommendation: Recommendation) => {
    if (isEditMode) return; // Não adicionar ao carrinho no modo de edição
    
    addItem({
      id: Number(recommendation.id),
      name: recommendation.name,
      price: recommendation.price,
      image: recommendation.image || "/placeholder-default.svg",
    })
    openCart()
    toast.success(`${recommendation.name} adicionado ao carrinho!`)
  }

  // Função para editar uma recomendação
  const handleEditRecommendation = (recommendation: Recommendation) => {
    // Try to get the full product data from admin products to include product info fields
    let productForModal = { ...recommendation };
    
    try {
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
      if (existingAdminProducts) {
        const adminProductsArray = JSON.parse(existingAdminProducts);
        const existingProduct = adminProductsArray.find((p: any) => p.id === recommendation.id);
        
        if (existingProduct) {
          // Merge the admin product data with the recommendation data
          productForModal = {
            ...recommendation,
            ...existingProduct,
            // Ensure recommendation-specific fields are preserved
            category: recommendation.category,
            availableUnits: recommendation.availableUnits,
            availableSizes: recommendation.availableSizes,
            sizeQuantities: recommendation.sizeQuantities,
            recommendationCategory: recommendation.recommendationCategory,
            recommendationSubcategory: recommendation.recommendationSubcategory
          };
        } else {
          // If not found in test products, try other product storage
          const otherProductStorages = [
            "gang-boyz-products",
            "gang-boyz-standalone-products",
            "gang-boyz-recommendations"
          ];
          
          for (const storageKey of otherProductStorages) {
            const storedProducts = localStorage.getItem(storageKey);
            if (storedProducts) {
              const productsArray = JSON.parse(storedProducts);
              const foundProduct = productsArray.find((p: any) => p.id === recommendation.id);
              if (foundProduct) {
                productForModal = {
                  ...recommendation,
                  ...foundProduct,
                  // Ensure recommendation-specific fields are preserved
                  category: recommendation.category,
                  availableUnits: recommendation.availableUnits,
                  availableSizes: recommendation.availableSizes,
                  sizeQuantities: recommendation.sizeQuantities,
                  recommendationCategory: recommendation.recommendationCategory,
                  recommendationSubcategory: recommendation.recommendationSubcategory
                };
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching full product data for edit:", error);
      // Fall back to just the recommendation data
      productForModal = { ...recommendation };
    }
    
    setCurrentProduct(productForModal);
    setIsEditing(true);
    setIsModalOpen(true);
  }

  // Function to handle adding a new recommendation with destacar checkbox pre-checked and disabled
  const handleAddNewRecommendation = () => {
    const defaultProduct = {
      id: generateUniqueId('REC'),
      name: "",
      price: 0,
      originalPrice: 0,
      image: "/placeholder-default.svg",
      color: "",
      category: "Recomendações",
      subcategory: "recomendacoes",
      label: "",
      labelType: undefined,
      stock: 0,
      sizeStock: {},
      availableUnits: 0,
      availableSizes: [],
      sizeQuantities: {},
      recommendationCategory: "",
      recommendationSubcategory: "",
      // Automatically check the destacar checkbox for recommendations
      destacarEmRecomendacoes: true,
      destacarEmOfertas: false,
      destacarEmAlta: false,
      destacarLancamentos: false
    };
    
    setCurrentProduct(defaultProduct);
    setIsEditing(false);
    setIsModalOpen(true);
  }

  // Função para salvar uma recomendação (criar ou atualizar)
  const handleSaveRecommendation = async (product: any) => {
    if (isEditing) {
      // Atualizar recomendação existente
      await handleUpdateRecommendation(product);
    } else {
      // Adicionar nova recomendação
      await handleCreateRecommendation(product);
    }
    
    // Instead of dispatching events that cause infinite loops, just reload the recommendations directly
    // This avoids the circular event loop while still updating the display
    const savedRecommendations = localStorage.getItem("gang-boyz-recommendations");
    if (savedRecommendations) {
      try {
        const parsedRecommendations: Recommendation[] = JSON.parse(savedRecommendations);
        // Limitar a 30 recomendações para evitar problemas de performance
        const limitedRecommendations = parsedRecommendations.slice(-30);
        
        // Filtrar apenas produtos ativos e remover o teste
        const activeRecommendations = limitedRecommendations.filter(rec => rec.isActive && rec.id !== "REC-TEST-001");
        setRecommendations(activeRecommendations);
      } catch (error) {
        console.error("Erro ao recarregar recomendações:", error);
      }
    }
    
    // Also reload highlighted products directly
    const highlighted = products.filter(p => p.destacarEmRecomendacoes === true);
    setHighlightedProducts(highlighted);
    
    toast.success(isEditing ? "Recomendação atualizada com sucesso!" : "Recomendação adicionada com sucesso!");
  }

  // Função para atualizar uma recomendação existente
  const handleUpdateRecommendation = async (product: any) => {
    // Calculate total available units from size quantities
    const sizeQuantities = product.sizeQuantities || {};
    const availableSizes = product.availableSizes || [];
    const totalUnits = Object.values(sizeQuantities).reduce((sum: number, qty: unknown) => 
      sum + (typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0), 0);
    
    // Converter o produto do modal para o formato de recomendação
    const updatedRecommendation: Recommendation = {
      id: product.id,
      name: product.name,
      description: `${product.name} - Cor: ${product.color}`,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Recomendações",
      isActive: true,
      availableUnits: totalUnits,
      availableSizes: availableSizes,
      sizeQuantities: sizeQuantities,
      recommendationCategory: product.recommendationCategory,
      recommendationSubcategory: product.recommendationSubcategory
    }

    // Atualizar no localStorage
    const existingRecommendations = localStorage.getItem("gang-boyz-recommendations");
    let recommendationsArray: Recommendation[] = [];
    
    if (existingRecommendations) {
      recommendationsArray = JSON.parse(existingRecommendations);
    }
    
    // Encontrar e atualizar a recomendação existente
    const updatedArray = recommendationsArray.map(rec => 
      rec.id === updatedRecommendation.id ? updatedRecommendation : rec
    );
    
    // Salvar no localStorage
    try {
      localStorage.setItem("gang-boyz-recommendations", JSON.stringify(updatedArray));
      
      // Also save to backend
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-recommendations', 
          content: JSON.stringify(updatedArray) 
        }),
      });
    } catch (error) {
      console.error('Erro ao atualizar recomendação:', error);
      toast.error('Erro ao atualizar a recomendação.');
      return;
    }
    
    // Atualizar também no contexto de produtos principal
    if (product.recommendationCategory && product.recommendationSubcategory) {
      // Converter para o formato do admin product
      // First check if product already exists in admin products
      const existingAdminProducts = localStorage.getItem("gang-boyz-test-products");
      let existingProduct = null;
      if (existingAdminProducts) {
        try {
          const adminProductsArray = JSON.parse(existingAdminProducts);
          existingProduct = adminProductsArray.find((p: any) => p.id === updatedRecommendation.id);
        } catch (error) {
          console.error('Error parsing admin products:', error);
        }
      }
      
      const adminProduct: any = {
        ...(existingProduct || {}), // Preserve existing properties
        id: updatedRecommendation.id,
        name: updatedRecommendation.name,
        price: updatedRecommendation.price,
        originalPrice: updatedRecommendation.originalPrice,
        image: updatedRecommendation.image,
        color: product.color || "Preto",
        categories: [product.recommendationCategory, product.recommendationSubcategory],
        sizes: availableSizes,
        stock: totalUnits,
        sizeStock: Object.entries(sizeQuantities).reduce((acc, [size, qty]) => {
          acc[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0;
          return acc;
        }, {} as Record<string, number>),
        discountPercentage: updatedRecommendation.originalPrice && updatedRecommendation.originalPrice > updatedRecommendation.price 
          ? Math.round(((updatedRecommendation.originalPrice - updatedRecommendation.price) / updatedRecommendation.originalPrice) * 100)
          : (existingProduct ? existingProduct.discountPercentage : undefined),
        installments: existingProduct?.installments || "3x sem juros",
        brand: existingProduct?.brand || "Gang BoyZ",
        isNew: existingProduct?.isNew !== undefined ? existingProduct.isNew : true,
        isPromotion: !!(updatedRecommendation.originalPrice && updatedRecommendation.originalPrice > updatedRecommendation.price),
        description: updatedRecommendation.description,
        status: existingProduct?.status || "ativo",
        availableUnits: totalUnits,
        availableSizes: availableSizes,
        recommendationCategory: product.recommendationCategory,
        // Configuração de destaque - preserve existing settings
        destacarEmRecomendacoes: product.destacarEmRecomendacoes !== undefined ? product.destacarEmRecomendacoes : (existingProduct?.destacarEmRecomendacoes !== undefined ? existingProduct.destacarEmRecomendacoes : true),
        destacarEmOfertas: product.destacarEmOfertas || existingProduct?.destacarEmOfertas || false,
        destacarEmAlta: product.destacarEmAlta || existingProduct?.destacarEmAlta || false,
        destacarLancamentos: product.destacarLancamentos || existingProduct?.destacarLancamentos || false
      }

      // Atualizar no contexto de produtos
      updateProduct(updatedRecommendation.id, adminProduct);
    }
    
    // Disparar evento para atualizar outros componentes (but not forceProductsReload to avoid loops)
    window.dispatchEvent(new Event('recommendationsUpdated'));
    
    // Close modal
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProduct(null);
  }

  // Função para criar uma nova recomendação
  const handleCreateRecommendation = async (product: any) => {
    // Calculate total available units from size quantities
    const sizeQuantities = product.sizeQuantities || {};
    const availableSizes = product.availableSizes || [];
    const totalUnits = Object.values(sizeQuantities).reduce((sum: number, qty: unknown) => 
      sum + (typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0), 0);
    
    // Converter o produto do modal para o formato de recomendação
    const newRecommendation: Recommendation = {
      id: product.id || generateUniqueId("REC"), // Gera ID único se não houver
      name: product.name,
      description: `${product.name} - Cor: ${product.color}`,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Recomendações",
      isActive: true,
      availableUnits: totalUnits, // Use calculated total
      availableSizes: availableSizes,
      sizeQuantities: sizeQuantities, // Store size quantities
      recommendationCategory: product.recommendationCategory,
      recommendationSubcategory: product.recommendationSubcategory
    }

    // Salvar no localStorage
    const existingRecommendations = localStorage.getItem("gang-boyz-recommendations");
    let recommendationsArray: Recommendation[] = [];
    
    if (existingRecommendations) {
      recommendationsArray = JSON.parse(existingRecommendations);
    }
    
    // Adicionar a nova recomendação
    recommendationsArray.push(newRecommendation);
    
    // Limitar a 30 recomendações para evitar problemas de performance
    const limitedRecommendations = cleanupOldRecommendations(recommendationsArray);
    
    // Salvar no localStorage
    try {
      localStorage.setItem("gang-boyz-recommendations", JSON.stringify(limitedRecommendations));
      
      // Also save to backend
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-recommendations', 
          content: JSON.stringify(limitedRecommendations) 
        }),
      });
    } catch (error) {
      console.error('Erro ao salvar recomendação:', error);
      toast.error('Erro ao salvar a recomendação.');
      return;
    }
    
    // Também salvar no contexto de produtos principal
    if (product.recommendationCategory && product.recommendationSubcategory) {
      // Converter para o formato do admin product
      const adminProduct: any = {
        id: newRecommendation.id,
        name: newRecommendation.name,
        price: newRecommendation.price,
        originalPrice: newRecommendation.originalPrice,
        image: newRecommendation.image,
        color: product.color || "Preto",
        categories: [product.recommendationCategory, product.recommendationSubcategory],
        sizes: availableSizes,
        stock: totalUnits,
        sizeStock: Object.entries(sizeQuantities).reduce((acc, [size, qty]) => {
          acc[size] = typeof qty === 'string' ? parseInt(qty) || 0 : typeof qty === 'number' ? qty : 0;
          return acc;
        }, {} as Record<string, number>),
        discountPercentage: newRecommendation.originalPrice && newRecommendation.originalPrice > newRecommendation.price 
          ? Math.round(((newRecommendation.originalPrice - newRecommendation.price) / newRecommendation.originalPrice) * 100)
          : undefined,
        installments: "3x sem juros",
        brand: "Gang BoyZ",
        isNew: true,
        isPromotion: !!(newRecommendation.originalPrice && newRecommendation.originalPrice > newRecommendation.price),
        description: newRecommendation.description,
        status: "ativo",
        availableUnits: totalUnits,
        availableSizes: availableSizes,
        recommendationCategory: product.recommendationCategory,
        // Configuração de destaque - pre-checked for recommendations
        destacarEmRecomendacoes: true,
        destacarEmOfertas: product.destacarEmOfertas || false,
        destacarEmAlta: product.destacarEmAlta || false,
        destacarLancamentos: product.destacarLancamentos || false
      }

      // Adicionar ao contexto de produtos
      addProduct(adminProduct);
    }
    
    // Disparar evento para atualizar outros componentes (but not forceProductsReload to avoid loops)
    window.dispatchEvent(new Event('recommendationsUpdated'));
    
    // Close modal
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProduct(null);
  }

  // Função para deletar uma recomendação
  const handleDeleteRecommendation = async (id: string) => {
    // Remover do localStorage
    const existingRecommendations = localStorage.getItem("gang-boyz-recommendations");
    let recommendationsArray: Recommendation[] = [];
    
    if (existingRecommendations) {
      recommendationsArray = JSON.parse(existingRecommendations);
    }
    
    // Filtrar para remover a recomendação
    const updatedRecommendations = recommendationsArray.filter(rec => rec.id !== id);
    
    // Salvar no localStorage
    try {
      localStorage.setItem("gang-boyz-recommendations", JSON.stringify(updatedRecommendations));
      
      // Also save to backend
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: 'gang-boyz-recommendations', 
          content: JSON.stringify(updatedRecommendations) 
        }),
      });
    } catch (error) {
      console.error('Erro ao deletar recomendação:', error);
      toast.error('Erro ao deletar a recomendação.');
      return;
    }
    
    // Também remover do contexto de produtos
    deleteProduct(id);
    
    // Disparar evento para atualizar outros componentes (but not forceProductsReload to avoid loops)
    window.dispatchEvent(new Event('recommendationsUpdated'));
    
    toast.success("Recomendação removida com sucesso!");
  }

  const handleSaveTitle = () => {
    updateContentById("recommendations-title", editingTitle)
    setEditableTitle(editingTitle)
    toast.success("Título atualizado com sucesso!")
  }

  const handleCancelEdit = () => {
    setEditingTitle(editableTitle)
  }

  return (
    <section className="py-8 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <div className="text-center mb-8 md:mb-12">
          {isEditMode ? (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Input
                  value={editingTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                  className="text-2xl md:text-3xl font-bold text-white text-center bg-gray-800 border-gray-600"
                />
                <Edit3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <Button onClick={handleSaveTitle} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-700 text-white hover:bg-gray-600">
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {editableTitle}
              </h2>
              <div className="w-16 h-1 bg-red-600 mx-auto"></div>
            </>
          )}
        </div>

        {/* Desktop - Grid de produtos */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayRecommendations.map((recommendation, index) => (
            <div key={recommendation.id} className="relative group">
              <StandardProductCard
                product={{
                  id: recommendation.id,
                  name: recommendation.name,
                  price: recommendation.price,
                  image: recommendation.image,
                  originalPrice: recommendation.originalPrice
                }}
                onClick={() => isEditMode ? handleEditRecommendation(recommendation) : window.location.href = `/produto/${recommendation.id}`}
              />
              
              {/* Botões de edição e exclusão quando em modo de edição */}
              {/* {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRecommendation(recommendation);
                    }}
                    title="Editar produto"
                  >
                    <Edit3 className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                        handleDeleteRecommendation(recommendation.id);
                      }
                    }}
                    title="Excluir produto"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              )} */}
            </div>
          ))}
          
          {/* Botão de adicionar quando em modo de edição */}
          {/* Ocultando o botão de adicionar produto conforme solicitado */}
          {/* {isEditMode && (
            <div 
              className="w-full flex items-center justify-center cursor-pointer group"
              onClick={() => {
                setCurrentProduct(null);
                setIsEditing(false);
                setIsModalOpen(true);
              }}
            >
              <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
                <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 cursor-pointer">
                  <div className="text-center text-gray-400">
                    <div className="text-2xl mb-1">➕</div>
                    <div className="text-xs font-medium">ADICIONAR PRODUTO</div>
                    <div className="text-xs">Clique para adicionar</div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Novo elemento abaixo do grid */}
        <div className="mt-6">
          {/* conteúdo do novo elemento */}
        </div>

        {/* Mobile - Grid otimizado (2 cards por linha) */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {displayRecommendations.map((recommendation) => (
              <div 
                key={recommendation.id}
                className="relative group"
              >
                <div 
                  className="bg-black overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation"
                  onClick={() => isEditMode ? handleEditRecommendation(recommendation) : window.location.href = `/produto/${recommendation.id}`}
                >
                  {/* Imagem com proporção otimizada para mobile */}
                  <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
                    <img
                      src={recommendation.image}
                      alt={recommendation.name}
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                      loading="lazy"
                    />
                  </div>

                  {/* Nome/Código embaixo da imagem - Otimizado para mobile */}
                  <div className="text-white p-2 sm:p-3">
                    <h3 className="font-semibold text-xs sm:text-sm leading-tight mb-1">{recommendation.name}</h3>
                    <div className="red-text font-bold text-sm sm:text-lg">R$ {recommendation.price.toFixed(2).replace('.', ',')}</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">ID: {recommendation.id}</div>
                    
                    {/* Display additional information for recommendations */}
                    {recommendation.availableUnits !== undefined && (
                      <div className="text-gray-400 text-[10px] sm:text-xs mt-1">
                        Estoque: {recommendation.availableUnits} unid.
                      </div>
                    )}
                    {recommendation.availableSizes && recommendation.availableSizes.length > 0 && (
                      <div className="text-gray-400 text-[10px] sm:text-xs">
                        Tamanhos: {recommendation.availableSizes.join(", ")}
                      </div>
                    )}
                    {recommendation.recommendationCategory && (
                      <div className="text-gray-400 text-[10px] sm:text-xs">
                        Categoria: {recommendation.recommendationCategory}
                      </div>
                    )}
                    {recommendation.recommendationSubcategory && (
                      <div className="text-gray-400 text-[10px] sm:text-xs">
                        Subcategoria: {recommendation.recommendationSubcategory}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Botões de edição e exclusão quando em modo de edição */}
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      className="bg-white/80 hover:bg-white border border-gray-300 shadow-md rounded-full p-1 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRecommendation(recommendation);
                      }}
                      title="Editar produto"
                    >
                      <Edit3 className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      className="bg-red-500/80 hover:bg-red-500 border border-red-600 shadow-md rounded-full p-1 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                          handleDeleteRecommendation(recommendation.id);
                        }
                      }}
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Botão de adicionar quando em modo de edição */}
            {/* Ocultando o botão de adicionar produto conforme solicitado */}
            {/* {isEditMode && (
              <div 
                className="relative group"
                onClick={() => {
                  setCurrentProduct(null);
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative w-full" style={{ paddingBottom: '133.33333333333%' }}>
                  <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 cursor-pointer">
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-400 text-sm font-medium">Adicionar Produto</span>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
      
      {/* Banner Footer */}
      <div className="container mx-auto px-4 py-8">

      </div>

      {/* Modal para adicionar/editar recomendação */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
          setCurrentProduct(null);
        }}
        product={currentProduct}
        onSave={handleSaveRecommendation}
        title="Recomendações"
        subcategory="recomendacoes"
        mode={isEditing ? "edit" : "create"}
      />
    </section>
  )
}