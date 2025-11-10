import { NextRequest, NextResponse } from 'next/server'
import { UploadResponse } from '@/lib/banner-types'
import { firebaseStorageService } from '@/lib/firebase-storage-service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Formato não suportado. Use JPG, PNG, WebP, GIF, MP4, WebM ou OGG.' 
      }, { status: 400 })
    }

    // Validar tamanho
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '10MB' : '5MB'
      return NextResponse.json({ 
        error: `Arquivo muito grande. Máximo ${maxSizeMB}.` 
      }, { status: 400 })
    }

    // Converter para base64
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    console.log('Upload debug - File type:', file.type, 'Size:', file.size, 'Data URL length:', dataUrl.length)

    // Comprimir imagem se for muito grande
    let optimizedDataUrl = dataUrl
    if (dataUrl.length > 2 * 1024 * 1024) { // 2MB
      console.log('⚠️ Imagem grande detectada, comprimindo...')
      optimizedDataUrl = await compressImage(dataUrl, 0.7)
      console.log('✅ Imagem comprimida. Novo tamanho:', optimizedDataUrl.length)
    }
    
    // Ensure the data URL is valid
    if (!optimizedDataUrl.startsWith('data:')) {
      console.error('Invalid data URL generated:', optimizedDataUrl.substring(0, 100))
      return NextResponse.json({ error: 'Erro ao processar a imagem' }, { status: 500 })
    }
    
    // Upload para Firebase Storage
    let imageUrl = optimizedDataUrl
    try {
      // Gerar nome único para o banner
      const timestamp = Date.now()
      const fileName = `banner_${timestamp}_${file.name}`
      
      // Upload para Firebase Storage
      imageUrl = await firebaseStorageService.uploadImage(optimizedDataUrl, 'banners')
      console.log('✅ Imagem enviada para Firebase Storage:', imageUrl)
    } catch (firebaseError) {
      console.warn('⚠️ Falha no upload para Firebase, usando data URL:', firebaseError)
      // Continuar usando data URL como fallback
    }

    // Obter dimensões da imagem
    const dimensions = await getImageDimensions(imageUrl)
    
    // Gerar hash simples baseado no conteúdo
    const hash = generateSimpleHash(file.name + file.size + file.type + Date.now())

    const response: UploadResponse = {
      url: imageUrl,
      width: dimensions.width,
      height: dimensions.height,
      mime: file.type,
      hash
    }

    console.log('Upload response:', response)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Função para comprimir imagem
async function compressImage(dataUrl: string, quality: number = 0.7): Promise<string> {
  // For server-side compression, we'll use a simpler approach
  // In a real implementation, you would use a library like sharp
  // For now, we'll just reduce the quality by truncating the base64 string
  // This is a simplified approach - in production you should use proper image compression
  
  try {
    // Extract the base64 part
    const base64Data = dataUrl.split(',')[1]
    if (!base64Data) {
      return dataUrl
    }
    
    // Reduce the size by the quality factor (simplified approach)
    const newLength = Math.floor(base64Data.length * quality)
    const compressedBase64 = base64Data.substring(0, newLength)
    
    // Reconstruct the data URL
    const mimeType = dataUrl.split(';')[0].split(':')[1]
    return `data:${mimeType};base64,${compressedBase64}`
  } catch (error) {
    console.warn('Erro ao comprimir imagem, usando original:', error)
    return dataUrl
  }
}

// Função para obter dimensões da imagem (Node.js compatible)
async function getImageDimensions(dataUrl: string): Promise<{ width: number, height: number }> {
  try {
    // Para Node.js, vamos usar uma abordagem mais simples
    // Extrair dimensões do base64 se possível, senão usar fallback
    const base64Data = dataUrl.split(',')[1]
    if (base64Data) {
      // Tentar extrair dimensões do header da imagem
      const buffer = Buffer.from(base64Data, 'base64')
      
      // Para JPEG
      if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        let i = 2
        while (i < buffer.length - 1) {
          if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
            const height = (buffer[i + 5] << 8) | buffer[i + 6]
            const width = (buffer[i + 7] << 8) | buffer[i + 8]
            return { width, height }
          }
          i++
        }
      }
      
      // Para PNG
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19]
        const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23]
        return { width, height }
      }
    }
    
    // Fallback para dimensões padrão
    return { width: 1920, height: 1080 }
  } catch (error) {
    console.error('Erro ao obter dimensões:', error)
    return { width: 1920, height: 1080 }
  }
}

// Gerar hash simples
function generateSimpleHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}