// Script to test Firebase banner synchronization
console.log('=== Firebase Banner Synchronization Test ===');

async function testFirebaseBannerSync() {
  console.log('Testing Firebase banner synchronization...');
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    // Check if Firebase service is available
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
          console.log(`     Image: ${banner.currentImage ? banner.currentImage.substring(0, 50) + '...' : 'None'}`);
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
        console.log(`     Image: ${banner.currentImage ? banner.currentImage.substring(0, 50) + '...' : 'None'}`);
      });
    } catch (error) {
      console.log('❌ Error loading from Firebase after sync:', error.message);
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Error in Firebase sync test:', error);
  }
}

// Run the test
testFirebaseBannerSync();

console.log('\nTo manually run the test, call: testFirebaseBannerSync()');

export { testFirebaseBannerSync };