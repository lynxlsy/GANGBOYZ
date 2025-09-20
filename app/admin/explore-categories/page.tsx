"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Edit, Save, X, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CategoryItem {
  id: string
  name: string
  image: string
  description: string
  link: string
}

export default function ExploreCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<CategoryItem>>({
    name: "",
    image: "/placeholder-default.svg",
    description: "",
    link: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Carregar categorias do localStorage
  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("gang-boyz-explore-categories")
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      } else {
        // Categorias padrão
        const defaultCategories: CategoryItem[] = [
          {
            id: "oversized",
            name: "Oversized",
            image: "/placeholder-default.svg",
            description: "Looks confortáveis e despojados",
            link: "/camisetas"
          },
          {
            id: "estampas",
            name: "Estampas",
            image: "/placeholder-default.svg", 
            description: "Designs únicos e exclusivos",
            link: "/camisetas"
          },
          {
            id: "lisos",
            name: "Lisos",
            image: "/placeholder-default.svg",
            description: "Cores sólidas e minimalistas",
            link: "/camisetas"
          },
          {
            id: "shorts",
            name: "Shorts",
            image: "/placeholder-default.svg",
            description: "Conforto para o dia a dia",
            link: "/roupas"
          },
          {
            id: "verao",
            name: "Verão",
            image: "/placeholder-default.svg",
            description: "Pieces para dias quentes",
            link: "/camisetas"
          },
          {
            id: "inverno",
            name: "Inverno", 
            image: "/placeholder-default.svg",
            description: "Aquecimento com estilo",
            link: "/roupas"
          }
        ]
        setCategories(defaultCategories)
        localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(defaultCategories))
      }
    }
    loadCategories()
  }, [])

  // Salvar categorias no localStorage
  const saveCategories = (updatedCategories: CategoryItem[]) => {
    localStorage.setItem("gang-boyz-explore-categories", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)
    // Disparar evento para atualizar componentes
    window.dispatchEvent(new CustomEvent('exploreCategoriesUpdated'))
  }

  // Selecionar imagem
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setNewCategory({...newCategory, image: e.target?.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  // Adicionar categoria
  const addCategory = () => {
    if (!newCategory.name || !newCategory.image) {
      toast.error("Nome e imagem são obrigatórios!")
      return
    }

    const category: CategoryItem = {
      id: `cat_${Date.now()}`,
      name: newCategory.name,
      image: newCategory.image,
      description: newCategory.description || "",
      link: newCategory.link || "/"
    }

    saveCategories([...categories, category])
    
    // Limpar campos
    setNewCategory({
      name: "",
      image: "/placeholder-default.svg",
      description: "",
      link: ""
    })
    setSelectedFile(null)
    setImagePreview("")
    
    toast.success("Categoria adicionada com sucesso!")
  }

  // Editar categoria
  const startEdit = (category: CategoryItem) => {
    setEditingCategory(category.id)
    setNewCategory(category)
    setImagePreview(category.image)
  }

  // Salvar edição
  const saveEdit = () => {
    if (!newCategory.name || !newCategory.image) {
      toast.error("Nome e imagem são obrigatórios!")
      return
    }

    const updatedCategories = categories.map(category =>
      category.id === editingCategory
        ? {
            ...category,
            name: newCategory.name,
            image: newCategory.image,
            description: newCategory.description || "",
            link: newCategory.link || "/"
          }
        : category
    )

    saveCategories(updatedCategories)
    setEditingCategory(null)
    
    // Limpar campos
    setNewCategory({
      name: "",
      image: "/placeholder-default.svg",
      description: "",
      link: ""
    })
    setSelectedFile(null)
    setImagePreview("")
    
    toast.success("Categoria atualizada com sucesso!")
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingCategory(null)
    setNewCategory({
      name: "",
      image: "/placeholder-default.svg",
      description: "",
      link: ""
    })
    setSelectedFile(null)
    setImagePreview("")
  }

  // Deletar categoria
  const deleteCategory = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      const updatedCategories = categories.filter(category => category.id !== id)
      saveCategories(updatedCategories)
      toast.success("Categoria deletada com sucesso!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 hover:border-red-400/50 hover:bg-white/20 transition-all duration-500">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-1.5 shadow-lg shadow-red-500/25">
                  <ArrowLeft className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">Voltar ao Admin</span>
              </div>
            </div>
          </Link>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">Explore Categories</h1>
            <p className="text-gray-300">Gerencie as categorias da seção "EXPLORE NA GANG BOYZ"</p>
          </div>
        </div>

        {/* Formulário de Nova Categoria */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="name">Nome da Categoria *</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="Ex: Oversized"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={newCategory.link}
                onChange={(e) => setNewCategory({...newCategory, link: e.target.value})}
                placeholder="Ex: /camisetas"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                placeholder="Ex: Looks confortáveis e despojados"
                className="mt-1"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="image">Imagem da Categoria *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              <strong>Formato ideal:</strong> JPG ou PNG, formato circular, resolução mínima 200x200px, tamanho máximo 5MB.
            </p>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {editingCategory ? (
              <>
                <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={addCategory} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Categoria
              </Button>
            )}
          </div>
        </Card>

        {/* Lista de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="relative">
                {/* Preview da Categoria */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Informações da Categoria */}
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                  <p className="text-gray-500 text-xs">Link: {category.link}</p>
                  <p className="text-gray-500 text-xs">ID: {category.id}</p>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(category)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhuma categoria cadastrada</p>
            <p className="text-gray-500 text-sm">Adicione categorias para exibir na seção "EXPLORE NA GANG BOYZ"</p>
          </div>
        )}
      </div>
    </div>
  )
}
