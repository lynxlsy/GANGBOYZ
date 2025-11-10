const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBvQZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8QZ8Q",
  authDomain: "gang-boyz-ecommerce.firebaseapp.com",
  projectId: "gang-boyz-ecommerce",
  storageBucket: "gang-boyz-ecommerce.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearFirebaseData() {
  console.log('🔥 Iniciando limpeza do Firebase...');
  
  const collections = [
    'products',
    'cardProducts', 
    'banners',
    'aboutInfo',
    'services',
    'contacts',
    'recommendations'
  ];
  
  let totalDeleted = 0;
  
  for (const collectionName of collections) {
    try {
      console.log(`📦 Limpando coleção: ${collectionName}`);
      
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`✅ ${collectionName}: vazia (0 documentos)`);
        continue;
      }
      
      console.log(`📄 ${collectionName}: ${snapshot.size} documentos encontrados`);
      
      // Deletar todos os documentos
      const deletePromises = snapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, collectionName, docSnapshot.id))
      );
      
      await Promise.all(deletePromises);
      
      console.log(`🗑️ ${collectionName}: ${snapshot.size} documentos removidos`);
      totalDeleted += snapshot.size;
      
    } catch (error) {
      console.error(`❌ Erro ao limpar ${collectionName}:`, error.message);
    }
  }
  
  console.log(`\n🎯 Limpeza concluída! Total de documentos removidos: ${totalDeleted}`);
  console.log('✅ Firebase limpo com sucesso!');
}

// Executar limpeza
clearFirebaseData()
  .then(() => {
    console.log('🏁 Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });





