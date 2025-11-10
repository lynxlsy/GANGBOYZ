// Test editing an existing category in Firebase
import { db } from './lib/firebase-config';
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

async function testEditExistingCategory() {
  try {
    console.log('🧪 Testing edit of existing category...');
    
    // First, find an existing category
    console.log('📋 Finding existing categories...');
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      console.log('❌ No categories found in Firebase');
      return;
    }
    
    // Get the first category to test editing
    const firstCategory = snapshot.docs[0];
    const categoryId = firstCategory.id;
    const categoryData = firstCategory.data();
    
    console.log(`✅ Found category to test:`);
    console.log(`  ID: ${categoryId}`);
    console.log(`  Name: ${categoryData.name}`);
    console.log(`  Current data:`, categoryData);
    
    // Test updating the category
    console.log('\n✏️ Testing UPDATE operation...');
    const updateData = {
      name: `${categoryData.name} - Updated`,
      description: categoryData.description ? `${categoryData.description} (updated)` : 'Updated description',
      updatedAt: serverTimestamp()
    };
    
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, updateData);
    
    console.log('✅ UPDATE successful!');
    console.log(`  Updated category ${categoryId} with:`, updateData);
    
    // Restore original name to not mess up the data
    console.log('\n🔄 Restoring original data...');
    const restoreData = {
      name: categoryData.name,
      description: categoryData.description || '',
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(categoryRef, restoreData);
    console.log('✅ Original data restored');
    
    console.log('\n✅ Edit test completed successfully!');
    
  } catch (error) {
    console.error('❌ Edit test failed:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the test
testEditExistingCategory();