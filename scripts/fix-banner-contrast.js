// Script para corrigir o contraste da faixa de promoção
(function() {
  // Verificar se estamos no navegador
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      // Obter configuração atual do banner strip
      const config = localStorage.getItem('gang-boyz-banner-strip-config');
      
      if (config) {
        const parsed = JSON.parse(config);
        console.log('Configuração atual da faixa de promoção:', parsed);
        
        // Verificar se há problema de contraste (fundo preto com texto preto)
        if (parsed.backgroundColor === '#000000' && parsed.textColor === '#000000') {
          // Corrigir a cor do texto para branco
          parsed.textColor = '#ffffff';
          localStorage.setItem('gang-boyz-banner-strip-config', JSON.stringify(parsed));
          console.log('Contraste da faixa de promoção corrigido: texto alterado para branco');
        }
        
        // Verificar se a cor do texto está vazia ou inválida
        if (!parsed.textColor || parsed.textColor === '') {
          parsed.textColor = '#ffffff';
          localStorage.setItem('gang-boyz-banner-strip-config', JSON.stringify(parsed));
          console.log('Cor do texto da faixa de promoção definida como branco');
        }
      } else {
        console.log('Nenhuma configuração de faixa de promoção encontrada');
      }
    } catch (error) {
      console.error('Erro ao corrigir contraste da faixa de promoção:', error);
    }
  } else {
    console.log('Este script deve ser executado em um navegador com suporte a localStorage');
  }
})();