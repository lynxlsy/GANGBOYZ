"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ProductInfo {
  // Shipping Information
  freeShippingText: string
  freeShippingThreshold: string
  pickupText: string
  pickupStatus: string
  
  // Technical Information
  material: string
  weight: string
  dimensions: string
  origin: string
  care: string
  warranty: string
}

export function ProductInfoEditor() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    // Shipping Information
    freeShippingText: "Frete Grátis",
    freeShippingThreshold: "Acima de R$ 200",
    pickupText: "Retire na Loja",
    pickupStatus: "Disponível",
    
    // Technical Information
    material: "100% Algodão",
    weight: "300g",
    dimensions: "70cm x 50cm",
    origin: "Brasil",
    care: "Lavar à mão, não alvejar",
    warranty: "90 dias contra defeitos"
  })

  // Load saved product info from localStorage
  useEffect(() => {
    const savedInfo = localStorage.getItem('gang-boyz-product-info')
    if (savedInfo) {
      try {
        setProductInfo(JSON.parse(savedInfo))
      } catch (error) {
        console.error("Failed to parse product info from localStorage:", error)
      }
    }
  }, [])

  // Save product info to localStorage
  const saveProductInfo = () => {
    try {
      localStorage.setItem('gang-boyz-product-info', JSON.stringify(productInfo))
      toast.success("Informações salvas com sucesso!")
    } catch (error) {
      console.error("Failed to save product info to localStorage:", error)
      toast.error("Erro ao salvar informações")
    }
  }

  const handleInputChange = (field: keyof ProductInfo, value: string) => {
    setProductInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Editar Informações do Produto
          </h2>
          <p className="text-gray-400">
            Configure as informações que aparecem nos detalhes do produto
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Informações de Envio</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Texto do Frete Grátis
                  </label>
                  <input
                    type="text"
                    value={productInfo.freeShippingText}
                    onChange={(e) => handleInputChange('freeShippingText', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Valor Mínimo para Frete Grátis
                  </label>
                  <input
                    type="text"
                    value={productInfo.freeShippingThreshold}
                    onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Texto de Retirada na Loja
                  </label>
                  <input
                    type="text"
                    value={productInfo.pickupText}
                    onChange={(e) => handleInputChange('pickupText', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Status da Retirada
                  </label>
                  <input
                    type="text"
                    value={productInfo.pickupStatus}
                    onChange={(e) => handleInputChange('pickupStatus', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Technical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Informações Técnicas</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={productInfo.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Peso
                  </label>
                  <input
                    type="text"
                    value={productInfo.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Dimensões
                  </label>
                  <input
                    type="text"
                    value={productInfo.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Origem
                  </label>
                  <input
                    type="text"
                    value={productInfo.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cuidados
                  </label>
                  <input
                    type="text"
                    value={productInfo.care}
                    onChange={(e) => handleInputChange('care', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Garantia
                  </label>
                  <input
                    type="text"
                    value={productInfo.warranty}
                    onChange={(e) => handleInputChange('warranty', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={saveProductInfo}
              className="bg-red-600 hover:bg-red-700"
            >
              Salvar Informações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}