import { redirect } from 'next/navigation'

export default function BuscaPage() {
  // Redirecionar para evitar problemas de build
  redirect('/')
  
  return null
}