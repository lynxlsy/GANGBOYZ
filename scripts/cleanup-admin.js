// Script para limpar todos os dados de teste do dashboard admin
// Execute este script para deixar o dashboard limpo para o cliente

console.log('🧹 Iniciando limpeza completa do dashboard admin...')

// Lista de todas as chaves que contêm dados de teste
const keysToRemove = [
  "gang-boyz-hot-products",
  "gang-boyz-standalone-products", 
  "gang-boyz-categories",
  "gang-boyz-homepage-banners",
  "gang-boyz-collections",
  "gang-boyz-test-products",
  "gang-boyz-products-backup",
  "gang-boyz-recommendations",
  "gang-boyz-banners",
  "gang-boyz-lancamentos",
  "gang-boyz-em-alta",
  "gang-boyz-ofertas",
  "gang-boyz-contacts",
  "gang-boyz-services",
  "gang-boyz-about"
]

// Função para limpar localStorage
function cleanLocalStorage() {
  console.log('📦 Limpando localStorage...')
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
      console.log(`✅ Removido: ${key}`)
    }
  })
  
  console.log('✅ localStorage limpo!')
}

// Função para limpar sessionStorage
function cleanSessionStorage() {
  console.log('🗂️ Limpando sessionStorage...')
  sessionStorage.clear()
  console.log('✅ sessionStorage limpo!')
}

// Função para disparar eventos de atualização
function triggerUpdateEvents() {
  console.log('🔄 Disparando eventos de atualização...')
  
  const events = [
    'hotProductsUpdated',
    'productsUpdated', 
    'bannersUpdated',
    'collectionsUpdated',
    'recommendationsUpdated',
    'lancamentosUpdated',
    'emAltaUpdated',
    'ofertasUpdated'
  ]
  
  events.forEach(event => {
    window.dispatchEvent(new CustomEvent(event))
    console.log(`📡 Evento disparado: ${event}`)
  })
}

// Executar limpeza completa
function executeCleanup() {
  console.log('🚀 Executando limpeza completa...')
  
  try {
    cleanLocalStorage()
    cleanSessionStorage()
    triggerUpdateEvents()
    
    console.log('🎉 Limpeza completa finalizada!')
    console.log('✨ Dashboard admin está agora limpo e pronto para o cliente testar!')
    
    // Mostrar resumo
    console.log('\n📊 RESUMO DA LIMPEZA:')
    console.log('✅ Produtos de teste removidos')
    console.log('✅ Banners de demonstração removidos')
    console.log('✅ Coleções de teste removidas')
    console.log('✅ Recomendações de teste removidas')
    console.log('✅ Categorias de demonstração removidas')
    console.log('✅ Todos os dados de sessão limpos')
    console.log('✅ Eventos de atualização disparados')
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error)
  }
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  executeCleanup()
} else {
  console.log('⚠️ Este script deve ser executado no browser')
}

// Exportar funções para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cleanLocalStorage,
    cleanSessionStorage,
    triggerUpdateEvents,
    executeCleanup
  }
}

