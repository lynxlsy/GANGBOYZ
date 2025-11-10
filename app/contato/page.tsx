"use client"

import { useState, useEffect } from "react"
import { HeaderCentered } from "@/components/header-centered"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { NotificationSystem } from "@/components/notification-system"
import { CookieBanner } from "@/components/cookie-banner"
import { useEditMode } from "@/lib/edit-mode-context"
import { Edit3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getContentById, updateContentById } from "@/lib/editable-content-utils"

export default function ContatoPage() {
  const { isEditMode } = useEditMode()
  
  // Main content
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState("")
  const [editingContent, setEditingContent] = useState("")
  
  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = getContentById("contato-content") || `CONTATO

Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo:

INFORMAÇÕES DE CONTATO

E-mail: contato@gangboyz.com.br
Telefone: (11) 99999-9999
WhatsApp: (11) 99999-9999

Horário de Atendimento:
Segunda a Sexta: 9h às 18h
Sábado: 10h às 16h

ENDEREÇO

Rua Exemplo, 123
São Paulo - SP
CEP: 01234-567

REDES SOCIAIS

Instagram: @gangboyz
Facebook: /gangboyz
Twitter: @gangboyz

FORMULÁRIO DE CONTATO

Você também pode nos enviar uma mensagem diretamente através do formulário abaixo:

[NOME COMPLETO]
[E-MAIL]
[TELEFONE]
[ASSUNTO]
[MENSAGEM]

[ENVIAR MENSAGEM]

NOSSA LOCALIZAÇÃO

[MAPA EMBEDDED]

POLÍTICA DE RESPOSTAS

Nos comprometemos a responder todas as mensagens em até 24 horas úteis. Para solicitações urgentes, recomendamos o contato via WhatsApp.

SUPORTE AO CLIENTE

Para questões relacionadas a pedidos, trocas, devoluções ou suporte técnico, entre em contato com nosso departamento especializado:

E-mail: suporte@gangboyz.com.br
Telefone: (11) 98888-8888

ATENDIMENTO PERSONALIZADO

Para parceiros, influenciadores ou assuntos comerciais, entre em contato com nossa equipe dedicada:

E-mail: parceiros@gangboyz.com.br
Telefone: (11) 97777-7777`
    
    setContent(savedContent)
    setEditingContent(savedContent)
  }, [])

  const handleSave = () => {
    updateContentById("contato-content", editingContent)
    setContent(editingContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditingContent(content)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Custom Header with Black Background */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black">
        <HeaderCentered hideMobileLogo={true} forceBlackBackground={true} />
      </div>
      
      <main className="relative pt-40 md:pt-52">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section with Logo */}
            <div className="bg-black py-6 md:py-8 rounded-2xl mb-12 md:mb-16 -mt-20 md:mt-0">
              <div className="text-center">
                {/* Logo - Hidden on desktop since it's in the header */}
                <div className="mb-3 flex justify-center md:hidden">
                  <img
                    src="/logo-gang-boyz-new.svg"
                    alt="Gang BoyZ"
                    className="w-36"
                  />
                </div>
                <h1 className="text-xl md:text-3xl font-bold mb-2">Contato</h1>
                <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                  Entre em contato conosco através dos nossos canais de atendimento
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="mb-12 md:mb-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50">
                {isEditMode && isEditing ? (
                  <div className="mb-6">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="text-gray-200 text-base md:text-lg leading-relaxed min-h-[400px] md:min-h-[500px] mb-4 bg-gray-700/50 border-gray-600 rounded-lg p-4 font-mono"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave} 
                        className="bg-green-600 hover:bg-green-700 text-sm md:text-base h-8 md:h-10"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700 text-sm md:text-base h-8 md:h-10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : isEditMode ? (
                  <div 
                    className="mb-6 cursor-pointer hover:bg-gray-700/50 p-4 rounded-lg transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <div className="flex items-start gap-2">
                      <Edit3 className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                      <div className="text-gray-200 text-base md:text-lg leading-relaxed whitespace-pre-line font-mono">
                        {content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-200 text-base md:text-lg leading-relaxed whitespace-pre-line font-mono">
                    {content}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <ScrollToTop />
      <WhatsAppButton />
      <NotificationSystem />
      <CookieBanner />
    </div>
  )
}