"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Settings, 
  Save,
  Clock,
  RefreshCw,
  Truck,
  CreditCard,
  Phone,
  Mail,
  MapPin
} from "lucide-react"

export default function FooterPage() {
  const [footerData, setFooterData] = useState({
    atendimentoHorario: "Segunda à sexta das 9h00 às 17h00",
    trocasDevolucoes: "Primeira troca é grátis",
    frete: "Grátis acima de R$349",
    parcelamento: "Em até 10x sem juros no cartão",
    telefone: "(11) 99999-9999",
    email: "contato@gangboyz.com",
    endereco: "São Paulo, SP - Brasil"
  })

  const handleSave = () => {
    // Salvar dados do footer no localStorage
    localStorage.setItem("gang-boyz-footer-data", JSON.stringify(footerData))
    console.log("Dados do footer salvos:", footerData)
  }

  const footerSections = [
    {
      title: "ATENDIMENTO",
      description: "Horário de funcionamento",
      key: "atendimentoHorario",
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      placeholder: "Ex: Segunda à sexta das 9h00 às 17h00"
    },
    {
      title: "TROCAS E DEVOLUÇÕES",
      description: "Política de trocas",
      key: "trocasDevolucoes",
      icon: RefreshCw,
      color: "from-green-500 to-green-600",
      placeholder: "Ex: Primeira troca é grátis"
    },
    {
      title: "FRETE",
      description: "Condições de frete",
      key: "frete",
      icon: Truck,
      color: "from-purple-500 to-purple-600",
      placeholder: "Ex: Grátis acima de R$349"
    },
    {
      title: "PARCELAMENTO",
      description: "Condições de pagamento",
      key: "parcelamento",
      icon: CreditCard,
      color: "from-orange-500 to-orange-600",
      placeholder: "Ex: Em até 10x sem juros no cartão"
    }
  ]

  const contactSections = [
    {
      title: "TELEFONE",
      description: "WhatsApp e telefone",
      key: "telefone",
      icon: Phone,
      color: "from-green-500 to-green-600",
      placeholder: "Ex: (11) 99999-9999"
    },
    {
      title: "EMAIL",
      description: "Email de contato",
      key: "email",
      icon: Mail,
      color: "from-red-500 to-red-600",
      placeholder: "Ex: contato@gangboyz.com"
    },
    {
      title: "ENDEREÇO",
      description: "Localização da empresa",
      key: "endereco",
      icon: MapPin,
      color: "from-blue-500 to-blue-600",
      placeholder: "Ex: São Paulo, SP - Brasil"
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

          {/* Seção Informações Principais */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2 shadow-lg shadow-red-500/25">
                <Settings className="h-6 w-6 text-white" />
              </div>
              Informações Principais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {footerSections.map((section) => (
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
                    <Label className="text-white font-semibold">Texto:</Label>
                    <Input
                      value={footerData[section.key as keyof typeof footerData]}
                      onChange={(e) => setFooterData({...footerData, [section.key]: e.target.value})}
                      placeholder={section.placeholder}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Seção Contato */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/25">
                <Phone className="h-6 w-6 text-white" />
              </div>
              Informações de Contato
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactSections.map((section) => (
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
                    <Label className="text-white font-semibold">Informação:</Label>
                    <Input
                      value={footerData[section.key as keyof typeof footerData]}
                      onChange={(e) => setFooterData({...footerData, [section.key]: e.target.value})}
                      placeholder={section.placeholder}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="text-center mb-12">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center text-lg mx-auto"
            >
              <Save className="h-5 w-5 mr-3" />
              Salvar Configurações do Footer
            </Button>
          </div>

          {/* Preview */}
          <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 shadow-lg shadow-green-500/25">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">Preview do Footer</h3>
            </div>
            
            <div className="bg-black/50 rounded-xl p-6 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-lg">ATENDIMENTO</h4>
                  <p className="text-gray-300">{footerData.atendimentoHorario}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-lg">TROCAS E DEVOLUÇÕES</h4>
                  <p className="text-gray-300">{footerData.trocasDevolucoes}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-lg">FRETE</h4>
                  <p className="text-gray-300">{footerData.frete}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-lg">PARCELAMENTO</h4>
                  <p className="text-gray-300">{footerData.parcelamento}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">{footerData.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-red-400" />
                    <span className="text-gray-300">{footerData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">{footerData.endereco}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
