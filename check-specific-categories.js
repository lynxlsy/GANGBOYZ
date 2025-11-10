// Check specific categories like "oversized" and "estampas"
import { db } from './lib/firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function checkSpecificCategories() {
  try {
    console.log('🔍 Checking specific categories: oversized, estampas');
    
    const categoriesRef = collection(db, 'categories');
    
    // Check for "oversized"
    console.log('\n📋 Checking for "oversized" category...');
    const oversizedQuery = query(categoriesRef, where('name', '==', 'oversized'));
    const oversizedSnapshot = await getDocs(oversizedQuery);
    
    if (!oversizedSnapshot.empty) {
      oversizedSnapshot.forEach((doc) => {
        console.log(`✅ Found oversized: ID=${doc.id}, Data=`, doc.data());
      });
    } else {
      console.log('❌ "oversized" category not found');
    }
    
    // Check for "estampas"
    console.log('\n📋 Checking for "estampas" category...');
    const estampasQuery = query(categoriesRef, where('name', '==', 'estampas'));
    const estampasSnapshot = await getDocs(estampasQuery);
    
    if (!estampasSnapshot.empty) {
      estampasSnapshot.forEach((doc) => {
        console.log(`✅ Found estampas: ID=${doc.id}, Data=`, doc.data());
      });
    } else {
      console.log('❌ "estampas" category not found');
    }
    
    // Check for categories with similar names
    console.log('\n📋 Checking for categories with similar names...');
    const allCategoriesSnapshot = await getDocs(categoriesRef);
    
    allCategoriesSnapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.name?.toLowerCase() || '';
      
      if (name.includes('oversized') || name.includes('estampa')) {
        console.log(`✅ Similar category: ID=${doc.id}, Name=${data.name}, Data=`, data);
      }
    });
    
    console.log('\n✅ Check completed');
    
  } catch (error) {
    console.error('❌ Check failed:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the check
checkSpecificCategories();