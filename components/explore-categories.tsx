"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AdminEditButton } from "@/components/admin-edit-button"
import { AdminEditModal } from "@/components/admin-edit-modal"
import { useToast } from "@/hooks/use-toast"
import { loadEditableContents, getContentById, updateContentById } from "@/lib/editable-content-utils"
import { Input } from "@/components/ui/input"
import { Edit3, Save, Plus, Trash2, ChevronDown } from "lucide-react"

interface CategoryItem {
  id: string
  name: string
  image: string
  description: string
  link: string
  isActive: boolean
}

export function ExploreCategories({ isEditMode = false }: { isEditMode?: boolean }) {
  const [exploreCategories, setExploreCategories] = useState<CategoryItem[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()
  const [editableTitle, setEditableTitle] = useState("EXPLORE NA GANG BOYZ")
  const [editingTitle, setEditingTitle] = useState("")
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState<Omit<CategoryItem, 'id' | 'isActive'>>({ 
    name: "", 
    image: "/placeholder-category.svg", 
    description: "", 
    link: "" 
  })
  const [availableLinks, setAvailableLinks] = useState<{label: string, value: string}[]>([])
  const [showLinkSelector, setShowLinkSelector] = useState(false)
  const [linkSelectorCategory, setLinkSelectorCategory] = useState<string | null>(null)

  // Carregar categorias do localStorage
  useEffect(() => {
    const loadCategories = () => {
      // Carregar título editável
      const titleContent = getContentById("explore-title")
      if (titleContent) {
        setEditableTitle(titleContent)
        setEditingTitle(titleContent)
      }

      const savedCategories = localStorage.getItem("gang-boyz-explore-categories")
      if (savedCategories) {
        setExploreCategories(JSON.parse(savedCategories))
      } else {
        // Categorias padrão
        const defaultCategories: CategoryItem[] = [
          {
            id: "oversized",
            name: "Oversized",
            image: "/placeholder-default.svg",
            description: "Looks confortáveis e despojados",
            link: "/explore/oversized",
            isActive: true
          },
          {
            id: "estampas",
            name: "Estampas",
            image: "/placeholder-default.svg", 
            description: "Designs únicos e exclusivos",
            link: "/explore/estampas",
            isActive: true
          },
          {
            id: "lisos",
            name: "Lisos",
            image: "/placeholder-default.svg",
            description: "Cores sólidas e minimalistas",
            link: "/explore/lisos",
            isActive: true
          },
          {
            id: "shorts",
            name: "Shorts",
            image: "/placeholder-default.svg",
            description: "Conforto para o dia a dia",
            link: "/explore/shorts",
            isActive: true
          },
          {
            id: "verao",
            name: "Verão",
            image: "/placeholder-default.svg",
            description: "Pieces para dias quentes",
            link: "/explore/verao",
            isActive: true
          },
          {
            id: "inverno", 
            name: "Inverno", 
            image: "/placeholder-default.svg",
            description: "Aquecimento com estilo",
            link: "/explore/inverno",
            isActive: true
          }
        ]
        setExploreCategories(defaultCategories)
        localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(defaultCategories))
      }
    }

    // Carregar inicialmente
    loadCategories()

    // Escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gang-boyz-explore-categories") {
        loadCategories()
      }
    }

    // Escutar mudanças customizadas (quando a mesma aba modifica)
    const handleCustomStorageChange = () => {
      loadCategories()
    }

    // Escutar mudanças nos conteúdos editáveis
    const handleEditableContentsChange = () => {
      const titleContent = getContentById("explore-title")
      if (titleContent) {
        setEditableTitle(titleContent)
        setEditingTitle(titleContent)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('exploreCategoriesUpdated', handleCustomStorageChange)
    window.addEventListener('editableContentsUpdated', handleEditableContentsChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('exploreCategoriesUpdated', handleCustomStorageChange)
      window.removeEventListener('editableContentsUpdated', handleEditableContentsChange)
    }
  }, [])

  // Load available links from existing categories and standard subcategories
  useEffect(() => {
    const loadAvailableLinks = () => {
      // Get existing category links
      const categoryLinks = exploreCategories.map(cat => ({
        label: `Categoria: ${cat.name}`,
        value: cat.link
      }))
      
      // Add standard subcategory links
      const standardLinks = [
        { label: "Camisetas Básicas", value: "/camisetas/basica" },
        { label: "Camisetas Manga Longa", value: "/camisetas/manga-longa" },
        { label: "Camisetas Manga Curta", value: "/camisetas/manga-curta" },
        { label: "Regatas", value: "/camisetas/regata" },
        { label: "Tank Tops", value: "/camisetas/tank-top" },
        { label: "Camisetas Polo", value: "/camisetas/polo" },
        { label: "Moletons", value: "/moletons" },
        { label: "Jaquetas", value: "/jaquetas" },
        { label: "Calças", value: "/calcas" },
        { label: "Shorts/Bermudas", value: "/shorts-bermudas" },
        { label: "Lançamentos", value: "/lancamentos" },
        { label: "Em Alta", value: "/em-alta" }
      ]
      
      setAvailableLinks([...categoryLinks, ...standardLinks])
    }
    
    loadAvailableLinks()
  }, [exploreCategories])

  const handleSaveTitle = () => {
    updateContentById("explore-title", editingTitle)
    setEditableTitle(editingTitle)
    toast({
      title: "Título atualizado",
      description: "O título da seção Explore foi atualizado com sucesso."
    })
  }

  const handleCancelEdit = () => {
    setEditingTitle(editableTitle)
  }

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da categoria"
      })
      return
    }

    // Generate link based on category name if not provided
    const link = newCategory.link || `/explore/${newCategory.name.toLowerCase().replace(/\s+/g, '-')}`

    const categoryToAdd: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      image: newCategory.image,
      description: newCategory.description,
      link,
      isActive: true
    }

    const updatedCategories = [...exploreCategories, categoryToAdd]
    setExploreCategories(updatedCategories)
    localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(updatedCategories))
    setNewCategory({ name: "", image: "/placeholder-category.svg", description: "", link: "" })
    setIsAddingCategory(false)
    
    toast({
      title: "Categoria adicionada",
      description: "A nova categoria foi adicionada com sucesso e sua página foi gerada automaticamente."
    })
    
    // Disparar evento para atualizar outras abas
    window.dispatchEvent(new Event('exploreCategoriesUpdated'))
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da categoria"
      })
      return
    }

    const updatedCategories = exploreCategories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    )
    
    setExploreCategories(updatedCategories)
    localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(updatedCategories))
    setEditingCategory(null)
    setShowLinkSelector(false)
    setLinkSelectorCategory(null)
    
    toast({
      title: "Categoria atualizada",
      description: "A categoria foi atualizada com sucesso."
    })
    
    // Disparar evento para atualizar outras abas
    window.dispatchEvent(new Event('exploreCategoriesUpdated'))
  }

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      const updatedCategories = exploreCategories.filter(cat => cat.id !== id)
      setExploreCategories(updatedCategories)
      localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(updatedCategories))
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso."
      })
      
      // Disparar evento para atualizar outras abas
      window.dispatchEvent(new Event('exploreCategoriesUpdated'))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (isEditing && editingCategory) {
          setEditingCategory({ ...editingCategory, image: e.target?.result as string })
        } else {
          setNewCategory({ ...newCategory, image: e.target?.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectLink = (link: string) => {
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, link })
      setShowLinkSelector(false)
      setLinkSelectorCategory(null)
    }
  }

  return (
    <section className="py-8 md:py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Título Principal */}
        <div className="text-center mb-6 md:mb-8 relative">
          {isEditMode ? (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Input
                  value={editingTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-black text-center bg-white border-gray-300"
                />
                <Edit3 className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <Button onClick={handleSaveTitle} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" size="sm" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-8 md:mb-12">
              {editableTitle}
            </h2>
          )}
        </div>

        {/* Admin Controls in Edit Mode */}
        {isEditMode && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="text-lg font-semibold">Gerenciar Categorias</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingCategory ? "Cancelar" : "Adicionar Categoria"}
                </Button>
              </div>
            </div>

            {isAddingCategory && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Nova Categoria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Nome *</label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Ex: Oversized"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Link (opcional)</label>
                    <Input
                      value={newCategory.link}
                      onChange={(e) => setNewCategory({...newCategory, link: e.target.value})}
                      placeholder="Ex: /explore/oversized"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Descrição</label>
                    <Input
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Descrição da categoria"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Imagem</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="bg-white"
                    />
                    {newCategory.image && (
                      <div className="mt-2">
                        <img 
                          src={newCategory.image} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    onClick={() => setIsAddingCategory(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            )}

            {editingCategory && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Editar Categoria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Nome *</label>
                    <Input
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Link</label>
                    <div className="relative">
                      <Input
                        value={editingCategory.link}
                        onChange={(e) => setEditingCategory({...editingCategory, link: e.target.value})}
                        className="bg-white pr-10"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => {
                          setShowLinkSelector(true)
                          setLinkSelectorCategory(editingCategory.id)
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    {showLinkSelector && linkSelectorCategory === editingCategory.id && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <div className="text-xs text-gray-500 mb-2">Selecione um link:</div>
                          {availableLinks.map((link) => (
                            <div
                              key={link.value}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              onClick={() => handleSelectLink(link.value)}
                            >
                              <div className="font-medium">{link.label}</div>
                              <div className="text-xs text-gray-500">{link.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Descrição</label>
                    <Input
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Imagem</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="bg-white"
                    />
                    {editingCategory.image && (
                      <div className="mt-2">
                        <img 
                          src={editingCategory.image} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button 
                    onClick={() => {
                      setEditingCategory(null)
                      setShowLinkSelector(false)
                      setLinkSelectorCategory(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateCategory}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categorias - Layout 3x2 no mobile, horizontal no desktop */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {exploreCategories.filter(cat => cat.isActive).map((category) => (
            <div key={category.id} className="relative group">
              {isEditMode && (
                <div className="absolute top-0 right-0 flex gap-1 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                    onClick={() => setEditingCategory({...category})}
                  >
                    <Edit3 className="h-3 w-3 text-gray-700" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <Link href={category.link} className="group cursor-pointer touch-manipulation">
                <div className="text-center">
                  {/* Imagem Circular - Otimizada para mobile 3x2 */}
                  <div className="relative mb-2 sm:mb-3 mx-auto w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Nome da Categoria - Otimizado para mobile */}
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 leading-tight">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}