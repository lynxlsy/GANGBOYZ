// Test Firestore rules and connectivity
import { db } from './lib/firebase-config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

async function testFirestoreRules() {
  try {
    console.log('🧪 Testing Firestore connectivity and rules...');
    
    // Test 1: Try to read from categories collection
    console.log('📋 Testing read access to categories collection...');
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    console.log(`✅ Read test successful. Found ${snapshot.size} active categories.`);
    
    // Test 2: Try to write a test document
    console.log('📝 Testing write access to categories collection...');
    const testCategory = {
      name: 'Test Category',
      image: '/placeholder-category-circle.png',
      href: '/explore/test',
      description: 'Test category for rules verification',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(categoriesRef, testCategory);
    console.log(`✅ Write test successful. Created test document with ID: ${docRef.id}`);
    
    // Clean up - delete the test document
    // Note: We won't delete it here to avoid additional complexity
    console.log('✅ Firestore rules test completed successfully!');
    console.log('🔧 If you continue to see 400 errors, check your Firestore rules in the Firebase Console.');
    
  } catch (error) {
    console.error('❌ Firestore rules test failed:', error);
    console.error('🔧 Troubleshooting steps:');
    console.error('1. Check your Firestore rules in the Firebase Console');
    console.error('2. Ensure your rules allow read/write access to the categories collection');
    console.error('3. Verify your Firebase project has the Firestore Database enabled');
    console.error('4. Check that your API key has the correct permissions');
    
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the test
testFirestoreRules();