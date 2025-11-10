// Script to test and verify banner proportions
console.log('=== Testing Banner Proportions ===');

function testBannerProportions() {
  console.log('Testing banner proportions...');
  
  // Test hero section
  const heroSections = document.querySelectorAll('.hero-section');
  heroSections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    console.log(`Hero Section ${index + 1}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)} (aspect ratio: ${aspectRatio.toFixed(2)})`);
    
    // Check if it's within expected range for hero banners
    const expectedRatios = [16/9, 1507/1333]; // Common hero banner ratios
    const isClose = expectedRatios.some(ratio => Math.abs(aspectRatio - ratio) < 0.1);
    console.log(`  Expected ratio: ${expectedRatios.join(' or ')}`);
    console.log(`  Within expected range: ${isClose ? '✅' : '❌'}`);
  });
  
  // Test banner renderers
  const bannerRenderers = document.querySelectorAll('.banner-renderer');
  bannerRenderers.forEach((renderer, index) => {
    const rect = renderer.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    console.log(`Banner Renderer ${index + 1}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)} (aspect ratio: ${aspectRatio.toFixed(2)})`);
    
    // Check computed aspect ratio from style
    const computedStyle = window.getComputedStyle(renderer);
    const aspectRatioStyle = computedStyle.aspectRatio;
    console.log(`  CSS aspect-ratio: ${aspectRatioStyle}`);
  });
  
  // Test images within banners
  const bannerImages = document.querySelectorAll('.hero-section img, .banner-renderer img');
  bannerImages.forEach((img, index) => {
    const rect = img.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    console.log(`Banner Image ${index + 1}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)} (aspect ratio: ${aspectRatio.toFixed(2)})`);
    
    // Check object-fit property
    const computedStyle = window.getComputedStyle(img);
    const objectFit = computedStyle.objectFit;
    console.log(`  object-fit: ${objectFit}`);
  });
}

// Run the test
setTimeout(testBannerProportions, 1000);

console.log('\nTo manually run the test, call: testBannerProportions()');

export { testBannerProportions };