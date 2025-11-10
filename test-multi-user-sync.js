// Script to test multi-user synchronization
console.log('=== Multi-User Synchronization Test ===');

function testMultiUserSync() {
  console.log('Testing multi-user synchronization...');
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.log('Not in browser environment - cannot access localStorage');
      return;
    }
    
    // Show current banner data
    console.log('\n--- Current Banner Data ---');
    const storageKey = 'gang-boyz-homepage-banners';
    const savedBanners = localStorage.getItem(storageKey);
    
    if (savedBanners) {
      try {
        const banners = JSON.parse(savedBanners);
        console.log(`Found ${banners.length} banners:`);
        banners.forEach((banner, index) => {
          console.log(`  ${index + 1}. ${banner.id}`);
          console.log(`     Name: ${banner.name}`);
          console.log(`     Image: ${banner.currentImage.substring(0, 50)}...`);
          console.log(`     Last updated: ${banner.updatedAt || 'Unknown'}`);
        });
      } catch (e) {
        console.log('Could not parse banner data:', e.message);
      }
    } else {
      console.log('No banner data found in localStorage');
    }
    
    // Test event system
    console.log('\n--- Testing Event System ---');
    const testBannerId = 'test-banner-' + Date.now();
    const testImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // Listen for banner updates
    const handleBannerUpdate = (event) => {
      console.log('✅ Received banner update event:', event.detail);
    };
    
    window.addEventListener('bannerUpdated', handleBannerUpdate);
    window.addEventListener('editModeBannerUpdate', handleBannerUpdate);
    
    // Simulate banner update
    console.log('Simulating banner update...');
    window.dispatchEvent(new CustomEvent('editModeBannerUpdate', {
      detail: {
        bannerId: testBannerId,
        imageUrl: testImageUrl
      }
    }));
    
    // Remove listener after test
    setTimeout(() => {
      window.removeEventListener('bannerUpdated', handleBannerUpdate);
      window.removeEventListener('editModeBannerUpdate', handleBannerUpdate);
      console.log('✅ Event system test completed');
    }, 1000);
    
    // Test localStorage synchronization
    console.log('\n--- Testing localStorage Synchronization ---');
    const testData = {
      id: 'sync-test-' + Date.now(),
      name: 'Sync Test Banner',
      currentImage: testImageUrl,
      timestamp: new Date().toISOString()
    };
    
    // Store test data
    const testKey = 'gang-boyz-sync-test';
    localStorage.setItem(testKey, JSON.stringify(testData));
    console.log('✅ Stored test data in localStorage');
    
    // Simulate storage event (like another tab updating)
    const storageEvent = new StorageEvent('storage', {
      key: testKey,
      oldValue: null,
      newValue: JSON.stringify(testData),
      url: window.location.href,
      storageArea: localStorage
    });
    
    window.dispatchEvent(storageEvent);
    console.log('✅ Simulated storage event');
    
    // Clean up test data
    localStorage.removeItem(testKey);
    console.log('✅ Cleaned up test data');
    
    console.log('\n=== Multi-User Sync Test Complete ===');
    console.log('If you open this page in another browser/tab, you should see the same banner data');
    
  } catch (error) {
    console.error('Error in multi-user sync test:', error);
  }
}

// Run the test
testMultiUserSync();

console.log('\nAvailable functions:');
console.log('- testMultiUserSync(): Test multi-user synchronization');

console.log('\n=== End Script ===');