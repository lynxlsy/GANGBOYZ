"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/lib/products-context-simple"
import { Button } from "@/components/ui/button"

export default function TestStockUpdatePage() {
  const { products, updateProductStock } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [message, setMessage] = useState<string>("")

  // Filter products that have sizeStock
  const productsWithStock = products.filter(product => 
    product.sizeStock && Object.keys(product.sizeStock).length > 0
  )

  const handleUpdateStock = () => {
    if (!selectedProduct || !selectedSize) {
      setMessage("Por favor, selecione um produto e um tamanho")
      return
    }

    try {
      updateProductStock(selectedProduct, selectedSize, quantity)
      setMessage(`Estoque atualizado com sucesso! ${quantity} unidades removidas do tamanho ${selectedSize}`)
      
      // Reset form
      setSelectedProduct("")
      setSelectedSize("")
      setQuantity(1)
    } catch (error) {
      console.error("Error updating stock:", error)
      setMessage("Erro ao atualizar estoque")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Atualização de Estoque</h1>
        
        {message && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <p className={message.includes("Erro") ? "text-red-400" : "text-green-400"}>
              {message}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Atualizar Estoque</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Produto</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Selecione um produto</option>
                  {productsWithStock.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (ID: {product.id})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedProduct && (
                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Selecione um tamanho</option>
                    {(() => {
                      const product = productsWithStock.find(p => p.id === selectedProduct)
                      return product && product.sizeStock ? 
                        Object.entries(product.sizeStock).map(([size, stock]) => (
                          <option key={size} value={size}>
                            {size} ({stock} unidades)
                          </option>
                        )) : null
                    })()}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <Button
                onClick={handleUpdateStock}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
              >
                Atualizar Estoque
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Produtos com Estoque</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {productsWithStock.map(product => (
                <div key={product.id} className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-400">ID: {product.id}</p>
                  <p className="text-sm text-gray-400">Estoque Total: {product.stock}</p>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Estoque por Tamanho:</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {product.sizeStock && Object.entries(product.sizeStock).map(([size, stock]) => (
                        <div key={size} className="text-xs">
                          <span className="text-gray-400">{size}:</span> 
                          <span className={stock === 0 ? "text-red-400" : "text-green-400"}> {stock}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {product.stock === 0 && (
                    <div className="mt-2 text-xs text-red-400 font-medium">
                      PRODUTO ESGOTADO
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}