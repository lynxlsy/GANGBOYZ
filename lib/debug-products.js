// Debug script to check product data in localStorage
console.log("=== Product Debug Info ===");

try {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.localStorage) {
    console.log("Checking localStorage for products...");
    
    // Check all possible product storage keys
    const productKeys = [
      "gang-boyz-test-products",
      "gang-boyz-products",
      "gang-boyz-standalone-products",
      "gang-boyz-recommendations"
    ];
    
    productKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const products = JSON.parse(data);
          console.log(`\n${key}:`);
          console.log(`  Found ${products.length} products`);
          products.forEach((product, index) => {
            console.log(`    Product ${index + 1}:`);
            console.log(`      ID: ${product.id}`);
            console.log(`      Name: ${product.name}`);
            console.log(`      Categories: ${JSON.stringify(product.categories)}`);
            console.log(`      Status: ${product.status}`);
          });
        } catch (parseError) {
          console.log(`${key}: Error parsing data - ${parseError.message}`);
        }
      } else {
        console.log(`${key}: No data found`);
      }
    });
  } else {
    console.log("Not in browser environment, cannot access localStorage");
  }
} catch (error) {
  console.error("Error accessing localStorage:", error.message);
}

console.log("\n=== Category Config Info ===");
try {
  // Simulate category config data
  const CATEGORY_CONFIGS = {
    'praia': {
      category: 'Shorts/Bermudas',
      subcategory: 'Praia'
    },
    'manga-curta': {
      category: 'Camisetas',
      subcategory: 'Manga Curta'
    }
  };
  
  console.log("Sample category configs:");
  Object.keys(CATEGORY_CONFIGS).forEach(key => {
    console.log(`  ${key}: ${CATEGORY_CONFIGS[key].category} / ${CATEGORY_CONFIGS[key].subcategory}`);
  });
} catch (error) {
  console.error("Error with category config:", error.message);
}