// Debug existing categories in Firebase
import { db } from './lib/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function debugExistingCategories() {
  try {
    console.log('🔍 Debugging existing categories in Firebase...');
    
    // List all categories
    console.log('📋 Listing all categories...');
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log(`Found ${snapshot.size} categories:`);
    snapshot.forEach((doc) => {
      console.log(`  ID: ${doc.id}`);
      console.log(`  Data:`, doc.data());
      console.log('  ---');
    });
    
    // Check specific categories that might exist
    const commonCategoryNames = ['oversized', 'estampas', 'camisetas', 'calças', 'bonés'];
    
    for (const name of commonCategoryNames) {
      console.log(`\n🔍 Checking for category: ${name}`);
      const q = query(categoriesRef, where('name', '==', name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          console.log(`  Found: ID=${doc.id}, Data=`, doc.data());
        });
      } else {
        console.log(`  Not found`);
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
debugExistingCategories();