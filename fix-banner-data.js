// Script to fix and initialize banner data properly
console.log('=== Fixing Banner Data ===');

function fixBannerData() {
  console.log('Checking and fixing banner data...');
  
  try {
    // Check if banner data exists
    const existingData = localStorage.getItem('gang-boyz-homepage-banners');
    
    if (!existingData) {
      console.log('No banner data found, creating default set...');
      createDefaultBannerData();
      return;
    }
    
    // Parse existing data
    let banners = JSON.parse(existingData);
    console.log(`Found ${banners.length} existing banners`);
    
    // Check for required banners
    const requiredBanners = [
      { id: 'hero-banner-1', name: 'Banner Principal 1 (Hero)' },
      { id: 'hero-banner-2', name: 'Banner Principal 2 (Hero)' },
      { id: 'offers-banner', name: 'Banner de Ofertas Especiais' },
      { id: 'footer-banner', name: 'Banner Footer' }
    ];
    
    // Check which banners are missing
    const missingBanners = requiredBanners.filter(required => 
      !banners.some(banner => banner.id === required.id)
    );
    
    if (missingBanners.length > 0) {
      console.log(`Missing banners: ${missingBanners.map(b => b.id).join(', ')}`);
      
      // Add missing banners
      missingBanners.forEach(missing => {
        const newBanner = createDefaultBanner(missing.id, missing.name);
        banners.push(newBanner);
        console.log(`Added banner: ${missing.id}`);
      });
      
      // Save updated data
      localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(banners));
      console.log('✅ Updated banner data with missing banners');
    } else {
      console.log('✅ All required banners are present');
    }
    
    // Validate banner data structure
    banners = banners.map(banner => validateBannerStructure(banner));
    
    // Save validated data
    localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(banners));
    console.log('✅ Banner data validated and saved');
    
    // Force refresh
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
      window.dispatchEvent(new CustomEvent('forceBannerSync'));
    }, 100);
    
    console.log('=== Banner Data Fix Complete ===');
    
  } catch (error) {
    console.error('❌ Error fixing banner data:', error);
    // Create default data as fallback
    createDefaultBannerData();
  }
}

function createDefaultBannerData() {
  console.log('Creating default banner data...');
  
  const defaultBanners = [
    createDefaultBanner('hero-banner-1', 'Banner Principal 1 (Hero)'),
    createDefaultBanner('hero-banner-2', 'Banner Principal 2 (Hero)'),
    createDefaultBanner('offers-banner', 'Banner de Ofertas Especiais'),
    createDefaultBanner('footer-banner', 'Banner Footer')
  ];
  
  localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(defaultBanners));
  console.log('✅ Created default banner data');
  
  // Force refresh
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
    window.dispatchEvent(new CustomEvent('forceBannerSync'));
  }, 100);
}

function createDefaultBanner(id, name) {
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
    currentImage: "/placeholder-default.svg",
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

function validateBannerStructure(banner) {
  // Ensure all required fields are present
  const validatedBanner = { ...banner };
  
  // Required fields with defaults
  const defaults = {
    id: 'unknown-banner',
    name: 'Banner Padrão',
    description: 'Banner sem descrição',
    currentImage: '/placeholder-default.svg',
    mediaType: 'image',
    dimensions: '1920x1080px',
    format: 'image',
    position: 'Default position'
  };
  
  // Apply defaults for missing fields
  Object.keys(defaults).forEach(key => {
    if (validatedBanner[key] === undefined || validatedBanner[key] === null) {
      validatedBanner[key] = defaults[key];
    }
  });
  
  // Ensure overlaySettings exists
  if (!validatedBanner.overlaySettings) {
    validatedBanner.overlaySettings = {
      enabled: false,
      fromColor: 'black',
      fromOpacity: 50,
      viaColor: 'black',
      viaOpacity: 20,
      toColor: 'transparent',
      toOpacity: 0,
      direction: 'to-r'
    };
  }
  
  // Fix footer banner overlay settings
  if (validatedBanner.id === 'footer-banner' && validatedBanner.overlaySettings) {
    validatedBanner.overlaySettings.enabled = true;
  }
  
  return validatedBanner;
}

// Run the fix
fixBannerData();

console.log('\nTo manually run the fix, call: fixBannerData()');

export { fixBannerData, createDefaultBannerData, validateBannerStructure };