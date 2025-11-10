"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { loadEditableContents, updateContentById } from "@/lib/editable-content-utils"
import { toast } from "@/hooks/use-toast"

interface EditableContent {
  id: string
  title: string
  content: string
}

export default function TestEditableContent() {
  const [contents, setContents] = useState<EditableContent[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadContents()
    
    const handleStorageChange = () => {
      loadContents()
    }
    
    window.addEventListener('editableContentsUpdated', handleStorageChange)
    return () => window.removeEventListener('editableContentsUpdated', handleStorageChange)
  }, [])

  const loadContents = async () => {
    try {
      const loadedContents = await loadEditableContents()
      setContents(loadedContents)
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error)
      toast({
        title: "Erro ao carregar conteúdo",
        description: "Ocorreu um erro ao carregar os conteúdos editáveis. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }

  const updateContent = async (id: string, content: string) => {
    try {
      await updateContentById(id, content)
      await loadContents()
      
      toast({
        title: "Conteúdo atualizado",
        description: "O conteúdo foi atualizado com sucesso."
      })
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error)
      toast({
        title: "Erro ao atualizar conteúdo",
        description: "Ocorreu um erro ao salvar o conteúdo. Por favor, tente novamente.",
        variant: "destructive"
      })
    }
  }

  if (!isClient) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Teste de Conteúdos Editáveis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contents.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">{item.title}</h2>
              <Textarea
                value={item.content}
                onChange={(e) => updateContent(item.id, e.target.value)}
                className="min-h-[150px] w-full mb-4"
              />
              <Button 
                onClick={() => updateContent(item.id, item.content)}
                className="w-full"
              >
                Salvar
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={async () => {
              try {
                localStorage.removeItem("gang-boyz-editable-contents")
                await loadContents()
                
                toast({
                  title: "Conteúdos resetados",
                  description: "Os conteúdos foram resetados para os valores padrão."
                })
              } catch (error) {
                console.error('Erro ao resetar conteúdos:', error)
                toast({
                  title: "Erro ao resetar conteúdos",
                  description: "Ocorreu um erro ao resetar os conteúdos. Por favor, tente novamente.",
                  variant: "destructive"
                })
              }
            }}
            variant="destructive"
          >
            Resetar Conteúdos
          </Button>
        </div>
      </div>
    </div>
  )
}