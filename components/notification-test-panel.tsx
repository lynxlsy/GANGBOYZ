"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Play, Pause, RotateCcw } from "lucide-react"
import { toast } from "sonner"

export function NotificationTestPanel() {
  const [isRunning, setIsRunning] = useState(false)
  const [testCount, setTestCount] = useState(0)

  // Simular compra de teste
  const simulateTestPurchase = () => {
    const testProducts = [
      { id: "MOL001", name: "Moletom Premium", price: 149.90, category: "Moletons" },
      { id: "CAM002", name: "Camiseta Básica", price: 49.90, category: "Camisetas" },
      { id: "JAC003", name: "Jaqueta Streetwear", price: 299.90, category: "Jaquetas" },
      { id: "CAL004", name: "Calça Jeans", price: 199.90, category: "Calças" },
      { id: "SHO005", name: "Short Esportivo", price: 79.90, category: "Shorts" }
    ]

    const randomProduct = testProducts[Math.floor(Math.random() * testProducts.length)]
    
    // Disparar evento customizado para simular compra
    window.dispatchEvent(new CustomEvent('testPurchase', { 
      detail: {
        productId: randomProduct.id,
        productName: randomProduct.name,
        price: randomProduct.price,
        category: randomProduct.category
      }
    }))
    
    setTestCount(prev => prev + 1)
    toast.success(`Compra simulada: ${randomProduct.name}`)
  }

  // Iniciar simulação automática
  const startAutoSimulation = () => {
    setIsRunning(true)
    const interval = setInterval(() => {
      simulateTestPurchase()
    }, 3000) // A cada 3 segundos

    // Parar após 30 segundos
    setTimeout(() => {
      setIsRunning(false)
      clearInterval(interval)
    }, 30000)
  }

  // Parar simulação
  const stopAutoSimulation = () => {
    setIsRunning(false)
  }

  // Reset contador
  const resetCounter = () => {
    setTestCount(0)
    toast.info("Contador resetado")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Teste de Notificações
        </CardTitle>
        <CardDescription>
          Simule compras para testar o sistema de notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? "Executando" : "Parado"}
            </Badge>
            <span className="text-sm text-gray-600">
              Compras simuladas: {testCount}
            </span>
          </div>
        </div>

        {/* Controles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            onClick={simulateTestPurchase}
            disabled={isRunning}
            className="w-full"
            variant="outline"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Simular 1 Compra
          </Button>

          <Button 
            onClick={isRunning ? stopAutoSimulation : startAutoSimulation}
            className="w-full"
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Parar Auto
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto (30s)
              </>
            )}
          </Button>

          <Button 
            onClick={resetCounter}
            className="w-full"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Instruções */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Como testar:</strong>
          </p>
          <ul className="text-xs text-blue-700 mt-1 space-y-1">
            <li>• Clique em "Simular 1 Compra" para uma compra única</li>
            <li>• Use "Auto (30s)" para simulação contínua</li>
            <li>• As notificações aparecerão na homepage a cada 8s</li>
            <li>• Verifique o console para logs detalhados</li>
          </ul>
        </div>

        {/* Status do Sistema */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-800">
            <strong>Status:</strong> Sistema de notificações ativo
          </p>
          <p className="text-xs text-gray-600 mt-1">
            As notificações aparecem no centro inferior da tela (discretas)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}