"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Eye, Save, RefreshCw, Trash2, Settings, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { InlineCropViewport } from "@/components/inline-crop-viewport"

interface CropMetadata {
  src: string
  ratio: string  // "1891x100"
  scale: number
  tx: number     // translateX relativo (-1..1)
  ty: number     // translateY relativo (-1..1)
}

interface ProductBanner {
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

export default function ProductBannersPage() {
  const [banners, setBanners] = useState<ProductBanner[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Carregar banners do localStorage
  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = () => {
    const savedBanners = localStorage.getItem("gang-boyz-product-banners")
    if (savedBanners) {
      const banners: ProductBanner[] = JSON.parse(savedBanners)
      setBanners(banners)
    } else {
      // Banners padrão para produtos
      const defaultBanners: ProductBanner[] = [
        {
          id: "footer-banner-products",
          name: "Banner Footer - Páginas de Produtos",
          description: "Banner que aparece acima do footer em todas as páginas de produtos (1891x100px)",
          currentImage: "/banner-template-1891x100.jpg",
          mediaType: "image",
          dimensions: "1891x100px (18.91:1) - Banner específico para footer",
          format: "JPG, PNG, WebP, MP4, GIF",
          position: "Acima do Footer (em todas as páginas de produtos)"
        }
      ]
      setBanners(defaultBanners)
      localStorage.setItem("gang-boyz-product-banners", JSON.stringify(defaultBanners))
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

      // Atualizar banner com nova mídia
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
      
      // Salvar apenas metadados no localStorage
      console.log("💾 Salvando no localStorage...")
      const bannersMetadata = updatedBanners.map(banner => ({
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage,
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        cropMetadata: banner.cropMetadata
      }))
      
      console.log("📦 Metadados para salvar:", bannersMetadata)
      localStorage.setItem("gang-boyz-product-banners", JSON.stringify(bannersMetadata))
      console.log("✅ Salvo no localStorage com sucesso!")
      
      // Disparar eventos customizados para atualizar outras abas
      console.log("📡 Disparando eventos de sincronização...")
      window.dispatchEvent(new CustomEvent('productBannerUpdated'))
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
      // Salvar apenas metadados no localStorage
      const bannersMetadata = banners.map(banner => ({
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage,
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        cropMetadata: banner.cropMetadata
      }))
      
      localStorage.setItem("gang-boyz-product-banners", JSON.stringify(bannersMetadata))
      
      // Disparar eventos customizados para atualizar outras abas
      window.dispatchEvent(new CustomEvent('productBannerUpdated'))
      
      toast.success("Banners salvos com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar banners.")
    } finally {
      setSaving(false)
    }
  }

  const deleteBanner = (bannerId: string) => {
    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    setBanners(updatedBanners)
    
    // Salvar apenas metadados no localStorage
    const bannersMetadata = updatedBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage,
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-product-banners", JSON.stringify(bannersMetadata))
    
    // Disparar eventos para atualizar componentes
    window.dispatchEvent(new CustomEvent('productBannerUpdated'))
    
    toast.success("Banner excluído com sucesso!")
  }

  const resetBanners = () => {
    const defaultBanners: ProductBanner[] = [
      {
        id: "footer-banner-products",
        name: "Banner Footer - Páginas de Produtos",
        description: "Banner que aparece acima do footer em todas as páginas de produtos (1891x100px)",
        currentImage: "/banner-template-1891x100.jpg",
        mediaType: "image",
        dimensions: "1891x100px (18.91:1) - Banner específico para footer",
        format: "JPG, PNG, WebP, MP4, GIF",
        position: "Acima do Footer (em todas as páginas de produtos)"
      }
    ]
    setBanners(defaultBanners)
    
    // Salvar apenas metadados no localStorage
    const bannersMetadata = defaultBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage,
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-product-banners", JSON.stringify(bannersMetadata))
    
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
    
    // Salvar apenas metadados no localStorage
    const bannersMetadata = updatedBanners.map(banner => ({
      id: banner.id,
      name: banner.name,
      description: banner.description,
      currentImage: banner.currentImage,
      mediaType: banner.mediaType,
      dimensions: banner.dimensions,
      format: banner.format,
      position: banner.position,
      cropMetadata: banner.cropMetadata
    }))
    
    localStorage.setItem("gang-boyz-product-banners", JSON.stringify(bannersMetadata))
    
    // Disparar eventos para atualizar componentes
    window.dispatchEvent(new CustomEvent('productBannerUpdated'))
    
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
                  Banners da Aba de Produtos
                </h1>
                <p className="text-gray-300 text-sm md:text-lg">Gerencie os banners específicos das páginas de produtos</p>
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
              onClick={saveBanners}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-sm flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>

        {/* Banner Footer Section */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg shadow-blue-500/25">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Banner Footer - Páginas de Produtos</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Este banner aparece acima do footer em todas as páginas de produtos com dimensões específicas de 1891x100 pixels.
            Use o editor de recorte para ajustar a imagem perfeitamente ao layout.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.filter(banner => banner.id === "footer-banner-products").map((banner) => (
              <div key={banner.id} className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-red-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{banner.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                      FOOTER
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
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                      bannerType="footer"
                    />
                  ) : (
                    <div 
                      className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl"
                      style={{ aspectRatio: '18.91/1' }}
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
              <h4 className="font-black text-white">Dimensões Específicas:</h4>
              <p className="text-sm">Use imagens com proporção 18.91:1 (1891x100px) para o banner do footer.</p>
            </div>
            <div>
              <h4 className="font-black text-white">Editor de Recorte:</h4>
              <p className="text-sm">Use o editor de recorte para ajustar a imagem perfeitamente ao layout do footer.</p>
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
