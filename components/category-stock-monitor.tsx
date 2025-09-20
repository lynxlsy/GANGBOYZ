"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, ShoppingCart } from "lucide-react"
import { useProducts } from "@/lib/products-context-simple"

interface CategoryStockMonitorProps {
  category: string
}

export function CategoryStockMonitor({ category }: CategoryStockMonitorProps) {
  const { products, getActiveProductsByCategory } = useProducts()
  const [stockData, setStockData] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    products: [] as any[]
  })

  useEffect(() => {
    const categoryProducts = products.filter(p => p.categories.includes(category))

    const totalStock = categoryProducts.reduce((sum, product) => sum + (product.stock || 0), 0)
    const lowStockProducts = categoryProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length
    const outOfStockProducts = categoryProducts.filter(p => (p.stock || 0) === 0).length

    setStockData({
      totalProducts: categoryProducts.length,
      totalStock,
      lowStockProducts,
      outOfStockProducts,
      products: categoryProducts
    })
  }, [products, category])

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: "Esgotado", color: "destructive", icon: AlertTriangle }
    if (stock <= 10) return { status: "Estoque Baixo", color: "secondary", icon: TrendingDown }
    return { status: "Em Estoque", color: "default", icon: CheckCircle }
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stockData.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total em Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stockData.totalStock}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stockData.lowStockProducts}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Esgotados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stockData.outOfStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Área de Saídas (Pendente) */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Controle de Saídas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Sistema de controle de saídas</p>
            <p className="text-sm text-gray-500">Será integrado automaticamente quando o sistema de pagamentos for configurado</p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card className="bg-black/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Produtos e Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          {stockData.products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum produto encontrado nesta categoria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stockData.products.map((product) => {
                const stockStatus = getStockStatus(product.stock || 0)
                const StatusIcon = stockStatus.icon
                
                return (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.color} • {product.sizes?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{product.stock || 0}</div>
                        <div className="text-xs text-gray-400">unidades</div>
                      </div>
                      
                      <Badge 
                        variant={stockStatus.color as any}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {stockStatus.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
