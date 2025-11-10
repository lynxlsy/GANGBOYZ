// Firebase Admin Configuration
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { credential } from 'firebase-admin';

// Initialize Firebase Admin
let app: any;
let db: any;
let storage: any;

try {
  // Try to initialize with service account key
  app = initializeApp({
    credential: applicationDefault(),
  });
  
  // Initialize services
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization failed:', error);
  
  // Initialize with mock objects to prevent crashes
  app = { name: 'mock-admin-app' };
  db = { type: 'mock-admin-db' };
  storage = { type: 'mock-admin-storage' };
}

export { db as adminDb, storage as adminStorage };
export default app;