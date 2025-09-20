"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Eye, Save, RefreshCw, Trash2, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { InlineCropViewport } from "@/components/inline-crop-viewport"

interface CropMetadata {
  src: string
  ratio: string  // "1920x650"
  scale: number
  tx: number     // translateX relativo (-1..1)
  ty: number     // translateY relativo (-1..1)
}

interface Banner {
  id: string
  name: string
  description: string
  currentImage: string
  mediaType: 'image' | 'video' | 'gif'
  dimensions: string
  format: string
  position: string
  cropMetadata?: CropMetadata
}

export default function HomepageBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bannerText, setBannerText] = useState("SITE DEMONSTRATIVO")
  const [isBannerActive, setIsBannerActive] = useState(true)
  const [bannerEmoji, setBannerEmoji] = useState("")
  const [bannerBgColor, setBannerBgColor] = useState("black")
  const [bannerHeight, setBannerHeight] = useState(38) // altura em pixels
  const [bannerSpeed, setBannerSpeed] = useState(50) // velocidade do scroll (1-100)
  const [bannerRepetitions, setBannerRepetitions] = useState(4) // quantidade de repetições do texto

  // Carregar banners do localStorage
  useEffect(() => {
    loadBanners()
    loadBannerSettings()
  }, [])

  const loadBannerSettings = () => {
    const savedText = localStorage.getItem("gang-boyz-banner-text")
    const savedActive = localStorage.getItem("gang-boyz-banner-active")
    const savedEmoji = localStorage.getItem("gang-boyz-banner-emoji")
    const savedBgColor = localStorage.getItem("gang-boyz-banner-bg-color")
    const savedHeight = localStorage.getItem("gang-boyz-banner-height")
    const savedSpeed = localStorage.getItem("gang-boyz-banner-speed")
    const savedRepetitions = localStorage.getItem("gang-boyz-banner-repetitions")
    
    if (savedText) setBannerText(savedText)
    if (savedActive !== null) setIsBannerActive(savedActive === 'true')
    if (savedEmoji) setBannerEmoji(savedEmoji)
    if (savedBgColor) setBannerBgColor(savedBgColor)
    if (savedHeight) setBannerHeight(parseInt(savedHeight))
    if (savedSpeed) setBannerSpeed(parseInt(savedSpeed))
    if (savedRepetitions) setBannerRepetitions(parseInt(savedRepetitions))
  }

  const loadBanners = () => {
    const savedBanners = localStorage.getItem("gang-boyz-homepage-banners")
    if (savedBanners) {
      const banners: Banner[] = JSON.parse(savedBanners)
      
      // Verificar se precisa migrar do sistema antigo (hero-banner único para hero-banner-1 e hero-banner-2)
      const hasOldHeroBanner = banners.some(banner => banner.id === "hero-banner")
      const hasNewHeroBanners = banners.some(banner => banner.id.startsWith("hero-banner"))
      
      if (hasOldHeroBanner && !hasNewHeroBanners) {
        // Migrar banner antigo para o novo sistema
        const oldHeroBanner = banners.find(banner => banner.id === "hero-banner")
        if (oldHeroBanner) {
          // Criar dois banners hero baseados no antigo
          const heroBanner1: Banner = {
            ...oldHeroBanner,
            id: "hero-banner-1",
            name: "Banner Principal 1 (Hero)",
            description: "Primeiro banner do carrossel principal da página inicial"
          }
          
          const heroBanner2: Banner = {
            ...oldHeroBanner,
            id: "hero-banner-2",
            name: "Banner Principal 2 (Hero)",
            description: "Segundo banner do carrossel principal da página inicial",
            currentImage: "/banner-hero-2.svg" // Imagem diferente para o segundo
          }
          
          // Remover banner antigo e adicionar os dois banners
          const otherBanners = banners.filter(banner => banner.id !== "hero-banner")
          const migratedBanners = [heroBanner1, heroBanner2, ...otherBanners]
          
          setBanners(migratedBanners)
          localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(migratedBanners))
          return
        }
      }
      
      // Verificar se tem apenas um banner hero e criar o segundo se necessário
      // Apenas carregar banners existentes, sem criar banner 2 automaticamente
      
      setBanners(banners)
    } else {
      // Banners padrão
      const defaultBanners: Banner[] = [
        {
          id: "hero-banner-1",
          name: "Banner Principal 1 (Hero)",
          description: "Primeiro banner do carrossel principal da página inicial",
          currentImage: "/banner-hero.svg",
          mediaType: "image",
          dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Background da seção hero (abaixo da faixa de aviso)"
        },
        {
          id: "hero-banner-2",
          name: "Banner Principal 2 (Hero)",
          description: "Segundo banner do carrossel principal da página inicial",
          currentImage: "/banner-hero.svg",
          mediaType: "image",
          dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Background da seção hero (abaixo da faixa de aviso)"
        },
        {
          id: "hot-banner",
          name: "Banner HOT",
          description: "Banner da seção HOT, exibido acima dos produtos mais vendidos",
          currentImage: "/banner-hero.svg",
          mediaType: "image",
          dimensions: "1200x400px (3:1) - Otimizado para seção HOT",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Seção HOT (abaixo do header)"
        },
        {
          id: "footer-banner",
          name: "Banner Footer",
          description: "Banner que aparece antes do footer em todas as páginas",
          currentImage: "/banner-footer.svg",
          mediaType: "image",
          dimensions: "1200x400px (3:1) - Banner específico para footer",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Antes do Footer (em todas as páginas)"
        },
        {
          id: "chefe-banner",
          name: "Banner Chefe",
          description: "Banner do chefe/CEO da empresa",
          currentImage: "/banner-chefe.svg",
          mediaType: "image",
          dimensions: "1200x400px (3:1) - Banner específico para chefe",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Seção do Chefe"
        }
      ]
      setBanners(defaultBanners)
      localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(defaultBanners))
    }
  }

  const handleMediaChange = async (bannerId: string, file: File) => {
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formato de arquivo não suportado. Use JPG, PNG, WebP, GIF, MP4, WebM ou OGG.")
      return
    }

    // Validar tamanho (máximo 10MB para vídeos, 5MB para imagens)
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '10MB' : '5MB'
      toast.error(`Arquivo muito grande. Máximo ${maxSizeMB}.`)
      return
    }

    try {
      console.log("📁 Iniciando upload do arquivo:", file.name, file.size, "bytes")
      
      // Fazer upload via API
      const formData = new FormData()
      formData.append('file', file)
      
      console.log("📤 Enviando para API /api/uploads...")
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      console.log("📡 Resposta da API:", response.status, response.statusText)

      if (!response.ok) {
        const error = await response.json()
        console.error("❌ Erro na API:", error)
        throw new Error(error.error || 'Erro no upload')
      }

      const uploadResult = await response.json()
      console.log("✅ Resultado do upload:", uploadResult)
      
      // Determinar tipo de mídia
      let mediaType: 'image' | 'video' | 'gif' = 'image'
      if (uploadResult.mime.startsWith('video/')) {
        mediaType = 'video'
      } else if (uploadResult.mime === 'image/gif') {
        mediaType = 'gif'
      }

      // Atualizar banner com nova mídia (apenas URL, não base64)
      console.log("🔄 Atualizando banner:", bannerId)
      const updatedBanners = banners.map(banner => 
        banner.id === bannerId 
          ? { 
              ...banner, 
              currentImage: uploadResult.url, 
              mediaType, 
              cropMetadata: undefined // Resetar metadados de recorte
            }
          : banner
      )
      
      console.log("📝 Banners atualizados:", updatedBanners)
      setBanners(updatedBanners)
      
      // Salvar apenas metadados no localStorage (sem imagens grandes)
      console.log("💾 Salvando no localStorage...")
      const bannersMetadata = updatedBanners.map(banner => ({
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage, // URL apenas
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        cropMetadata: banner.cropMetadata
      }))
      
      console.log("📦 Metadados para salvar:", bannersMetadata)
      localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
      console.log("✅ Salvo no localStorage com sucesso!")
      
      // Sincronizar banner do footer se existir
      const footerBanner = updatedBanners.find(banner => banner.id === "footer-banner")
      if (footerBanner) {
        const footerMetadata = {
          id: footerBanner.id,
          name: footerBanner.name,
          description: footerBanner.description,
          currentImage: footerBanner.currentImage,
          mediaType: footerBanner.mediaType,
          dimensions: footerBanner.dimensions,
          format: footerBanner.format,
          position: footerBanner.position,
          cropMetadata: footerBanner.cropMetadata
        }
        localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(footerMetadata))
      }
      
      // Disparar eventos customizados para atualizar outras abas
      console.log("📡 Disparando eventos de sincronização...")
      window.dispatchEvent(new CustomEvent('bannerUpdated'))
      window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
      console.log("✅ Eventos disparados!")
      
      const mediaTypeText = mediaType === 'video' ? 'Vídeo' : mediaType === 'gif' ? 'GIF' : 'Imagem'
      toast.success(`${mediaTypeText} carregado e salvo com sucesso!`)
      console.log("🎉 Upload concluído com sucesso!")
      
    } catch (error) {
      console.error('Erro no upload:', error)
      toast.error("Erro ao carregar arquivo")
    }
  }

  const saveBanners = () => {
    setSaving(true)
    try {
      // Salvar apenas metadados no localStorage (sem imagens grandes)
      const bannersMetadata = banners.map(banner => ({
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage, // URL apenas
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        cropMetadata: banner.cropMetadata
      }))
      
      localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
      
      // Sincronizar banner do footer se existir
      const footerBanner = banners.find(banner => banner.id === "footer-banner")
      if (footerBanner) {
        const footerMetadata = {
          id: footerBanner.id,
          name: footerBanner.name,
          description: footerBanner.description,
          currentImage: footerBanner.currentImage,
          mediaType: footerBanner.mediaType,
          dimensions: footerBanner.dimensions,
          format: footerBanner.format,
          position: footerBanner.position,
          cropMetadata: footerBanner.cropMetadata
        }
        localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(footerMetadata))
      }
      
      // Disparar eventos customizados para atualizar outras abas
      window.dispatchEvent(new CustomEvent('bannerUpdated'))
      window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
      
      toast.success("Banners salvos com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar banners.")
    } finally {
      setSaving(false)
    }
  }

  const deleteBanner = (bannerId: string) => {
    if (bannerId.startsWith("hero-banner")) {
      toast.error("Os banners principais não podem ser excluídos!")
      return
    }

    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    setBanners(updatedBanners)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannersMetadata = updatedBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage, // URL apenas
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
    
    // Se for o banner do footer, também remover do localStorage específico
    if (bannerId === "footer-banner") {
      localStorage.removeItem("gang-boyz-footer-banner")
    }
    
    // Disparar eventos para atualizar componentes
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
    window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
    
    toast.success("Banner excluído com sucesso!")
  }

  const resetBanners = () => {
    const defaultBanners: Banner[] = [
        {
          id: "hero-banner-1",
          name: "Banner Principal 1 (Hero)",
          description: "Primeiro banner do carrossel principal da página inicial",
          currentImage: "/banner-hero-1.svg",
          mediaType: "image",
          dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Background da seção hero (abaixo da faixa de aviso)"
        },
        {
          id: "hero-banner-2",
          name: "Banner Principal 2 (Hero)",
          description: "Segundo banner do carrossel principal da página inicial",
          currentImage: "/banner-hero-2.svg",
          mediaType: "image",
          dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Background da seção hero (abaixo da faixa de aviso)"
        },
      {
        id: "hot-banner",
        name: "Banner HOT",
        description: "Banner da seção HOT, exibido acima dos produtos mais vendidos",
        currentImage: "/placeholder-default.svg",
        mediaType: "image",
        dimensions: "1920x650px (≈2.95:1) - Otimizado para seção HOT",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Seção HOT (abaixo do header)"
      },
      {
        id: "footer-banner",
        name: "Banner Footer",
        description: "Banner que aparece antes do footer em todas as páginas",
        currentImage: "/placeholder.jpg",
        mediaType: "image",
        dimensions: "1920x650px (≈2.95:1) - Padrão para banners de seção",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Antes do Footer (em todas as páginas)"
      }
    ]
    setBanners(defaultBanners)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannersMetadata = defaultBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage, // URL apenas
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
    
    // Sincronizar banner do footer
    const footerBanner = defaultBanners.find(banner => banner.id === "footer-banner")
    if (footerBanner) {
      const footerMetadata = {
        id: footerBanner.id,
        name: footerBanner.name,
        description: footerBanner.description,
        currentImage: footerBanner.currentImage,
        mediaType: footerBanner.mediaType,
        dimensions: footerBanner.dimensions,
        format: footerBanner.format,
        position: footerBanner.position,
        cropMetadata: footerBanner.cropMetadata
      }
      localStorage.setItem("gang-boyz-footer-banner", JSON.stringify(footerMetadata))
    }
    
    toast.success("Banners resetados para o padrão!")
  }

  // Funções para recorte inline
  const handleCropSave = (bannerId: string, metadata: CropMetadata) => {
    const updatedBanners = banners.map(banner => 
      banner.id === bannerId 
        ? { ...banner, cropMetadata: metadata }
        : banner
    )
    
    setBanners(updatedBanners)
    
    // Salvar apenas metadados no localStorage (sem imagens grandes)
    const bannersMetadata = updatedBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage, // URL apenas
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(bannersMetadata))
    
    // Disparar eventos para atualizar componentes
    window.dispatchEvent(new CustomEvent('bannerUpdated'))
    window.dispatchEvent(new CustomEvent('footerBannerUpdated'))
    
    toast.success("Recorte salvo com sucesso!")
  }

  const handleCropCancel = (bannerId: string) => {
    // Não precisa fazer nada, o componente já gerencia o cancelamento
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <Link href="/admin/banners">
              <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 hover:border-red-400/50 hover:bg-white/20 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-1.5 shadow-lg shadow-red-500/25">
                    <ArrowLeft className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white font-medium">Voltar aos Banners</span>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Image 
                  src="/logo-gang-boyz-new.svg" 
                  alt="Gang BoyZ" 
                  width={80} 
                  height={32} 
                  className="h-8 w-auto filter brightness-110"
                />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">
                  Banners da Homepage
                </h1>
                <p className="text-gray-300 text-sm md:text-lg">Gerencie os banners da página inicial com suporte a vídeos e GIFs</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <button 
              onClick={resetBanners}
              disabled={saving}
              className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 hover:border-red-400/50 hover:bg-white/20 transition-all duration-500 text-white text-sm flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetar
            </button>
            <button 
              onClick={() => {
                const currentBanners = [...banners]
                const filteredBanners = currentBanners.filter(banner => !banner.id.startsWith("hero-banner"))
                
                const heroBanner1: Banner = {
                  id: "hero-banner-1",
                  name: "Banner Principal 1 (Hero)",
                  description: "Primeiro banner do carrossel principal da página inicial",
                  currentImage: "/banner-hero-1.svg",
                  mediaType: "image",
                  dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
                  format: "JPG, PNG, WebP, MP4, GIF",
                  position: "Background da seção hero (abaixo da faixa de aviso)"
                }
                
                const heroBanner2: Banner = {
                  id: "hero-banner-2",
                  name: "Banner Principal 2 (Hero)",
                  description: "Segundo banner do carrossel principal da página inicial",
                  currentImage: "/banner-hero-2.svg",
                  mediaType: "image",
                  dimensions: "1920x1080px (16:9) - Considerando faixa de aviso de 38px",
                  format: "JPG, PNG, WebP, MP4, GIF",
                  position: "Background da seção hero (abaixo da faixa de aviso)"
                }
                
                const newBanners = [heroBanner1, heroBanner2, ...filteredBanners]
                setBanners(newBanners)
                localStorage.setItem("gang-boyz-homepage-banners", JSON.stringify(newBanners))
                toast.success("Banners Hero criados com sucesso!")
              }}
              disabled={saving}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-sm flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Criar Banners Hero
            </button>
            <button 
              onClick={saveBanners}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-sm flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>

        {/* Faixa de Aviso */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-3 shadow-lg shadow-red-500/25">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h2 className="text-3xl font-black text-white">Faixa de Aviso Superior</h2>
          </div>
          
          {/* Controles Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Texto e Emoji */}
            <div className="space-y-6">
              <div>
                <Label className="font-black text-white mb-3 block text-lg">
                  📝 Texto do Aviso
                </Label>
                <Input
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="Digite o texto do aviso..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Texto que aparecerá na faixa superior do site
                </p>
              </div>
              
              <div>
                <Label className="font-black text-white mb-3 block text-lg">
                  😀 Emoji (opcional)
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={bannerEmoji}
                    onChange={(e) => setBannerEmoji(e.target.value)}
                    placeholder="🔥"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 w-24 h-12 text-xl text-center"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {["🔥", "⭐", "💥", "🚀", "✨", "🎯", "💎", "⚡", "🎉", "💯", "🔥", "🌟"].map((emoji, index) => (
                      <button
                        key={`emoji-${index}`}
                        onClick={() => setBannerEmoji(emoji)}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-red-400/50 flex items-center justify-center text-lg transition-all duration-300 hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Emoji que aparecerá antes e depois do texto
                </p>
              </div>
            </div>
            
            {/* Controles de Aparência */}
            <div className="space-y-6">
              <div>
                <Label className="font-black text-white mb-3 block text-lg">
                  🎨 Cor de Fundo
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Preto", value: "black", class: "bg-black" },
                    { name: "Vermelho", value: "red", class: "bg-red-600" },
                    { name: "Sincronizado", value: "sync", class: "bg-gradient-to-r from-red-600 to-blue-600" },
                    { name: "Azul", value: "blue", class: "bg-blue-600" },
                    { name: "Amarelo", value: "yellow", class: "bg-yellow-500" },
                    { name: "Verde", value: "green", class: "bg-green-600" }
                  ].map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBannerBgColor(color.value)}
                      className={`h-12 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        bannerBgColor === color.value ? 'border-white shadow-lg' : 'border-white/20'
                      } ${color.class} flex items-center justify-center text-sm text-white font-bold`}
                      title={color.name}
                    >
                      {color.name === "Sincronizado" ? "SYNC" : color.name.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="font-black text-white mb-3 block text-lg">
                  📏 Altura da Faixa
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-12">Baixa</span>
                    <input
                      type="range"
                      min="24"
                      max="80"
                      value={bannerHeight}
                      onChange={(e) => setBannerHeight(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-sm text-gray-400 w-12">Alta</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-white/10 px-3 py-1 rounded-lg text-white font-bold">
                      {bannerHeight}px
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="font-black text-white mb-3 block text-lg">
                  ⚡ Velocidade do Scroll
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-12">Lenta</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={bannerSpeed}
                      onChange={(e) => setBannerSpeed(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-sm text-gray-400 w-12">Rápida</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-white/10 px-3 py-1 rounded-lg text-white font-bold">
                      {bannerSpeed}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="font-black text-white mb-3 block text-lg">
                  🔄 Repetições do Texto
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-12">Poucas</span>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={bannerRepetitions}
                      onChange={(e) => setBannerRepetitions(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-sm text-gray-400 w-12">Muitas</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-white/10 px-3 py-1 rounded-lg text-white font-bold">
                      {bannerRepetitions} repetições
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controles de Ativação */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="banner-active"
                checked={isBannerActive}
                onChange={(e) => setIsBannerActive(e.target.checked)}
                className="w-5 h-5 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
              />
              <Label htmlFor="banner-active" className="text-white font-bold text-lg">
                Ativar Faixa de Aviso
              </Label>
            </div>
            
            <button
              onClick={() => {
                localStorage.setItem("gang-boyz-banner-text", bannerText)
                localStorage.setItem("gang-boyz-banner-active", isBannerActive.toString())
                localStorage.setItem("gang-boyz-banner-emoji", bannerEmoji)
                localStorage.setItem("gang-boyz-banner-bg-color", bannerBgColor)
                localStorage.setItem("gang-boyz-banner-height", bannerHeight.toString())
                localStorage.setItem("gang-boyz-banner-speed", bannerSpeed.toString())
                localStorage.setItem("gang-boyz-banner-repetitions", bannerRepetitions.toString())
                window.dispatchEvent(new CustomEvent('bannerSettingsUpdated'))
                toast.success("Configurações da faixa salvas!")
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center text-lg"
            >
              <Save className="h-5 w-5 mr-3" />
              Salvar Configurações
            </button>
          </div>
          
          {/* Preview Melhorado */}
          <div className="bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/25">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-black text-white">Preview da Faixa</h3>
            </div>
            
            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div 
                className={`flex items-center overflow-hidden rounded-lg ${
                  bannerBgColor === 'black' ? 'bg-black' :
                  bannerBgColor === 'red' ? 'bg-red-600' :
                  bannerBgColor === 'blue' ? 'bg-blue-600' :
                  bannerBgColor === 'yellow' ? 'bg-yellow-500' :
                  bannerBgColor === 'green' ? 'bg-green-600' :
                  bannerBgColor === 'sync' ? 'bg-gradient-to-r from-red-600 to-blue-600' :
                  'bg-black'
                }`}
                style={{ height: `${bannerHeight}px` }}
              >
                {isBannerActive ? (
                  <div 
                    className="flex text-white font-bold text-sm tracking-wider whitespace-nowrap"
                    style={{ 
                      animation: `scroll ${Math.max(5, 20 - (bannerSpeed / 5))}s linear infinite` 
                    }}
                  >
                    {Array.from({ length: bannerRepetitions }, (_, i) => (
                      <span key={i} className="mr-8">{bannerEmoji} {bannerText} {bannerEmoji}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm flex items-center justify-center w-full">
                    Faixa desativada
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                <span>Altura: {bannerHeight}px</span>
                <span>Velocidade: {bannerSpeed}%</span>
                <span>Repetições: {bannerRepetitions}</span>
                <span>Status: {isBannerActive ? 'Ativa' : 'Inativa'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Gerenciamento da Faixa de Aviso */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 shadow-lg shadow-green-500/25">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Gerenciar Faixa de Aviso</h3>
                <p className="text-gray-400 text-sm">Configure a faixa de aviso para todas as páginas do site</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                // Salvar configurações no formato do DemoBanner
                const demoBannerSettings = {
                  text: bannerText,
                  emoji: bannerEmoji,
                  bgColor: bannerBgColor,
                  height: bannerHeight,
                  speed: bannerSpeed,
                  repetitions: bannerRepetitions,
                  isActive: isBannerActive
                }
                
                console.log("🚀 Admin: Salvando configurações:", demoBannerSettings)
                localStorage.setItem("demo-banner-settings", JSON.stringify(demoBannerSettings))
                
                // Disparar evento para atualizar todas as páginas
                console.log("📡 Admin: Disparando evento customizado...")
                window.dispatchEvent(new CustomEvent('demoBannerSettingsUpdated'))
                
                toast.success("Faixa de aviso sincronizada em todas as páginas!")
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center text-lg"
            >
              <Settings className="h-5 w-5 mr-2" />
              Sincronizar com Todas as Páginas
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sincronização automática: Homepage, Camisetas, Calças, Moletons, Jaquetas e todas as páginas de produtos</span>
            </div>
          </div>
        </div>

        {/* Carrossel Hero Section */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg shadow-blue-500/25">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h2 className="text-2xl font-black text-white">Carrossel Hero - Banners Principais</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Estes banners aparecem no carrossel principal da homepage com alternância automática a cada 4 segundos.
            Use as setas laterais ou os indicadores para navegar manualmente.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.filter(banner => banner.id.startsWith("hero-banner")).map((banner) => (
              <div key={banner.id} className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-red-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{banner.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                      CARROSSEL
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{banner.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold text-gray-300 text-sm">Tipo:</Label>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      banner.mediaType === 'video' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      banner.mediaType === 'gif' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {banner.mediaType === 'video' ? '🎥 Vídeo' : 
                       banner.mediaType === 'gif' ? '🎞️ GIF' : '🖼️ Imagem'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="font-semibold text-gray-300 text-sm">Dimensões:</Label>
                    <span className="text-xs text-gray-400">{banner.dimensions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banners List */}
        <div className="space-y-6 md:space-y-8">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Banner Info */}
                <div>
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{banner.name}</h3>
                    {!banner.id.startsWith("hero-banner") && (
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{banner.description}</p>
                  
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Tipo de Mídia:</Label>
                      <span className={`text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-medium ${
                        banner.mediaType === 'video' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        banner.mediaType === 'gif' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {banner.mediaType === 'video' ? '🎥 Vídeo' : 
                         banner.mediaType === 'gif' ? '🎞️ GIF' : '🖼️ Imagem'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Dimensões:</Label>
                      <span className="text-xs md:text-sm text-gray-400">{banner.dimensions}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Formato:</Label>
                      <span className="text-xs md:text-sm text-gray-400">{banner.format}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                      <Label className="font-semibold text-gray-300 text-sm">Posição:</Label>
                      <span className="text-xs md:text-sm text-gray-400">{banner.position}</span>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label htmlFor={`file-${banner.id}`} className="font-semibold text-gray-300">
                      Nova Mídia
                    </Label>
                    <Input
                      id={`file-${banner.id}`}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleMediaChange(banner.id, file)
                      }}
                      className="cursor-pointer bg-white/10 border-white/20 text-white placeholder-gray-400 hover:bg-white/20"
                    />
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="text-green-400">Imagens:</span> máximo 5MB (JPG, PNG, WebP, GIF)<br/>
                      <span className="text-blue-400">Vídeos:</span> máximo 10MB (MP4, WebM, OGG)
                    </p>
                  </div>
                </div>

                {/* Banner Preview */}
                <div>
                  <Label className="font-semibold text-gray-300 text-sm md:text-base mb-3 md:mb-4 block">
                    Preview:
                  </Label>
                  
                  {banner.mediaType === 'image' ? (
                    <InlineCropViewport
                      imageUrl={banner.currentImage}
                      cropMetadata={banner.cropMetadata}
                      onSave={(metadata) => handleCropSave(banner.id, metadata)}
                      onCancel={() => handleCropCancel(banner.id)}
                      bannerName={banner.name}
                      bannerType={banner.id.startsWith('hero-banner') ? 'hero' : 'other'}
                    />
                  ) : (
                    <div 
                      className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <video
                        src={banner.currentImage}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        loop
                      />
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/70 backdrop-blur-sm text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium border border-white/20">
                      <Eye className="h-3 w-3 inline mr-1" />
                        {banner.mediaType === 'video' ? 'Vídeo' : 'GIF'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mt-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 shadow-lg shadow-green-500/25">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h3 className="text-2xl font-black text-white">Instruções de Uso</h3>
          </div>
          <div className="space-y-3 text-gray-300">
            <div>
              <h4 className="font-black text-white">Dimensões Recomendadas:</h4>
              <p className="text-sm">Use imagens com proporção 16:9 (1920x1080px) para melhor qualidade.</p>
            </div>
            <div>
              <h4 className="font-black text-white">Formatos Suportados:</h4>
              <p className="text-sm">JPG, PNG e WebP. WebP oferece melhor compressão mantendo a qualidade.</p>
            </div>
            <div>
              <h4 className="font-black text-white">Tamanho do Arquivo:</h4>
              <p className="text-sm">Máximo 5MB por imagem para garantir carregamento rápido.</p>
            </div>
            <div>
              <h4 className="font-black text-white">Dica:</h4>
              <p className="text-sm">Use imagens com boa resolução mas otimizadas para web para melhor performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
