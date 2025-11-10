"use client"

import { useState, useEffect } from 'react'
import { BannerConfig, getBannerConfig, BANNER_STRIP_CONFIGS } from '@/lib/banner-config'
import { LocalStorageManager } from '@/lib/localStorage-utils'

export interface BannerData {
  id: string
  name: string
  description: string
  currentImage: string
  // Device-specific images
  desktopImage?: string
  mobileImage?: string
  mediaType: 'image' | 'video' | 'gif'
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
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  }
}

export interface BannerStripData {
  text: string
  isActive: boolean
  emoji: string
  bgColor: string
  height: number
  speed: number
  repetitions: number
}

export function useBanner(bannerId: string) {
  const [banner, setBanner] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const config = getBannerConfig(bannerId)
  
  useEffect(() => {
    if (!config) {
      setError(`Banner config not found for ID: ${bannerId}`)
      setLoading(false)
      return
    }

    const loadBanner = async () => {
      try {
        console.log(`Loading banner ${bannerId}`)
        
        // First try to load from Firebase if available
        try {
          const { bannerSyncServiceV2 } = await import('@/lib/banner-sync-service-v2')
          if (bannerSyncServiceV2 && typeof window !== 'undefined') {
            console.log(`Attempting to load ${bannerId} from Firebase`)
            // Try to load banners from Firebase
            try {
              const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage')
              console.log('Firebase banners loaded:', firebaseBanners)
              
              // If we have Firebase data, update localStorage
              if (firebaseBanners.length > 0) {
                const storageKey = config.storageKey
                const savedBanners = localStorage.getItem(storageKey)
                let localBanners: BannerData[] = savedBanners ? JSON.parse(savedBanners) : []
                
                // Merge Firebase data with local data
                let updated = false
                firebaseBanners.forEach(firebaseBanner => {
                  const localIndex = localBanners.findIndex(b => b.id === firebaseBanner.id)
                  if (localIndex >= 0) {
                    // Update existing banner with Firebase data
                    localBanners[localIndex] = { ...localBanners[localIndex], ...firebaseBanner }
                    updated = true
                  } else {
                    // Add new banner from Firebase
                    localBanners.push(firebaseBanner)
                    updated = true
                  }
                })
                
                // Save updated data to localStorage if there were changes
                if (updated) {
                  localStorage.setItem(storageKey, JSON.stringify(localBanners))
                  console.log('Updated localStorage with Firebase data')
                }
              }
            } catch (firebaseLoadError) {
              console.log('Could not load from Firebase, using localStorage only:', firebaseLoadError)
            }
          }
        } catch (firebaseError) {
          console.log('Firebase service not available, using localStorage only')
        }
        
        const savedBanners = localStorage.getItem(config.storageKey)
        console.log(`Saved banners for ${config.storageKey}:`, savedBanners)
        if (savedBanners) {
          const banners: BannerData[] = JSON.parse(savedBanners)
          const bannerData = banners.find(b => b.id === bannerId)
          console.log(`Found banner data for ${bannerId}:`, bannerData)
          if (bannerData) {
            setBanner(bannerData)
          } else {
            // Create default banner if it doesn't exist
            const defaultBanner: BannerData = {
              id: bannerId,
              name: config.name,
              description: config.description,
              currentImage: config.defaultImage,
              mediaType: 'image',
              dimensions: config.dimensions,
              format: config.mediaTypes.join(', '),
              position: config.position,
              overlaySettings: bannerId === 'footer-banner' ? {
                enabled: true,
                fromColor: 'black',
                fromOpacity: 50,
                viaColor: 'black',
                viaOpacity: 20,
                toColor: 'transparent',
                toOpacity: 0,
                direction: 'to-r'
              } : {
                enabled: false,
                fromColor: 'black',
                fromOpacity: 50,
                viaColor: 'black',
                viaOpacity: 20,
                toColor: 'transparent',
                toOpacity: 0,
                direction: 'to-r'
              }
            }
            setBanner(defaultBanner)
            
            // Add the default banner to localStorage
            banners.push(defaultBanner)
            localStorage.setItem(config.storageKey, JSON.stringify(banners))
          }
        } else {
          // Create default banner if no saved data exists
          const defaultBanner: BannerData = {
            id: bannerId,
            name: config.name,
            description: config.description,
            currentImage: config.defaultImage,
            mediaType: 'image',
            dimensions: config.dimensions,
            format: config.mediaTypes.join(', '),
            position: config.position,
            overlaySettings: bannerId === 'footer-banner' ? {
                enabled: true,
                fromColor: 'black',
                fromOpacity: 50,
                viaColor: 'black',
                viaOpacity: 20,
                toColor: 'transparent',
                toOpacity: 0,
                direction: 'to-r'
              } : {
                enabled: false,
                fromColor: 'black',
                fromOpacity: 50,
                viaColor: 'black',
                viaOpacity: 20,
                toColor: 'transparent',
                toOpacity: 0,
                direction: 'to-r'
              }
            }
          setBanner(defaultBanner)
          
          // Save the default banner to localStorage
          localStorage.setItem(config.storageKey, JSON.stringify([defaultBanner]))
        }
        setError(null)
      } catch (err) {
        console.error(`Error loading banner ${bannerId}:`, err)
        setError(`Error loading banner: ${err}`)
        
        // Even if there's an error, try to return default banner
        if (config) {
          const defaultBanner: BannerData = {
            id: bannerId,
            name: config.name,
            description: config.description,
            currentImage: config.defaultImage,
            mediaType: 'image',
            dimensions: config.dimensions,
            format: config.mediaTypes.join(', '),
            position: config.position,
            overlaySettings: bannerId === 'footer-banner' ? {
                enabled: true,
                fromColor: 'black',
                fromOpacity: 50,
                viaColor: 'black',
                viaOpacity: 20,
                toColor: 'transparent',
                toOpacity: 0,
                direction: 'to-r'
              } : {
                enabled: false,
                fromColor: 'black',
                fromOpacity: 50,
                viaColor: 'black',
                viaOpacity: 20,
                toColor: 'transparent',
                toOpacity: 0,
                direction: 'to-r'
              }
            }
          setBanner(defaultBanner)
        }
      } finally {
        setLoading(false)
      }
    }

    // Load initially
    loadBanner()

    // Listen for changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === config.storageKey) {
        console.log(`Storage change detected for ${config.storageKey}`)
        loadBanner()
      }
    }

    // Listen for custom changes (when the same tab modifies)
    const handleCustomStorageChange = () => {
      console.log(`Custom storage change detected for banner ${bannerId}`)
      loadBanner()
    }

    // Listen for banner updates
    const handleBannerUpdated = (event: CustomEvent) => {
      console.log(`Banner updated event received for ${bannerId}:`, event.detail)
      if (event.detail && event.detail.bannerId === bannerId) {
        // Update the banner image directly
        setBanner(prevBanner => {
          if (prevBanner) {
            console.log(`Updating banner ${bannerId} image to:`, event.detail.imageUrl)
            const updatedBanner = {
              ...prevBanner,
              currentImage: event.detail.imageUrl
            }
            
            // Sync with Firebase
            syncWithFirebase(updatedBanner)
            
            return updatedBanner
          }
          return prevBanner
        })
        
        // Also update localStorage
        try {
          const savedBanners = localStorage.getItem(config.storageKey)
          if (savedBanners) {
            const banners: BannerData[] = JSON.parse(savedBanners)
            const bannerIndex = banners.findIndex(b => b.id === bannerId)
            if (bannerIndex >= 0) {
              banners[bannerIndex] = {
                ...banners[bannerIndex],
                currentImage: event.detail.imageUrl
              }
              localStorage.setItem(config.storageKey, JSON.stringify(banners))
              
              // Sync with Firebase
              syncWithFirebase(banners[bannerIndex])
            }
          }
        } catch (err) {
          console.error(`Error updating banner ${bannerId} in localStorage:`, err)
        }
      }
    }

    // Function to sync banner with Firebase
    const syncWithFirebase = async (banner: BannerData) => {
      try {
        const { bannerSyncServiceV2 } = await import('@/lib/banner-sync-service-v2')
        if (bannerSyncServiceV2) {
          await bannerSyncServiceV2.syncBannerToFirebase(banner)
          console.log(`✅ Banner ${banner.id} synced with Firebase`)
        }
      } catch (syncError: any) {
        console.warn(`⚠️ Failed to sync banner ${banner.id} with Firebase:`, syncError)
        
        // Only dispatch error event if it's a real Firebase error, not network issues
        if (typeof window !== 'undefined') {
          // Check if we're online before dispatching error
          if (typeof navigator !== 'undefined' && navigator.onLine) {
            window.dispatchEvent(new CustomEvent('bannerFirebaseSyncError', {
              detail: { bannerId: banner.id, error: syncError.message || 'Erro de sincronização com Firebase' }
            }))
          } else {
            console.log(`Offline mode: Skipping Firebase sync for banner ${banner.id}`)
          }
        }
        
        // If it's a size error, try to compress the image
        if (syncError.message && syncError.message.includes('muito grande')) {
          console.log(`🔄 Tentando comprimir imagem do banner ${banner.id}...`)
          try {
            // Try to compress the image and sync again
            if (banner.currentImage && banner.currentImage.startsWith('data:')) {
              // Import the compress function directly
              const module = await import('@/lib/banner-sync-service-v2')
              const { compressImage, bannerSyncServiceV2 } = module;
            
              const compressedImage = await compressImage(banner.currentImage, 0.6)
            
              // Update the banner with compressed image
              const compressedBanner = {
                ...banner,
                currentImage: compressedImage
              }
            
              // Try to sync again with compressed image
              await bannerSyncServiceV2.syncBannerToFirebase(compressedBanner)
              console.log(`✅ Banner ${banner.id} synced with Firebase after compression`)
            
              // Update localStorage with compressed image
              const savedBanners = localStorage.getItem(config.storageKey)
              if (savedBanners) {
                const banners: BannerData[] = JSON.parse(savedBanners)
                const bannerIndex = banners.findIndex(b => b.id === banner.id)
                if (bannerIndex >= 0) {
                  banners[bannerIndex] = compressedBanner
                  localStorage.setItem(config.storageKey, JSON.stringify(banners))
                  window.dispatchEvent(new CustomEvent(config.eventName))
                }
              }
            }
          } catch (compressionError) {
            console.error(`❌ Failed to compress and sync banner ${banner.id}:`, compressionError)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(config.eventName, handleCustomStorageChange)
    window.addEventListener('bannerUpdated', handleBannerUpdated as EventListener)
    // Also listen for edit mode updates
    window.addEventListener('editModeBannerUpdate', handleBannerUpdated as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(config.eventName, handleCustomStorageChange)
      window.removeEventListener('bannerUpdated', handleBannerUpdated as EventListener)
      window.removeEventListener('editModeBannerUpdate', handleBannerUpdated as EventListener)
    }
  }, [bannerId, config])

  // Ensure we always return a valid object
  return {
    banner,
    loading,
    error,
    config: config || undefined,
    updateBanner: async (updates: Partial<BannerData>) => {
      if (!config || !banner) return false

      try {
        const savedBanners = localStorage.getItem(config.storageKey)
        let banners: BannerData[] = savedBanners ? JSON.parse(savedBanners) : []
        
        const bannerIndex = banners.findIndex(b => b.id === bannerId)
        const updatedBanner = { ...banner, ...updates }
        
        if (bannerIndex >= 0) {
          banners[bannerIndex] = updatedBanner
        } else {
          banners.push(updatedBanner)
        }
        
        // Otimizar dados antes de salvar - remover propriedades desnecessárias
        const optimizedBanners = banners.map(b => {
          const optimized = LocalStorageManager.optimizeBannerData(b);
          // Certificar-se de que cropMetadata e overlaySettings não sejam undefined
          if (optimized.cropMetadata === undefined) {
            delete optimized.cropMetadata;
          }
          if (optimized.overlaySettings === undefined) {
            delete optimized.overlaySettings;
          }
          // Remover propriedades vazias
          if (optimized.cropMetadata && Object.keys(optimized.cropMetadata).length === 0) {
            delete optimized.cropMetadata;
          }
          if (optimized.overlaySettings && Object.keys(optimized.overlaySettings).length === 0) {
            delete optimized.overlaySettings;
          }
          return optimized;
        });
        
        // Verificar tamanho dos dados antes de salvar
        const bannersData = JSON.stringify(optimizedBanners);
        if (bannersData.length > 4.5 * 1024 * 1024) { // 4.5MB limite de segurança
          console.warn(`⚠️ Dados do banner excedem o limite de armazenamento, limpando dados antigos`);
          // Manter apenas os banners mais recentes
          const recentBanners = optimizedBanners.slice(-5); // Manter apenas os 5 mais recentes
          LocalStorageManager.safeSetItem(config.storageKey, JSON.stringify(recentBanners))
        } else {
          LocalStorageManager.safeSetItem(config.storageKey, bannersData)
        }
        
        setBanner(updatedBanner)
        
        // Log the update for debugging
        console.log(`Banner ${bannerId} updated:`, updatedBanner)
        
        // Sincronizar com Firebase
        try {
          // Importar o serviço de sincronização
          const { bannerSyncServiceV2 } = await import('@/lib/banner-sync-service-v2')
          await bannerSyncServiceV2.syncBannerToFirebase(updatedBanner)
          console.log(`✅ Banner ${bannerId} sincronizado com Firebase`)
        } catch (syncError) {
          console.warn(`⚠️ Falha na sincronização do banner ${bannerId} com Firebase:`, syncError)
        }
        
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent(config.eventName))
        
        // For homepage banners, also dispatch a general update event
        if (config.storageKey === "gang-boyz-homepage-banners") {
          window.dispatchEvent(new CustomEvent("homepageBannerUpdate"))
          // Also dispatch edit mode update event
          window.dispatchEvent(new CustomEvent("editModeBannerUpdate", {
            detail: { bannerId: bannerId, imageUrl: updatedBanner.currentImage }
          }))
        }
        
        return true
      } catch (err: any) {
        if (err instanceof DOMException && err.name === 'QuotaExceededError') {
          console.error(`QuotaExceededError ao atualizar banner ${bannerId}:`, err)
          // Tentar limpar dados antigos como fallback
          try {
            // Limpar dados antigos de todas as chaves de banner
            const bannerKeys = [
              'gang-boyz-homepage-banners',
              'gang-boyz-footer-banner',
              'gang-boyz-showcase-banners'
            ];
            
            bannerKeys.forEach(key => {
              const savedData = localStorage.getItem(key);
              if (savedData) {
                const data = JSON.parse(savedData);
                if (Array.isArray(data)) {
                  // Manter apenas os 3 mais recentes
                  const recentData = data.slice(-3);
                  LocalStorageManager.safeSetItem(key, JSON.stringify(recentData));
                  console.log(`✅ Espaço liberado para ${key}`);
                }
              }
            });
            
            // Tentar salvar novamente
            const savedBanners = localStorage.getItem(config.storageKey);
            if (savedBanners) {
              const banners: BannerData[] = JSON.parse(savedBanners);
              const bannerIndex = banners.findIndex(b => b.id === bannerId);
              if (bannerIndex >= 0) {
                banners[bannerIndex] = { ...banner, ...updates };
                LocalStorageManager.safeSetItem(config.storageKey, JSON.stringify(banners.slice(-3)));
                console.log(`✅ Banner ${bannerId} salvo após limpeza`);
              }
            }
          } catch (cleanupError) {
            console.error(`Erro ao limpar dados antigos para banner ${bannerId}:`, cleanupError);
          }
        } else {
          console.error(`Erro ao atualizar banner ${bannerId}:`, err)
        }
        return false
      }
    }
  }
}

export function useBannerStrip(stripType: 'homepage' | 'categoryPages') {
  const [stripData, setStripData] = useState<BannerStripData | null>(null)
  const [loading, setLoading] = useState(true)

  const config = stripType === 'homepage' 
    ? BANNER_STRIP_CONFIGS.homepage 
    : BANNER_STRIP_CONFIGS.categoryPages

  useEffect(() => {
    const loadStripData = () => {
      try {
        const savedData = localStorage.getItem(config.storageKey)
        if (savedData) {
          setStripData(JSON.parse(savedData))
        } else {
          setStripData(config.defaultSettings)
        }
      } catch (err) {
        console.error(`Erro ao carregar strip ${stripType}:`, err)
        setStripData(config.defaultSettings)
      } finally {
        setLoading(false)
      }
    }

    loadStripData()

    // Escutar mudanças
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === config.storageKey) {
        loadStripData()
      }
    }

    const handleCustomChange = () => {
      loadStripData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(config.eventName, handleCustomChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(config.eventName, handleCustomChange)
    }
  }, [stripType, config])

  const updateStripData = (updates: Partial<BannerStripData>) => {
    try {
      const newData = { ...stripData, ...updates } as BannerStripData
      localStorage.setItem(config.storageKey, JSON.stringify(newData))
      setStripData(newData)
      
      // Disparar evento customizado
      window.dispatchEvent(new CustomEvent(config.eventName))
      
      return true
    } catch (err) {
      console.error(`Erro ao atualizar strip ${stripType}:`, err)
      return false
    }
  }

  return {
    stripData,
    loading,
    config,
    updateStripData
  }
}

