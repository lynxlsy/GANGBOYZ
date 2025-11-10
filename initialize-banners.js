// Script to initialize banner data in localStorage
console.log('=== Initializing Banner Data ===');

function initializeBannerData() {
  console.log('Creating default banner data...');
  
  try {
    // Check if banner data already exists
    const existingData = localStorage.getItem('gang-boyz-homepage-banners');
    if (existingData) {
      console.log('Banner data already exists, parsing...');
      const banners = JSON.parse(existingData);
      console.log(`Found ${banners.length} existing banners`);
      
      // Check if all required banners are present
      const requiredBanners = ['hero-banner-1', 'hero-banner-2', 'offers-banner', 'footer-banner'];
      const missingBanners = requiredBanners.filter(requiredId => 
        !banners.some(banner => banner.id === requiredId)
      );
      
      if (missingBanners.length > 0) {
        console.log(`Missing banners: ${missingBanners.join(', ')}`);
        
        // Add missing banners
        missingBanners.forEach(bannerId => {
          const defaultBanner = createDefaultBanner(bannerId);
          banners.push(defaultBanner);
          console.log(`Added default banner: ${bannerId}`);
        });
        
        // Save updated data
        localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(banners));
        console.log('✅ Updated banner data with missing banners');
      } else {
        console.log('✅ All required banners are present');
      }
    } else {
      console.log('No existing banner data, creating default set...');
      
      // Create default banner set
      const defaultBanners = [
        createDefaultBanner('hero-banner-1'),
        createDefaultBanner('hero-banner-2'),
        createDefaultBanner('offers-banner'),
        createDefaultBanner('footer-banner')
      ];
      
      localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(defaultBanners));
      console.log('✅ Created default banner data');
    }
    
    // Force refresh of banner components
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
      window.dispatchEvent(new CustomEvent('forceBannerSync'));
    }, 100);
    
    console.log('=== Initialization Complete ===');
    
  } catch (error) {
    console.error('❌ Error initializing banner data:', error);
  }
}

function createDefaultBanner(bannerId) {
  // Default banner configurations
  const bannerConfigs = {
    'hero-banner-1': {
      name: "Banner Principal 1 (Hero)",
      description: "Primeiro banner do carrossel principal da página inicial",
      dimensions: "1920x1080px",
      position: "Background da seção hero (abaixo da faixa de aviso)",
      aspectRatio: "16:9"
    },
    'hero-banner-2': {
      name: "Banner Principal 2 (Hero)",
      description: "Segundo banner do carrossel principal da página inicial",
      dimensions: "1507x1333px",
      position: "Background da seção hero (abaixo da faixa de aviso)",
      aspectRatio: "1507:1333"
    },
    'offers-banner': {
      name: "Banner de Ofertas Especiais",
      description: "Banner de ofertas especiais, exibido acima dos produtos em destaque",
      dimensions: "1248x624px",
      position: "Seção HOT (abaixo do header)",
      aspectRatio: "2:1"
    },
    'footer-banner': {
      name: "Banner Footer",
      description: "Banner que aparece antes do footer em todas as páginas",
      dimensions: "1920x650px",
      position: "Antes do Footer (em todas as páginas)",
      aspectRatio: "2.95:1"
    }
  };
  
  const config = bannerConfigs[bannerId] || {
    name: bannerId,
    description: "Banner padrão",
    dimensions: "1920x1080px",
    position: "Default position",
    aspectRatio: "16:9"
  };
  
  return {
    id: bannerId,
    name: config.name,
    description: config.description,
    currentImage: "/placeholder-default.svg",
    mediaType: "image",
    dimensions: config.dimensions,
    format: "image",
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
  };
}

// Run initialization
initializeBannerData();

console.log('\nTo re-run initialization, call: initializeBannerData()');

export { initializeBannerData, createDefaultBanner };