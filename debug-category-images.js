// Debug category images in Firebase
import { db, storage } from './lib/firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

async function debugCategoryImages() {
  try {
    console.log('🔍 Debugging category images in Firebase...');
    
    // Get all categories
    console.log('📋 Getting all categories...');
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${snapshot.size} categories:`);
    
    for (const doc of snapshot.docs) {
      const categoryId = doc.id;
      const categoryData = doc.data();
      
      console.log(`\n📊 Category: ${categoryData.name} (ID: ${categoryId})`);
      console.log(`  Image field: ${categoryData.image}`);
      
      // Check if image is a URL or needs to be fetched from Storage
      if (categoryData.image) {
        if (categoryData.image.startsWith('http')) {
          console.log(`  ✅ Image is a direct URL`);
        } else if (categoryData.image.startsWith('/')) {
          console.log(`  ✅ Image is a local path`);
        } else if (categoryData.image.startsWith('data:')) {
          console.log(`  ✅ Image is base64 data`);
        } else {
          // Might be a Firebase Storage path
          console.log(`  ⚠️ Image might be a Firebase Storage path, trying to get download URL...`);
          try {
            const imageRef = ref(storage, categoryData.image);
            const downloadURL = await getDownloadURL(imageRef);
            console.log(`  ✅ Successfully resolved to download URL: ${downloadURL}`);
          } catch (error) {
            console.log(`  ❌ Failed to resolve image path:`, error.message);
          }
        }
      } else {
        console.log(`  ⚠️ No image field`);
      }
    }
    
    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the debug
debugCategoryImages();