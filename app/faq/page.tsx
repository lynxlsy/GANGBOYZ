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

export default function FAQPage() {
  const { isEditMode } = useEditMode()
  
  // Main content
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState("")
  const [editingContent, setEditingContent] = useState("")
  
  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = getContentById("faq-content") || `PERGUNTAS FREQUENTES

1. COMO FAÇO PARA REALIZAR UMA COMPRA?

Para realizar uma compra, basta navegar pelo nosso site, selecionar os produtos desejados, adicioná-los ao carrinho e seguir o processo de checkout. Você precisará criar uma conta ou fazer login para finalizar a compra.

2. QUAIS SÃO AS FORMAS DE PAGAMENTO ACEITAS?

Aceitamos as seguintes formas de pagamento:
- Cartões de crédito (Visa, Mastercard, American Express, Elo, Hipercard)
- Boleto bancário
- PIX

3. QUAL O PRAZO PARA ENTREGA?

O prazo de entrega varia de acordo com a região e o tipo de frete selecionado:
- Frete Expresso: 1-3 dias úteis
- Frete Padrão: 3-7 dias úteis
- Frete Econômico: 7-15 dias úteis

4. POSSO TROCAR OU DEVOLVER UM PRODUTO?

Sim, oferecemos trocas e devoluções dentro do prazo de 30 dias após o recebimento do produto, desde que esteja em perfeitas condições, com etiquetas e embalagem original. A primeira troca é gratuita.

5. OS PRODUTOS POSSUEM GARANTIA?

Todos os nossos produtos possuem garantia de fabricação contra defeitos de material e acabamento. O prazo de garantia varia de acordo com o tipo de produto.

6. COMO ACOMPANHO MEU PEDIDO?

Após a confirmação do pagamento, você receberá um e-mail com o código de rastreio do seu pedido. Também é possível acompanhar o status do pedido na seção "Meus Pedidos" da sua conta.

7. OS PRODUTOS SÃO AUTÊNTICOS?

Sim, todos os produtos comercializados pela Gang Boyz são originais e autênticos. Trabalhamos diretamente com marcas e fornecedores autorizados.

8. QUAL O TAMANHO DOS PRODUTOS?

Disponibilizamos tabelas de medidas detalhadas para cada produto. Recomendamos verificar as medidas antes de realizar a compra. Em caso de dúvidas, entre em contato com nosso atendimento.

9. É POSSÍVEL ALTERAR OU CANCELAR MEU PEDIDO?

Pedidos podem ser alterados ou cancelados antes do envio. Após o envio, segue o processo normal de troca ou devolução. Entre em contato com nosso atendimento o quanto antes para solicitar alterações.

10. COMO ENTRO EM CONTATO COM O ATENDIMENTO AO CLIENTE?

Você pode entrar em contato conosco através dos seguintes canais:
- E-mail: contato@gangboyz.com.br
- WhatsApp: (11) 99999-9999
- Telefone: (11) 99999-9999
- Formulário de contato no site

Horário de atendimento: Segunda a Sexta, das 9h às 18h.`
    
    setContent(savedContent)
    setEditingContent(savedContent)
  }, [])

  const handleSave = () => {
    updateContentById("faq-content", editingContent)
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
                <h1 className="text-xl md:text-3xl font-bold mb-2">Perguntas Frequentes</h1>
                <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                  Tire suas dúvidas sobre nossos produtos e serviços
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