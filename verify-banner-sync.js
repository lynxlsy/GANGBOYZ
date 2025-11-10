// Script to verify banner synchronization is working
console.log('=== Verifying Banner Synchronization ===');

async function verifyBannerSync() {
  console.log('Checking banner synchronization status...');
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    // Check if Firebase sync service is available
    let bannerSyncServiceV2;
    try {
      const module = await import('./lib/banner-sync-service-v2');
      bannerSyncServiceV2 = module.bannerSyncServiceV2;
      console.log('✅ Firebase banner sync service loaded successfully');
    } catch (error) {
      console.log('❌ Firebase banner sync service not available:', error.message);
      return;
    }
    
    // Check current localStorage data
    const storageKey = 'gang-boyz-homepage-banners';
    const savedBanners = localStorage.getItem(storageKey);
    console.log(`Current localStorage data for ${storageKey}:`);
    
    let banners = [];
    if (savedBanners) {
      try {
        banners = JSON.parse(savedBanners);
        console.log(`Found ${banners.length} banners:`);
        banners.forEach((banner, index) => {
          console.log(`  ${index + 1}. ${banner.id}`);
          console.log(`     Name: ${banner.name}`);
          console.log(`     Image size: ${banner.currentImage ? `${Math.round(banner.currentImage.length / 1024)}KB` : 'None'}`);
          console.log(`     Has cropMetadata: ${!!banner.cropMetadata}`);
          console.log(`     Has overlaySettings: ${!!banner.overlaySettings}`);
        });
      } catch (e) {
        console.log('Could not parse banner data:', e.message);
        return;
      }
    } else {
      console.log('No banner data found in localStorage');
      return;
    }
    
    // Test loading from Firebase
    console.log('\n--- Testing Firebase Load ---');
    try {
      const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage');
      console.log(`✅ Successfully loaded ${firebaseBanners.length} banners from Firebase`);
      
      if (firebaseBanners.length > 0) {
        console.log('Firebase banners:');
        firebaseBanners.forEach((banner, index) => {
          console.log(`  ${index + 1}. ${banner.id}`);
          console.log(`     Name: ${banner.name}`);
          console.log(`     Image size: ${banner.currentImage ? `${Math.round(banner.currentImage.length / 1024)}KB` : 'None'}`);
        });
      }
    } catch (error) {
      console.log('❌ Error loading from Firebase:', error.message);
    }
    
    console.log('\n=== Verification Complete ===');
    
  } catch (error) {
    console.error('Error in banner sync verification:', error);
  }
}

// Run the verification
verifyBannerSync();

console.log('\nTo manually run the verification, call: verifyBannerSync()');

export { verifyBannerSync };