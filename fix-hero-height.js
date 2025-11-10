// Script to fix and verify hero section height
console.log('=== Fixing Hero Section Height ===');

function fixHeroHeight() {
  console.log('Checking hero section height configuration...');
  
  try {
    // Check localStorage
    const localStorageHeight = localStorage.getItem('hero-section-height');
    console.log('LocalStorage height:', localStorageHeight);
    
    // Check if we're in edit mode
    const isEditMode = localStorage.getItem('gang-boyz-edit-mode') === 'true';
    console.log('Edit mode:', isEditMode);
    
    // Get current hero section if it exists
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const currentHeight = heroSection.style.height;
      console.log('Current hero section height:', currentHeight);
      
      // If there's a localStorage value, apply it
      if (localStorageHeight) {
        const height = parseInt(localStorageHeight, 10);
        if (!isNaN(height) && height >= 300 && height <= 1200) {
          heroSection.style.height = height + 'px';
          console.log('Applied height from localStorage:', height + 'px');
        }
      }
    }
    
    console.log('✅ Hero height configuration checked');
    
  } catch (error) {
    console.error('❌ Error checking hero height:', error);
  }
}

// Run the fix
fixHeroHeight();

// Also run when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fixHeroHeight);
} else {
  fixHeroHeight();
}

// Watch for changes
setInterval(fixHeroHeight, 5000);

console.log('\nTo manually run the fix, call: fixHeroHeight()');

export { fixHeroHeight };