"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Save, RefreshCw, Trash2, Settings, Image as ImageIcon, Cloud, CloudOff } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { BannerConfig, BANNER_CONFIGS, BANNER_STRIP_CONFIGS } from "@/lib/banner-config"
import { BannerData, BannerStripData } from "@/hooks/use-banner"
import { bannerSyncServiceV2 as bannerSyncService } from "@/lib/banner-sync-service-v2"

interface BannerAdminMobileProps {
  storageKey: string
  eventName: string
  bannerConfigs: BannerConfig[]
  stripConfig?: typeof BANNER_STRIP_CONFIGS.homepage | typeof BANNER_STRIP_CONFIGS.categoryPages
  showCategoryStrip?: boolean
}

export function BannerAdminMobile({ storageKey, eventName, bannerConfigs, stripConfig, showCategoryStrip = false }: BannerAdminMobileProps) {
  const [banners, setBanners] = useState<BannerData[]>([])
  const [loading, setLoading] = useState(false)
  const [editingBanner, setEditingBanner] = useState<string | null>(null)
  const [cropData, setCropData] = useState<{x: number, y: number, scale: number}>({x: 0, y: 0, scale: 1})
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  // Estados para faixa de aviso
  const [stripData, setStripData] = useState<BannerStripData | null>(null)
  const [stripSaving, setStripSaving] = useState(false)
  const [stripSaved, setStripSaved] = useState(false)
  
  // Estados para faixa de categorias
  const [categoryStripData, setCategoryStripData] = useState<BannerStripData | null>(null)
  const [categoryStripSaving, setCategoryStripSaving] = useState(false)
  const [categoryStripSaved, setCategoryStripSaved] = useState(false)

  useEffect(() => {
    loadBanners()
    if (stripConfig) {
      loadStripData()
    }
    if (showCategoryStrip) {
      loadCategoryStripData()
    }
  }, [])

  const loadBanners = () => {
    try {
      const savedBanners = localStorage.getItem(storageKey)
      if (savedBanners) {
        const parsedBanners: BannerData[] = JSON.parse(savedBanners)
        const correctedBanners = parsedBanners.map(banner => {
          const config = bannerConfigs.find(c => c.id === banner.id)
          if (config && (banner.currentImage === "/banner-footer.svg" || banner.currentImage === "/banner-template-1891x100.jpg")) {
            return { ...banner, currentImage: config.defaultImage }
          }
          return banner
        })
        setBanners(correctedBanners)
        localStorage.setItem(storageKey, JSON.stringify(correctedBanners))
      } else {
        const defaultBanners: BannerData[] = bannerConfigs.map(config => ({
          id: config.id,
          name: config.name,
          description: config.description,
          currentImage: config.defaultImage,
          mediaType: 'image',
          dimensions: config.dimensions,
          format: config.mediaTypes.join(', '),
          position: config.position
        }))
        setBanners(defaultBanners)
        localStorage.setItem(storageKey, JSON.stringify(defaultBanners))
      }
    } catch (error) {
      console.error("Erro ao carregar banners:", error)
      toast.error("Erro ao carregar banners")
    }
  }

  const loadStripData = () => {
    if (!stripConfig) return
    
    try {
      const savedData = stripConfig ? localStorage.getItem(stripConfig.storageKey) : null
      if (savedData) {
        setStripData(JSON.parse(savedData))
      } else {
        setStripData(stripConfig?.defaultSettings || { isActive: false, text: '', emoji: '', bgColor: 'black', height: 38, speed: 50, repetitions: 4 })
      }
    } catch (error) {
      console.error("Erro ao carregar dados da faixa:", error)
    }
  }

  const loadCategoryStripData = () => {
    try {
      const savedData = localStorage.getItem(BANNER_STRIP_CONFIGS.categoryPages.storageKey)
      if (savedData) {
        setCategoryStripData(JSON.parse(savedData))
      } else {
        setCategoryStripData(BANNER_STRIP_CONFIGS.categoryPages.defaultSettings)
      }
    } catch (error) {
      console.error("Erro ao carregar dados da faixa de categorias:", error)
    }
  }

  const handleFileUpload = async (bannerId: string, file: File) => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro no upload')
      }

      const { url } = await response.json()
      
      const updatedBanners = banners.map(banner => 
        banner.id === bannerId 
          ? { ...banner, currentImage: url }
          : banner
      )
      
      setBanners(updatedBanners)
      localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
      window.dispatchEvent(new CustomEvent(eventName))
      
      toast.success("Banner atualizado com sucesso!")
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro ao fazer upload do banner")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBanner = (bannerId: string) => {
    const updatedBanners = banners.filter(banner => banner.id !== bannerId)
    setBanners(updatedBanners)
    localStorage.setItem(storageKey, JSON.stringify(updatedBanners))
    window.dispatchEvent(new CustomEvent(eventName))
    toast.success("Banner excluído com sucesso!")
  }

  const handleStripSave = async () => {
    if (!stripConfig || !stripData) return
    
    setStripSaving(true)
    
    try {
      if (stripConfig) {
        localStorage.setItem(stripConfig.storageKey, JSON.stringify(stripData))
        window.dispatchEvent(new CustomEvent(stripConfig.eventName))
      }
      
      setStripSaving(false)
      setStripSaved(true)
      
      setTimeout(() => {
        setStripSaved(false)
      }, 2000)
      
      toast.success("Configurações da faixa salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar faixa:", error)
      toast.error("Erro ao salvar configurações")
      setStripSaving(false)
    }
  }

  const handleCategoryStripSave = async () => {
    if (!categoryStripData) return
    
    setCategoryStripSaving(true)
    
    try {
      localStorage.setItem(BANNER_STRIP_CONFIGS.categoryPages.storageKey, JSON.stringify(categoryStripData))
      window.dispatchEvent(new CustomEvent(BANNER_STRIP_CONFIGS.categoryPages.eventName))
      
      setCategoryStripSaving(false)
      setCategoryStripSaved(true)
      
      setTimeout(() => {
        setCategoryStripSaved(false)
      }, 2000)
      
      toast.success("Configurações da faixa de categorias salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar faixa de categorias:", error)
      toast.error("Erro ao salvar configurações")
      setCategoryStripSaving(false)
    }
  }

  const forceReload = () => {
    localStorage.removeItem(storageKey)
    loadBanners()
    if (stripConfig) {
      loadStripData()
    }
    if (showCategoryStrip) {
      loadCategoryStripData()
    }
    toast.success("Dados atualizados com sucesso!")
  }

  return (
    <div className="w-full p-4 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Banners</h1>
          <Button 
            onClick={forceReload}
            variant="outline" 
            size="sm"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
        </div>

        {/* Banners Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Banners</h2>
          <div className="grid grid-cols-1 gap-4">
            {banners.map((banner) => {
              const config = bannerConfigs.find(c => c.id === banner.id)
              return (
                <div key={banner.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{banner.name}</h3>
                      <p className="text-sm text-gray-400">{banner.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                      onClick={() => {
                        const fileInput = document.createElement('input')
                        fileInput.type = 'file'
                        fileInput.accept = 'image/*'
                        fileInput.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            handleFileUpload(banner.id, file)
                          }
                        }
                        fileInput.click()
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar
                    </Button>
                  </div>
                  
                  <div className="relative w-full h-32 rounded-md overflow-hidden bg-gray-700">
                    {banner.currentImage ? (
                      <Image
                        src={banner.currentImage}
                        alt={banner.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400">
                    <p>Dimensões: {config?.dimensions || 'N/A'}</p>
                    <p>Formatos: {config?.mediaTypes.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Strip Section */}
        {stripConfig && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Faixa de Aviso</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="strip-text" className="text-sm font-medium mb-1 block">
                    Texto
                  </Label>
                  <Input
                    id="strip-text"
                    value={stripData?.text || ''}
                    onChange={(e) => setStripData(prev => prev ? {...prev, text: e.target.value} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Texto da faixa"
                  />
                </div>
                <div>
                  <Label htmlFor="strip-emoji" className="text-sm font-medium mb-1 block">
                    Emoji
                  </Label>
                  <Input
                    id="strip-emoji"
                    value={stripData?.emoji || ''}
                    onChange={(e) => setStripData(prev => prev ? {...prev, emoji: e.target.value} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Emoji"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="strip-bg-color" className="text-sm font-medium mb-1 block">
                    Cor de Fundo
                  </Label>
                  <Input
                    id="strip-bg-color"
                    type="color"
                    value={stripData?.bgColor || '#000000'}
                    onChange={(e) => setStripData(prev => prev ? {...prev, bgColor: e.target.value} : null)}
                    className="bg-gray-700 border-gray-600 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="strip-height" className="text-sm font-medium mb-1 block">
                    Altura (px)
                  </Label>
                  <Input
                    id="strip-height"
                    type="number"
                    min="20"
                    max="100"
                    value={stripData?.height || 38}
                    onChange={(e) => setStripData(prev => prev ? {...prev, height: parseInt(e.target.value) || 38} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="strip-speed" className="text-sm font-medium mb-1 block">
                    Velocidade
                  </Label>
                  <Input
                    id="strip-speed"
                    type="number"
                    min="10"
                    max="200"
                    value={stripData?.speed || 50}
                    onChange={(e) => setStripData(prev => prev ? {...prev, speed: parseInt(e.target.value) || 50} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleStripSave}
                  disabled={stripSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {stripSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : stripSaved ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Category Strip Section */}
        {showCategoryStrip && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Faixa de Categorias</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="category-strip-text" className="text-sm font-medium mb-1 block">
                    Texto
                  </Label>
                  <Input
                    id="category-strip-text"
                    value={categoryStripData?.text || ''}
                    onChange={(e) => setCategoryStripData(prev => prev ? {...prev, text: e.target.value} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Texto da faixa"
                  />
                </div>
                <div>
                  <Label htmlFor="category-strip-emoji" className="text-sm font-medium mb-1 block">
                    Emoji
                  </Label>
                  <Input
                    id="category-strip-emoji"
                    value={categoryStripData?.emoji || ''}
                    onChange={(e) => setCategoryStripData(prev => prev ? {...prev, emoji: e.target.value} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Emoji"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="category-strip-bg-color" className="text-sm font-medium mb-1 block">
                    Cor de Fundo
                  </Label>
                  <Input
                    id="category-strip-bg-color"
                    type="color"
                    value={categoryStripData?.bgColor || '#000000'}
                    onChange={(e) => setCategoryStripData(prev => prev ? {...prev, bgColor: e.target.value} : null)}
                    className="bg-gray-700 border-gray-600 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="category-strip-height" className="text-sm font-medium mb-1 block">
                    Altura (px)
                  </Label>
                  <Input
                    id="category-strip-height"
                    type="number"
                    min="20"
                    max="100"
                    value={categoryStripData?.height || 38}
                    onChange={(e) => setCategoryStripData(prev => prev ? {...prev, height: parseInt(e.target.value) || 38} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="category-strip-speed" className="text-sm font-medium mb-1 block">
                    Velocidade
                  </Label>
                  <Input
                    id="category-strip-speed"
                    type="number"
                    min="10"
                    max="200"
                    value={categoryStripData?.speed || 50}
                    onChange={(e) => setCategoryStripData(prev => prev ? {...prev, speed: parseInt(e.target.value) || 50} : null)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleCategoryStripSave}
                  disabled={categoryStripSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {categoryStripSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : categoryStripSaved ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}