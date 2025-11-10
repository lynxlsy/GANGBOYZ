// Script to test Firebase synchronization
console.log('=== Firebase Sync Test Script ===');

async function testFirebaseSync() {
  console.log('Testing Firebase synchronization...');
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    // Check if Firebase is available
    let bannerSyncServiceV2;
    try {
      const module = await import('./lib/banner-sync-service-v2');
      bannerSyncServiceV2 = module.bannerSyncServiceV2;
      console.log('✅ Firebase service loaded successfully');
    } catch (error) {
      console.log('❌ Firebase service not available:', error.message);
      return;
    }
    
    // Check current localStorage data
    const storageKey = 'gang-boyz-homepage-banners';
    const savedBanners = localStorage.getItem(storageKey);
    console.log(`Current localStorage data for ${storageKey}:`);
    
    if (savedBanners) {
      try {
        const banners = JSON.parse(savedBanners);
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
      return;
    }
    
    // Test loading from Firebase
    console.log('\n--- Testing Firebase Load ---');
    try {
      const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage');
      console.log(`✅ Successfully loaded ${firebaseBanners.length} banners from Firebase (simulated)`);
    } catch (error) {
      console.log('❌ Error loading from Firebase:', error.message);
    }
    
    // Test syncing to Firebase
    console.log('\n--- Testing Firebase Sync ---');
    const savedBannersData = localStorage.getItem(storageKey);
    if (savedBannersData) {
      try {
        const banners = JSON.parse(savedBannersData);
        for (const banner of banners) {
          try {
            await bannerSyncServiceV2.syncBannerToFirebase(banner);
            console.log(`✅ Banner ${banner.id} synced to Firebase successfully`);
          } catch (syncError) {
            console.log(`❌ Error syncing banner ${banner.id} to Firebase:`, syncError.message);
          }
        }
      } catch (e) {
        console.log('Error parsing banner data for sync:', e.message);
      }
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Error in Firebase sync test:', error);
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

// Run the test automatically
console.log('\nAvailable functions:');
console.log('- testFirebaseSync(): Test Firebase synchronization');
console.log('- showCurrentBannerData(): Show current banner data in localStorage');
console.log('- clearBannerData(): Clear all banner data from localStorage');

console.log('\nTo use, call one of the functions above in the console.');
console.log('Example: testFirebaseSync()');

// Auto-run the test when the script is loaded
// testFirebaseSync();

console.log('\n=== End Script ===');