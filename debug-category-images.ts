// Script para diagnosticar problemas com imagens de categorias
// Executar no console do navegador ou como script Node.js

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
  description: string;
}

function validateImageUrl(imageUrl: string | undefined): string | null {
  // Check for null, undefined, or empty strings
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.log('⚠️ No valid image URL provided, using placeholder');
    return null;
  }
  
  // Trim the URL
  const trimmedUrl = imageUrl.trim();
  
  // Check if it's a valid URL
  if (trimmedUrl.startsWith('http')) {
    console.log(`✅ Valid HTTP URL: ${trimmedUrl}`);
    return trimmedUrl;
  }
  
  // Check if it's a valid local path
  if (trimmedUrl.startsWith('/')) {
    console.log(`✅ Valid local path: ${trimmedUrl}`);
    return trimmedUrl;
  }
  
  // Check if it's base64 data
  if (trimmedUrl.startsWith('data:')) {
    console.log(`✅ Valid base64 data URL`);
    return trimmedUrl;
  }
  
  // Check if it's a valid data URL (handle cases where it might not start with 'data:' but is still valid)
  if (trimmedUrl.includes('base64')) {
    console.log(`✅ Valid base64 data URL (alternative check): ${trimmedUrl}`);
    return trimmedUrl;
  }
  
  // For any other case, log it and return the URL as is (might be a valid relative path)
  console.log(`ℹ️ Using image URL as is: ${trimmedUrl}`);
  return trimmedUrl;
}

async function debugCategoryImages() {
  console.log('🔍 Diagnosticando problemas com imagens de categorias...');
  
  try {
    // Verificar categorias no localStorage
    const savedCategories = localStorage.getItem("gang-boyz-categories");
    if (savedCategories) {
      console.log('📦 Categorias encontradas no localStorage:');
      const categories: Category[] = JSON.parse(savedCategories);
      
      categories.forEach((cat, index) => {
        console.log(`\n📊 Categoria ${index + 1}:`);
        console.log(`  ID: ${cat.id}`);
        console.log(`  Nome: ${cat.name}`);
        console.log(`  Imagem: ${cat.image}`);
        console.log(`  Href: ${cat.href}`);
        
        // Validar URL da imagem
        const validatedUrl = validateImageUrl(cat.image);
        console.log(`  URL Validada: ${validatedUrl}`);
        
        // Verificar se é uma URL válida
        if (validatedUrl) {
          try {
            new URL(validatedUrl);
            console.log(`  ✅ URL válida`);
          } catch {
            console.log(`  ⚠️ URL inválida`);
          }
        }
      });
    } else {
      console.log('⚠️ Nenhuma categoria encontrada no localStorage');
    }
    
    // Verificar Firebase (se possível)
    console.log('\n📡 Para verificar categorias no Firebase, execute:');
    console.log('   db.collection("categories").get().then(snapshot => {');
    console.log('     snapshot.forEach(doc => console.log(doc.id, "=>", doc.data()));');
    console.log('   });');
    
  } catch (error) {
    console.error('❌ Erro ao diagnosticar categorias:', error);
  }
}

// Executar diagnóstico
debugCategoryImages();

export { debugCategoryImages, validateImageUrl };