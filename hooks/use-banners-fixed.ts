import useSWR from 'swr'
import { Banner, BannerUpdatePayload, UploadResponse } from '@/lib/banner-types'

// Fetcher para SWR
const fetcher = (url: string) => fetch(url).then(res => res.json())

// Hook para buscar múltiplos banners
export function useBanners(ids: string[]) {
  const { data, error, mutate } = useSWR<Banner[]>(
    `/api/banners?ids=${ids.join(',')}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 1000, // 1 segundo
    }
  )

  return {
    banners: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

// Hook para buscar um banner específico
export function useBanner(id: string) {
  const { data, error, mutate } = useSWR<Banner>(
    `/api/banners/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 1000, // 1 segundo
    }
  )

  return {
    banner: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

// Função para fazer upload de arquivo
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/uploads', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro no upload')
  }

  return response.json()
}

// Função para atualizar banner
export async function updateBanner(id: string, payload: BannerUpdatePayload): Promise<Banner> {
  const response = await fetch(`/api/banners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Erro ao atualizar banner')
  }

  return response.json()
}

// BroadcastChannel para sincronização em tempo real - versão simplificada
export class BannerBroadcastChannel {
  private channel: BroadcastChannel | null = null

  constructor() {
    // Verificar se estamos no browser e BroadcastChannel está disponível
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('banner:updated')
      } catch (error) {
        console.warn('BroadcastChannel não disponível:', error)
        this.channel = null
      }
    } else {
      console.warn('BroadcastChannel não suportado neste ambiente')
      this.channel = null
    }
  }

  // Enviar notificação de atualização
  broadcast(id: string, version: number) {
    if (this.channel) {
      try {
        this.channel.postMessage({ id, version })
      } catch (error) {
        console.warn('Erro ao enviar mensagem:', error)
      }
    }
  }

  // Escutar atualizações
  onUpdate(callback: (id: string, version: number) => void) {
    if (!this.channel) {
      // Retornar função vazia se não há channel
      return () => {}
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const { id, version } = event.data
        callback(id, version)
      } catch (error) {
        console.warn('Erro ao processar mensagem:', error)
      }
    }

    this.channel.addEventListener('message', handleMessage)

    // Retornar função de cleanup
    return () => {
      if (this.channel) {
        this.channel.removeEventListener('message', handleMessage)
      }
    }
  }

  // Fechar canal
  close() {
    if (this.channel) {
      try {
        this.channel.close()
      } catch (error) {
        console.warn('Erro ao fechar canal:', error)
      }
    }
  }
}

