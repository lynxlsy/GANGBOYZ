// Script para corrigir o contraste da faixa de promoção
// Este script deve ser incluído na página para corrigir automaticamente o problema

(function() {
  // Função para corrigir o contraste
  function fixBannerContrast() {
    if (typeof localStorage !== 'undefined') {
      try {
        // Obter configuração atual do banner strip
        const config = localStorage.getItem('gang-boyz-banner-strip-config');
        
        if (config) {
          const parsed = JSON.parse(config);
          console.log('Configuração atual da faixa de promoção:', parsed);
          
          // Verificar se há problema de contraste (fundo preto com texto preto)
          if (parsed.backgroundColor === '#000000' && 
              (!parsed.textColor || parsed.textColor === '#000000' || parsed.textColor === '')) {
            // Corrigir a cor do texto para branco
            parsed.textColor = '#ffffff';
            localStorage.setItem('gang-boyz-banner-strip-config', JSON.stringify(parsed));
            console.log('Contraste da faixa de promoção corrigido: texto alterado para branco');
            
            // Forçar atualização da página para aplicar as mudanças
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }
          
          // Verificar se a cor do texto está vazia ou inválida
          if (!parsed.textColor || parsed.textColor === '') {
            parsed.textColor = '#ffffff';
            localStorage.setItem('gang-boyz-banner-strip-config', JSON.stringify(parsed));
            console.log('Cor do texto da faixa de promoção definida como branco');
            
            // Forçar atualização da página para aplicar as mudanças
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }
        } else {
          console.log('Nenhuma configuração de faixa de promoção encontrada');
        }
      } catch (error) {
        console.error('Erro ao corrigir contraste da faixa de promoção:', error);
      }
    } else {
      console.log('localStorage não disponível');
    }
  }

  // Executar a correção quando a página carregar
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixBannerContrast);
    } else {
      fixBannerContrast();
    }
  } else {
    // Se estiver em um ambiente Node.js, exportar a função
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = { fixBannerContrast };
    }
  }
})();