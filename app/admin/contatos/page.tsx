import { redirect } from 'next/navigation'

export default function ContatosPage() {
  // Redirecionar para evitar problemas de build
  redirect('/')
  
  return null
}