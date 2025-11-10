// Test Category CRUD Operations with Firebase
import { db } from './lib/firebase-config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

async function testCategoryCRUD() {
  try {
    console.log('🧪 Testing Category CRUD Operations with Firebase...');
    
    // Test 1: Create a new category
    console.log('📝 Testing CREATE operation...');
    const testCategory = {
      name: 'Test CRUD Category',
      image: '/placeholder-category-circle.png',
      href: '/explore/test-crud',
      description: 'Test category for CRUD operations',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'categories'), testCategory);
    console.log(`✅ CREATE successful. Created test document with ID: ${docRef.id}`);
    
    // Test 2: Read the category
    console.log('📋 Testing READ operation...');
    const categoryDoc = await getDocs(query(collection(db, 'categories'), where('__name__', '==', docRef.id)));
    if (!categoryDoc.empty) {
      console.log('✅ READ successful. Found category:', categoryDoc.docs[0].data());
    } else {
      console.log('❌ READ failed. Category not found');
    }
    
    // Test 3: Update the category
    console.log('✏️ Testing UPDATE operation...');
    const updateData = {
      name: 'Updated Test CRUD Category',
      description: 'Updated test category for CRUD operations',
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    console.log('✅ UPDATE successful.');
    
    // Test 4: Delete the category
    console.log('🗑️ Testing DELETE operation...');
    await deleteDoc(docRef);
    console.log('✅ DELETE successful.');
    
    console.log('✅ All Category CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Category CRUD test failed:', error);
    
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
      console.error(`   Error message: ${error.message}`);
    }
  }
}

// Run the test
testCategoryCRUD();