// Script to verify Firebase synchronization is working
console.log('=== Firebase Synchronization Verification ===');

async function verifyFirebaseSync() {
  console.log('Verifying Firebase synchronization...');
  
  try {
    // Test Firebase connection
    const response = await fetch('/api/firebase-test');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Firebase connection: SUCCESS');
      console.log(`   Document ID: ${data.documentId}`);
      console.log(`   Document Count: ${data.documentCount}`);
    } else {
      console.log('❌ Firebase connection: FAILED');
      console.log(`   Error: ${data.message}`);
      return;
    }
    
    // Test banner sync service
    try {
      const { bannerSyncServiceV2 } = await import('./lib/banner-sync-service-v2');
      if (bannerSyncServiceV2) {
        console.log('✅ Banner sync service: AVAILABLE');
        
        // Check if service is initialized
        const status = await bannerSyncServiceV2.getSyncStatus();
        console.log(`   Sync status: ${status.isOnline ? 'ONLINE' : 'OFFLINE'}`);
        console.log(`   Last sync: ${status.lastSync ? new Date(status.lastSync).toISOString() : 'Never'}`);
      } else {
        console.log('❌ Banner sync service: NOT AVAILABLE');
      }
    } catch (error) {
      console.log('❌ Banner sync service: ERROR');
      console.log(`   Error: ${error.message}`);
    }
    
    // Check localStorage for banner data
    console.log('\n--- Local Storage Banner Data ---');
    const bannerKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('banner')) {
        bannerKeys.push(key);
      }
    }
    
    if (bannerKeys.length > 0) {
      console.log(`✅ Found ${bannerKeys.length} banner-related keys:`);
      bannerKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              console.log(`   ${key}: ${parsed.length} banners`);
              parsed.forEach((banner, index) => {
                console.log(`     ${index + 1}. ${banner.id} - ${banner.name}`);
                console.log(`        Image: ${banner.currentImage ? (banner.currentImage.length > 50 ? banner.currentImage.substring(0, 50) + '...' : banner.currentImage) : 'None'}`);
              });
            } else {
              console.log(`   ${key}: ${typeof parsed}`);
            }
          } catch (e) {
            console.log(`   ${key}: Unable to parse data`);
          }
        } else {
          console.log(`   ${key}: No data`);
        }
      });
    } else {
      console.log('⚠️ No banner data found in localStorage');
    }
    
    console.log('\n=== Verification Complete ===');
    
  } catch (error) {
    console.error('Error during verification:', error);
  }
}

// Run verification
verifyFirebaseSync();

console.log('\nTo run again, call: verifyFirebaseSync()');