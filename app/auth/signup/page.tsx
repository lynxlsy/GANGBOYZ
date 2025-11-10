"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false) // Modal único de autenticação
  const [isGoogleAuth, setIsGoogleAuth] = useState(false) // Indica se é autenticação Google
  const [authCompleted, setAuthCompleted] = useState(false) // Indica se a autenticação foi concluída
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup } = useAuth()

  // Redirecionar se já estiver logado
  useEffect(() => {
    // Verificar se o usuário já está logado (implementação simplificada)
    const user = localStorage.getItem("gang-boyz-user")
    if (user) {
      router.push("/") // Sempre redirecionar para homepage
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Usar apenas sistema local (demo) - Firebase removido
      const localResult = await signup(email, password, name)
      if (localResult.success) {
        setShowAuthModal(true)
        setIsGoogleAuth(false) // Não é Google auth
        setAuthCompleted(true) // Autenticação concluída
      } else {
        setError(localResult.error || "Erro ao criar conta")
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a conta")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Google auth removido - usando apenas sistema local
      setError("Autenticação Google desativada")
    } catch (err) {
      setError("Ocorreu um erro ao criar conta com Google")
      console.error(err)
      setShowAuthModal(false) // Fechar modal em caso de erro
    } finally {
      setIsLoading(false)
    }
  }

  // Função para lidar com o redirecionamento do modal
  const handleModalRedirect = () => {
    setShowAuthModal(false)
    router.push("/")
    router.refresh()
  }

  // Função para voltar à homepage
  const handleGoToHomepage = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo-gang-boyz-new.svg" 
              alt="Gang BoyZ" 
              className="h-25 w-auto" // Aumentado de h-18 para h-25 (mais 40%)
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">Junte-se ao Gang BoyZ</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Crie sua conta para começar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-400">A senha deve ter pelo menos 6 caracteres</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">Ou continue com</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-400">
            Já tem uma conta?{" "}
            <Link href="/auth/signin" className="text-white hover:underline">
              Entrar
            </Link>
          </div>
          
          <div className="text-xs text-center text-gray-500">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link href="/termos" className="text-gray-400 hover:underline">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-gray-400 hover:underline">
              Política de Privacidade
            </Link>
          </div>
          
          {/* Botão para voltar à homepage */}
          <Button 
            variant="outline" 
            className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            onClick={handleGoToHomepage}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Homepage
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de Autenticação Unificado */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              {isGoogleAuth && !authCompleted ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 mb-4">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Processando Autenticação</h3>
                  <div className="text-gray-300 text-sm mb-4">
                    <p className="mb-2">A janela de autenticação do Google foi aberta.</p>
                    <p className="mb-2">Após autenticar sua conta, volte para a tela inicial do site.</p>
                    <p className="text-yellow-400 text-xs italic mb-2">Atenção: Pode ocorrer um erro onde a página atual não atualiza automaticamente. Se isso acontecer, será necessário reentrar no site da GANG.</p>
                    <p className="text-yellow-400 text-xs italic">Em dispositivos móveis, se o popup for bloqueado pelo navegador, tente desbloquear popups nas configurações do navegador ou toque e segure o botão do Google até aparecer a opção para abrir em uma nova aba.</p>
                  </div>
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10 mb-4">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Autenticação Concluída!</h3>
                  <div className="text-gray-300 text-sm mb-4">
                    <p className="mb-2">Se seu login foi bem sucedido e não apareceu mensagem de erro, considere que já está tudo ok.</p>
                    <p className="mb-2">Após autenticar sua conta, volte para a tela inicial do site:</p>
                    <p className="text-yellow-400 text-xs italic">Atenção: Pode ocorrer um erro onde a página atual não atualiza automaticamente. Se isso acontecer, será necessário reentrar no site da GANG.</p>
                  </div>
                  <Button 
                    onClick={handleModalRedirect}
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    Voltar para a Homepage
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}