// Script para remover produtos PROD001-PROD005 do localStorage
function clearProdProducts() {
  console.log("🧹 Limpando produtos PROD001-PROD005 do localStorage...")
  
  // Lista de chaves do localStorage que podem conter esses produtos
  const localStorageKeys = [
    "gang-boyz-products",
    "gang-boyz-card-products", 
    "gang-boyz-categories",
    "gang-boyz-hot-products",
    "gang-boyz-standalone-products",
    "gang-boyz-test-products"
  ]
  
  // IDs dos produtos a serem removidos
  const productsToRemove = ["PROD001", "PROD002", "PROD003", "PROD004", "PROD005"]
  
  localStorageKeys.forEach(key => {
    const data = localStorage.getItem(key)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        let updated = false
        
        // Se for um array de produtos
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(product => !productsToRemove.includes(product.id))
          if (filtered.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(filtered))
            console.log(`✅ Removidos produtos PROD001-PROD005 de ${key}`)
            updated = true
          }
        }
        
        // Se for um objeto com produtos dentro
        if (parsed.products && Array.isArray(parsed.products)) {
          const filtered = parsed.products.filter(product => !productsToRemove.includes(product.id))
          if (filtered.length !== parsed.products.length) {
            parsed.products = filtered
            localStorage.setItem(key, JSON.stringify(parsed))
            console.log(`✅ Removidos produtos PROD001-PROD005 de ${key}.products`)
            updated = true
          }
        }
        
        // Se for um array de categorias com produtos
        if (Array.isArray(parsed) && parsed.some(item => item.products)) {
          parsed.forEach(category => {
            if (category.products && Array.isArray(category.products)) {
              const filtered = category.products.filter(product => !productsToRemove.includes(product.id))
              if (filtered.length !== category.products.length) {
                category.products = filtered
                localStorage.setItem(key, JSON.stringify(parsed))
                console.log(`✅ Removidos produtos PROD001-PROD005 de ${key} categoria ${category.name}`)
                updated = true
              }
            }
          })
        }
        
        if (!updated) {
          console.log(`ℹ️ Nenhum produto PROD001-PROD005 encontrado em ${key}`)
        }
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${key}:`, error)
      }
    }
  })
  
  // Disparar eventos para atualizar as seções
  window.dispatchEvent(new CustomEvent('hotProductsUpdated'))
  window.dispatchEvent(new CustomEvent('productsUpdated'))
  window.dispatchEvent(new CustomEvent('cardsUpdated'))
  
  console.log("🎉 Limpeza concluída! Recarregue a página para ver as mudanças.")
}

// Executar se estiver no browser
if (typeof window !== 'undefined') {
  clearProdProducts()
}
