// Serviço de Sincronização de Conteúdos Editáveis com Firebase
import { db } from './firebase-config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

// Interface para conteúdo editável
export interface EditableContent {
  id: string;
  content: string;
  type: string;
  page: string;
  elementId: string;
  createdAt: any;
  updatedAt: any;
}

class EditableContentSyncService {
  private isSyncing = false;
  private syncQueue: string[] = [];
  private listeners: Map<string, () => void> = new Map();
  
  // Sincronizar conteúdo individual do localStorage para Firebase
  async syncContentToFirebase(contentId: string, content: string): Promise<void> {
    // Evitar múltiplas sincronizações simultâneas
    if (this.isSyncing) {
      console.log(`⏳ Sincronização já em andamento para ${contentId}. Adicionando à fila.`);
      this.syncQueue.push(contentId);
      return;
    }

    this.isSyncing = true;

    try {
      // Verificar se Firebase está disponível
      if (!db || db.type === 'mock-db') {
        console.warn('⚠️ Firebase não disponível. Usando fallback para localStorage.');
        return;
      }
      
      const contentRef = doc(collection(db, 'editableContents'), contentId);
      
      console.log(`🔄 Sincronizando conteúdo ${contentId}:`, content);

      await setDoc(contentRef, {
        id: contentId,
        content: content,
        updatedAt: serverTimestamp()
      }, { merge: true });

      console.log(`✅ Conteúdo ${contentId} sincronizado com Firebase`);
    } catch (error: any) {
      console.error(`❌ Erro ao sincronizar conteúdo ${contentId}:`, error);
      
      // Se for erro de quota ou timeout, usar fallback para localStorage compartilhado
      if (error?.code === 'resource-exhausted' || 
          error?.message?.includes('quota') || 
          error?.message?.includes('Timeout')) {
        console.warn(`⚠️ Firebase indisponível. Usando fallback para conteúdo ${contentId}`);
        return;
      }
      
      // Não re-throw o erro para evitar quebrar a aplicação
      console.warn(`⚠️ Erro ao sincronizar conteúdo ${contentId}, usando fallback`);
    } finally {
      this.isSyncing = false;
      
      // Processar fila se houver itens pendentes
      if (this.syncQueue.length > 0) {
        const nextContentId = this.syncQueue.shift();
        if (nextContentId) {
          console.log(`🔄 Processando próximo item da fila: ${nextContentId}`);
          // Recarregar dados do localStorage e sincronizar
          const savedContent = localStorage.getItem(`editable-content-${nextContentId}`);
          if (savedContent) {
            this.syncContentToFirebase(nextContentId, savedContent);
          }
        }
      }
    }
  }
  
  // Buscar conteúdo do Firebase
  async getContentFromFirebase(contentId: string): Promise<string | null> {
    try {
      // Verificar se Firebase está disponível
      if (!db || db.type === 'mock-db') {
        return null;
      }
      
      const contentRef = doc(collection(db, 'editableContents'), contentId);
      const contentDoc = await getDoc(contentRef);
      
      if (contentDoc.exists()) {
        const data = contentDoc.data();
        return data.content || null;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Erro ao buscar conteúdo ${contentId} do Firebase:`, error);
      return null;
    }
  }
  
  // Escutar mudanças em tempo real
  listenToContentChanges(contentId: string, callback: (content: string | null) => void) {
    // Verificar se Firebase está disponível
    if (!db || db.type === 'mock-db') {
      return () => {}; // Função de cleanup vazia
    }
    
    try {
      const contentRef = doc(collection(db, 'editableContents'), contentId);
      
      const unsubscribe = onSnapshot(contentRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback(data.content || null);
        } else {
          callback(null);
        }
      }, (error) => {
        console.error(`❌ Erro ao escutar mudanças do conteúdo ${contentId}:`, error);
      });
      
      // Armazenar o listener para possível cleanup
      this.listeners.set(contentId, unsubscribe);
      
      return unsubscribe;
    } catch (error) {
      console.error(`❌ Erro ao configurar listener para conteúdo ${contentId}:`, error);
      return () => {}; // Função de cleanup vazia
    }
  }
  
  // Parar de escutar mudanças
  stopListeningToContentChanges(contentId: string) {
    const unsubscribe = this.listeners.get(contentId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(contentId);
    }
  }
  
  // Sincronizar todos os conteúdos do localStorage para Firebase
  async syncAllContentsToFirebase(): Promise<void> {
    try {
      // Verificar se Firebase está disponível
      if (!db || db.type === 'mock-db') {
        return;
      }
      
      // Buscar todos os conteúdos editáveis do localStorage
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('editable-content-')
      );
      
      console.log(`🔄 Sincronizando ${keys.length} conteúdos para Firebase...`);
      
      for (const key of keys) {
        const contentId = key.replace('editable-content-', '');
        const content = localStorage.getItem(key);
        
        if (content) {
          await this.syncContentToFirebase(contentId, content);
        }
      }
      
      console.log('✅ Todos os conteúdos sincronizados com Firebase');
    } catch (error) {
      console.error('❌ Erro ao sincronizar todos os conteúdos:', error);
    }
  }
  
  // Limpar todos os listeners
  cleanup() {
    this.listeners.forEach((unsubscribe, contentId) => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn(`⚠️ Erro ao limpar listener para conteúdo ${contentId}:`, error);
      }
    });
    this.listeners.clear();
  }
}

export const editableContentSyncService = new EditableContentSyncService();