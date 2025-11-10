// Script to monitor banner synchronization performance
console.log('=== Monitoring Banner Synchronization Performance ===');

class BannerSyncMonitor {
  constructor() {
    this.syncTimes = [];
    this.listeners = [];
  }
  
  // Record sync time
  recordSync(start_time, end_time, banner_count, success) {
    const duration = end_time - start_time;
    this.syncTimes.push({
      timestamp: new Date(),
      duration: duration,
      banner_count: banner_count,
      success: success
    });
    
    console.log(`📊 Sync Performance: ${success ? '✅' : '❌'} ${duration}ms for ${banner_count} banners`);
    
    // Keep only last 50 records
    if (this.syncTimes.length > 50) {
      this.syncTimes.shift();
    }
    
    return duration;
  }
  
  // Get average sync time
  getAverageSyncTime() {
    if (this.syncTimes.length === 0) return 0;
    
    const successfulSyncs = this.syncTimes.filter(sync => sync.success);
    if (successfulSyncs.length === 0) return 0;
    
    const totalDuration = successfulSyncs.reduce((sum, sync) => sum + sync.duration, 0);
    return totalDuration / successfulSyncs.length;
  }
  
  // Get sync statistics
  getStats() {
    const totalSyncs = this.syncTimes.length;
    const successfulSyncs = this.syncTimes.filter(sync => sync.success).length;
    const failedSyncs = totalSyncs - successfulSyncs;
    const averageTime = this.getAverageSyncTime();
    
    return {
      totalSyncs,
      successfulSyncs,
      failedSyncs,
      successRate: totalSyncs > 0 ? (successfulSyncs / totalSyncs * 100).toFixed(1) : 0,
      averageTime: averageTime.toFixed(0),
      lastSync: this.syncTimes.length > 0 ? this.syncTimes[this.syncTimes.length - 1] : null
    };
  }
  
  // Print detailed report
  printReport() {
    const stats = this.getStats();
    console.log('\n📈 Banner Sync Performance Report:');
    console.log(`   Total Syncs: ${stats.totalSyncs}`);
    console.log(`   Successful: ${stats.successfulSyncs}`);
    console.log(`   Failed: ${stats.failedSyncs}`);
    console.log(`   Success Rate: ${stats.successRate}%`);
    console.log(`   Average Time: ${stats.averageTime}ms`);
    
    if (stats.lastSync) {
      console.log(`   Last Sync: ${stats.lastSync.timestamp.toLocaleTimeString()}`);
      console.log(`   Last Duration: ${stats.lastSync.duration}ms`);
      console.log(`   Last Banner Count: ${stats.lastSync.banner_count}`);
    }
  }
}

// Create global instance
const bannerSyncMonitor = new BannerSyncMonitor();

// Monitor Firebase banner updates
if (typeof window !== 'undefined') {
  // Listen for banner sync events
  window.addEventListener('bannerFirebaseSync', (event) => {
    console.log(`🔔 Banner ${event.detail.bannerId} synced to Firebase`);
  });
  
  // Listen for banner sync errors
  window.addEventListener('bannerFirebaseSyncError', (event) => {
    console.log(`❌ Banner ${event.detail.bannerId} sync failed: ${event.detail.error}`);
  });
  
  // Listen for homepage banner updates
  window.addEventListener('homepageBannerUpdate', () => {
    console.log('🔄 Homepage banners updated');
  });
}

// Function to test sync performance
async function testSyncPerformance() {
  console.log('🚀 Testing banner sync performance...');
  
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
    
    let banners = [];
    if (savedBanners) {
      try {
        banners = JSON.parse(savedBanners);
      } catch (e) {
        console.log('Could not parse banner data:', e.message);
        return;
      }
    }
    
    // Time the sync operation
    const startTime = performance.now();
    
    // Test loading from Firebase
    try {
      const firebaseBanners = await bannerSyncServiceV2.loadBannersFromFirebase('homepage');
      const endTime = performance.now();
      
      // Record the sync
      bannerSyncMonitor.recordSync(startTime, endTime, firebaseBanners.length, true);
      
      console.log(`✅ Successfully loaded ${firebaseBanners.length} banners from Firebase in ${Math.round(endTime - startTime)}ms`);
    } catch (error) {
      const endTime = performance.now();
      bannerSyncMonitor.recordSync(startTime, endTime, banners.length, false);
      console.log('❌ Error loading from Firebase:', error.message);
    }
    
    // Print report
    bannerSyncMonitor.printReport();
    
  } catch (error) {
    console.error('Error in sync performance test:', error);
  }
}

// Run initial test
testSyncPerformance();

// Set up periodic monitoring
if (typeof window !== 'undefined') {
  setInterval(() => {
    bannerSyncMonitor.printReport();
  }, 60000); // Print report every minute
}

console.log('\n🔬 To test sync performance, call: testSyncPerformance()');
console.log('📊 To view stats, call: bannerSyncMonitor.getStats()');
console.log('📋 To view full report, call: bannerSyncMonitor.printReport()');

export { bannerSyncMonitor, testSyncPerformance };