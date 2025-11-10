// Script to debug banner data structure
console.log('=== Banner Structure Debug ===');

// Function to validate banner data
function validateBannerData(banner) {
  const issues = [];
  
  if (!banner) {
    issues.push('Banner is null or undefined');
    return issues;
  }
  
  // Check required fields
  if (!banner.id) issues.push('Missing id field');
  if (!banner.name) issues.push('Missing name field');
  if (!banner.currentImage) issues.push('Missing currentImage field');
  if (!banner.mediaType) issues.push('Missing mediaType field');
  if (!banner.dimensions) issues.push('Missing dimensions field');
  if (!banner.position) issues.push('Missing position field');
  
  // Validate image URL
  if (banner.currentImage) {
    if (typeof banner.currentImage !== 'string') {
      issues.push('currentImage is not a string');
    } else if (!banner.currentImage.startsWith('data:') && !banner.currentImage.startsWith('http')) {
      issues.push('currentImage is not a valid URL or data URL');
    }
  }
  
  // Validate media type
  const validMediaTypes = ['image', 'video', 'gif'];
  if (banner.mediaType && !validMediaTypes.includes(banner.mediaType)) {
    issues.push(`Invalid mediaType: ${banner.mediaType}`);
  }
  
  return issues;
}

// Check localStorage for banner data
if (typeof localStorage !== 'undefined') {
  console.log('Checking localStorage for banner data...');
  
  // Check all localStorage keys
  const bannerKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('banner')) {
      bannerKeys.push(key);
    }
  }
  
  console.log('Found banner keys:', bannerKeys);
  
  // Check each banner key
  bannerKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      console.log(`\n${key}:`);
      
      if (!data) {
        console.log('  No data found');
        return;
      }
      
      console.log(`  Data size: ${data.length} characters`);
      
      const parsed = JSON.parse(data);
      console.log(`  Parsed type: ${typeof parsed}`);
      
      if (Array.isArray(parsed)) {
        console.log(`  Array length: ${parsed.length}`);
        parsed.forEach((banner, index) => {
          console.log(`    Banner ${index}:`);
          console.log(`      ID: ${banner.id}`);
          console.log(`      Name: ${banner.name}`);
          console.log(`      Image URL: ${banner.currentImage ? banner.currentImage.substring(0, 100) + '...' : 'undefined'}`);
          console.log(`      Image length: ${banner.currentImage ? banner.currentImage.length : 'undefined'}`);
          console.log(`      Media type: ${banner.mediaType}`);
          
          // Validate banner
          const issues = validateBannerData(banner);
          if (issues.length > 0) {
            console.log(`      Issues:`, issues);
          } else {
            console.log(`      Status: Valid`);
          }
        });
      } else {
        console.log(`  Data:`, parsed);
      }
    } catch (error) {
      console.log(`  Error parsing data:`, error.message);
    }
  });
} else {
  console.log('localStorage not available');
}

console.log('\n=== End Debug ===');