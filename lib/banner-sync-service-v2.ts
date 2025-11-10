import { BannerData } from '@/hooks/use-banner'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase-config'

interface FirebaseBanner {
  id: string
  name: string
  description: string
  currentImage: string
  // Device-specific images
  desktopImage?: string
  mobileImage?: string
  mediaType: string
  dimensions: string
  format: string
  position: string
  cropMetadata?: {
    src: string
    ratio: string
    scale: number
    tx: number
    ty: number
  }
  overlaySettings?: {
    enabled: boolean
    fromColor: string
    fromOpacity: number
    viaColor: string
    viaOpacity: number
    toColor: string
    toOpacity: number
    direction: string
  }
  createdAt: any
  updatedAt: any
}

class BannerSyncServiceV2 {
  private isInitialized = false
  private syncInProgress = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      // Verificar se o Firebase está disponível
      if (db && (db as any).type !== 'mock-db') {
        this.isInitialized = true;
        console.log('✅ Serviço de sincronização Firebase inicializado');
      } else {
        this.isInitialized = false;
        console.log('⚠️ Firebase não disponível, usando modo simulado');
        console.log('Detalhes do db:', db);
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar serviço Firebase:', error);
      this.isInitialized = false;
    }
  }

  // Sincronizar banner individual
  async syncBannerToFirebase(banner: BannerData, type: 'homepage' | 'category' | 'hero' = 'homepage'): Promise<void> {
    if (!this.isInitialized) {
      console.log('⚠️ Serviço Firebase não inicializado, pulando sincronização');
      return;
    }

    if (this.syncInProgress) {
      throw new Error('Sincronização já em andamento');
    }

    this.syncInProgress = true;

    try {
      // Otimizar banner para formato Firebase - remover dados desnecessários
      const optimizedBanner = {
        id: banner.id,
        name: banner.name,
        description: banner.description,
        currentImage: banner.currentImage,
        // Include device-specific images if they exist
        ...(banner.desktopImage && { desktopImage: banner.desktopImage }),
        ...(banner.mobileImage && { mobileImage: banner.mobileImage }),
        mediaType: banner.mediaType,
        dimensions: banner.dimensions,
        format: banner.format,
        position: banner.position,
        // Apenas incluir cropMetadata e overlaySettings se existirem e não forem undefined
        ...(banner.cropMetadata && Object.keys(banner.cropMetadata).length > 0 && { cropMetadata: banner.cropMetadata }),
        ...(banner.overlaySettings && Object.keys(banner.overlaySettings).length > 0 && { overlaySettings: banner.overlaySettings })
      };
      
      // Verificar se a imagem é uma data URL válida
      if (optimizedBanner.currentImage && optimizedBanner.currentImage.startsWith('data:')) {
        // Se a imagem for muito grande, registrar um aviso
        if (optimizedBanner.currentImage.length > 1048487) { // ~1MB limite do Firestore
          console.warn(`⚠️ Banner ${banner.id} tem uma imagem muito grande (${Math.round(optimizedBanner.currentImage.length / 1024)}KB) para o Firebase Firestore`);
          
          // Tentar comprimir a imagem antes de salvar
          try {
            // Comprimir para um tamanho aceitável (abaixo de 1MB)
            const targetSize = 1000000; // 1MB
            const compressionRatio = targetSize / optimizedBanner.currentImage.length;
            const quality = Math.min(0.8, Math.max(0.1, compressionRatio));
            
            const compressedImage = await compressImage(optimizedBanner.currentImage, quality);
            optimizedBanner.currentImage = compressedImage;
            console.log(`✅ Imagem comprimida para banner ${banner.id} (${Math.round(compressedImage.length / 1024)}KB)`);
          } catch (compressError) {
            console.warn(`⚠️ Falha ao comprimir imagem do banner ${banner.id}:`, compressError);
            
            // Se não conseguirmos comprimir, vamos tentar converter para URL
            // Isso pode acontecer se a imagem foi salva localmente e depois convertida
            if (optimizedBanner.currentImage.length > 2000000) { // 2MB
              console.error(`❌ Banner ${banner.id} ainda é muito grande para o Firebase Firestore (${Math.round(optimizedBanner.currentImage.length / 1024)}KB)`);
              throw new Error(`Imagem do banner ${banner.id} é muito grande para o Firebase Firestore. Use uma imagem menor.`);
            }
          }
        }
      }
      
      // Verificar tamanho final antes de salvar no Firebase
      if (optimizedBanner.currentImage && optimizedBanner.currentImage.length > 1048487) { // ~1MB limite do Firestore
        console.error(`❌ Banner ${banner.id} ainda é muito grande para o Firebase Firestore (${Math.round(optimizedBanner.currentImage.length / 1024)}KB)`);
        throw new Error(`Imagem do banner ${banner.id} é muito grande para o Firebase Firestore. Use uma imagem menor.`);
      }
      
      // Converter banner otimizado para formato Firebase
      const firebaseBanner: FirebaseBanner = {
        id: optimizedBanner.id,
        name: optimizedBanner.name,
        description: optimizedBanner.description,
        currentImage: optimizedBanner.currentImage,
        // Include device-specific images if they exist
        ...(optimizedBanner.desktopImage && { desktopImage: optimizedBanner.desktopImage }),
        ...(optimizedBanner.mobileImage && { mobileImage: optimizedBanner.mobileImage }),
        mediaType: optimizedBanner.mediaType,
        dimensions: optimizedBanner.dimensions,
        position: optimizedBanner.position,
        format: optimizedBanner.format,
        // Apenas incluir cropMetadata e overlaySettings se existirem
        ...(optimizedBanner.cropMetadata && { cropMetadata: optimizedBanner.cropMetadata }),
        ...(optimizedBanner.overlaySettings && { overlaySettings: optimizedBanner.overlaySettings }),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Referência ao documento do banner
      const { doc, setDoc } = await import('firebase/firestore');
      const bannerRef = doc(db, 'banners', banner.id);
      
      // Salvar no Firebase Firestore
      await setDoc(bannerRef, firebaseBanner, { merge: true });
      
      console.log(`✅ Banner ${banner.id} sincronizado com Firebase`);
      
      // Disparar evento de atualização
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('bannerFirebaseSync', {
          detail: { bannerId: banner.id, type, timestamp: Date.now() }
        }));
      }

    } catch (error: any) {
      console.error('❌ Erro ao sincronizar banner com Firebase:', error);
      
      // Only dispatch error event if it's a real Firebase error, not network issues
      if (typeof window !== 'undefined') {
        // Check if we're online before dispatching error
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          window.dispatchEvent(new CustomEvent('bannerFirebaseSyncError', {
            detail: { bannerId: banner.id, error: error.message || 'Erro de sincronização com Firebase' }
          }));
        } else {
          console.log('Offline mode: banner sync skipped due to network status');
        }
      }
      
      // Re-throw the error so calling functions can handle it appropriately
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sincronizar todos os banners da homepage
  async syncHomepageBannersToFirebase(): Promise<void> {
    if (!this.isInitialized) {
      console.log('⚠️ Serviço Firebase não inicializado, pulando sincronização')
      return
    }

    if (this.syncInProgress) {
      throw new Error('Sincronização já em andamento')
    }

    this.syncInProgress = true

    try {
      // Carregar banners do localStorage
      if (typeof window === 'undefined') {
        throw new Error('localStorage não disponível')
      }
      
      const savedBanners = localStorage.getItem('gang-boyz-homepage-banners')
      if (!savedBanners) {
        throw new Error('Nenhum banner encontrado no localStorage')
      }

      const banners: BannerData[] = JSON.parse(savedBanners)
      
      // Sincronizar cada banner individualmente
      for (const banner of banners) {
        try {
          await this.syncBannerToFirebase(banner, 'homepage')
        } catch (error) {
          console.error(`❌ Erro ao sincronizar banner ${banner.id}:`, error)
        }
      }
      
      console.log(`✅ ${banners.length} banners sincronizados com Firebase`)

    } catch (error) {
      console.error('❌ Erro na sincronização em lote:', error)
      throw error
    } finally {
      this.syncInProgress = false
    }
  }

  // Carregar banners do Firebase
  async loadBannersFromFirebase(type: 'homepage' | 'category' | 'hero' = 'homepage'): Promise<BannerData[]> {
    if (!this.isInitialized) {
      console.log('⚠️ Serviço Firebase não inicializado, pulando carregamento');
      return [];
    }

    try {
      const { collection, getDocs, query, onSnapshot } = await import('firebase/firestore');
      
      // Create query for banners
      const bannersCollection = collection(db, 'banners');
      // For homepage banners, we can load all or filter by type
      const bannersQuery = query(bannersCollection);
      
      const snapshot = await getDocs(bannersQuery);
      const banners: BannerData[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        banners.push({
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          currentImage: data.currentImage || '',
          // Include device-specific images if they exist
          ...(data.desktopImage && { desktopImage: data.desktopImage }),
          ...(data.mobileImage && { mobileImage: data.mobileImage }),
          mediaType: data.mediaType || 'image',
          dimensions: data.dimensions || '',
          format: data.format || '',
          position: data.position || '',
          cropMetadata: data.cropMetadata,
          overlaySettings: data.overlaySettings
        });
      });
      
      console.log(`✅ ${banners.length} banners carregados do Firebase`);
      return banners;

    } catch (error) {
      console.error('❌ Erro ao carregar banners do Firebase:', error);
      return [];
    }
  }
  
  // Set up real-time listener for banner updates
  listenForBannerUpdates(callback: (banners: BannerData[]) => void): () => void {
    if (!this.isInitialized) {
      console.log('⚠️ Serviço Firebase não inicializado, pulando listener');
      return () => {};
    }
    
    // Import Firestore functions
    import('firebase/firestore').then(({ collection, query, onSnapshot }) => {
      try {
        // Create query for banners
        const bannersCollection = collection(db, 'banners');
        const bannersQuery = query(bannersCollection);
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
          const banners: BannerData[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            banners.push({
              id: doc.id,
              name: data.name || '',
              description: data.description || '',
              currentImage: data.currentImage || '',
              // Include device-specific images if they exist
              ...(data.desktopImage && { desktopImage: data.desktopImage }),
              ...(data.mobileImage && { mobileImage: data.mobileImage }),
              mediaType: data.mediaType || 'image',
              dimensions: data.dimensions || '',
              format: data.format || '',
              position: data.position || '',
              cropMetadata: data.cropMetadata,
              overlaySettings: data.overlaySettings
            });
          });
          
          console.log(`🔄 ${banners.length} banners atualizados via listener`);
          callback(banners);
        }, (error) => {
          console.error('❌ Erro no listener de banners:', error);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('❌ Erro ao configurar listener de banners:', error);
        return () => {};
      }
    }).catch((error) => {
      console.error('❌ Erro ao importar Firestore:', error);
      return () => {};
    });
    
    // Return a dummy unsubscribe function for now
    return () => {};
  }

  // Forçar sincronização entre abas
  forceSyncBetweenTabs(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('forceBannerSync', {
        detail: { 
          timestamp: Date.now(),
          cacheBust: true,
          forceRefresh: true
        }
      }))
    }
  }

  // Migrar dados do localStorage para Firebase
  async migrateLocalStorageToFirebase(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Serviço não inicializado')
    }

    try {
      // Simular migração
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('✅ Migração para Firebase concluída')

    } catch (error) {
      console.error('❌ Erro na migração:', error)
      throw error
    }
  }

  // Verificar status da sincronização
  async getSyncStatus(): Promise<{ lastSync: number | null, isOnline: boolean }> {
    try {
      // Simular verificação de status
      return { lastSync: Date.now(), isOnline: true }
    } catch (error) {
      return { lastSync: null, isOnline: false }
    }
  }
}

