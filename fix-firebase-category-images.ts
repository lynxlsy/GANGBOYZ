// Script to fix invalid image URLs in Firebase categories
import { db } from './lib/firebase-config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

async function fixFirebaseCategoryImages() {
  try {
    console.log('🔧 Checking and fixing Firebase category images...');
    
    // Get all categories
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${snapshot.size} categories in Firebase`);
    
    let fixedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const categoryId = docSnapshot.id;
      const categoryData = docSnapshot.data();
      
      console.log(`\n📊 Checking category: ${categoryData.name} (ID: ${categoryId})`);
      console.log(`  Current image: "${categoryData.image}"`);
      
      // Check if image is invalid
      if (!categoryData.image || 
          categoryData.image.trim() === '' || 
          categoryData.image.trim() === 'null' || 
          categoryData.image.trim() === 'undefined') {
        console.log(`  ❌ Invalid image URL found, fixing...`);
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, {
          image: "/placeholder-category-circle.png"
        });
        console.log(`  ✅ Fixed image URL to placeholder`);
        fixedCount++;
      } else if (categoryData.image && 
                 !categoryData.image.startsWith('http') && 
                 !categoryData.image.startsWith('/') && 
                 !categoryData.image.startsWith('data:')) {
        // This might be a corrupted Firebase Storage path
        console.log(`  ⚠️ Suspicious image URL detected, setting to placeholder`);
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, {
          image: "/placeholder-category-circle.png"
        });
        console.log(`  ✅ Fixed suspicious image URL to placeholder`);
        fixedCount++;
      } else {
        console.log(`  ✅ Image URL looks valid`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} categories with invalid image URLs`);
    console.log('🔧 Fix process completed successfully!');
    
  } catch (error: any) {
    console.error('❌ Error fixing Firebase category images:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the fix
fixFirebaseCategoryImages();