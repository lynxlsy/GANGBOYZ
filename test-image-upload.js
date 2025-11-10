// Script para testar o upload de imagens
// Copie e cole este código no console do navegador

async function testImageUpload() {
  console.log('🧪 Testando upload de imagens...');
  
  try {
    // Criar uma imagem de teste (1x1 pixel PNG transparente)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testImageBlob = await fetch(`data:image/png;base64,${testImageData}`).then(r => r.blob());
    
    // Criar FormData
    const formData = new FormData();
    formData.append('file', testImageBlob, 'test-image.png');
    
    // Fazer upload usando a API
    console.log('📤 Enviando imagem para /api/uploads...');
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Upload bem-sucedido:', result);
    
    // Verificar se a URL é válida
    if (result.url) {
      console.log('🔗 URL da imagem:', result.url.substring(0, 100) + '...');
      
      // Tentar carregar a imagem
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Imagem carregada com sucesso: ${img.width}x${img.height}`);
      };
      img.onerror = () => {
        console.log('❌ Erro ao carregar a imagem');
      };
      img.src = result.url;
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de upload:', error);
  }
  
  console.log('✅ Teste concluído!');
}

// Para usar: copie e cole a função acima no console do navegador e depois execute:
// testImageUpload();