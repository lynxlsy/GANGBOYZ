"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Link as LinkIcon, 
  ExternalLink, 
  Save,
  Eye,
  Settings,
  Image as ImageIcon,
  MousePointer,
  Target
} from "lucide-react"

export default function LinkarPage() {
  const [links, setLinks] = useState({
    bannerOfertas: "/ofertas",
    bannerNovaColecao: "/produtos",
    bannerMoletons: "/moletons",
    bannerAcessorios: "/acessorios",
    bannerPromocoes: "/promocoes",
    botaoExplorarColecao: "/produtos",
    botaoVerOfertas: "/ofertas",
    botaoConfira: "/moletons",
    botaoHeroExplorar: "/produtos",
    botaoHeroLookbook: "/lookbook"
  })

  const handleSave = () => {
    // Salvar links no localStorage
    localStorage.setItem("gang-boyz-banner-links", JSON.stringify(links))
    console.log("Links salvos:", links)
  }

  const bannerSections = [
    {
      title: "Banner de Ofertas Especiais",
      description: "Banner que aparece na seção FeaturedProducts",
      key: "bannerOfertas",
      icon: ImageIcon,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Banner Nova Coleção",
      description: "Banner da coleção principal no BannersShowcase",
      key: "bannerNovaColecao", 
      icon: ImageIcon,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Banner Moletons",
      description: "Banner de moletons no BannersShowcase",
      key: "bannerMoletons",
      icon: ImageIcon,
      color: "from-gray-500 to-gray-600"
    },
    {
      title: "Banner Acessórios",
      description: "Banner de acessórios no BannerGrid",
      key: "bannerAcessorios",
      icon: ImageIcon,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Banner Promoções",
      description: "Banner de promoções no BannerGrid",
      key: "bannerPromocoes",
      icon: ImageIcon,
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  const buttonSections = [
    {
      title: "Botão Explorar Coleção",
      description: "Botão no banner Nova Coleção",
      key: "botaoExplorarColecao",
      icon: MousePointer,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Botão Ver Ofertas",
      description: "Botão no banner Ofertas Especiais",
      key: "botaoVerOfertas",
      icon: MousePointer,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Botão Confira",
      description: "Botão no banner Moletons",
      key: "botaoConfira",
      icon: MousePointer,
      color: "from-gray-500 to-gray-600"
    },
    {
      title: "Botão Hero Explorar",
      description: "Botão principal do Hero",
      key: "botaoHeroExplorar",
      icon: MousePointer,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Botão Hero Lookbook",
      description: "Botão secundário do Hero",
      key: "botaoHeroLookbook",
      icon: MousePointer,
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden -mt-20 pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
      
      {/* Conteúdo Principal */}
      <div className="pb-8">
        <div className="max-w-6xl mx-auto px-4">

          {/* Seção Banners */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2 shadow-lg shadow-red-500/25">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              Links dos Banners
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bannerSections.map((section) => (
                <Card key={section.key} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`bg-gradient-to-br ${section.color} rounded-lg p-2 shadow-lg`}>
                      <section.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{section.title}</h3>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-white font-semibold">URL de Destino:</Label>
                    <Input
                      value={links[section.key as keyof typeof links]}
                      onChange={(e) => setLinks({...links, [section.key]: e.target.value})}
                      placeholder="/pagina-destino"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ExternalLink className="h-4 w-4" />
                      <span>Exemplo: /ofertas, /produtos, /moletons</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Seção Botões */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/25">
                <MousePointer className="h-6 w-6 text-white" />
              </div>
              Links dos Botões
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buttonSections.map((section) => (
                <Card key={section.key} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`bg-gradient-to-br ${section.color} rounded-lg p-2 shadow-lg`}>
                      <section.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{section.title}</h3>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-white font-semibold">URL de Destino:</Label>
                    <Input
                      value={links[section.key as keyof typeof links]}
                      onChange={(e) => setLinks({...links, [section.key]: e.target.value})}
                      placeholder="/pagina-destino"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ExternalLink className="h-4 w-4" />
                      <span>Exemplo: /ofertas, /produtos, /moletons</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="text-center">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center text-lg mx-auto"
            >
              <Save className="h-5 w-5 mr-3" />
              Salvar Todos os Links
            </Button>
          </div>

          {/* Preview */}
          <Card className="mt-12 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 shadow-lg shadow-green-500/25">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">Preview dos Links</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(links).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300 font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <span className="text-red-400 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
