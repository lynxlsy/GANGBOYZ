// Script para testar os banners hero
console.log('=== Test Hero Banners ===');

function testHeroBanners() {
  console.log('Testando funcionamento dos banners hero...');
  
  try {
    // Verificar dados no localStorage
    const homepageBannersKey = 'gang-boyz-homepage-banners';
    const savedBanners = localStorage.getItem(homepageBannersKey);
    
    if (!savedBanners) {
      console.log('❌ Nenhum dado de banner encontrado no localStorage');
      return false;
    }
    
    const banners = JSON.parse(savedBanners);
    console.log(`✅ Encontrados ${banners.length} banners no localStorage`);
    
    // Verificar banners hero específicos
    const heroBanner1 = banners.find(b => b.id === 'hero-banner-1');
    const heroBanner2 = banners.find(b => b.id === 'hero-banner-2');
    
    if (heroBanner1) {
      console.log('✅ Hero Banner 1 encontrado:');
      console.log(`   ID: ${heroBanner1.id}`);
      console.log(`   Nome: ${heroBanner1.name}`);
      console.log(`   Imagem: ${heroBanner1.currentImage.substring(0, 50)}${heroBanner1.currentImage.length > 50 ? '...' : ''}`);
      console.log(`   Dimensões: ${heroBanner1.dimensions}`);
    } else {
      console.log('❌ Hero Banner 1 não encontrado');
    }
    
    if (heroBanner2) {
      console.log('✅ Hero Banner 2 encontrado:');
      console.log(`   ID: ${heroBanner2.id}`);
      console.log(`   Nome: ${heroBanner2.name}`);
      console.log(`   Imagem: ${heroBanner2.currentImage.substring(0, 50)}${heroBanner2.currentImage.length > 50 ? '...' : ''}`);
      console.log(`   Dimensões: ${heroBanner2.dimensions}`);
    } else {
      console.log('❌ Hero Banner 2 não encontrado');
    }
    
    // Verificar se os banners estão sendo exibidos no DOM
    setTimeout(() => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        console.log('✅ Seção Hero encontrada no DOM');
        
        const images = heroSection.querySelectorAll('img');
        console.log(`✅ Encontradas ${images.length} imagens na seção Hero`);
        
        images.forEach((img, index) => {
          console.log(`   Imagem ${index + 1}: ${img.src.substring(0, 50)}${img.src.length > 50 ? '...' : ''}`);
          console.log(`   Alt: ${img.alt}`);
        });
      } else {
        console.log('❌ Seção Hero não encontrada no DOM');
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao testar banners hero:', error);
    return false;
  }
}

// Função para simular atualização de banner
function simulateBannerUpdate() {
  console.log('Simulando atualização de banner...');
  
  try {
    const testImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSI5NjAiIHk9IjU0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5URVNURTwvdGV4dD48L3N2Zz4=';
    
    // Disparar evento de atualização
    window.dispatchEvent(new CustomEvent('editModeBannerUpdate', {
      detail: {
        bannerId: 'hero-banner-1',
        imageUrl: testImageUrl
      }
    }));
    
    console.log('✅ Evento de atualização de banner disparado');
    
    // Verificar atualização após um tempo
    setTimeout(() => {
      testHeroBanners();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro ao simular atualização de banner:', error);
  }
}

console.log('\nFunções disponíveis:');
console.log('- testHeroBanners(): Testar funcionamento dos banners hero');
console.log('- simulateBannerUpdate(): Simular atualização de banner');

// Executar teste automaticamente
console.log('\nExecutando teste automático...');
testHeroBanners();

export { testHeroBanners, simulateBannerUpdate };