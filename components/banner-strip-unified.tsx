"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit3, Save, X } from "lucide-react"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"
import { useEditMode } from "@/lib/edit-mode-context"
import { toast } from "@/hooks/use-toast"
import { eventManager } from "@/lib/event-manager"

interface BannerStripConfig {
  texts: string[]
  backgroundColor: string
  textColor: string
  speed: number // pixels per second
  repetitions: number
}

// Configuração padrão com cores corrigidas
const DEFAULT_CONFIG: BannerStripConfig = {
  texts: [
    "FRETE GRÁTIS ACIMA DE R$349",
    "10% OFF NA PRIMEIRA COMPRA",
    "TROCA GRÁTIS NA PRIMEIRA TROCA",
    "PARCELAMENTO EM ATÉ 10X SEM JUROS"
  ],
  backgroundColor: "#000000", // Fundo preto
  textColor: "#ffffff", // Texto branco (corrigido)
  speed: 50,
  repetitions: 3
}

export function HomepageBannerStrip() {
  const { isEditMode } = useEditMode()
  const [config, setConfig] = useState<BannerStripConfig>(DEFAULT_CONFIG)
  const [isEditing, setIsEditing] = useState(false)
  const [editingConfig, setEditingConfig] = useState<BannerStripConfig>(DEFAULT_CONFIG)
  const [visibleTexts, setVisibleTexts] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false) // Added saving state

  // Carregar configuração com fallback para localStorage
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Fallback para localStorage
        const savedConfig = localStorage.getItem("gang-boyz-banner-strip-config")
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig)
            
            // Corrigir problema de contraste se necessário
            if (parsedConfig.backgroundColor === '#000000' && 
                (!parsedConfig.textColor || parsedConfig.textColor === '#000000')) {
              parsedConfig.textColor = '#ffffff'
            }
            
            // Garantir que a cor do texto esteja definida
            if (!parsedConfig.textColor) {
              parsedConfig.textColor = '#ffffff'
            }
            
            setConfig(parsedConfig)
            setEditingConfig(parsedConfig)
          } catch (error) {
            console.error('Erro ao carregar configuração do banner strip:', error)
            setConfig(DEFAULT_CONFIG)
            setEditingConfig(DEFAULT_CONFIG)
          }
        } else {
          // Verificar conteúdo editável
          const editableContent = getContentById("banner-strip-texts")
          if (editableContent) {
            const lines = editableContent.split('\n').filter(line => line.trim() !== '')
            if (lines.length > 0) {
              const newConfig = {
                ...DEFAULT_CONFIG,
                texts: lines
              }
              setConfig(newConfig)
              setEditingConfig(newConfig)
              localStorage.setItem("gang-boyz-banner-strip-config", JSON.stringify(newConfig))
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configuração:', error)
        // Fallback para localStorage se falhar
        const savedConfig = localStorage.getItem("gang-boyz-banner-strip-config")
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig)
            // Corrigir problema de contraste se necessário
            if (parsedConfig.backgroundColor === '#000000' && 
                (!parsedConfig.textColor || parsedConfig.textColor === '#000000')) {
              parsedConfig.textColor = '#ffffff'
            }
            
            // Garantir que a cor do texto esteja definida
            if (!parsedConfig.textColor) {
              parsedConfig.textColor = '#ffffff'
            }
            setConfig(parsedConfig)
            setEditingConfig(parsedConfig)
          } catch (error) {
            console.error('Erro ao carregar configuração do banner strip:', error)
            setConfig(DEFAULT_CONFIG)
            setEditingConfig(DEFAULT_CONFIG)
          }
        }
      }
    }

    loadConfig()

    // Escutar atualizações do localStorage
    const handleStorageChange = () => {
      const savedConfig = localStorage.getItem("gang-boyz-banner-strip-config")
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig)
          // Corrigir problema de contraste se necessário
          if (parsedConfig.backgroundColor === '#000000' && 
              (!parsedConfig.textColor || parsedConfig.textColor === '#000000')) {
            parsedConfig.textColor = '#ffffff'
          }
          
          // Garantir que a cor do texto esteja definida
          if (!parsedConfig.textColor) {
            parsedConfig.textColor = '#ffffff'
          }
          setConfig(parsedConfig)
          setEditingConfig(parsedConfig)
        } catch (error) {
          console.error('Erro ao carregar configuração do banner strip:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('editableContentsUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('editableContentsUpdated', handleStorageChange)
    }
  }, [])

  // Gerar textos visíveis com repetições
  useEffect(() => {
    const generateVisibleTexts = () => {
      const texts = []
      for (let i = 0; i < config.repetitions; i++) {
        texts.push(...config.texts)
      }
      setVisibleTexts(texts)
    }
    
    generateVisibleTexts()
  }, [config.texts, config.repetitions])

  const handleSaveConfig = async () => {
    setIsSaving(true)
    
    // Garantir que a cor do texto seja visível no fundo
    const finalConfig = { ...editingConfig }
    
    // Se o fundo for preto e o texto também, corrigir para branco
    if (finalConfig.backgroundColor === '#000000' && 
        (!finalConfig.textColor || finalConfig.textColor === '#000000')) {
      finalConfig.textColor = '#ffffff'
    }
    
    // Se o fundo for branco e o texto também, corrigir para preto
    if (finalConfig.backgroundColor === '#ffffff' && 
        (!finalConfig.textColor || finalConfig.textColor === '#ffffff')) {
      finalConfig.textColor = '#000000'
    }
    
    // Garantir que a cor do texto esteja definida
    if (!finalConfig.textColor) {
      finalConfig.textColor = '#ffffff'
    }
    
    try {
      setConfig(finalConfig)
      
      // Também salvar no localStorage para fallback
      localStorage.setItem("gang-boyz-banner-strip-config", JSON.stringify(finalConfig))
      
      // Salvar textos como conteúdo editável
      const textsContent = finalConfig.texts.join('\n')
      updateContentById("banner-strip-texts", textsContent)
      
      setIsEditing(false)
      
      toast({
        title: "Configuração atualizada",
        description: "A faixa de promoção foi atualizada com sucesso."
      })
      
      // Emit event to notify other components
      eventManager.emitThrottled('editableContentsUpdated')
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
      // Mesmo que falhe, manter a alteração local
      setConfig(finalConfig)
      localStorage.setItem("gang-boyz-banner-strip-config", JSON.stringify(finalConfig))
      const textsContent = finalConfig.texts.join('\n')
      updateContentById("banner-strip-texts", textsContent)
      setIsEditing(false)
      
      toast({
        title: "Configuração atualizada localmente",
        description: "A configuração foi salva localmente."
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingConfig(config)
    setIsEditing(false)
  }

  // Estilos dinâmicos para animação
  const animationStyle = useMemo(() => ({
    animation: `scroll ${Math.max(10, visibleTexts.length * (100 / config.speed))}s linear infinite`,
  }), [visibleTexts.length, config.speed])

  return (
    <div 
      className="relative w-full overflow-hidden py-3"
      style={{ 
        backgroundColor: isEditMode ? '#f0f0f0' : config.backgroundColor,
        height: '50px'
      }}
    >
      {isEditMode && (
        <div className="absolute top-1 right-1 z-20 flex gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-6 w-6 p-0 bg-white border-gray-300 hover:bg-gray-100 shadow-md"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="h-3 w-3 text-gray-900" />
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Editar Faixa de Promoção</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900">Textos (um por linha)</label>
                <Textarea
                  value={editingConfig.texts.join('\n')}
                  onChange={(e) => {
                    const texts = e.target.value.split('\n').filter(text => text.trim() !== '')
                    setEditingConfig(prev => ({ ...prev, texts }))
                  }}
                  rows={6}
                  className="mt-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900"
                  placeholder="Digite um texto por linha&#10;Ex:&#10;FRETE GRÁTIS ACIMA DE R$349&#10;10% OFF NA PRIMEIRA COMPRA"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Cor de Fundo</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={editingConfig.backgroundColor}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="h-10 w-12 p-1 bg-white border-gray-300"
                    />
                    <Input
                      type="text"
                      value={editingConfig.backgroundColor}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="flex-1 bg-white text-gray-900 border-gray-300"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-900">Cor do Texto</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={editingConfig.textColor}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="h-10 w-12 p-1 bg-white border-gray-300"
                    />
                    <Input
                      type="text"
                      value={editingConfig.textColor}
                      onChange={(e) => setEditingConfig(prev => ({ ...prev, textColor: e.target.value }))}
                      className="flex-1 bg-white text-gray-900 border-gray-300"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Velocidade (px/s)</label>
                  <Input
                    type="number"
                    min="10"
                    max="200"
                    value={editingConfig.speed}
                    onChange={(e) => setEditingConfig(prev => ({ ...prev, speed: parseInt(e.target.value) || 50 }))}
                    className="mt-1 bg-white text-gray-900 border-gray-300"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-900">Repetições</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={editingConfig.repetitions}
                    onChange={(e) => setEditingConfig(prev => ({ ...prev, repetitions: parseInt(e.target.value) || 3 }))}
                    className="mt-1 bg-white text-gray-900 border-gray-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
                className="border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Animated text strip */}
      <div 
        className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap"
        style={animationStyle}
      >
        {visibleTexts.map((text, index) => (
          <span 
            key={index} 
            className="mx-8 text-sm font-medium"
            style={{ color: config.textColor }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}