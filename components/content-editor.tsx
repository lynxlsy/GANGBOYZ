"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, X, Edit3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { eventManager } from "@/lib/event-manager"

interface EditableContent {
  id: string
  title: string
  content: string
}

interface ContentEditorProps {
  isOpen: boolean
  onClose: () => void
}

export function ContentEditor({ isOpen, onClose }: ContentEditorProps) {
  const [editableContents, setEditableContents] = useState<EditableContent[]>([
    {
      id: "explore-title",
      title: "Título Explore",
      content: "EXPLORE NA GANG BOYZ"
    },
    {
      id: "explore-categories",
      title: "Categorias Explore",
      content: "Oversized\nEstampas\nLisos\nShorts\nVerão\nInverno"
    },
    {
      id: "offers-title",
      title: "Título Ofertas",
      content: "OFERTAS"
    },
    {
      id: "season-highlights-title",
      title: "Título Destaques da Temporada",
      content: "DESTAQUES DA TEMPORADA"
    },
    {
      id: "season-highlights-description",
      title: "Descrição Destaques da Temporada",
      content: "Explore nossas coleções mais populares e descubra peças únicas que definem o estilo urbano"
    },
    {
      id: "about-title",
      title: "Título Sobre",
      content: "SOBRE A GANG BOYZ"
    },
    {
      id: "about-description",
      title: "Descrição Sobre",
      content: "Mais do que uma loja, uma referência no mercado quando falamos em excelência, trazemos as peças mais exclusivas e sempre estamos por dentro da moda atual para nossos clientes não ficarem para trás. Com +20 mil pedidos enviados, +15 mil clientes atendidos, +1000 envios todo mês, hoje não há dúvida que escolher a Gang Boyz é a escolha certa para seu guarda-roupa."
    },
    {
      id: "about-stats-orders",
      title: "Estatísticas Pedidos",
      content: "+20K\nPedidos Enviados\nMilhares de entregas realizadas"
    },
    {
      id: "about-stats-clients",
      title: "Estatísticas Clientes",
      content: "+15K\nClientes Atendidos\nPessoas que confiam na nossa marca"
    },
    {
      id: "about-stats-monthly",
      title: "Estatísticas Mensais",
      content: "+1K\nEnvios por Mês\nEntregas mensais garantidas"
    },
    {
      id: "mission-title",
      title: "Título Missão",
      content: "NOSSA MISSÃO"
    },
    {
      id: "mission-description",
      title: "Descrição Missão",
      content: "Ser a marca de streetwear mais autêntica do Brasil, representando a cultura urbana com qualidade, estilo e inovação. Queremos que cada peça conte uma história e que nossos clientes se sintam parte de uma comunidade que valoriza a expressão individual através da moda."
    },
    {
      id: "services",
      title: "Serviços",
      content: "ATENDIMENTO\nSegunda à sexta das 9h00 às 17h00\n\nTROCAS E DEVOLUÇÕES\nPrimeira troca é grátis\n\nFRETE\nGrátis acima de R$349\n\nPARCELAMENTO\nEm até 10x sem juros no cartão"
    }
  ])

  useEffect(() => {
    loadEditableContents()
  }, [])

  const loadEditableContents = () => {
    if (typeof window !== 'undefined') {
      const savedContents = localStorage.getItem("gang-boyz-editable-contents")
      if (savedContents) {
        try {
          const parsedContents = JSON.parse(savedContents)
          setEditableContents(parsedContents)
        } catch (error) {
          console.error('Erro ao fazer parse dos conteúdos editáveis:', error)
        }
      }
    }
  }

  const saveEditableContents = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("gang-boyz-editable-contents", JSON.stringify(editableContents))
        // Disparar evento para atualizar outros componentes with throttling
        eventManager.emitThrottled('editableContentsUpdated')
        onClose()
        
        toast({
          title: "Conteúdo atualizado",
          description: "As alterações de conteúdo foram salvas com sucesso."
        })
      } catch (error) {
        console.error('Erro ao salvar conteúdos editáveis:', error)
        
        toast({
          title: "Erro ao salvar conteúdo",
          description: "Ocorreu um erro ao salvar as alterações de conteúdo. Por favor, tente novamente.",
          variant: "destructive"
        })
      }
    }
  }

  const updateContent = (id: string, content: string) => {
    setEditableContents(prev => 
      prev.map(item => 
        item.id === id ? {...item, content} : item
      )
    )
  }

  const getContentById = (id: string) => {
    const item = editableContents.find(item => item.id === id)
    return item ? item.content : ""
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Editor de Conteúdo</span>
            <div className="flex gap-2">
              <Button 
                onClick={saveEditableContents}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {editableContents.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center">
                <Edit3 className="h-4 w-4 mr-2" />
                {item.title}
              </h3>
              <Textarea
                value={item.content}
                onChange={(e) => updateContent(item.id, e.target.value)}
                className="min-h-[120px] w-full"
                placeholder="Digite o conteúdo..."
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            onClick={saveEditableContents}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Todas as Alterações
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}