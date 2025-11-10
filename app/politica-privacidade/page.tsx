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

export default function PoliticaPrivacidadePage() {
  const { isEditMode } = useEditMode()
  
  // Main content
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState("")
  const [editingContent, setEditingContent] = useState("")
  
  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = getContentById("politica-privacidade-content") || `POLÍTICA DE PRIVACIDADE

A Gang Boyz valoriza a privacidade e a proteção dos dados pessoais de seus clientes. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você visita nosso site ou utiliza nossos serviços.

1. INFORMAÇÕES COLETADAS

Coletamos informações pessoais que você nos fornece diretamente, como:
- Nome completo
- Endereço de e-mail
- Número de telefone
- Endereço postal
- Informações de pagamento
- Preferências de produtos

Também coletamos automaticamente informações técnicas, como:
- Endereço IP
- Tipo de navegador
- Páginas visitadas
- Tempo de permanência no site

2. USO DAS INFORMAÇÕES

Utilizamos suas informações para:
- Processar pedidos e entregas
- Personalizar sua experiência de compra
- Enviar comunicações sobre produtos e promoções
- Melhorar nosso site e serviços
- Cumprir obrigações legais

3. COMPARTILHAMENTO DE INFORMAÇÕES

Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros, exceto:
- Prestadores de serviço que nos auxiliam na operação do site
- Empresas de entrega para processar seus pedidos
- Autoridades legais quando exigido por lei

4. SEGURANÇA DE DADOS

Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos tecnologia de criptografia SSL para proteger dados sensíveis durante transmissões.

5. COOKIES E TECNOLOGIAS DE RASTREAMENTO

Utilizamos cookies e tecnologias similares para:
- Melhorar a navegação no site
- Lembrar suas preferências
- Analisar o tráfego do site
- Personalizar conteúdo e anúncios

Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.

6. DIREITOS DO TITULAR

Você tem o direito de:
- Acessar suas informações pessoais
- Corrigir dados incorretos
- Solicitar a exclusão de seus dados
- Revogar consentimentos
- Portabilidade dos dados

7. RETENÇÃO DE DADOS

Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, exceto quando exigido por lei.

8. ALTERAÇÕES NESTA POLÍTICA

Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através do site ou por e-mail.

9. CONTATO

Para dúvidas sobre esta Política de Privacidade, entre em contato conosco:
E-mail: privacidade@gangboyz.com.br
Telefone: (11) 99999-9999`
    
    setContent(savedContent)
    setEditingContent(savedContent)
  }, [])

  const handleSave = () => {
    updateContentById("politica-privacidade-content", editingContent)
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
                <h1 className="text-xl md:text-3xl font-bold mb-2">Política de Privacidade</h1>
                <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                  Conheça como protegemos e utilizamos seus dados pessoais
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