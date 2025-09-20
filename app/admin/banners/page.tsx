"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Globe, Image as ImageIcon, Zap, Layers } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BannersPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)

  const pages = [
    {
      id: "homepage",
      name: "Homepage",
      description: "Banners da página principal",
      icon: Globe,
      available: true
    },
    {
      id: "produtos",
      name: "Banners da Aba de Produtos",
      description: "Banners específicos das páginas de produtos",
      icon: Layers,
      available: true
    }
  ]

  const features = [
    {
      icon: ImageIcon,
      title: "Hero Banner",
      description: "Banner principal da homepage"
    },
    {
      icon: Zap,
      title: "HOT Section",
      description: "Banner da seção em destaque"
    },
    {
      icon: Layers,
      title: "Footer Banner",
      description: "Banner antes do rodapé"
    }
  ]

  if (selectedPage) {
    if (selectedPage === "homepage") {
      window.location.href = "/admin/banners/homepage"
      return null
    }
    if (selectedPage === "produtos") {
      window.location.href = "/admin/banners/produtos"
      return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Minimalist Header */}
        <div className="mb-16">
          <Link href="/admin">
            <div className="inline-flex items-center gap-3 border border-red-500 rounded-lg px-4 py-2 hover:bg-red-500/10 transition-colors duration-200 mb-8">
              <ArrowLeft className="h-4 w-4 text-red-500" />
              <span className="text-white font-medium">Voltar ao Admin</span>
            </div>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-white mb-4">
              Banners
            </h1>
            <p className="text-gray-400 text-lg">
              Gerencie os banners do site
            </p>
          </div>
        </div>

        {/* Minimalist Page Selection */}
        <div className="mb-16">
          {pages.map((page) => {
            const IconComponent = page.icon
            return (
              <div 
                key={page.id} 
                className={`group border border-gray-800 hover:border-red-500 transition-colors duration-200 cursor-pointer rounded-lg ${
                  page.available ? '' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => page.available && setSelectedPage(page.id)}
              >
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors duration-200">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{page.name}</h2>
                    <p className="text-gray-400 text-sm">
                      {page.description}
                    </p>
                  </div>
                  
                  {page.available ? (
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors duration-200">
                      Acessar
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-600 text-gray-400 cursor-not-allowed py-3 rounded-lg">
                      Em Breve
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Minimalist Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Recursos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="border border-gray-800 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Minimalist Info */}
        <div className="border border-gray-800 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-4">Sobre</h3>
          <p className="text-gray-400 mb-6">
            Interface minimalista para gerenciar banners. Suporte a imagens, vídeos e GIFs.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div>• JPG, PNG, WebP (até 10MB)</div>
            <div>• MP4, WebM (até 50MB)</div>
            <div>• GIF animado (até 5MB)</div>
            <div>• SVG vetorial</div>
          </div>
        </div>
      </div>
    </div>
  )
}
