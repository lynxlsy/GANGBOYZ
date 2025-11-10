// Script to properly initialize banner data with correct image URLs
console.log('=== Initializing Banner Data Properly ===');

function initBannerDataProperly() {
  console.log('Initializing banner data with proper image URLs...');
  
  try {
    // Check if banner data already exists
    const existingData = localStorage.getItem('gang-boyz-homepage-banners');
    
    if (existingData) {
      console.log('Banner data already exists, checking for issues...');
      let banners = JSON.parse(existingData);
      let updated = false;
      
      // Check each banner for data URLs and fix them
      banners = banners.map(banner => {
        // If the image is a data URL, replace with placeholder or Firebase URL
        if (banner.currentImage && banner.currentImage.startsWith('data:')) {
          console.log(`⚠️ Found data URL for banner ${banner.id}, replacing with placeholder`);
          banner.currentImage = '/placeholder-default.svg';
          updated = true;
        }
        return banner;
      });
      
      if (updated) {
        localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(banners));
        console.log('✅ Banner data updated with proper image URLs');
      } else {
        console.log('✅ Banner data is already correct');
      }
    } else {
      console.log('No existing banner data, creating default set...');
      
      // Create default banner set with proper image URLs
      const defaultBanners = [
        createDefaultBanner('hero-banner-1', 'Banner Principal 1 (Hero)', '/placeholder-default.svg'),
        createDefaultBanner('hero-banner-2', 'Banner Principal 2 (Hero)', '/placeholder-default.svg'),
        createDefaultBanner('offers-banner', 'Banner de Ofertas Especiais', '/placeholder-default.svg'),
        createDefaultBanner('footer-banner', 'Banner Footer', '/placeholder-default.svg')
      ];
      
      localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(defaultBanners));
      console.log('✅ Created default banner data with proper image URLs');
    }
    
    // Force refresh of banner components
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
      window.dispatchEvent(new CustomEvent('forceBannerSync'));
    }, 100);
    
    console.log('=== Banner Data Initialization Complete ===');
    
  } catch (error) {
    console.error('❌ Error initializing banner data:', error);
  }
}

function createDefaultBanner(id, name, imageUrl) {
  // Banner configurations
  const configs = {
    'hero-banner-1': {
      description: "Primeiro banner do carrossel principal da página inicial",
      dimensions: "1920x1080px",
      position: "Background da seção hero (abaixo da faixa de aviso)",
      aspectRatio: "16:9"
    },
    'hero-banner-2': {
      description: "Segundo banner do carrossel principal da página inicial",
      dimensions: "1507x1333px",
      position: "Background da seção hero (abaixo da faixa de aviso)",
      aspectRatio: "1507:1333"
    },
    'offers-banner': {
      description: "Banner de ofertas especiais, exibido acima dos produtos em destaque",
      dimensions: "1248x624px",
      position: "Seção HOT (abaixo do header)",
      aspectRatio: "2:1"
    },
    'footer-banner': {
      description: "Banner que aparece antes do footer em todas as páginas",
      dimensions: "1920x650px",
      position: "Antes do Footer (em todas as páginas)",
      aspectRatio: "2.95:1"
    }
  };
  
  const config = configs[id] || {
    description: "Banner padrão",
    dimensions: "1920x1080px",
    position: "Default position",
    aspectRatio: "16:9"
  };
  
  return {
    id: id,
    name: name,
    description: config.description,
    currentImage: imageUrl,
    mediaType: "image",
    dimensions: config.dimensions,
    format: "image",
    position: config.position,
    overlaySettings: id === 'footer-banner' ? {
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
  };
}

// Run initialization
initBannerDataProperly();

console.log('\nTo manually run initialization, call: initBannerDataProperly()');

export { initBannerDataProperly, createDefaultBanner };