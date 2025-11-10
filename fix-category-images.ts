// Script para corrigir imagens de categorias
// Executar no console do navegador ou como script Node.js

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
  description: string;
}

function validateAndFixImageUrl(imageUrl: string | undefined): string {
  // Check for null, undefined, or empty strings
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    console.log('⚠️ No valid image URL provided, using placeholder');
    return '/placeholder-category-circle.png';
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
  
  // For any other case, use placeholder
  console.log(`⚠️ Invalid image URL, using placeholder: ${trimmedUrl}`);
  return '/placeholder-category-circle.png';
}

async function fixCategoryImages() {
  console.log('🔧 Corrigindo problemas com imagens de categorias...');
  
  try {
    // Verificar e corrigir categorias no localStorage
    const savedCategories = localStorage.getItem("gang-boyz-categories");
    if (savedCategories) {
      console.log('📦 Corrigindo categorias no localStorage...');
      const categories: Category[] = JSON.parse(savedCategories);
      
      const fixedCategories = categories.map(cat => ({
        ...cat,
        image: validateAndFixImageUrl(cat.image)
      }));
      
      // Salvar categorias corrigidas
      localStorage.setItem("gang-boyz-categories", JSON.stringify(fixedCategories));
      console.log('✅ Categorias corrigidas e salvas no localStorage');
      
      // Mostrar detalhes das correções
      fixedCategories.forEach((cat, index) => {
        console.log(`\n📊 Categoria ${index + 1}:`);
        console.log(`  ID: ${cat.id}`);
        console.log(`  Nome: ${cat.name}`);
        console.log(`  Imagem: ${cat.image}`);
      });
    } else {
      console.log('⚠️ Nenhuma categoria encontrada no localStorage');
    }
    
    console.log('\n✅ Processo de correção concluído!');
    console.log('🔄 Recarregue a página para ver as mudanças');
    
  } catch (error) {
    console.error('❌ Erro ao corrigir categorias:', error);
  }
}

// Executar correção
fixCategoryImages();

export { fixCategoryImages, validateAndFixImageUrl };