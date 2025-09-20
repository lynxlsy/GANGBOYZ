"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Eye, Clock, ToggleLeft, ToggleRight, MessageSquare, Settings, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface WelcomeModalConfig {
  enabled: boolean
  displayTime: number // em segundos
  title: string
  description: string
  buttonText: string
}

export default function WelcomeModalAdminPage() {
  const [config, setConfig] = useState<WelcomeModalConfig>({
    enabled: true,
    displayTime: 4,
    title: "Seja bem-vindo",
    description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
    buttonText: "Explorar Loja"
  })

  const [previewModal, setPreviewModal] = useState(false)

  // Carregar configuração salva
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('welcome-modal-config')
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }
  }, [])

  // Salvar configuração
  const handleSaveConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome-modal-config', JSON.stringify(config))
      toast.success("Configuração do modal salva com sucesso!")
    }
  }

  // Resetar configuração
  const handleResetConfig = () => {
    const defaultConfig: WelcomeModalConfig = {
      enabled: true,
      displayTime: 4,
      title: "Seja bem-vindo",
      description: "Descubra nossa coleção exclusiva de streetwear premium. Peças únicas que expressam sua individualidade e estilo urbano.",
      buttonText: "Explorar Loja"
    }
    setConfig(defaultConfig)
    if (typeof window !== 'undefined') {
      localStorage.setItem('welcome-modal-config', JSON.stringify(defaultConfig))
      toast.success("Configuração resetada para padrão!")
    }
  }

  // Limpar histórico de visualização
  const handleClearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gang-boyz-welcome-seen')
      localStorage.removeItem('welcome-modal-disabled')
      toast.success("Histórico de visualização limpo! O modal aparecerá novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <div className="inline-flex items-center gap-3 border border-red-500 rounded-lg px-4 py-2 hover:bg-red-500/10 transition-colors duration-200 mb-6">
              <ArrowLeft className="h-4 w-4 text-red-500" />
              <span className="text-white font-medium">Voltar ao Admin</span>
            </div>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Configuração do Modal de Boas-vindas
              </h1>
              <p className="text-gray-400 text-lg">
                Configure o tempo de exibição e conteúdo do modal de boas-vindas
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setPreviewModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
              >
                <Eye className="h-5 w-5 mr-2" />
                Visualizar Modal
              </Button>
              
              <Button
                onClick={handleSaveConfig}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Salvar Configuração
              </Button>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configurações Principais */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-red-500" />
                Configurações Principais
              </h3>
              
              <div className="space-y-4">
                {/* Ativar/Desativar Modal */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-semibold">Modal Ativo</Label>
                    <p className="text-gray-400 text-sm">Controla se o modal aparece para novos visitantes</p>
                  </div>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className="flex items-center gap-2"
                  >
                    {config.enabled ? (
                      <ToggleRight className="h-8 w-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Tempo de Exibição */}
                <div>
                  <Label className="text-white font-semibold mb-2 block flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Tempo de Exibição (segundos)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={config.displayTime}
                    onChange={(e) => setConfig(prev => ({ ...prev, displayTime: parseInt(e.target.value) || 4 }))}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Ex: 4"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Tempo que o modal fica visível antes de fechar automaticamente (1-30 segundos)
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Conteúdo do Modal
              </h3>
              
              <div className="space-y-4">
                {/* Título */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">Título</Label>
                  <Input
                    value={config.title}
                    onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Ex: Seja bem-vindo"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">Descrição</Label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:border-red-500 focus:outline-none"
                    rows={3}
                    placeholder="Descrição do modal..."
                  />
                </div>

                {/* Texto do Botão */}
                <div>
                  <Label className="text-white font-semibold mb-2 block">Texto do Botão</Label>
                  <Input
                    value={config.buttonText}
                    onChange={(e) => setConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Ex: Explorar Loja"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informações e Ações */}
          <div className="space-y-6">
            {/* Status Atual */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Status Atual</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Modal:</span>
                  <span className={`font-semibold ${config.enabled ? 'text-green-400' : 'text-red-400'}`}>
                    {config.enabled ? 'Ativo' : 'Desativado'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tempo de exibição:</span>
                  <span className="text-white font-semibold">{config.displayTime}s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Título:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]" title={config.title}>
                    {config.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={handleClearHistory}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold"
                >
                  Limpar Histórico de Visualização
                </Button>
                
                <Button
                  onClick={handleResetConfig}
                  variant="outline"
                  className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Resetar para Padrão
                </Button>
              </div>
            </div>

            {/* Informações */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-blue-400 font-bold text-lg mb-4">ℹ️ Informações</h3>
              
              <div className="space-y-2 text-sm text-blue-300">
                <p>• O modal aparece apenas para visitantes novos</p>
                <p>• Usuários podem desativar permanentemente</p>
                <p>• Configurações são salvas no navegador</p>
                <p>• Tempo mínimo: 1 segundo, máximo: 30 segundos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Preview */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-neutral-900/95 to-black/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Close button */}
            <button
              onClick={() => setPreviewModal(false)}
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
                      className="drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                    />
                  </div>
                </div>

                {/* Welcome message */}
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                    {config.title}
                  </h1>
                  <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
                </div>

                {/* Description */}
                <p className="text-base text-white/80 max-w-sm mx-auto leading-relaxed">
                  {config.description}
                </p>

                {/* Action button */}
                <div className="pt-4">
                  <Button
                    onClick={() => setPreviewModal(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
                  >
                    {config.buttonText}
                  </Button>
                </div>

                {/* Auto-close indicator */}
                <div className="pt-4">
                  <div className="w-20 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{
                        animation: `shrink ${config.displayTime}s linear forwards`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Fechará automaticamente em {config.displayTime}s
                  </p>
                </div>
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
      )}
    </div>
  )
}
