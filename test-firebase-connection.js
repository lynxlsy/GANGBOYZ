// Test Firebase connection and category reading
import { db } from './lib/firebase-config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection and category reading...');
    
    // Test 1: Check if we can access the categories collection
    console.log('📋 Testing access to categories collection...');
    const categoriesRef = collection(db, 'categories');
    console.log('✅ Categories collection reference created');
    
    // Test 2: Try a simple query
    console.log('📝 Testing simple query (all categories)...');
    const allQuery = query(categoriesRef);
    const allSnapshot = await getDocs(allQuery);
    console.log(`✅ Simple query successful. Found ${allSnapshot.size} total categories`);
    
    // Test 3: Try the active categories query
    console.log('📝 Testing active categories query...');
    const activeQuery = query(categoriesRef, where('isActive', '==', true));
    const activeSnapshot = await getDocs(activeQuery);
    console.log(`✅ Active categories query successful. Found ${activeSnapshot.size} active categories`);
    
    // Test 4: Try the full query with ordering
    console.log('📝 Testing full query with ordering...');
    const fullQuery = query(
      categoriesRef, 
      where('isActive', '==', true),
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc')
    );
    const fullSnapshot = await getDocs(fullQuery);
    console.log(`✅ Full query successful. Found ${fullSnapshot.size} ordered categories`);
    
    // Show some category data
    if (!fullSnapshot.empty) {
      console.log('📋 Sample categories:');
      const categories = [];
      fullSnapshot.forEach((doc, index) => {
        if (index < 3) { // Show first 3
          categories.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
      console.log(categories);
    }
    
    console.log('✅ All Firebase tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the test
testFirebaseConnection();