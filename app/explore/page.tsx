"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit3, Trash2, Plus, Save, X, Link, ChevronDown } from "lucide-react"
import { useEditMode } from "@/lib/edit-mode-context"
import { toast } from "sonner"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"

interface ExploreCategory {
  id: string
  name: string
  image: string
  link: string
  description: string
  isActive: boolean
}

export default function ExplorePage() {
  const { isEditMode } = useEditMode()
  const [categories, setCategories] = useState<ExploreCategory[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "", 
    image: "/placeholder-category.svg", 
    link: "", 
    description: "" 
  })
  const [isAdding, setIsAdding] = useState(false)
  const [editedCategory, setEditedCategory] = useState<ExploreCategory | null>(null)
  const [availableLinks, setAvailableLinks] = useState<{label: string, value: string}[]>([])
  const [showLinkSelector, setShowLinkSelector] = useState(false)
  const [linkSelectorCategory, setLinkSelectorCategory] = useState<string | null>(null)

  // Load categories from localStorage
  useEffect(() => {
    const loadCategories = () => {
      try {
        const savedCategories = localStorage.getItem("gang-boyz-explore-categories")
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories))
        } else {
          // Initialize with default categories
          const defaultCategories: ExploreCategory[] = [
            {
              id: "cat-oversized",
              name: "OVERSIZED",
              image: "/placeholder-category.svg",
              link: "/explore/oversized",
              description: "Camisetas oversized de alta qualidade",
              isActive: true
            },
            {
              id: "cat-estampas",
              name: "ESTAMPAS",
              image: "/placeholder-category.svg",
              link: "/explore/estampas",
              description: "Camisetas com estampas exclusivas",
              isActive: true
            },
            {
              id: "cat-liso",
              name: "LISO",
              image: "/placeholder-category.svg",
              link: "/explore/liso",
              description: "Camisetas lisas básicas",
              isActive: true
            }
          ]
          setCategories(defaultCategories)
          localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(defaultCategories))
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      }
    }

    loadCategories()
  }, [])

  // Load available links from existing categories and standard subcategories
  useEffect(() => {
    const loadAvailableLinks = () => {
      // Get existing category links
      const categoryLinks = categories.map(cat => ({
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
  }, [categories])

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(categories))
    }
  }, [categories])

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Por favor, preencha o nome da categoria")
      return
    }

    // Generate link based on category name if not provided
    const link = newCategory.link || `/explore/${newCategory.name.toLowerCase().replace(/\s+/g, '-')}`

    const categoryToAdd: ExploreCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      image: newCategory.image,
      link,
      description: newCategory.description,
      isActive: true
    }

    setCategories(prev => [...prev, categoryToAdd])
    setNewCategory({ name: "", image: "/placeholder-category.svg", link: "", description: "" })
    setIsAdding(false)
    toast.success("Categoria adicionada com sucesso!")
  }

  const handleUpdateCategory = () => {
    if (!editedCategory) return

    if (!editedCategory.name) {
      toast.error("Por favor, preencha o nome da categoria")
      return
    }

    setCategories(prev => 
      prev.map(cat => cat.id === editedCategory.id ? editedCategory : cat)
    )
    setEditingId(null)
    setEditedCategory(null)
    setShowLinkSelector(false)
    setLinkSelectorCategory(null)
    toast.success("Categoria atualizada com sucesso!")
  }

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
      toast.success("Categoria excluída com sucesso!")
    }
  }

  const handleEditClick = (category: ExploreCategory) => {
    setEditingId(category.id)
    setEditedCategory({ ...category })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedCategory(null)
    setShowLinkSelector(false)
    setLinkSelectorCategory(null)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (isEditing && editedCategory) {
          setEditedCategory({ ...editedCategory, image: e.target?.result as string })
        } else {
          setNewCategory({ ...newCategory, image: e.target?.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateNewSubcategory = () => {
    // Create a new subcategory with auto-generated link
    const subcategoryName = `Nova Categoria ${categories.length + 1}`
    const newSubcategory: ExploreCategory = {
      id: `cat-${Date.now()}`,
      name: subcategoryName,
      image: "/placeholder-category.svg",
      link: `/explore/nova-categoria-${categories.length + 1}`,
      description: "Nova categoria criada",
      isActive: true
    }
    
    setCategories(prev => [...prev, newSubcategory])
    toast.success("Nova subcategoria criada com sucesso!")
  }

  const handleSelectLink = (link: string) => {
    if (editedCategory) {
      setEditedCategory({ ...editedCategory, link })
      setShowLinkSelector(false)
      setLinkSelectorCategory(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explorar Categorias</h1>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>

        {isEditMode && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Gerenciar Categorias</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateNewSubcategory}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Subcategoria
                </Button>
                <Button 
                  onClick={() => setIsAdding(!isAdding)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAdding ? "Cancelar" : "Adicionar Categoria"}
                </Button>
              </div>
            </div>

            {isAdding && (
              <div className="p-4 bg-gray-700 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Nova Categoria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Nome *</Label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Ex: OVERSIZED"
                      className="bg-gray-600 border-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Link (opcional)</Label>
                    <Input
                      value={newCategory.link}
                      onChange={(e) => setNewCategory({...newCategory, link: e.target.value})}
                      placeholder="Ex: /explore/oversized"
                      className="bg-gray-600 border-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Descrição</Label>
                    <Input
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Descrição da categoria"
                      className="bg-gray-600 border-gray-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Imagem</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="bg-gray-600 border-gray-500"
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
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    onClick={() => setIsAdding(false)}
                    variant="outline"
                    className="border-gray-500 text-white hover:bg-gray-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.filter(cat => cat.isActive).map((category) => (
            <div key={category.id} className="relative group">
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    onClick={() => handleEditClick(category)}
                  >
                    <Edit3 className="h-4 w-4 text-gray-700" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {editingId === category.id && editedCategory ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Nome *</Label>
                        <Input
                          value={editedCategory.name}
                          onChange={(e) => setEditedCategory({...editedCategory, name: e.target.value})}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Link</Label>
                        <div className="relative">
                          <Input
                            value={editedCategory.link}
                            onChange={(e) => setEditedCategory({...editedCategory, link: e.target.value})}
                            className="bg-gray-700 border-gray-600 pr-10"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => {
                              setShowLinkSelector(true)
                              setLinkSelectorCategory(category.id)
                            }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        {showLinkSelector && linkSelectorCategory === category.id && (
                          <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2">
                              <div className="text-xs text-gray-400 mb-2">Selecione um link:</div>
                              {availableLinks.map((link) => (
                                <div
                                  key={link.value}
                                  className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                                  onClick={() => handleSelectLink(link.value)}
                                >
                                  <div className="font-medium">{link.label}</div>
                                  <div className="text-xs text-gray-400">{link.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Descrição</Label>
                        <Input
                          value={editedCategory.description}
                          onChange={(e) => setEditedCategory({...editedCategory, description: e.target.value})}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Imagem</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="bg-gray-700 border-gray-600"
                        />
                        {editedCategory.image && (
                          <div className="mt-2">
                            <img 
                              src={editedCategory.image} 
                              alt="Preview" 
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="border-gray-500 text-white hover:bg-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleUpdateCategory}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{category.description}</p>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => window.location.href = category.link}
                    >
                      Explorar
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}