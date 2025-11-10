import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    // Check if Firebase is properly configured
    if (!db || (db as any).type === 'mock-db') {
      return NextResponse.json({ 
        success: false, 
        message: 'Firebase is not properly configured' 
      }, { status: 500 });
    }

    // Test Firestore connection by creating a test document
    const testCollection = collection(db, 'test-connection');
    const testDoc = await addDoc(testCollection, {
      timestamp: serverTimestamp(),
      message: 'Firebase connection test from API route',
      endpoint: '/api/firebase-test'
    });

    // Count documents in the test collection
    const snapshot = await getDocs(testCollection);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Firebase connection successful',
      documentId: testDoc.id,
      documentCount: snapshot.size
    });
    
  } catch (error: any) {
    console.error('Firebase test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Firebase connection failed',
      error: error.message
    }, { status: 500 });
  }
}