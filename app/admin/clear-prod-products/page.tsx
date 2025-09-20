"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ClearProdProductsPage() {
  const [isClearing, setIsClearing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const clearProdProducts = async () => {
    setIsClearing(true)
    
    try {
      // Lista de chaves do localStorage que podem conter esses produtos
      const localStorageKeys = [
        "gang-boyz-products",
        "gang-boyz-card-products", 
        "gang-boyz-categories",
        "gang-boyz-hot-products",
        "gang-boyz-standalone-products",
        "gang-boyz-test-products"
      ]
      
      // IDs dos produtos a serem removidos
      const productsToRemove = ["PROD001", "PROD002", "PROD003", "PROD004", "PROD005"]
      
      let totalRemoved = 0
      
      localStorageKeys.forEach(key => {
        const data = localStorage.getItem(key)
        if (data) {
          try {
            const parsed = JSON.parse(data)
            let updated = false
            
            // Se for um array de produtos
            if (Array.isArray(parsed)) {
              const filtered = parsed.filter(product => !productsToRemove.includes(product.id))
              if (filtered.length !== parsed.length) {
                localStorage.setItem(key, JSON.stringify(filtered))
                totalRemoved += parsed.length - filtered.length
                updated = true
              }
            }
            
            // Se for um objeto com produtos dentro
            if (parsed.products && Array.isArray(parsed.products)) {
              const filtered = parsed.products.filter(product => !productsToRemove.includes(product.id))
              if (filtered.length !== parsed.products.length) {
                parsed.products = filtered
                localStorage.setItem(key, JSON.stringify(parsed))
                totalRemoved += parsed.products.length - filtered.length
                updated = true
              }
            }
            
            // Se for um array de categorias com produtos
            if (Array.isArray(parsed) && parsed.some(item => item.products)) {
              parsed.forEach(category => {
                if (category.products && Array.isArray(category.products)) {
                  const filtered = category.products.filter(product => !productsToRemove.includes(product.id))
                  if (filtered.length !== category.products.length) {
                    category.products = filtered
                    localStorage.setItem(key, JSON.stringify(parsed))
                    totalRemoved += category.products.length - filtered.length
                    updated = true
                  }
                }
              })
            }
            
          } catch (error) {
            console.error(`Erro ao processar ${key}:`, error)
          }
        }
      })
      
      // Disparar eventos para atualizar as seções
      window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
      window.dispatchEvent(new CustomEvent('productsUpdated'))
      window.dispatchEvent(new CustomEvent('cardsUpdated'))
      
      setIsComplete(true)
      toast.success(`${totalRemoved} produtos PROD001-PROD005 removidos com sucesso!`)
      
    } catch (error) {
      console.error("Erro ao limpar produtos:", error)
      toast.error("Erro ao limpar produtos")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 hover:border-red-400/50 hover:bg-white/20 transition-all duration-500">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-1.5 shadow-lg shadow-red-500/25">
                  <ArrowLeft className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">Voltar ao Admin</span>
              </div>
            </div>
          </Link>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">Limpeza de Produtos</h1>
            <p className="text-gray-300">Remover produtos PROD001-PROD005 do localStorage</p>
          </div>
        </div>

        {/* Card Principal */}
        <Card className="p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-10 w-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Remover Produtos PROD001-PROD005</h2>
              <p className="text-gray-400 mb-6">
                Este script irá remover os seguintes produtos de todos os localStorage:
              </p>
            </div>

            {/* Lista de Produtos */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold">• Jaqueta Bomber Premium (PROD001)</div>
                  <div className="text-red-400 font-semibold">• Jaqueta Oversized Street (PROD002)</div>
                  <div className="text-red-400 font-semibold">• Moletom Hoodie Gang (PROD003)</div>
                </div>
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold">• Camiseta Graphic Neon (PROD004)</div>
                  <div className="text-red-400 font-semibold">• Calça Cargo Street (PROD005)</div>
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            {!isComplete ? (
              <Button
                onClick={clearProdProducts}
                disabled={isClearing}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isClearing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Removendo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5 mr-2" />
                    Remover Produtos
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Limpeza Concluída!</h3>
                <p className="text-gray-400 mb-4">
                  Os produtos PROD001-PROD005 foram removidos do localStorage.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  Recarregar Página
                </Button>
              </div>
            )}

            {/* Aviso */}
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>⚠️ Aviso:</strong> Esta ação é irreversível. Os produtos serão removidos permanentemente do localStorage.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
