/**
 * Script para limpar o localStorage do Gang Boyz E-commerce
 * 
 * Este script ajuda a limpar dados antigos do localStorage para evitar
 * problemas de quota excedida.
 */

// Função para verificar o uso do localStorage
function checkLocalStorageUsage() {
  if (typeof localStorage === 'undefined') {
    console.log('localStorage não disponível');
    return;
  }

  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }

  const totalMB = (total / 1024 / 1024).toFixed(2);
  const percentage = (total / (5 * 1024 * 1024)) * 100;
  
  console.log(`📊 Uso do LocalStorage: ${totalMB}MB / 5MB (${percentage.toFixed(1)}%)`);
  return { used: total, total: 5 * 1024 * 1024, percentage };
}

// Função para limpar dados antigos do Gang Boyz
function cleanupGangBoyzData() {
  if (typeof localStorage === 'undefined') {
    console.log('localStorage não disponível');
    return;
  }

  console.log('🔍 Limpando dados antigos do Gang Boyz...');

  const keysToKeep = [
    'gang-boyz-active-theme',
    'gang-boyz-about-info',
    'gang-boyz-test-products',
    'gang-boyz-products',
    'gang-boyz-recommendations',
    'gang-boyz-editable-contents',
    'gang-boyz-user-preferences'
  ];

  // Coletar todas as chaves do Gang Boyz
  const gangBoyzKeys = Object.keys(localStorage).filter(key => key.startsWith('gang-boyz-'));
  
  console.log(`📦 Encontradas ${gangBoyzKeys.length} chaves do Gang Boyz`);

  // Limpar dados duplicados ou muito antigos no gang-boyz-test-products
  const testProducts = localStorage.getItem('gang-boyz-test-products');
  if (testProducts) {
    try {
      const products = JSON.parse(testProducts);
      console.log(`🛍️ Produtos no admin: ${products.length}`);
      
      // Manter apenas os últimos 50 produtos
      if (products.length > 50) {
        const recentProducts = products.slice(-50);
        localStorage.setItem('gang-boyz-test-products', JSON.stringify(recentProducts));
        console.log(`✂️ Reduzido de ${products.length} para 50 produtos`);
      }
    } catch (error) {
      console.error('❌ Erro ao limpar produtos:', error);
      localStorage.removeItem('gang-boyz-test-products');
    }
  }

  // Limpar dados duplicados ou muito antigos no gang-boyz-recommendations
  const recommendations = localStorage.getItem('gang-boyz-recommendations');
  if (recommendations) {
    try {
      const recs = JSON.parse(recommendations);
      console.log(`⭐ Recomendações: ${recs.length}`);
      
      // Manter apenas os últimos 30 recomendações
      if (recs.length > 30) {
        const recentRecs = recs.slice(-30);
        localStorage.setItem('gang-boyz-recommendations', JSON.stringify(recentRecs));
        console.log(`✂️ Reduzido de ${recs.length} para 30 recomendações`);
      }
    } catch (error) {
      console.error('❌ Erro ao limpar recomendações:', error);
      localStorage.removeItem('gang-boyz-recommendations');
    }
  }

  console.log('✅ Limpeza concluída!');
  checkLocalStorageUsage();
}

// Função para mostrar detalhes do uso do localStorage
function showLocalStorageDetails() {
  if (typeof localStorage === 'undefined') {
    console.log('localStorage não disponível');
    return;
  }

  console.log('\n📋 Detalhes do LocalStorage:');
  console.log('==========================');

  const gangBoyzKeys = Object.keys(localStorage).filter(key => key.startsWith('gang-boyz-'));
  
  gangBoyzKeys.forEach(key => {
    const value = localStorage.getItem(key);
    const size = (value.length / 1024).toFixed(2);
    console.log(`  ${key}: ${size}KB`);
  });

  console.log(`\n📦 Total de chaves do Gang Boyz: ${gangBoyzKeys.length}`);
}

// Executar as funções
console.log('🚀 Iniciando limpeza do LocalStorage do Gang Boyz...\n');

checkLocalStorageUsage();
showLocalStorageDetails();
cleanupGangBoyzData();

console.log('\n✨ Processo finalizado!');