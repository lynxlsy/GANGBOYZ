// Firebase Storage Service
import { adminStorage } from './firebase-admin-config';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

class FirebaseStorageService {
  // Upload de imagem para o Firebase Storage
  async uploadImage(base64Image: string, folder: string = 'images'): Promise<string> {
    try {
      // Verificar se o Storage está disponível
      if (!adminStorage || adminStorage.type === 'mock-admin-storage') {
        throw new Error('Firebase Storage not available');
      }
      
      // Gerar nome único para a imagem
      const fileName = `${uuidv4()}.jpg`;
      const storageRef = ref(adminStorage, `${folder}/${fileName}`);
      
      // Otimizar imagem se for muito grande
      let optimizedImage = base64Image;
      if (base64Image.length > 2 * 1024 * 1024) { // 2MB
        console.log('⚠️ Imagem grande detectada, otimizando...');
        optimizedImage = await this.optimizeImage(base64Image);
      }
      
      // Upload da imagem
      await uploadString(storageRef, optimizedImage, 'data_url');
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log(`✅ Image uploaded successfully: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading image to Firebase Storage:', error);
      throw error;
    }
  }
  
  // Função para otimizar imagens grandes
  private async optimizeImage(base64Image: string): Promise<string> {
    try {
      // Para imagens muito grandes, apenas retornar a imagem original
      // A otimização anterior estava corrompendo as imagens ao truncar a string base64
      console.log('⚠️ Imagem grande detectada, usando imagem original sem otimização...');
      return base64Image;
    } catch (error) {
      console.warn('⚠️ Erro ao processar imagem, usando original:', error);
      return base64Image;
    }
  }
  
  // Upload de banner para o Firebase Storage
  async uploadBanner(base64Image: string, bannerId: string): Promise<string> {
    try {
      // Verificar se o Storage está disponível
      if (!adminStorage || adminStorage.type === 'mock-admin-storage') {
        throw new Error('Firebase Storage not available');
      }
      
      // Usar o ID do banner como nome do arquivo
      const fileName = `${bannerId}.jpg`;
      const storageRef = ref(adminStorage, `banners/${fileName}`);
      
      // Upload da imagem
      await uploadString(storageRef, base64Image, 'data_url');
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log(`✅ Banner uploaded successfully: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading banner to Firebase Storage:', error);
      throw error;
    }
  }
  
  // Upload de produto para o Firebase Storage
  async uploadProductImage(base64Image: string, productId: string): Promise<string> {
    try {
      // Verificar se o Storage está disponível
      if (!adminStorage || adminStorage.type === 'mock-admin-storage') {
        throw new Error('Firebase Storage not available');
      }
      
      // Usar o ID do produto como nome do arquivo
      const fileName = `${productId}.jpg`;
      const storageRef = ref(adminStorage, `products/${fileName}`);
      
      // Upload da imagem
      await uploadString(storageRef, base64Image, 'data_url');
      
      // Obter URL de download
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log(`✅ Product image uploaded successfully: ${downloadURL}`);
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading product image to Firebase Storage:', error);
      throw error;
    }
  }
}

export const firebaseStorageService = new FirebaseStorageService();