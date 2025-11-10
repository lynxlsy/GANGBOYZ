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

export default function SobreNosPage() {
  const { isEditMode } = useEditMode()
  
  // Mission section
  const [isEditingMission, setIsEditingMission] = useState(false)
  const [missionContent, setMissionContent] = useState("")
  const [editingMissionContent, setEditingMissionContent] = useState("")
  
  // Vision section
  const [isEditingVision, setIsEditingVision] = useState(false)
  const [visionContent, setVisionContent] = useState("")
  const [editingVisionContent, setEditingVisionContent] = useState("")
  
  // Values section
  const [isEditingValues, setIsEditingValues] = useState(false)
  const [valuesContent, setValuesContent] = useState("")
  const [editingValuesContent, setEditingValuesContent] = useState("")
  
  // History section
  const [isEditingHistory, setIsEditingHistory] = useState(false)
  const [historyContent, setHistoryContent] = useState("")
  const [editingHistoryContent, setEditingHistoryContent] = useState("")
  
  // Load content from localStorage on component mount
  useEffect(() => {
    // Mission content
    const savedMissionContent = getContentById("sobre-nos-missao") || "Nossa missão é revolucionar o streetwear brasileiro, trazendo autenticidade, estilo e qualidade para as ruas. Queremos representar a cultura urbana com roupas que expressem a verdadeira essência da juventude brasileira."
    setMissionContent(savedMissionContent)
    setEditingMissionContent(savedMissionContent)
    
    // Vision content
    const savedVisionContent = getContentById("sobre-nos-visao") || "Ser a marca de referência em streetwear no Brasil, reconhecida pela qualidade dos produtos, autenticidade da marca e impacto positivo na cultura urbana."
    setVisionContent(savedVisionContent)
    setEditingVisionContent(savedVisionContent)
    
    // Values content
    const savedValuesContent = getContentById("sobre-nos-valores") || "• Autenticidade: Valorizamos a verdadeira cultura urbana\n• Qualidade: Comprometidos com materiais e acabamentos excelentes\n• Inovação: Sempre buscando novas tendências e designs\n• Comunidade: Fortalecendo laços com nossa comunidade"
    setValuesContent(savedValuesContent)
    setEditingValuesContent(savedValuesContent)
    
    // History content
    const savedHistoryContent = getContentById("sobre-nos-historia") || "Fundada em 2020 por um grupo de amigos apaixonados pela cultura urbana, a Gang Boyz nasceu nas ruas de São Paulo. Começamos com poucas peças e muito estilo, e hoje somos uma das marcas de streetwear mais reconhecidas do Brasil."
    setHistoryContent(savedHistoryContent)
    setEditingHistoryContent(savedHistoryContent)
  }, [])

  // Mission handlers
  const handleSaveMission = () => {
    updateContentById("sobre-nos-missao", editingMissionContent)
    setMissionContent(editingMissionContent)
    setIsEditingMission(false)
  }

  const handleCancelMission = () => {
    setEditingMissionContent(missionContent)
    setIsEditingMission(false)
  }

  // Vision handlers
  const handleSaveVision = () => {
    updateContentById("sobre-nos-visao", editingVisionContent)
    setVisionContent(editingVisionContent)
    setIsEditingVision(false)
  }

  const handleCancelVision = () => {
    setEditingVisionContent(visionContent)
    setIsEditingVision(false)
  }

  // Values handlers
  const handleSaveValues = () => {
    updateContentById("sobre-nos-valores", editingValuesContent)
    setValuesContent(editingValuesContent)
    setIsEditingValues(false)
  }

  const handleCancelValues = () => {
    setEditingValuesContent(valuesContent)
    setIsEditingValues(false)
  }

  // History handlers
  const handleSaveHistory = () => {
    updateContentById("sobre-nos-historia", editingHistoryContent)
    setHistoryContent(editingHistoryContent)
    setIsEditingHistory(false)
  }

  const handleCancelHistory = () => {
    setEditingHistoryContent(historyContent)
    setIsEditingHistory(false)
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
                <h1 className="text-xl md:text-3xl font-bold mb-2">Sobre a Gang Boyz</h1>
                <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                  A marca de streetwear que representa a cultura urbana brasileira com estilo e autenticidade
                </p>
              </div>
            </div>

            {/* Content Section */}
            {/* Mission Section */}
            <div className="mb-12 md:mb-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Nossa Missão</h2>
                {isEditMode && isEditingMission ? (
                  <div className="mb-6">
                    <Textarea
                      value={editingMissionContent}
                      onChange={(e) => setEditingMissionContent(e.target.value)}
                      className="text-gray-200 text-base md:text-lg leading-relaxed min-h-[120px] md:min-h-[150px] mb-4 bg-gray-700/50 border-gray-600 rounded-lg p-4"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveMission} 
                        className="bg-green-600 hover:bg-green-700 text-sm md:text-base h-8 md:h-10"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={handleCancelMission} 
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
                    onClick={() => setIsEditingMission(true)}
                  >
                    <div className="flex items-start gap-2">
                      <Edit3 className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                      <div className="text-gray-200 text-base md:text-lg leading-relaxed">
                        {missionContent.split('\n').map((line, index) => (
                          <p key={index} className="mb-3 last:mb-0">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-200 text-base md:text-lg leading-relaxed">
                    {missionContent.split('\n').map((line, index) => (
                      <p key={index} className="mb-3 last:mb-0">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Vision Section */}
            <div className="mb-12 md:mb-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Nossa Visão</h2>
                {isEditMode && isEditingVision ? (
                  <div className="mb-6">
                    <Textarea
                      value={editingVisionContent}
                      onChange={(e) => setEditingVisionContent(e.target.value)}
                      className="text-gray-200 text-base md:text-lg leading-relaxed min-h-[120px] md:min-h-[150px] mb-4 bg-gray-700/50 border-gray-600 rounded-lg p-4"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveVision} 
                        className="bg-green-600 hover:bg-green-700 text-sm md:text-base h-8 md:h-10"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={handleCancelVision} 
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
                    onClick={() => setIsEditingVision(true)}
                  >
                    <div className="flex items-start gap-2">
                      <Edit3 className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                      <div className="text-gray-200 text-base md:text-lg leading-relaxed">
                        {visionContent.split('\n').map((line, index) => (
                          <p key={index} className="mb-3 last:mb-0">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-200 text-base md:text-lg leading-relaxed">
                    {visionContent.split('\n').map((line, index) => (
                      <p key={index} className="mb-3 last:mb-0">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Values Section */}
            <div className="mb-12 md:mb-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Nossos Valores</h2>
                {isEditMode && isEditingValues ? (
                  <div className="mb-6">
                    <Textarea
                      value={editingValuesContent}
                      onChange={(e) => setEditingValuesContent(e.target.value)}
                      className="text-gray-200 text-base md:text-lg leading-relaxed min-h-[120px] md:min-h-[150px] mb-4 bg-gray-700/50 border-gray-600 rounded-lg p-4"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveValues} 
                        className="bg-green-600 hover:bg-green-700 text-sm md:text-base h-8 md:h-10"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={handleCancelValues} 
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
                    onClick={() => setIsEditingValues(true)}
                  >
                    <div className="flex items-start gap-2">
                      <Edit3 className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                      <div className="text-gray-200 text-base md:text-lg leading-relaxed whitespace-pre-line">
                        {valuesContent}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-200 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {valuesContent}
                  </div>
                )}
              </div>
            </div>
            
            {/* History Section */}
            <div className="mb-12 md:mb-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Nossa História</h2>
                {isEditMode && isEditingHistory ? (
                  <div className="mb-6">
                    <Textarea
                      value={editingHistoryContent}
                      onChange={(e) => setEditingHistoryContent(e.target.value)}
                      className="text-gray-200 text-base md:text-lg leading-relaxed min-h-[120px] md:min-h-[150px] mb-4 bg-gray-700/50 border-gray-600 rounded-lg p-4"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveHistory} 
                        className="bg-green-600 hover:bg-green-700 text-sm md:text-base h-8 md:h-10"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button 
                        onClick={handleCancelHistory} 
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
                    onClick={() => setIsEditingHistory(true)}
                  >
                    <div className="flex items-start gap-2">
                      <Edit3 className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                      <div className="text-gray-200 text-base md:text-lg leading-relaxed">
                        {historyContent.split('\n').map((line, index) => (
                          <p key={index} className="mb-3 last:mb-0">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-200 text-base md:text-lg leading-relaxed">
                    {historyContent.split('\n').map((line, index) => (
                      <p key={index} className="mb-3 last:mb-0">{line}</p>
                    ))}
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