"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, PlusCircle, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ShowcaseBanner {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  mediaType?: 'image' | 'video' | 'gif'
  link?: string
  buttonText: string
  overlayColor: string
}

interface DestaquesConfig {
  title: string
  description: string
}

export default function DestaquesTemporadaPage() {
  const [config, setConfig] = useState<DestaquesConfig>({
    title: "DESTAQUES DA TEMPORADA",
    description: "Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
  })
  const [banners, setBanners] = useState<ShowcaseBanner[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [newBanner, setNewBanner] = useState<ShowcaseBanner>({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    image: "/placeholder-default.svg",
    mediaType: "image",
    link: "",
    buttonText: "",
    overlayColor: "from-red-600/80 to-black/60"
  })
  const [bannerToEdit, setBannerToEdit] = useState<ShowcaseBanner | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string>("")

  // Carregar configuração do localStorage
  useEffect(() => {
    const loadConfig = () => {
      const savedConfig = localStorage.getItem("gang-boyz-destaques-config")
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }

    const loadBanners = () => {
      const savedBanners = localStorage.getItem("gang-boyz-showcase-banners")
      if (savedBanners) {
        setBanners(JSON.parse(savedBanners))
      } else {
        // Banners padrão de demonstração
        const defaultBanners: ShowcaseBanner[] = [
          {
            id: "showcase-1",
            title: "NOVA COLEÇÃO",
            subtitle: "Streetwear Premium",
            description: "Descubra os lançamentos mais ousados da temporada com qualidade premium e design exclusivo",
            image: "/banner-hero.svg",
            mediaType: "image",
            link: "/produtos",
            buttonText: "EXPLORAR COLEÇÃO",
            overlayColor: "from-red-600/80 to-black/60"
          },
          {
            id: "showcase-2",
            title: "OFERTAS ESPECIAIS",
            subtitle: "Até 50% OFF",
            description: "Aproveite nossas ofertas limitadas em peças selecionadas. Não perca essa oportunidade!",
            image: "/banner-ofertas-especiais.svg",
            mediaType: "image",
            link: "/ofertas",
            buttonText: "VER OFERTAS",
            overlayColor: "from-yellow-500/80 to-red-600/60"
          },
          {
            id: "showcase-3",
            title: "MOLETONS",
            subtitle: "Conforto Urbano",
            description: "Qualidade premium para o dia a dia. Conforto e estilo em uma única peça",
            image: "/banner-hero.svg",
            mediaType: "image",
            link: "/moletons",
            buttonText: "CONFIRA",
            overlayColor: "from-gray-800/80 to-black/60"
          }
        ]
        setBanners(defaultBanners)
        localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(defaultBanners))
      }
    }

    loadConfig()
    loadBanners()
  }, [])

  // Salvar configuração no localStorage
  const saveConfig = async () => {
    setIsSaving(true)
    
    try {
      localStorage.setItem("gang-boyz-destaques-config", JSON.stringify(config))
      
      // Disparar evento para atualizar componentes
      window.dispatchEvent(new CustomEvent('destaquesConfigUpdated'))
      
      toast.success("Configuração salva com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configuração:", error)
      toast.error("Erro ao salvar configuração")
    } finally {
      setIsSaving(false)
    }
  }

  // Salvar banners no localStorage
  const saveBanners = (updatedBanners: ShowcaseBanner[]) => {
    localStorage.setItem("gang-boyz-showcase-banners", JSON.stringify(updatedBanners))
    setBanners(updatedBanners)
    window.dispatchEvent(new CustomEvent('showcaseBannersUpdated'))
    toast.success("Banners atualizados com sucesso!")
  }

  // Manipular seleção de imagem
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setEditSelectedImage(file)
      setEditImagePreview(URL.createObjectURL(file))
    }
  }

  // Adicionar novo banner
  const addBanner = () => {
    if (!newBanner.title || !newBanner.subtitle || !newBanner.description || !newBanner.buttonText || !selectedImage) {
      toast.error("Por favor, preencha todos os campos e selecione uma imagem.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Image = reader.result as string
      const bannerToAdd: ShowcaseBanner = {
        ...newBanner,
        id: `showcase-${Date.now()}`,
        image: base64Image
      }
      const updatedBanners = [...banners, bannerToAdd]
      saveBanners(updatedBanners)
      setIsModalOpen(false)
      setNewBanner({
        id: "",
        title: "",
        subtitle: "",
        description: "",
        image: "/placeholder-default.svg",
        mediaType: "image",
        link: "",
        buttonText: "",
        overlayColor: "from-red-600/80 to-black/60"
      })
      setSelectedImage(null)
      setImagePreview("")
    }
    reader.readAsDataURL(selectedImage)
  }

  // Iniciar edição de banner
  const startEdit = (banner: ShowcaseBanner) => {
    setBannerToEdit({ ...banner })
    setEditImagePreview(banner.image)
    setEditSelectedImage(null)
    setEditModalOpen(true)
  }

  // Atualizar banner
  const updateBanner = () => {
    if (!bannerToEdit || !bannerToEdit.title || !bannerToEdit.subtitle || !bannerToEdit.description || !bannerToEdit.buttonText) {
      toast.error("Por favor, preencha todos os campos.")
      return
    }

    if (editSelectedImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result as string
        const updatedBanners = banners.map(banner =>
          banner.id === bannerToEdit.id ? { ...bannerToEdit, image: base64Image } : banner
        )
        saveBanners(updatedBanners)
        setEditModalOpen(false)
        setBannerToEdit(null)
        setEditSelectedImage(null)
        setEditImagePreview("")
      }
      reader.readAsDataURL(editSelectedImage)
    } else {
      const updatedBanners = banners.map(banner =>
        banner.id === bannerToEdit.id ? { ...bannerToEdit } : banner
      )
      saveBanners(updatedBanners)
      setEditModalOpen(false)
      setBannerToEdit(null)
      setEditImagePreview("")
    }
  }

  // Deletar banner
  const deleteBanner = (id: string) => {
    const updatedBanners = banners.filter(banner => banner.id !== id)
    saveBanners(updatedBanners)
    toast.success("Banner removido com sucesso!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute inset-0 bg-gradient-to-brom from-transparent via-black/20 to-black/40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-8">
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
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">Destaques da Temporada</h1>
            <p className="text-gray-300">Edite o título e descrição da seção "DESTAQUES DA TEMPORADA"</p>
          </div>
        </div>

        {/* Card Principal - Configuração da Seção */}
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Configuração da Seção</h2>
              <Button onClick={() => setIsModalOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Banner
              </Button>
            </div>

            <div>
              <Label htmlFor="title">Título da Seção *</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig({...config, title: e.target.value})}
                placeholder="Ex: DESTAQUES DA TEMPORADA"
                className="mt-1 text-lg font-bold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Título principal que aparece na seção da homepage
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descrição da Seção *</Label>
              <Input
                id="description"
                value={config.description}
                onChange={(e) => setConfig({...config, description: e.target.value})}
                placeholder="Ex: Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Texto descritivo que aparece abaixo do título
              </p>
            </div>

            {/* Preview */}
            <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Preview:</h3>
              <div className="text-center">
                <h2 className="text-3xl font-black text-white mb-4">
                  {config.title}
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  {config.description}
                </p>
              </div>
            </div>

            {/* Botão de Salvar */}
            <div className="flex justify-end">
              <Button
                onClick={saveConfig}
                disabled={isSaving || !config.title || !config.description}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Card de Gerenciamento de Banners */}
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Gerenciar Banners</h2>
            </div>

            <p className="text-gray-300">
              Aqui você pode adicionar, editar e remover os banners que aparecem na seção "DESTAQUES DA TEMPORADA".
            </p>

            {banners.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Nenhum banner encontrado. Adicione um novo banner para começar!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <Card key={banner.id} className="bg-gray-800 border-gray-600 overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {banner.mediaType?.toUpperCase() || 'IMAGE'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{banner.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{banner.subtitle}</p>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{banner.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 text-sm">{banner.buttonText}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => startEdit(banner)} className="text-xs px-2 py-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteBanner(banner.id)} className="px-2 py-1">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* Informações Adicionais */}
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">ℹ️ Informações</h3>
          <div className="space-y-2 text-gray-300">
            <p>• As alterações são salvas automaticamente no localStorage</p>
            <p>• A seção é atualizada em tempo real na homepage</p>
            <p>• Os banners da seção são gerenciados separadamente</p>
            <p>• Esta configuração afeta apenas o título e descrição da seção</p>
          </div>
        </Card>
      </div>

      {/* Modal de Adicionar Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Adicionar Novo Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner-title">Título *</Label>
                  <Input
                    id="banner-title"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                    placeholder="Ex: NOVA COLEÇÃO"
                  />
                </div>
                <div>
                  <Label htmlFor="banner-subtitle">Subtítulo *</Label>
                  <Input
                    id="banner-subtitle"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                    placeholder="Ex: Streetwear Premium"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="banner-description">Descrição *</Label>
                <Input
                  id="banner-description"
                  value={newBanner.description}
                  onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                  placeholder="Descrição do banner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="banner-link">Link (opcional)</Label>
                  <Input
                    id="banner-link"
                    value={newBanner.link}
                    onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                    placeholder="Ex: /produtos"
                  />
                </div>
                <div>
                  <Label htmlFor="banner-button">Texto do Botão *</Label>
                  <Input
                    id="banner-button"
                    value={newBanner.buttonText}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                    placeholder="Ex: EXPLORAR COLEÇÃO"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="banner-overlay">Cor do Gradiente</Label>
                <select
                  id="banner-overlay"
                  value={newBanner.overlayColor}
                  onChange={(e) => setNewBanner({ ...newBanner, overlayColor: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                >
                  <option value="from-red-600/80 to-black/60">Vermelho</option>
                  <option value="from-yellow-500/80 to-red-600/60">Amarelo/Vermelho</option>
                  <option value="from-gray-800/80 to-black/60">Cinza</option>
                  <option value="from-blue-600/80 to-black/60">Azul</option>
                  <option value="from-green-600/80 to-black/60">Verde</option>
                  <option value="from-purple-600/80 to-black/60">Roxo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="banner-image">Imagem do Banner *</Label>
                <Input
                  id="banner-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Formato ideal:</strong> JPG ou PNG, proporção 16:9 (horizontal), resolução mínima 1200x675px, tamanho máximo 5MB.
                </p>
                {imagePreview && (
                  <div className="mt-2 w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="text-white border-gray-600 hover:bg-gray-700">
                  Cancelar
                </Button>
                <Button onClick={addBanner} className="bg-blue-600 hover:bg-blue-700">
                  Adicionar Banner
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Editar Banner */}
      {editModalOpen && bannerToEdit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-banner-title">Título *</Label>
                  <Input
                    id="edit-banner-title"
                    value={bannerToEdit.title}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, title: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-banner-subtitle">Subtítulo *</Label>
                  <Input
                    id="edit-banner-subtitle"
                    value={bannerToEdit.subtitle}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, subtitle: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-banner-description">Descrição *</Label>
                <Input
                  id="edit-banner-description"
                  value={bannerToEdit.description}
                  onChange={(e) => setBannerToEdit({ ...bannerToEdit, description: e.target.value })}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-banner-link">Link (opcional)</Label>
                  <Input
                    id="edit-banner-link"
                    value={bannerToEdit.link}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, link: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-banner-button">Texto do Botão *</Label>
                  <Input
                    id="edit-banner-button"
                    value={bannerToEdit.buttonText}
                    onChange={(e) => setBannerToEdit({ ...bannerToEdit, buttonText: e.target.value })}
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-banner-overlay">Cor do Gradiente</Label>
                <select
                  id="edit-banner-overlay"
                  value={bannerToEdit.overlayColor}
                  onChange={(e) => setBannerToEdit({ ...bannerToEdit, overlayColor: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                >
                  <option value="from-red-600/80 to-black/60">Vermelho</option>
                  <option value="from-yellow-500/80 to-red-600/60">Amarelo/Vermelho</option>
                  <option value="from-gray-800/80 to-black/60">Cinza</option>
                  <option value="from-blue-600/80 to-black/60">Azul</option>
                  <option value="from-green-600/80 to-black/60">Verde</option>
                  <option value="from-purple-600/80 to-black/60">Roxo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="edit-banner-image">Nova Imagem (opcional)</Label>
                <Input
                  id="edit-banner-image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageSelect}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Formato ideal:</strong> JPG ou PNG, proporção 16:9 (horizontal), resolução mínima 1200x675px, tamanho máximo 5MB.
                </p>
                {editImagePreview && (
                  <div className="mt-2 w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                    <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditModalOpen(false)} className="text-white border-gray-600 hover:bg-gray-700">
                  Cancelar
                </Button>
                <Button onClick={updateBanner} className="bg-blue-600 hover:bg-blue-700">
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