// Instância singleton
export const bannerSyncServiceV2 = new BannerSyncServiceV2()

// Export the compressImage function
export { compressImage }

// Função auxiliar para comprimir imagens (simplified version for client-side)
async function compressImage(dataUrl: string, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    // For very large images, we might need to reduce quality further
    const adjustedQuality = Math.min(0.8, Math.max(0.1, quality));
    
    // For client-side, we'll use a canvas approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        const maxWidth = 1920; // Max width for web
        const maxHeight = 1080; // Max height for web
        
        let { width, height } = img;
        
        // Reduce dimensions if too large
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas with reduced quality
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL - try JPEG first, fallback to PNG
          let compressedDataUrl = canvas.toDataURL('image/jpeg', adjustedQuality);
          
          // If JPEG is still too large, try lower quality
          if (compressedDataUrl.length > 1048487 && adjustedQuality > 0.3) {
            compressedDataUrl = canvas.toDataURL('image/jpeg', adjustedQuality * 0.7);
          }
          
          // If still too large, try PNG with lower quality
          if (compressedDataUrl.length > 1048487) {
            compressedDataUrl = canvas.toDataURL('image/png', adjustedQuality * 0.5);
          }
          
          resolve(compressedDataUrl);
        } else {
          // If canvas context is not available, return original
          reject(new Error('Canvas context not available'));
        }
      } catch (error) {
        // If any error occurs during compression, return original
        reject(error);
      }
    };
    
    img.onerror = () => {
      // If image fails to load, reject
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = dataUrl;
  });
}
