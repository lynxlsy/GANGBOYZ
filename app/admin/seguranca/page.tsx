"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Shield, 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  Save,
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react"

export default function SegurancaPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    adminUsername: "admin",
    adminEmail: "admin@gangboyz.com"
  })

  const handleSave = () => {
    // Lógica para salvar configurações de segurança
    console.log("Salvando configurações de segurança:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
      
      {/* Conteúdo Principal */}
      <div className="pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Título */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-red-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-red-400 to-blue-400 bg-clip-text text-transparent">
                Segurança e Login
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Gerencie as configurações de segurança e acesso ao painel administrativo
            </p>
          </div>

          {/* Cards de Configuração */}
          <div className="space-y-8">
            
            {/* Alterar Senha */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:border-red-400/50 hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-3 shadow-lg shadow-red-500/25">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Alterar Senha</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="font-black text-white mb-3 block text-lg">🔒 Senha Atual</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      placeholder="Digite sua senha atual..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="font-black text-white mb-3 block text-lg">🔑 Nova Senha</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      placeholder="Digite sua nova senha..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="font-black text-white mb-3 block text-lg">✅ Confirmar Nova Senha</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirme sua nova senha..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center text-lg"
                >
                  <Save className="h-5 w-5 mr-3" />
                  Alterar Senha
                </Button>
              </div>
            </Card>

            {/* Informações do Admin */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-lg shadow-blue-500/25">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Informações do Administrador</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="font-black text-white mb-3 block text-lg">👤 Nome de Usuário</Label>
                  <Input
                    value={formData.adminUsername}
                    onChange={(e) => setFormData({...formData, adminUsername: e.target.value})}
                    placeholder="Nome de usuário do admin..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
                  />
                </div>

                <div>
                  <Label className="font-black text-white mb-3 block text-lg">📧 Email do Administrador</Label>
                  <Input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                    placeholder="Email do administrador..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-12 text-lg"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center text-lg"
                >
                  <Save className="h-5 w-5 mr-3" />
                  Salvar Informações
                </Button>
              </div>
            </Card>

            {/* Status de Segurança */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:border-green-400/50 hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 shadow-lg shadow-green-500/25">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Status de Segurança</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Sistema protegido com HTTPS</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Senha forte configurada</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Recomendado: Ativar autenticação de dois fatores</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
