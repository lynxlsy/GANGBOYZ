"use client"

import { ArrowLeft, Plus, Package, DollarSign, Tag, Eye } from "lucide-react"
import Link from "next/link"
import { CategoryStockMonitor } from "@/components/category-stock-monitor"

export default function ShortsBermudasAdminPage() {
  const subcategories = [
    {
      name: "Esportivo",
      href: "/admin/shorts-bermudas/esportivo",
      description: "Shorts e bermudas esportivas",
      productCount: 10,
      stock: 55
    },
    {
      name: "Casual",
      href: "/admin/shorts-bermudas/casual", 
      description: "Shorts e bermudas casuais",
      productCount: 8,
      stock: 38
    },
    {
      name: "Praia",
      href: "/admin/shorts-bermudas/praia",
      description: "Shorts e bermudas para praia",
      productCount: 6,
      stock: 25
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white -mt-20 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <div className="inline-flex items-center gap-3 border border-red-500 rounded-lg px-4 py-2 hover:bg-red-500/10 transition-colors duration-200 mb-6">
              <ArrowLeft className="h-4 w-4 text-red-500" />
              <span className="text-white font-medium">Voltar ao Admin</span>
            </div>
          </Link>
          
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Gerenciar Shorts/Bermudas
            </h1>
            <p className="text-gray-400 text-lg">
              Escolha uma categoria de short/bermuda para gerenciar os produtos
            </p>
          </div>
        </div>

        {/* Monitoramento de Estoque */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Monitoramento de Estoque</h2>
          <CategoryStockMonitor category="Shorts/Bermudas" />
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <Link key={subcategory.name} href={subcategory.href}>
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                    <Package className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                      {subcategory.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {subcategory.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Produtos</span>
                    <span className="text-white font-bold">{subcategory.productCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Estoque Total</span>
                    <span className="text-green-400 font-bold">{subcategory.stock}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Gerenciar</span>
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                      <Plus className="h-3 w-3 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-bold text-white">Total de Produtos</h3>
            </div>
            <p className="text-3xl font-black text-white">
              {subcategories.reduce((acc, sub) => acc + sub.productCount, 0)}
            </p>
          </div>
          
          <div className="border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-bold text-white">Categorias</h3>
            </div>
            <p className="text-3xl font-black text-white">{subcategories.length}</p>
          </div>
          
          <div className="border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-bold text-white">Estoque Total</h3>
            </div>
            <p className="text-3xl font-black text-white">
              {subcategories.reduce((acc, sub) => acc + sub.stock, 0)}
            </p>
          </div>
          
          <div className="border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-bold text-white">Média por Categoria</h3>
            </div>
            <p className="text-3xl font-black text-white">
              {Math.round(subcategories.reduce((acc, sub) => acc + sub.productCount, 0) / subcategories.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}