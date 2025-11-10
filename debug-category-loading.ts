// Script to debug category loading and image URLs
import { db } from './lib/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

async function debugCategoryLoading() {
  try {
    console.log('🔍 Debugging category loading and image URLs...');
    
    // Get all categories
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${snapshot.size} categories in Firebase:`);
    
    for (const docSnapshot of snapshot.docs) {
      const categoryId = docSnapshot.id;
      const categoryData = docSnapshot.data();
      
      console.log(`\n📊 Category: ${categoryData.name} (ID: ${categoryId})`);
      console.log(`  Image field: "${categoryData.image}"`);
      console.log(`  Image type: ${typeof categoryData.image}`);
      console.log(`  Image length: ${categoryData.image ? categoryData.image.length : 0}`);
      
      // Check if image is valid
      if (!categoryData.image) {
        console.log(`  ❌ No image URL provided`);
      } else if (categoryData.image.trim() === '') {
        console.log(`  ❌ Empty image URL`);
      } else if (categoryData.image.startsWith('http')) {
        console.log(`  ✅ Valid HTTP URL`);
      } else if (categoryData.image.startsWith('/')) {
        console.log(`  ✅ Valid local path`);
      } else if (categoryData.image.startsWith('data:')) {
        console.log(`  ✅ Valid base64 data URL`);
      } else {
        console.log(`  ⚠️ Unknown image URL format`);
      }
    }
    
    console.log('\n✅ Debug process completed');
    
  } catch (error: any) {
    console.error('❌ Error debugging category loading:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the debug
debugCategoryLoading();