"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useProducts } from "@/lib/products-context-simple"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart()
  const { products, updateProductStock } = useProducts()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate total price
  const totalPrice = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Calculate total items
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0)

  // Handle checkout completion
  const handleCompleteCheckout = () => {
    if (cartState.items.length === 0) {
      toast.error("Seu carrinho está vazio")
      return
    }

    setIsProcessing(true)
    
    try {
      // Update stock for each purchased item
      cartState.items.forEach(item => {
        // For each item, we need to know which size was purchased
        // In a real implementation, this would come from the cart item
        const size = item.size || "único"
        updateProductStock(String(item.id), size, item.quantity)
      })

      // Clear the cart
      clearCart()
      
      // Show success message
      toast.success("Compra realizada com sucesso! O estoque foi atualizado.")
      
      // Redirect to success page or home
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error processing checkout:", error)
      toast.error("Erro ao processar a compra. Por favor, tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/")
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-400 mb-6">Adicione alguns produtos antes de finalizar a compra.</p>
          <Button 
            onClick={handleContinueShopping}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Continuar Comprando
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-700 pb-4">
                  <img 
                    src={item.image || "/placeholder-default.svg"} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">Tamanho: {item.size || "único"}</p>
                    <p className="text-gray-400 text-sm">Quantidade: {item.quantity}</p>
                    <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Frete</span>
                <span className="text-green-500">Grátis</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-gray-700">
                <span>Total</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Informações de Pagamento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Digite seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
                <textarea 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Digite seu endereço completo"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Método de Pagamento</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option>Cartão de Crédito</option>
                  <option>Cartão de Débito</option>
                  <option>PIX</option>
                  <option>Boleto Bancário</option>
                </select>
              </div>
              
              <div className="pt-6">
                <Button
                  onClick={handleCompleteCheckout}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isProcessing ? "Processando..." : `Finalizar Compra (R$ ${totalPrice.toFixed(2).replace(".", ",")})`}
                </Button>
                
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full mt-4 border border-gray-600 text-white hover:bg-gray-800 py-3 rounded-lg"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}