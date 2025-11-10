// Script para limpar dados do Firebase
// Execute este script no console do navegador para limpar todos os dados do Firebase

console.log('🔥 Limpando dados do Firebase...')

// Função para limpar dados do Firebase
async function clearFirebaseData() {
  try {
    // Importar Firebase (assumindo que já está disponível)
    const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore')
    const { db } = await import('./lib/firebase-config.js')
    
    // Lista de coleções para limpar
    const collections = [
      'cardProducts',
      'products', 
      'banners',
      'bannerStrips',
      'aboutInfo',
      'services',
      'contacts',
      'recommendations'
    ]
    
    for (const collectionName of collections) {
      console.log(`🗑️ Limpando coleção: ${collectionName}`)
      
      const querySnapshot = await getDocs(collection(db, collectionName))
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, collectionName, docSnapshot.id))
      )
      
      await Promise.all(deletePromises)
      console.log(`✅ Coleção ${collectionName} limpa: ${querySnapshot.docs.length} documentos removidos`)
    }
    
    console.log('🎉 Dados do Firebase limpos com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados do Firebase:', error)
  }
}

// Executar limpeza
clearFirebaseData()





