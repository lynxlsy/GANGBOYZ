import { redirect } from 'next/navigation'

export default function SignUpPage() {
  // Redirecionar para evitar problemas de build
  redirect('/')
  
  return null
}