// Função utilitária para limpar dados antigos do localStorage
export function cleanupOldBannerData() {
  try {
    const storageKeys = [
      'gang-boyz-homepage-banners',
      'gang-boyz-footer-banner',
      'gang-boyz-showcase-banners'
    ];
    
    storageKeys.forEach(storageKey => {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (Array.isArray(data)) {
          // Verificar tamanho dos dados
          const dataSize = savedData.length;
          if (dataSize > 4.5 * 1024 * 1024) { // 4.5MB limite de segurança
            // Manter apenas os 5 mais recentes
            const recentData = data.slice(-5);
            localStorage.setItem(storageKey, JSON.stringify(recentData));
            console.log(`✅ Dados antigos limpos para ${storageKey} devido ao limite de tamanho`);
          } else if (data.length > 10) {
            // Manter apenas os 10 mais recentes
            const recentData = data.slice(-10);
            localStorage.setItem(storageKey, JSON.stringify(recentData));
            console.log(`✅ Dados antigos limpos para ${storageKey}`);
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao limpar dados antigos:', error);
  }
}

// Hook para limpar dados antigos periodicamente
export function useBannerCleanup() {
  useEffect(() => {
    const cleanupOldBanners = () => {
      cleanupOldBannerData();
    };

    // Executar limpeza na inicialização
    cleanupOldBanners();

    // Executar limpeza a cada 30 minutos
    const interval = setInterval(cleanupOldBanners, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}