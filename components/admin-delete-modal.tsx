"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface AdminDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
}

export function AdminDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName 
}: AdminDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-8 w-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Excluir Produto
          </h2>
          
          <p className="text-gray-300 mb-6">
            Tem certeza que deseja excluir o produto <strong>"{productName}"</strong>?
            <br />
            <span className="text-red-400 text-sm">Esta ação não pode ser desfeita!</span>
            <br />
            <span className="text-yellow-400 text-sm font-semibold">⚠️ Ao excluir, favor recarregue a página</span>
          </p>
          
          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}






