// Script to fix hero section styles dynamically
console.log('=== Fixing Hero Section Styles ===');

function fixHeroSectionStyles() {
  console.log('Checking and fixing hero section styles...');
  
  // Find all hero sections
  const heroSections = document.querySelectorAll('.hero-section');
  
  heroSections.forEach((section, index) => {
    console.log(`Checking hero section ${index + 1}...`);
    
    // Set fixed height to 800px as requested
    section.style.height = '800px';
    section.style.minHeight = '800px';
    section.style.maxHeight = '800px';
    
    console.log(`  ✅ Hero section ${index + 1} set to 800px height`);
  });
}

// Run the fix immediately
fixHeroSectionStyles();

// Run the fix again after a short delay to catch any dynamic changes
setTimeout(fixHeroSectionStyles, 1000);

// Set up a MutationObserver to watch for style changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const target = mutation.target;
      if (target.classList && target.classList.contains('hero-section')) {
        // Ensure the height stays at 800px
        target.style.height = '800px';
        target.style.minHeight = '800px';
        target.style.maxHeight = '800px';
      }
    }
  });
});

// Start observing
observer.observe(document.body, {
  attributes: true,
  subtree: true,
  attributeFilter: ['style']
});

console.log('\nHero section style fixer is now active (800px height enforced).');

// Export the function for manual use
export { fixHeroSectionStyles };