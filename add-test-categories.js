// Script para adicionar categorias de teste
// Copie e cole este código no console do navegador quando logado como administrador

// Função para adicionar categorias de teste
async function addTestCategories() {
  console.log('🌱 Adicionando categorias de teste...');
  
  // Verificar se o Firebase está disponível
  if (typeof db === 'undefined' || db.type === 'mock-db') {
    console.log('⚠️ Firebase não está disponível. Verifique se você está logado como administrador.');
    return;
  }
  
  // Categorias de teste com imagens de placeholder
  const testCategories = [
    {
      name: "Oversized",
      image: "/placeholder-category-circle.png",
      href: "/explore/oversized",
      description: "Camisetas oversized de alta qualidade",
      isActive: true,
      order: 1
    },
    {
      name: "Estampas",
      image: "/placeholder-category-circle.png",
      href: "/explore/estampas",
      description: "Camisetas com estampas exclusivas",
      isActive: true,
      order: 2
    },
    {
      name: "Lisos",
      image: "/placeholder-category-circle.png",
      href: "/explore/lisos",
      description: "Camisetas lisas em várias cores",
      isActive: true,
      order: 3
    },
    {
      name: "Shorts",
      image: "/placeholder-category-circle.png",
      href: "/explore/shorts",
      description: "Shorts confortáveis para o verão",
      isActive: true,
      order: 4
    },
    {
      name: "Verão",
      image: "/placeholder-category-circle.png",
      href: "/explore/verao",
      description: "Coleção especial de verão",
      isActive: true,
      order: 5
    },
    {
      name: "Inverno",
      image: "/placeholder-category-circle.png",
      href: "/explore/inverno",
      description: "Roupas quentes para o inverno",
      isActive: true,
      order: 6
    }
  ];
  
  try {
    // Adicionar categorias ao Firebase
    for (const category of testCategories) {
      try {
        // Adicionar nova categoria
        const docRef = await addDoc(collection(db, 'categories'), {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`✅ Categoria "${category.name}" adicionada com ID: ${docRef.id}`);
      } catch (error) {
        console.error(`❌ Erro ao adicionar categoria "${category.name}":`, error);
      }
    }
    
    console.log('✅ Processo concluído!');
    console.log('🔄 Recarregue a página para ver as mudanças');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar categorias:', error);
  }
}

// Para usar: copie e cole a função acima no console do navegador e depois execute:
// addTestCategories();