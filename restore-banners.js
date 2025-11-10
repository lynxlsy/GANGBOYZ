// Script to help restore banner data
console.log('=== Banner Data Restoration Script ===');

// Sample banner data structure
const sampleBanners = [
  {
    id: 'hero-banner-1',
    name: 'Banner Principal 1 (Hero)',
    description: 'Primeiro banner do carrossel principal da página inicial',
    currentImage: '/placeholder-default.svg',
    mediaType: 'image',
    dimensions: '1920x1080px',
    format: 'image',
    position: 'Background da seção hero (abaixo da faixa de aviso)',
    overlaySettings: {
      enabled: false,
      fromColor: 'black',
      fromOpacity: 50,
      viaColor: 'black',
      viaOpacity: 20,
      toColor: 'transparent',
      toOpacity: 0,
      direction: 'to-r'
    }
  },
  {
    id: 'hero-banner-2',
    name: 'Banner Principal 2 (Hero)',
    description: 'Segundo banner do carrossel principal da página inicial',
    currentImage: '/placeholder-default.svg',
    mediaType: 'image',
    dimensions: '1507x1333px',
    format: 'image',
    position: 'Background da seção hero (abaixo da faixa de aviso)',
    overlaySettings: {
      enabled: false,
      fromColor: 'black',
      fromOpacity: 50,
      viaColor: 'black',
      viaOpacity: 20,
      toColor: 'transparent',
      toOpacity: 0,
      direction: 'to-r'
    }
  },
  {
    id: 'offers-banner',
    name: 'Banner de Ofertas Especiais',
    description: 'Banner de ofertas especiais, exibido acima dos produtos em destaque',
    currentImage: '/placeholder-default.svg',
    mediaType: 'image',
    dimensions: '1248x624px',
    format: 'image',
    position: 'Seção HOT (abaixo do header)',
    overlaySettings: {
      enabled: false,
      fromColor: 'black',
      fromOpacity: 50,
      viaColor: 'black',
      viaOpacity: 20,
      toColor: 'transparent',
      toOpacity: 0,
      direction: 'to-r'
    }
  },
  {
    id: 'footer-banner',
    name: 'Banner Footer',
    description: 'Banner que aparece antes do footer em todas as páginas',
    currentImage: '/placeholder-default.svg',
    mediaType: 'image',
    dimensions: '1920x650px',
    format: 'image',
    position: 'Antes do Footer (em todas as páginas)',
    overlaySettings: {
      enabled: true,
      fromColor: 'black',
      fromOpacity: 50,
      viaColor: 'black',
      viaOpacity: 20,
      toColor: 'transparent',
      toOpacity: 0,
      direction: 'to-r'
    }
  }
];

function restoreBannerData() {
  console.log('Restoring banner data to localStorage...');
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    // Check if banner data already exists
    const existingData = localStorage.getItem('gang-boyz-homepage-banners');
    if (existingData) {
      console.log('Existing banner data found:');
      try {
        const parsed = JSON.parse(existingData);
        console.log(`Found ${parsed.length} banners`);
        parsed.forEach((banner, index) => {
          console.log(`  ${index + 1}. ${banner.id}: ${banner.currentImage.substring(0, 50)}...`);
        });
      } catch (e) {
        console.log('Could not parse existing data');
      }
      
      const choice = prompt('Existing banner data found. Do you want to overwrite it? (y/n)');
      if (choice && choice.toLowerCase() !== 'y') {
        console.log('Restore cancelled by user');
        return;
      }
    }
    
    // Save sample data to localStorage
    localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(sampleBanners));
    console.log('✅ Banner data restored successfully');
    console.log('You can now upload your custom images through the admin interface');
    
  } catch (error) {
    console.error('Error restoring banner data:', error);
  }
}

function clearBannerData() {
  console.log('Clearing banner data from localStorage...');
  
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('banner')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    });
    
    console.log(`✅ ${keysToRemove.length} banner-related keys cleared from localStorage`);
    
  } catch (error) {
    console.error('Error clearing banner data:', error);
  }
}

function showBannerData() {
  console.log('Showing current banner data...');
  
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('banner')) {
        keys.push(key);
      }
    }
    
    if (keys.length === 0) {
      console.log('No banner data found in localStorage');
      return;
    }
    
    console.log(`Found ${keys.length} banner-related keys:`);
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      console.log(`\n${key}:`);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            console.log(`  ${parsed.length} banners found:`);
            parsed.forEach((banner, index) => {
              console.log(`    ${index + 1}. ${banner.id}`);
              console.log(`       Image: ${banner.currentImage.substring(0, 50)}...`);
              console.log(`       Length: ${banner.currentImage ? banner.currentImage.length : 0} characters`);
            });
          } else {
            console.log(`  Data: ${JSON.stringify(parsed, null, 2)}`);
          }
        } catch (e) {
          console.log(`  Raw data (${data.length} chars): ${data.substring(0, 100)}...`);
        }
      } else {
        console.log('  No data');
      }
    });
    
  } catch (error) {
    console.error('Error showing banner data:', error);
  }
}

// Run the functions
console.log('\nAvailable functions:');
console.log('- restoreBannerData(): Restore default banner structure to localStorage');
console.log('- clearBannerData(): Clear all banner data from localStorage');
console.log('- showBannerData(): Show current banner data in localStorage');

console.log('\nTo use, call one of the functions above in the console.');
console.log('Example: restoreBannerData()');

console.log('\n=== End Script ===');