// Test Category Sync with Firebase
import { db } from './lib/firebase-config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

async function testCategorySync() {
  try {
    console.log('🧪 Testing Category Sync with Firebase...');
    
    // Test 1: Try to read from categories collection
    console.log('📋 Testing read access to categories collection...');
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    console.log(`✅ Read test successful. Found ${snapshot.size} active categories.`);
    
    // Test 2: Try to write a test document with proper structure
    console.log('📝 Testing write access to categories collection...');
    const testCategory = {
      name: 'Test Category',
      image: '/placeholder-category-circle.png',
      href: '/explore/test',
      description: 'Test category for sync verification',
      isActive: true
    };
    
    const docRef = await addDoc(categoriesRef, testCategory);
    console.log(`✅ Write test successful. Created test document with ID: ${docRef.id}`);
    
    // Test 3: Try to delete the test document
    console.log('🗑️ Testing delete access to categories collection...');
    await deleteDoc(docRef);
    console.log('✅ Delete test successful.');
    
    console.log('✅ Category sync test completed successfully!');
    console.log('🔧 If you continue to see 400 errors with categories, check your Firestore rules in the Firebase Console.');
    
  } catch (error) {
    console.error('❌ Category sync test failed:', error);
    console.error('🔧 Troubleshooting steps:');
    console.error('1. Check your Firestore rules in the Firebase Console');
    console.error('2. Ensure your rules allow read/write/delete access to the categories collection');
    console.error('3. Verify your Firebase project has the Firestore Database enabled');
    console.error('4. Check that your API key has the correct permissions');
    
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the test
testCategorySync();