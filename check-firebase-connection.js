// Script para verificar a conexão com o Firebase
// Copie e cole este código no console do navegador

async function checkFirebaseConnection() {
  console.log('🔍 Verificando conexão com o Firebase...');
  
  // Verificar se o Firebase está disponível
  if (typeof db === 'undefined') {
    console.log('❌ Firebase não está definido');
    return;
  }
  
  if (db.type === 'mock-db') {
    console.log('⚠️ Firebase está usando serviços mock (sem conexão real)');
    return;
  }
  
  console.log('✅ Firebase está disponível');
  
  try {
    // Tentar ler as categorias
    const querySnapshot = await getDocs(collection(db, 'categories'));
    console.log(`📊 Encontradas ${querySnapshot.size} categorias no Firebase`);
    
    // Mostrar as primeiras categorias
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < 5) { // Mostrar apenas as primeiras 5
        console.log(`  📦 Categoria:`, doc.id, '=>', doc.data());
        count++;
      }
    });
    
    if (querySnapshot.size > 5) {
      console.log(`  ... e mais ${querySnapshot.size - 5} categorias`);
    }
    
    // Verificar se há categorias ativas
    const activeQuery = await getDocs(
      query(collection(db, 'categories'), where('isActive', '==', true))
    );
    console.log(`✅ Há ${activeQuery.size} categorias ativas`);
    
  } catch (error) {
    console.error('❌ Erro ao acessar categorias:', error);
    console.log('⚠️ Verifique as permissões do Firestore');
  }
  
  console.log('✅ Verificação concluída!');
}

// Para usar: copie e cole a função acima no console do navegador e depois execute:
// checkFirebaseConnection();