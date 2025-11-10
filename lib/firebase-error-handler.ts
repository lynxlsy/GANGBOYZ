// Firebase Error Handler
export interface FirebaseError extends Error {
  code?: string;
  message: string;
  customData?: any;
}

export class FirebaseErrorHandler {
  static handleAddCategoryError(error: FirebaseError, categoryData: any) {
    console.error('❌ Error adding category to Firebase:', error);
    console.error('📋 Category data that failed to save:', categoryData);
    
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          console.error('🔐 Permission denied: Check your Firestore rules');
          console.error('   Ensure your rules allow creating documents in the categories collection');
          break;
        case 'invalid-argument':
          console.error('📄 Invalid argument: Check the data format');
          console.error('   Verify all required fields are present and correctly formatted');
          break;
        case 'resource-exhausted':
          console.error('⚡ Resource exhausted: Firestore quota limit reached');
          console.error('   Check your Firebase project usage limits');
          break;
        default:
          console.error(`❓ Unknown error code: ${error.code}`);
          console.error('   Check Firebase documentation for this error code');
      }
    }
    
    // Log detailed error information
    if (error.customData) {
      console.error('📄 Error details:', error.customData);
    }
    
    // Return user-friendly error message
    return new Error(this.getUserFriendlyMessage(error));
  }
  
  static handleUpdateCategoryError(error: FirebaseError, categoryId: string, updates: any) {
    console.error(`❌ Error updating category ${categoryId} in Firebase:`, error);
    console.error('📋 Update data that failed to save:', updates);
    
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          console.error('🔐 Permission denied: Check your Firestore rules');
          console.error('   Ensure your rules allow updating documents in the categories collection');
          break;
        case 'not-found':
          console.error('🔍 Document not found: The category may have been deleted or does not exist yet');
          console.error('   Verify the category ID exists in the database, or add as new category');
          break;
        case 'invalid-argument':
          console.error('📄 Invalid argument: Check the data format');
          console.error('   Verify all fields are correctly formatted');
          break;
        default:
          console.error(`❓ Unknown error code: ${error.code}`);
          console.error('   Check Firebase documentation for this error code');
      }
    }
    
    // Log detailed error information
    if (error.customData) {
      console.error('📄 Error details:', error.customData);
    }
    
    // Return user-friendly error message
    return new Error(this.getUserFriendlyMessage(error));
  }
  
  static handleDeleteCategoryError(error: FirebaseError, categoryId: string) {
    console.error(`❌ Error deleting category ${categoryId} from Firebase:`, error);
    
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          console.error('🔐 Permission denied: Check your Firestore rules');
          console.error('   Ensure your rules allow deleting documents in the categories collection');
          break;
        case 'not-found':
          console.error('🔍 Document not found: The category may have already been deleted');
          console.error('   This might not be an error if the category was already removed');
          break;
        default:
          console.error(`❓ Unknown error code: ${error.code}`);
          console.error('   Check Firebase documentation for this error code');
      }
    }
    
    // Log detailed error information
    if (error.customData) {
      console.error('📄 Error details:', error.customData);
    }
    
    // Return user-friendly error message
    return new Error(this.getUserFriendlyMessage(error));
  }
  
  private static getUserFriendlyMessage(error: FirebaseError): string {
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          return 'Permission denied when accessing Firebase. Please check Firestore rules.';
        case 'not-found':
          return 'Category not found in database.';
        case 'invalid-argument':
          return 'Invalid data format when saving to Firebase.';
        case 'resource-exhausted':
          return 'Firebase quota limit reached. Please try again later.';
        default:
          return `Firebase error: ${error.message}`;
      }
    }
    return 'An unknown error occurred when accessing Firebase.';
  }
}