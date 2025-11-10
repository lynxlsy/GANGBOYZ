// Script to test banner Firebase synchronization
console.log('=== Banner Firebase Sync Test ===');

async function testBannerFirebaseSync() {
  console.log('Testing banner Firebase synchronization...');
  
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
          console.log(`     Image: ${banner.currentImage.substring(0, 50)}...`);
          console.log(`     Image length: ${banner.currentImage ? banner.currentImage.length : 0}`);
        });
      } catch (e) {
        console.log('Could not parse banner data:', e.message);
        return;
      }
    } else {
      console.log('No banner data found in localStorage');
      // Create sample banner data for testing
      banners = [
        {
          id: 'test-banner-1',
          name: 'Test Banner 1',
          description: 'Test banner for Firebase sync',
          currentImage: '/placeholder-default.svg',
          mediaType: 'image',
          dimensions: '1920x1080px',
          format: 'image',
          position: 'Test Position'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(banners));
      console.log('Created sample banner data for testing');
    }
    
    // Test loading from Firebase
    console.log('\n--- Testing Firebase Load ---');
    try {
      const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage');
      console.log(`✅ Successfully loaded ${firebaseBanners.length} banners from Firebase`);
    } catch (error) {
      console.log('❌ Error loading from Firebase:', error.message);
    }
    
    // Test syncing to Firebase
    console.log('\n--- Testing Firebase Sync ---');
    for (const banner of banners) {
      try {
        await bannerSyncServiceV2.syncBannerToFirebase(banner);
        console.log(`✅ Banner ${banner.id} synced to Firebase successfully`);
      } catch (syncError) {
        console.log(`❌ Error syncing banner ${banner.id} to Firebase:`, syncError.message);
      }
    }
    
    // Test loading again to see if our banners are there
    console.log('\n--- Testing Firebase Load After Sync ---');
    try {
      const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage');
      console.log(`✅ Successfully loaded ${firebaseBanners.length} banners from Firebase after sync`);
      firebaseBanners.forEach((banner, index) => {
        console.log(`  ${index + 1}. ${banner.id}`);
        console.log(`     Name: ${banner.name}`);
        console.log(`     Image: ${banner.currentImage.substring(0, 50)}...`);
      });
    } catch (error) {
      console.log('❌ Error loading from Firebase after sync:', error.message);
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Error in banner Firebase sync test:', error);
  }
}

function showCurrentBannerData() {
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
              console.log(`       Name: ${banner.name}`);
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

// Run the test automatically
console.log('\nAvailable functions:');
console.log('- testBannerFirebaseSync(): Test banner Firebase synchronization');
console.log('- showCurrentBannerData(): Show current banner data in localStorage');

console.log('\nTo use, call one of the functions above in the console.');
console.log('Example: testBannerFirebaseSync()');

// Auto-run the test when the script is loaded
// testBannerFirebaseSync();

console.log('\n=== End Script ===');