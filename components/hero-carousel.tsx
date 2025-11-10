"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBanner, BannerData } from '@/hooks/use-banner' // Import BannerData type
import { updateContentById } from '@/lib/editable-content-utils'
import { editableContentSyncService } from '@/lib/editable-content-sync'
import { useEditMode } from '@/lib/edit-mode-context'

interface HeroCarouselProps {
  banners: Array<{
    id: string
    imageSrc: string
    alt: string
  }>
  autoPlayInterval?: number
  onEditBannerImage?: (bannerId: string) => void
}

export function HeroCarousel({ banners, autoPlayInterval = 5000, onEditBannerImage }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { isEditMode } = useEditMode()
  const [heroHeight, setHeroHeight] = useState(750) // Default height
  const [heroHeightMobile, setHeroHeightMobile] = useState(400) // Default mobile height
  const isDragging = useRef(false)
  const dragStartY = useRef(0)
  const startHeight = useRef(0)
  const isMobileView = useRef(false)
  const [editMode, setEditMode] = useState<'desktop' | 'mobile' | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | null>(null)
  const [previewHeight, setPreviewHeight] = useState<number | null>(null)
  
  // Buscar dados dos banners com crop
  const heroBanner1 = useBanner('hero-banner-1')
  const heroBanner2 = useBanner('hero-banner-2')

  // Function to detect if we're on mobile
  const isMobileDevice = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 || 
             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  }, []);

  // Function to get the appropriate image for the current device
  const getDeviceSpecificImage = useCallback((banner: BannerData) => {
    const isMobile = isMobileDevice();
    
    // If we have device-specific images, use them
    if (isMobile && banner.mobileImage) {
      return banner.mobileImage;
    } else if (!isMobile && banner.desktopImage) {
      return banner.desktopImage;
    }
    
    // Fallback to currentImage if device-specific images don't exist
    return banner.currentImage;
  }, [isMobileDevice]);

  // Memoized function to load height
  const loadHeight = useCallback(async () => {
    try {
      const isMobile = isMobileDevice();
      isMobileView.current = isMobile;
      
      // Load desktop height
      let desktopHeight = 750; // default
      const firebaseDesktopHeight = await editableContentSyncService.getContentFromFirebase('hero-section-height-desktop')
      if (firebaseDesktopHeight) {
        const height = parseInt(firebaseDesktopHeight, 10)
        if (!isNaN(height) && height >= 300 && height <= 1200) {
          desktopHeight = height;
        }
      } else {
        const localStorageDesktopHeight = localStorage.getItem('hero-section-height-desktop')
        if (localStorageDesktopHeight) {
          const height = parseInt(localStorageDesktopHeight, 10)
          if (!isNaN(height) && height >= 300 && height <= 1200) {
            desktopHeight = height;
          }
        }
      }
      
      // Load mobile height
      let mobileHeight = 400; // default
      const firebaseMobileHeight = await editableContentSyncService.getContentFromFirebase('hero-section-height-mobile')
      if (firebaseMobileHeight) {
        const height = parseInt(firebaseMobileHeight, 10)
        if (!isNaN(height) && height >= 200 && height <= 800) {
          mobileHeight = height;
        }
      } else {
        const localStorageMobileHeight = localStorage.getItem('hero-section-height-mobile')
        if (localStorageMobileHeight) {
          const height = parseInt(localStorageMobileHeight, 10)
          if (!isNaN(height) && height >= 200 && height <= 800) {
            mobileHeight = height;
          }
        }
      }
      
      // Set the appropriate height based on device
      if (isMobile) {
        console.log('Loaded mobile hero height:', mobileHeight)
        setHeroHeight(mobileHeight)
        setHeroHeightMobile(mobileHeight)
      } else {
        console.log('Loaded desktop hero height:', desktopHeight)
        setHeroHeight(desktopHeight)
      }
      
    } catch (error) {
      console.warn('Failed to load hero heights, using defaults:', error)
      const isMobile = isMobileDevice();
      isMobileView.current = isMobile;
      
      if (isMobile) {
        setHeroHeight(400)
        setHeroHeightMobile(400)
      } else {
        setHeroHeight(750)
      }
    }
  }, [isMobileDevice]);

  // Load height from Firebase or localStorage
  useEffect(() => {
    const loadHeight = async () => {
      try {
        // Try to get height from Firebase first
        const firebaseHeight = await editableContentSyncService.getContentFromFirebase('hero-section-height-desktop')
        if (firebaseHeight) {
          const height = parseInt(firebaseHeight, 10)
          if (!isNaN(height) && height >= 300 && height <= 1200) {
            console.log('Loaded hero height from Firebase:', height)
            setHeroHeight(height)
            return
          }
        }
        
        // Fallback to localStorage
        const localStorageHeight = localStorage.getItem('hero-section-height-desktop')
        if (localStorageHeight) {
          const height = parseInt(localStorageHeight, 10)
          if (!isNaN(height) && height >= 300 && height <= 1200) {
            console.log('Loaded hero height from localStorage:', height)
            setHeroHeight(height)
            return
          }
        }
        
        // Default height
        console.log('Using default hero height: 750px')
        setHeroHeight(750)
      } catch (error) {
        console.warn('Failed to load hero height, using default:', error)
        setHeroHeight(750)
      }
    }

    loadHeight()
  }, [])

  // Listen for real-time height updates
  useEffect(() => {
    const unsubscribe = editableContentSyncService.listenToContentChanges('hero-section-height-desktop', (content) => {
      if (content) {
        const height = parseInt(content, 10)
        if (!isNaN(height) && height >= 300 && height <= 1200) {
          console.log('Hero height updated from Firebase:', height)
          setHeroHeight(height)
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Force sync banners with Firebase on component mount
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const syncBanners = async () => {
      try {
        const { bannerSyncServiceV2 } = await import('@/lib/banner-sync-service-v2')
        if (bannerSyncServiceV2) {
          // Load banners from Firebase
          const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage')
          console.log('Firebase banners loaded:', firebaseBanners)
          
          // If we have Firebase data, update localStorage
          if (firebaseBanners.length > 0) {
            const storageKey = 'gang-boyz-homepage-banners'
            const savedBanners = localStorage.getItem(storageKey)
            let localBanners: BannerData[] = savedBanners ? JSON.parse(savedBanners) : []
            
            // Merge Firebase data with local data
            let updated = false
            firebaseBanners.forEach(firebaseBanner => {
              const localIndex = localBanners.findIndex(b => b.id === firebaseBanner.id)
              if (localIndex >= 0) {
                // Update existing banner with Firebase data
                localBanners[localIndex] = {
                  ...localBanners[localIndex],
                  ...firebaseBanner
                }
                updated = true
              } else {
                // Add new banner from Firebase
                localBanners.push(firebaseBanner)
                updated = true
              }
            })
            
            // Save updated banners to localStorage if changes were made
            if (updated) {
              localStorage.setItem(storageKey, JSON.stringify(localBanners))
              console.log('✅ LocalStorage updated with Firebase banner data')
              
              // Dispatch event to notify other components
              window.dispatchEvent(new CustomEvent('homepageBannerUpdate'))
            }
          }
          
          // Set up real-time listener for immediate updates
          unsubscribe = bannerSyncServiceV2.listenForBannerUpdates((updatedBanners) => {
            const storageKey = 'gang-boyz-homepage-banners'
            const savedBanners = localStorage.getItem(storageKey)
            let localBanners: BannerData[] = savedBanners ? JSON.parse(savedBanners) : []
            
            // Merge Firebase data with local data
            let updated = false
            updatedBanners.forEach(firebaseBanner => {
              const localIndex = localBanners.findIndex(b => b.id === firebaseBanner.id)
              if (localIndex >= 0) {
                // Update existing banner with Firebase data
                localBanners[localIndex] = {
                  ...localBanners[localIndex],
                  ...firebaseBanner
                }
                updated = true
              } else {
                // Add new banner from Firebase
                localBanners.push(firebaseBanner)
                updated = true
              }
            })
            
            // Save updated banners to localStorage if changes were made
            if (updated) {
              localStorage.setItem(storageKey, JSON.stringify(localBanners))
              console.log('✅ LocalStorage updated with Firebase banner data (real-time)')
              
              // Dispatch event to notify other components
              window.dispatchEvent(new CustomEvent('homepageBannerUpdate'))
            }
          });
        }
      } catch (error) {
        console.warn('Failed to sync banners with Firebase:', error)
      }
    }

    syncBanners()
    
    // Set up more frequent sync - every 10 seconds for better responsiveness
    const interval = setInterval(syncBanners, 10000)
    
    return () => {
      clearInterval(interval)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Memoized function to get aspect ratio
  const getBannerAspectRatio = useCallback((bannerId: string) => {
    if (bannerId === "hero-banner-1") return "16/9";
    if (bannerId === "hero-banner-2") return "1507/1333";
    return "16/9"; // default
  }, []);

  // Reset index if banners change
  useEffect(() => {
    setCurrentIndex(0)
  }, [banners]);

  // Manual navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Handle drag start for resizing
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditMode || editMode === null) return; // Only allow dragging if editMode is selected
    
    isDragging.current = true;
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startHeight.current = heroHeight;
    
    e.preventDefault();
  }, [isEditMode, editMode, heroHeight]);

  // Handle drag move for resizing
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !isEditMode || editMode === null) return; // Only allow dragging if editMode is selected
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY.current;
    const newHeight = Math.max(300, Math.min(1200, startHeight.current - deltaY)); // Note: subtracting deltaY because Y increases downward
    
    setHeroHeight(newHeight);
    
    e.preventDefault();
  }, [isEditMode, editMode]);

  // Handle drag end for resizing
  const handleDragEnd = useCallback(async (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !isEditMode || editMode === null) return; // Only allow dragging if editMode is selected
    
    isDragging.current = false;
    
    // Save to localStorage first
    try {
      if (editMode === 'mobile') {
        localStorage.setItem('hero-section-height-mobile', heroHeight.toString());
        setHeroHeightMobile(heroHeight); // Update mobile height state
        console.log('Mobile hero height saved to localStorage:', heroHeight);
      } else {
        localStorage.setItem('hero-section-height-desktop', heroHeight.toString());
        console.log('Desktop hero height saved to localStorage:', heroHeight);
      }
    } catch (error) {
      console.error('Failed to save hero height to localStorage:', error);
    }
    
    // Save to Firebase (if network is available)
    try {
      const key = `hero-section-height-${editMode}`;
      await updateContentById(key, heroHeight.toString());
      console.log(`${editMode.charAt(0).toUpperCase() + editMode.slice(1)} hero height saved to Firebase:`, heroHeight);
    } catch (error) {
      console.warn('Failed to save hero height to Firebase (network issue), but localStorage saved:', error);
      // This is not a critical error - localStorage will persist the value
    }
    
    e.preventDefault();
  }, [isEditMode, editMode, heroHeight]);

  // Add event listeners for drag
  useEffect(() => {
    if (isEditMode) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isEditMode, handleDragMove, handleDragEnd]);

  // Listen for screen size changes to switch between mobile and desktop heights
  useEffect(() => {
    const handleResize = () => {
      const wasMobile = isMobileView.current;
      const isNowMobile = isMobileDevice();
      
      // Only update if we've switched between mobile and desktop
      if (wasMobile !== isNowMobile) {
        isMobileView.current = isNowMobile;
        
        if (isNowMobile) {
          // Switching to mobile - use mobile height
          const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
          const height = parseInt(mobileHeight, 10);
          if (!isNaN(height) && height >= 200 && height <= 800) {
            setHeroHeight(height);
            setHeroHeightMobile(height);
            console.log('Switched to mobile view, height set to:', height);
          }
        } else {
          // Switching to desktop - use desktop height
          const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
          const height = parseInt(desktopHeight, 10);
          if (!isNaN(height) && height >= 300 && height <= 1200) {
            setHeroHeight(height);
            console.log('Switched to desktop view, height set to:', height);
          }
        }
      }
    };

    // Check on initial load and when resizing
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileDevice]);

  // Se não há banners, mostrar banner padrão
  if (banners.length === 0) {
    console.log('Nenhum banner fornecido, mostrando banner padrão');
    return (
      <section 
        className="hero-section relative w-full flex items-center justify-center overflow-hidden bg-black" 
        style={{ 
          height: `${heroHeight}px`
        }}
      >
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <img
            src="/placeholder-default.svg"
            alt="Banner Padrão"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.log('❌ Erro ao carregar imagem padrão')
            }}
            onLoad={() => {
              console.log('✅ Imagem padrão carregada com sucesso')
            }}
          />
          
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradiente vertical sobre o banner */}
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent"></div>
        </div>

        {/* Resize handle for edit mode */}
        {isEditMode && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-6 bg-red-500 cursor-ns-resize flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-30 touch-manipulation"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="w-12 h-1 bg-white rounded-full"></div>
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <div className="w-1 h-3 red-bg rounded-full mt-2 animate-pulse" />
          </div>
        </div>

        {/* Edit Mode Selector - Positioned near the resize handle */}
        {isEditMode && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {editMode === null ? (
              <>
                <button 
                  className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  onClick={() => {
                    // Show preview of current desktop height and enable editing
                    const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
                    const height = parseInt(desktopHeight, 10);
                    if (!isNaN(height) && height >= 300 && height <= 1200) {
                      setPreviewMode('desktop');
                      setPreviewHeight(height);
                      // Temporarily show desktop height
                      setHeroHeight(height);
                    }
                    // Enable editing mode for desktop
                    setEditMode('desktop');
                  }}
                >
                  Editar Desktop
                </button>
                <button 
                  className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  onClick={() => {
                    // Show preview of current mobile height and enable editing
                    const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
                    const height = parseInt(mobileHeight, 10);
                    if (!isNaN(height) && height >= 200 && height <= 800) {
                      setPreviewMode('mobile');
                      setPreviewHeight(height);
                      // Temporarily show mobile height
                      setHeroHeight(height);
                    }
                    // Enable editing mode for mobile
                    setEditMode('mobile');
                  }}
                >
                  Editar Mobile
                </button>
                <button 
                  className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  onClick={() => {
                    // Reset preview
                    if (isMobileDevice()) {
                      const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
                      const height = parseInt(mobileHeight, 10);
                      if (!isNaN(height) && height >= 200 && height <= 800) {
                        setHeroHeight(height);
                      }
                    } else {
                      const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
                      const height = parseInt(desktopHeight, 10);
                      if (!isNaN(height) && height >= 300 && height <= 1200) {
                        setHeroHeight(height);
                      }
                    }
                    setPreviewMode(null);
                    setPreviewHeight(null);
                  }}
                >
                  Resetar Visualização
                </button>
              </>
            ) : (
              <>
                <button 
                  className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  onClick={() => {
                    // Apply the current height to the selected platform
                    if (editMode === 'mobile') {
                      localStorage.setItem('hero-section-height-mobile', heroHeight.toString());
                      setHeroHeightMobile(heroHeight);
                    } else {
                      localStorage.setItem('hero-section-height-desktop', heroHeight.toString());
                    }
                    
                    // Save to Firebase
                    const key = `hero-section-height-${editMode}`;
                    updateContentById(key, heroHeight.toString()).catch(console.warn);
                    
                    console.log(`Applied ${editMode} height:`, heroHeight);
                    setEditMode(null);
                    setPreviewMode(null);
                    setPreviewHeight(null);
                  }}
                >
                  Aplicar Altura {editMode === 'desktop' ? 'Desktop' : 'Mobile'}
                </button>
                <button 
                  className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  onClick={() => {
                    // Cancel editing and reset to original height
                    if (editMode === 'mobile') {
                      const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
                      const height = parseInt(mobileHeight, 10);
                      if (!isNaN(height) && height >= 200 && height <= 800) {
                        setHeroHeight(height);
                      }
                    } else {
                      const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
                      const height = parseInt(desktopHeight, 10);
                      if (!isNaN(height) && height >= 300 && height <= 1200) {
                        setHeroHeight(height);
                      }
                    }
                    setEditMode(null);
                    setPreviewMode(null);
                    setPreviewHeight(null);
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}

        {/* Resize instructions when in edit mode but no platform selected */}
        {isEditMode && editMode === null && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            Selecione a plataforma para editar a altura
          </div>
        )}

        {/* Resize handle - only visible when platform is selected */}
        {isEditMode && editMode !== null && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-6 bg-red-500 cursor-ns-resize flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-30 touch-manipulation"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="w-12 h-1 bg-white rounded-full"></div>
          </div>
        )}

        {/* Elementos decorativos */}
        <div className="absolute top-20 right-10 w-4 h-4 red-bg rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-40 left-16 w-2 h-2 red-bg rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-20 w-3 h-3 red-bg rounded-full animate-pulse opacity-70"></div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <div className="w-1 h-3 red-bg rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  // Se só tem 1 banner, renderiza sem navegação
  if (banners.length === 1) {
    console.log('Apenas 1 banner, renderizando modo simples');
    const aspectRatio = getBannerAspectRatio(banners[0].id);
    return (
      <section 
        className="hero-section relative w-full flex items-center justify-center overflow-hidden bg-black" 
        style={{ 
          height: `${heroHeight}px`
        }}
      >
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <img
            src={banners[0].imageSrc}
            alt={banners[0].alt}
            className="w-full h-full object-contain"
            style={{
              transform: banners[0].id === "hero-banner-1" && heroBanner1.banner?.cropMetadata ? 
                `translate(${heroBanner1.banner.cropMetadata.tx || 0}px, ${heroBanner1.banner.cropMetadata.ty || 0}px) scale(${heroBanner1.banner.cropMetadata.scale || 1})` :
                banners[0].id === "hero-banner-2" && heroBanner2.banner?.cropMetadata ?
                `translate(${heroBanner2.banner.cropMetadata.tx || 0}px, ${heroBanner2.banner.cropMetadata.ty || 0}px) scale(${heroBanner2.banner.cropMetadata.scale || 1})` :
                undefined
            }}
            onError={(e) => {
              console.log(`❌ Erro ao carregar imagem: ${banners[0].imageSrc}`)
              // Fallback to default image but don't override the actual banner data
              // This is just a visual fallback, not a data update
              // This is just a visual fallback, not a data update
              e.currentTarget.src = "/placeholder-default.svg"
            }}
            onLoad={() => {
              console.log(`✅ Imagem carregada com sucesso: ${banners[0].imageSrc}`)
            }}
            onClick={() => onEditBannerImage && onEditBannerImage(banners[0].id)}
          />
          
          {/* Overlay escuro para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradiente vertical sobre o banner */}
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent"></div>
        </div>

        {/* Resize handle for edit mode */}
        {isEditMode && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-6 bg-red-500 cursor-ns-resize flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-30 touch-manipulation"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="w-12 h-1 bg-white rounded-full"></div>
          </div>
        )}

        {/* Elementos decorativos */}
        <div className="absolute top-20 right-10 w-4 h-4 red-bg rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-40 left-16 w-2 h-2 red-bg rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-20 w-3 h-3 red-bg rounded-full animate-pulse opacity-70"></div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <div className="w-1 h-3 red-bg rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  // Carrossel com múltiplos banners
  console.log(`Renderizando carrossel com ${banners.length} banners`);
  return (
        <section
          className="hero-section relative w-full flex items-center justify-center overflow-hidden bg-black"
          style={{ 
            height: `${heroHeight}px`
          }}
        >
      {/* Carousel Container */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {banners.map((banner, index) => {
          const aspectRatio = getBannerAspectRatio(banner.id);
          return (
            <div 
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                index === currentIndex 
                  ? 'opacity-100 transform translateX(0)' 
                  : index < currentIndex 
                    ? 'opacity-0 transform -translateX(100%)' 
                    : 'opacity-0 transform translateX(100%)'
              }`}
            >
              <img
                src={banner.imageSrc}
                alt={banner.alt}
                className="w-full h-full object-contain"
                style={{
                  transform: banner.id === "hero-banner-1" && heroBanner1.banner?.cropMetadata ? 
                    `translate(${heroBanner1.banner.cropMetadata.tx || 0}px, ${heroBanner1.banner.cropMetadata.ty || 0}px) scale(${heroBanner1.banner.cropMetadata.scale || 1})` :
                    banner.id === "hero-banner-2" && heroBanner2.banner?.cropMetadata ?
                    `translate(${heroBanner2.banner.cropMetadata.tx || 0}px, ${heroBanner2.banner.cropMetadata.ty || 0}px) scale(${heroBanner2.banner.cropMetadata.scale || 1})` :
                    undefined
                }}
                onError={(e) => {
                  console.log(`❌ Erro ao carregar imagem: ${banner.imageSrc}`)
                  // Fallback to default image but don't override the actual banner data
                  // This is just a visual fallback, not a data update
                  e.currentTarget.src = "/placeholder-default.svg"
                }}
                onLoad={() => {
                  console.log(`✅ Imagem carregada com sucesso: ${banner.imageSrc}`)
                }}
                onClick={() => onEditBannerImage && onEditBannerImage(banner.id)}
              />
            </div>
          );
        })}
        
        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Gradiente vertical sobre o banner */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black via-black/80 to-transparent"></div>
      </div>

      {/* Resize handle for edit mode */}
      {isEditMode && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-6 bg-red-500 cursor-ns-resize flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-30 touch-manipulation"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      )}

      {/* Edit Mode Selector - Positioned near the resize handle */}
      {isEditMode && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {editMode === null ? (
            <>
              <button 
                className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                onClick={() => {
                  // Show preview of current desktop height and enable editing
                  const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
                  const height = parseInt(desktopHeight, 10);
                  if (!isNaN(height) && height >= 300 && height <= 1200) {
                    setPreviewMode('desktop');
                    setPreviewHeight(height);
                    // Temporarily show desktop height
                    setHeroHeight(height);
                  }
                  // Enable editing mode for desktop
                  setEditMode('desktop');
                }}
              >
                Editar Desktop
              </button>
              <button 
                className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                onClick={() => {
                  // Show preview of current mobile height and enable editing
                  const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
                  const height = parseInt(mobileHeight, 10);
                  if (!isNaN(height) && height >= 200 && height <= 800) {
                    setPreviewMode('mobile');
                    setPreviewHeight(height);
                    // Temporarily show mobile height
                    setHeroHeight(height);
                  }
                  // Enable editing mode for mobile
                  setEditMode('mobile');
                }}
              >
                Editar Mobile
              </button>
              <button 
                className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                onClick={() => {
                  // Reset preview
                  if (isMobileDevice()) {
                    const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
                    const height = parseInt(mobileHeight, 10);
                    if (!isNaN(height) && height >= 200 && height <= 800) {
                      setHeroHeight(height);
                    }
                  } else {
                    const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
                    const height = parseInt(desktopHeight, 10);
                    if (!isNaN(height) && height >= 300 && height <= 1200) {
                      setHeroHeight(height);
                    }
                  }
                  setPreviewMode(null);
                  setPreviewHeight(null);
                }}
              >
                Resetar Visualização
              </button>
            </>
          ) : (
            <>
              <button 
                className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                onClick={() => {
                  // Apply the current height to the selected platform
                  if (editMode === 'mobile') {
                    localStorage.setItem('hero-section-height-mobile', heroHeight.toString());
                    setHeroHeightMobile(heroHeight);
                  } else {
                    localStorage.setItem('hero-section-height-desktop', heroHeight.toString());
                  }
                  
                  // Save to Firebase
                  const key = `hero-section-height-${editMode}`;
                  updateContentById(key, heroHeight.toString()).catch(console.warn);
                  
                  console.log(`Applied ${editMode} height:`, heroHeight);
                  setEditMode(null);
                  setPreviewMode(null);
                  setPreviewHeight(null);
                }}
              >
                Aplicar Altura {editMode === 'desktop' ? 'Desktop' : 'Mobile'}
              </button>
              <button 
                className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                onClick={() => {
                  // Cancel editing and reset to original height
                  if (editMode === 'mobile') {
                    const mobileHeight = localStorage.getItem('hero-section-height-mobile') || '400';
                    const height = parseInt(mobileHeight, 10);
                    if (!isNaN(height) && height >= 200 && height <= 800) {
                      setHeroHeight(height);
                    }
                  } else {
                    const desktopHeight = localStorage.getItem('hero-section-height-desktop') || '750';
                    const height = parseInt(desktopHeight, 10);
                    if (!isNaN(height) && height >= 300 && height <= 1200) {
                      setHeroHeight(height);
                    }
                  }
                  setEditMode(null);
                  setPreviewMode(null);
                  setPreviewHeight(null);
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}

      {/* Resize instructions when in edit mode but no platform selected */}
      {isEditMode && editMode === null && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
          Selecione a plataforma para editar a altura
        </div>
      )}

      {/* Resize handle - only visible when platform is selected */}
      {isEditMode && editMode !== null && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-6 bg-red-500 cursor-ns-resize flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-30 touch-manipulation"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      )}

      {/* Test comment to verify edit is working */}

      {/* Navigation Arrows - Otimizado para Mobile */}
      <button
        onClick={goToPrevious}
        className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-300 group cursor-pointer touch-manipulation"
        aria-label="Banner anterior"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full transition-all duration-300 group cursor-pointer touch-manipulation"
        aria-label="Próximo banner"
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Page Indicators - Otimizado para Mobile */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 md:h-1 transition-all duration-300 rounded-full touch-manipulation ${
              index === currentIndex 
                ? 'red-bg w-8 md:w-8' 
                : 'bg-white/50 hover:bg-white/70 w-6 md:w-6'
            }`}
            aria-label={`Ir para banner ${index + 1}`}
            style={{ minWidth: '24px', minHeight: '6px' }}
          />
        ))}
      </div>

      {/* Elementos decorativos - Responsivos */}
      <div className="absolute top-10 md:top-20 right-4 md:right-10 w-2 h-2 md:w-4 md:h-4 red-bg rounded-full animate-pulse opacity-80"></div>
      <div className="absolute top-20 md:top-40 left-8 md:left-16 w-1 h-1 md:w-2 md:h-2 red-bg rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-16 md:bottom-32 right-8 md:right-20 w-1.5 h-1.5 md:w-3 md:h-3 red-bg rounded-full animate-pulse opacity-70"></div>

      {/* Scroll Indicator - Otimizado para Mobile */}
      <div className="absolute bottom-6 md:bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-red-500 rounded-full flex justify-center touch-manipulation">
          <div className="w-1 h-2 md:w-1 md:h-3 red-bg rounded-full mt-1.5 md:mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
