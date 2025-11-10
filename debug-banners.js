// Script to debug and fix banner data issues
console.log('=== Debugging Banner Data ===');

function debugBannerData() {
  console.log('Checking banner data in localStorage...');
  
  try {
    // Check if banner data exists
    const existingData = localStorage.getItem('gang-boyz-homepage-banners');
    
    if (!existingData) {
      console.log('❌ No banner data found in localStorage');
      return;
    }
    
    // Parse existing data
    const banners = JSON.parse(existingData);
    console.log(`✅ Found ${banners.length} banners in localStorage`);
    
    // Check each banner
    banners.forEach((banner, index) => {
      console.log(`\n--- Banner ${index + 1}: ${banner.id} ---`);
      console.log('Name:', banner.name);
      console.log('Current Image:', banner.currentImage.substring(0, 100) + (banner.currentImage.length > 100 ? '...' : ''));
      console.log('Image Length:', banner.currentImage.length);
      console.log('Is Data URL:', banner.currentImage.startsWith('data:'));
      console.log('Media Type:', banner.mediaType);
      console.log('Dimensions:', banner.dimensions);
      
      // Check if image is too large for Firebase
      if (banner.currentImage.length > 1048487) {
        console.log('⚠️ WARNING: Image is too large for Firebase Firestore (> 1MB)');
      }
    });
    
    // Check total data size
    const totalSize = existingData.length;
    console.log(`\n📊 Total banner data size: ${Math.round(totalSize / 1024)} KB (${totalSize} bytes)`);
    
    if (totalSize > 1048487) {
      console.log('⚠️ WARNING: Total data exceeds Firebase limit (> 1MB)');
    }
    
  } catch (error) {
    console.error('❌ Error debugging banner data:', error);
  }
}

function fixBannerImageData() {
  console.log('Attempting to fix banner image data...');
  
  try {
    // Check if banner data exists
    const existingData = localStorage.getItem('gang-boyz-homepage-banners');
    
    if (!existingData) {
      console.log('❌ No banner data found in localStorage');
      return;
    }
    
    // Parse existing data
    let banners = JSON.parse(existingData);
    console.log(`✅ Found ${banners.length} banners in localStorage`);
    
    let fixed = false;
    
    // Check each banner for data URLs and try to fix them
    banners = banners.map(banner => {
      // If the image is a data URL, we need to replace it with a proper URL
      if (banner.currentImage && banner.currentImage.startsWith('data:')) {
        console.log(`⚠️ Found data URL for banner ${banner.id}, replacing with placeholder`);
        banner.currentImage = '/placeholder-default.svg';
        fixed = true;
      }
      return banner;
    });
    
    if (fixed) {
      // Save updated data
      localStorage.setItem('gang-boyz-homepage-banners', JSON.stringify(banners));
      console.log('✅ Banner data fixed and saved');
      
      // Force refresh
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
        window.dispatchEvent(new CustomEvent('forceBannerSync'));
      }, 100);
    } else {
      console.log('✅ No data URL issues found');
    }
    
  } catch (error) {
    console.error('❌ Error fixing banner data:', error);
  }
}

// Run the debug
debugBannerData();

console.log('\nTo manually run the debug, call: debugBannerData()');
console.log('To fix banner data, call: fixBannerImageData()');

export { debugBannerData, fixBannerImageData };