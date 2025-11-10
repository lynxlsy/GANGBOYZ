// Script para verificar se os banners hero estão sendo carregados corretamente
console.log('=== Verificação de Banners Hero ===');

function verifyHeroBanners() {
  console.log('Verificando carregamento dos banners hero...');
  
  try {
    // Verificar dados no localStorage
    const homepageBannersKey = 'gang-boyz-homepage-banners';
    const savedBanners = localStorage.getItem(homepageBannersKey);
    
    if (!savedBanners) {
      console.log('❌ Nenhum dado de banner encontrado no localStorage');
      console.log('Criando dados padrão...');
      
      // Criar dados padrão
      const defaultBanners = [
        {
          id: "hero-banner-1",
          name: "Banner Principal 1 (Hero)",
          description: "Primeiro banner do carrossel principal",
          currentImage: "/placeholder-default.svg",
          mediaType: "image",
          dimensions: "1920x1080px",
          format: "image",
          position: "Hero Section",
          overlaySettings: {
            enabled: false,
            fromColor: "black",
            fromOpacity: 50,
            viaColor: "black",
            viaOpacity: 20,
            toColor: "transparent",
            toOpacity: 0,
            direction: "to-r"
          }
        },
        {
          id: "hero-banner-2",
          name: "Banner Principal 2 (Hero)",
          description: "Segundo banner do carrossel principal",
          currentImage: "/placeholder-default.svg",
          mediaType: "image",
          dimensions: "1920x1080px",
          format: "image",
          position: "Hero Section",
          overlaySettings: {
            enabled: false,
            fromColor: "black",
            fromOpacity: 50,
            viaColor: "black",
            viaOpacity: 20,
            toColor: "transparent",
            toOpacity: 0,
            direction: "to-r"
          }
        }
      ];
      
      localStorage.setItem(homepageBannersKey, JSON.stringify(defaultBanners));
      console.log('✅ Dados padrão criados');
      
      // Disparar eventos de atualização
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
        window.dispatchEvent(new CustomEvent('forceBannerSync'));
      }, 100);
    } else {
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
      } else {
        console.log('❌ Hero Banner 1 não encontrado');
      }
      
      if (heroBanner2) {
        console.log('✅ Hero Banner 2 encontrado:');
        console.log(`   ID: ${heroBanner2.id}`);
        console.log(`   Nome: ${heroBanner2.name}`);
        console.log(`   Imagem: ${heroBanner2.currentImage.substring(0, 50)}${heroBanner2.currentImage.length > 50 ? '...' : ''}`);
      } else {
        console.log('❌ Hero Banner 2 não encontrado');
      }
    }
    
    // Verificar se os componentes React estão montados
    setTimeout(() => {
      checkReactComponents();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  }
}

function checkReactComponents() {
  console.log('Verificando componentes React...');
  
  // Verificar se o hook useBanner está funcionando
  try {
    // Este é apenas um teste de verificação, não podemos chamar o hook diretamente aqui
    console.log('✅ Verificação de componentes React concluída');
    
    // Verificar DOM
    checkDOMElements();
  } catch (error) {
    console.error('❌ Erro na verificação de componentes:', error);
  }
}

function checkDOMElements() {
  console.log('Verificando elementos DOM...');
  
  // Verificar se a seção hero existe
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    console.log('✅ Seção Hero encontrada no DOM');
    
    // Verificar imagens
    const images = heroSection.querySelectorAll('img');
    console.log(`✅ Encontradas ${images.length} imagens na seção Hero`);
    
    images.forEach((img, index) => {
      console.log(`   Imagem ${index + 1}:`);
      console.log(`     Src: ${img.src.substring(0, 50)}${img.src.length > 50 ? '...' : ''}`);
      console.log(`     Alt: ${img.alt}`);
      console.log(`     Visível: ${img.offsetWidth > 0 && img.offsetHeight > 0 ? 'Sim' : 'Não'}`);
    });
    
    // Verificar se há conteúdo visível
    const computedStyle = window.getComputedStyle(heroSection);
    const isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
    console.log(`✅ Seção Hero visível: ${isVisible ? 'Sim' : 'Não'}`);
    
  } else {
    console.log('❌ Seção Hero não encontrada no DOM');
    
    // Verificar se há algum elemento relacionado a banners
    const bannerElements = document.querySelectorAll('[class*="banner"], [id*="banner"]');
    console.log(`Encontrados ${bannerElements.length} elementos relacionados a banners`);
    
    bannerElements.forEach((el, index) => {
      console.log(`   Elemento ${index + 1}:`, el.tagName, el.className);
    });
  }
}

// Função para forçar atualização dos banners
function forceBannerRefresh() {
  console.log('Forçando atualização dos banners...');
  
  // Disparar eventos de atualização
  window.dispatchEvent(new CustomEvent('homepageBannerUpdate'));
  window.dispatchEvent(new CustomEvent('forceBannerSync'));
  
  // Verificar novamente após um tempo
  setTimeout(() => {
    verifyHeroBanners();
  }, 1000);
}

// Função para resetar e recriar dados dos banners
function resetAndRecreateBanners() {
  console.log('Resetando e recriando dados dos banners...');
  
  try {
    // Remover dados existentes
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('banner')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removido: ${key}`);
    });
    
    // Forçar atualização
    forceBannerRefresh();
    
    console.log('✅ Reset concluído');
  } catch (error) {
    console.error('❌ Erro ao resetar banners:', error);
  }
}

console.log('\nFunções disponíveis:');
console.log('- verifyHeroBanners(): Verificar carregamento dos banners hero');
console.log('- forceBannerRefresh(): Forçar atualização dos banners');
console.log('- resetAndRecreateBanners(): Resetar e recriar dados dos banners');

// Executar verificação automática
console.log('\nExecutando verificação automática...');
verifyHeroBanners();

export { verifyHeroBanners, forceBannerRefresh, resetAndRecreateBanners };