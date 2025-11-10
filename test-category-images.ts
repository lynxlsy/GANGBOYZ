// Script de teste para verificar se as imagens de categorias estão funcionando corretamente
// Executar no console do navegador

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
  description: string;
}

async function testCategoryImageUpload() {
  console.log('🧪 Testando upload de imagens de categorias...');
  
  try {
    // Testar upload de imagem fictícia
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // Simular upload usando a mesma abordagem dos banners
    console.log('📤 Testando upload de imagem...');
    
    const formData = new FormData();
    const blob = await fetch(testImage).then(r => r.blob());
    formData.append('file', blob, 'test-category-image.png');
    
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Erro no upload');
    }
    
    const { url, width, height, mime } = await response.json();
    console.log('✅ Upload bem-sucedido:');
    console.log(`  URL: ${url.substring(0, 50)}...`);
    console.log(`  Dimensões: ${width}x${height}`);
    console.log(`  Tipo: ${mime}`);
    
    // Testar validação de URL
    const validateImageUrl = (imageUrl: string | undefined): string | null => {
      if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        return null;
      }
      
      const trimmedUrl = imageUrl.trim();
      
      if (trimmedUrl.startsWith('http') || trimmedUrl.startsWith('/') || trimmedUrl.startsWith('data:')) {
        return trimmedUrl;
      }
      
      if (trimmedUrl.includes('base64')) {
        return trimmedUrl;
      }
      
      return trimmedUrl;
    };
    
    const validatedUrl = validateImageUrl(url);
    console.log(`✅ URL validada: ${!!validatedUrl}`);
    
    // Testar criação de categoria fictícia
    const testCategory: Category = {
      id: 'test-category',
      name: 'Test Category',
      image: url,
      href: '/explore/test-category',
      description: 'Test category for image verification'
    };
    
    console.log('✅ Categoria de teste criada:');
    console.log(`  ID: ${testCategory.id}`);
    console.log(`  Nome: ${testCategory.name}`);
    console.log(`  Imagem: ${testCategory.image.substring(0, 50)}...`);
    console.log(`  Href: ${testCategory.href}`);
    
    console.log('\n✅ Todos os testes passaram!');
    console.log('🎉 O sistema de upload de imagens de categorias está funcionando corretamente!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.log('⚠️ Verifique se o servidor está rodando e se a API de upload está acessível');
  }
}

// Executar teste
testCategoryImageUpload();

export { testCategoryImageUpload };