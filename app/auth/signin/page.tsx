import { redirect } from 'next/navigation'

export default function SignInPage() {
  // Redirecionar para evitar problemas de build
  redirect('/')
  
  return null
}