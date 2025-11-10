// Script to force banner synchronization with Firebase
console.log('=== Forcing Banner Synchronization ===');

async function forceBannerSync() {
  console.log('Forcing banner synchronization with Firebase...');
  
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
        banners.forEach((banner: any, index: number) => {
          console.log(`  ${index + 1}. ${banner.id}`);
          console.log(`     Name: ${banner.name}`);
          console.log(`     Image: ${banner.currentImage ? banner.currentImage.substring(0, 50) + '...' : 'None'}`);
          console.log(`     Image length: ${banner.currentImage ? banner.currentImage.length : 0}`);
        });
      } catch (e: any) {
        console.log('Could not parse banner data:', e.message);
        return;
      }
    } else {
      console.log('No banner data found in localStorage');
      return;
    }
    
    // Force sync all banners to Firebase
    console.log('\n--- Forcing Firebase Sync ---');
    let syncSuccess = 0;
    for (const banner of banners) {
      try {
        // Ensure banner has all required properties
        const bannerToSync = {
          id: banner.id || `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: banner.name || `Banner ${banner.id || 'unnamed'}`,
          description: banner.description || '',
          currentImage: banner.currentImage || '',
          mediaType: banner.mediaType || 'image',
          dimensions: banner.dimensions || '',
          format: banner.format || '',
          position: banner.position || '',
          // Only include cropMetadata and overlaySettings if they exist and are not empty
          ...(banner.cropMetadata && Object.keys(banner.cropMetadata).length > 0 && { cropMetadata: banner.cropMetadata }),
          ...(banner.overlaySettings && Object.keys(banner.overlaySettings).length > 0 && { overlaySettings: banner.overlaySettings })
        };
        
        // Skip if no image
        if (!bannerToSync.currentImage) {
          console.log(`⚠️ Skipping banner ${bannerToSync.id} - no image data`);
          continue;
        }
        
        // Check image size
        if (bannerToSync.currentImage.length > 1048487) { // ~1MB limite do Firestore
          console.log(`⚠️ Banner ${bannerToSync.id} image is too large (${Math.round(bannerToSync.currentImage.length / 1024)}KB). Skipping...`);
          continue;
        }
        
        await bannerSyncServiceV2.syncBannerToFirebase(bannerToSync);
        console.log(`✅ Banner ${bannerToSync.id} synced to Firebase successfully`);
        syncSuccess++;
      } catch (syncError: any) {
        console.log(`❌ Error syncing banner ${banner.id} to Firebase:`, syncError.message);
      }
    }
    
    console.log(`\n✅ Sync completed: ${syncSuccess}/${banners.length} banners synced`);
    
    // Test loading again to see if our banners are there
    console.log('\n--- Testing Firebase Load After Sync ---');
    try {
      const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage');
      console.log(`✅ Successfully loaded ${firebaseBanners.length} banners from Firebase after sync`);
      firebaseBanners.forEach((banner: any, index: number) => {
        console.log(`  ${index + 1}. ${banner.id}`);
        console.log(`     Name: ${banner.name}`);
        console.log(`     Image: ${banner.currentImage ? banner.currentImage.substring(0, 50) + '...' : 'None'}`);
      });
    } catch (error: any) {
      console.log('❌ Error loading from Firebase after sync:', error.message);
    }
    
    console.log('\n=== Banner Sync Force Complete ===');
    
  } catch (error: any) {
    console.error('Error in banner sync force:', error);
  }
}

// Run the force sync
forceBannerSync();

// Also export for manual calling
export { forceBannerSync };