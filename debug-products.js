// Diagnostic script to check product storage
console.log("=== Product Storage Diagnostic ===");

// Check all product-related localStorage keys
const productKeys = [
  "gang-boyz-test-products",
  "gang-boyz-dev-products",
  "gang-boyz-standalone-products",
  "gang-boyz-hot-products",
  "gang-boyz-recommendations"
];

productKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log(`\n${key}:`);
      console.log(`  Count: ${parsed.length}`);
      console.log(`  Sample IDs:`, parsed.slice(0, 3).map(p => p.id));
    } catch (e) {
      console.log(`\n${key}: Error parsing -`, e.message);
    }
  } else {
    console.log(`\n${key}: Not found`);
  }
});

// Check if we can find a specific product
const testId = "PROD"; // Partial ID to search for
console.log(`\n=== Searching for products with ID containing '${testId}' ===`);

const allProducts = [];
productKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      allProducts.push(...parsed.map(p => ({...p, source: key})));
    } catch (e) {
      console.log(`Error parsing ${key}:`, e.message);
    }
  }
});

const foundProducts = allProducts.filter(p => p.id && p.id.includes(testId));
console.log(`Found ${foundProducts.length} products with ID containing '${testId}':`);
foundProducts.forEach(p => {
  console.log(`  ${p.id} from ${p.source}`);
});