// Fix category images in Firebase
import { db, storage } from './lib/firebase-config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

async function fixCategoryImages() {
  try {
    console.log('🔧 Fixing category images in Firebase...');
    
    // Get all categories
    console.log('📋 Getting all categories...');
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${snapshot.size} categories to check:`);
    
    let fixedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const categoryId = docSnapshot.id;
      const categoryData = docSnapshot.data();
      
      console.log(`\n📊 Checking category: ${categoryData.name} (ID: ${categoryId})`);
      console.log(`  Current image: ${categoryData.image}`);
      
      // Check if image needs fixing
      if (!categoryData.image) {
        console.log(`  🛠️ Fixing missing image`);
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, {
          image: "/placeholder-category-circle.png"
        });
        console.log(`  ✅ Fixed missing image`);
        fixedCount++;
      } else if (categoryData.image && !categoryData.image.startsWith('http') && 
                 !categoryData.image.startsWith('/') && 
                 !categoryData.image.startsWith('data:')) {
        // This might be a Firebase Storage path, try to resolve it
        console.log(`  🛠️ Trying to resolve Firebase Storage path: ${categoryData.image}`);
        try {
          const imageRef = ref(storage, categoryData.image);
          const downloadURL = await getDownloadURL(imageRef);
          console.log(`  ✅ Resolved to download URL: ${downloadURL}`);
          
          // Update the category with the resolved URL
          const categoryRef = doc(db, 'categories', categoryId);
          await updateDoc(categoryRef, {
            image: downloadURL
          });
          console.log(`  ✅ Updated category with resolved URL`);
          fixedCount++;
        } catch (error) {
          console.log(`  ⚠️ Failed to resolve image path:`, error.message);
          // Set to placeholder as fallback
          const categoryRef = doc(db, 'categories', categoryId);
          await updateDoc(categoryRef, {
            image: "/placeholder-category-circle.png"
          });
          console.log(`  ✅ Set to placeholder image as fallback`);
          fixedCount++;
        }
      } else {
        console.log(`  ✅ Image looks good`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} categories`);
    console.log('🔧 Fix process completed');
    
  } catch (error) {
    console.error('❌ Fix process failed:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the fix
fixCategoryImages();