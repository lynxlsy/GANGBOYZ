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

export default function TermosUsoPage() {
  const { isEditMode } = useEditMode()
  
  // Main content
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState("")
  const [editingContent, setEditingContent] = useState("")
  
  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = getContentById("termos-uso-content") || `TERMOS DE USO

Bem-vindo à Gang Boyz! Ao acessar e utilizar nosso site, você concorda em cumprir os seguintes termos e condições:

1. ACEITAÇÃO DOS TERMOS

Ao acessar este site, você concorda com estes termos de uso, todas as leis e regulamentos aplicáveis, e reconhece que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.

2. DIREITOS DE PROPRIEDADE INTELECTUAL

Todo o conteúdo deste site, incluindo textos, gráficos, logotipos, ícones, imagens, arquivos de áudio e vídeo, é de propriedade exclusiva da Gang Boyz ou de seus licenciadores e é protegido pelas leis de direitos autorais brasileiras e internacionais.

3. USO DO SITE

Você pode visualizar e imprimir partes do conteúdo apenas para uso pessoal e não comercial. Você não pode:
- Reproduzir, duplicar, copiar ou revender qualquer parte do site
- Modificar ou adaptar qualquer parte do site
- Usar o site de forma que possa danificar ou tornar indisponível para outros usuários

4. REGISTRO DE CONTA

Para realizar compras, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha, e por restringir o acesso ao seu computador. Você concorda em aceitar responsabilidade por todas as atividades que ocorram sob sua conta.

5. PREÇOS E PAGAMENTO

Todos os preços estão em Reais (BRL) e podem ser alterados a qualquer momento sem aviso prévio. O pagamento pode ser realizado através dos meios disponíveis no site no momento da compra.

6. POLÍTICA DE TROCAS E DEVOLUÇÕES

Nossas políticas de trocas e devoluções estão detalhadas em nossa Política de Trocas e Devoluções, que faz parte integrante destes Termos de Uso.

7. LIMITAÇÃO DE RESPONSABILIDADE

A Gang Boyz não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar o site.

8. ALTERAÇÕES NOS TERMOS

Reservamo-nos o direito de modificar estes termos de uso a qualquer momento. As alterações serão publicadas nesta página e entrarão em vigor imediatamente após a publicação.

9. LEI APLICÁVEL

Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Estado de São Paulo.

10. CONTATO

Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
E-mail: termos@gangboyz.com.br
Telefone: (11) 99999-9999`
    
    setContent(savedContent)
    setEditingContent(savedContent)
  }, [])

  const handleSave = () => {
    updateContentById("termos-uso-content", editingContent)
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
                <h1 className="text-xl md:text-3xl font-bold mb-2">Termos de Uso</h1>
                <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                  Conheça os termos e condições para uso do nosso site e serviços
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