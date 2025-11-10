# Gerenciamento de LocalStorage - Gang Boyz E-commerce

## Problema Identificado

O sistema estava enfrentando o erro "Quota do localStorage excedida" devido ao acúmulo excessivo de dados no armazenamento local do navegador. Isso ocorria principalmente por:

1. Acúmulo de muitos produtos de teste no `gang-boyz-test-products`
2. Acúmulo de muitas recomendações no `gang-boyz-recommendations`
3. Falta de limpeza periódica de dados antigos

## Soluções Implementadas

### 1. Limitação de Dados Armazenados

- **Produtos de Teste**: Limitado a 50 itens mais recentes
- **Recomendações**: Limitado a 30 itens mais recentes
- **Outros Dados**: Chaves temporárias são removidas automaticamente

### 2. Sistema de Limpeza Automática

- **Verificação de Quota**: Monitoramento contínuo do uso do localStorage
- **Limpeza Preventiva**: Executada quando o uso ultrapassa 80% da capacidade
- **Limpeza Periódica**: Executada a cada 5 minutos para manter o armazenamento otimizado

### 3. Funções de Utilidade

As seguintes funções foram adicionadas/otimizadas em `lib/localStorage-utils.ts`:

- `checkLocalStorageQuota()`: Verifica o uso atual do localStorage
- `safeSetItem()`: Salva dados com verificação de quota
- `cleanupLocalStorage()`: Remove dados antigos e desnecessários
- `monitorLocalStorageUsage()`: Monitora o uso e aciona limpeza quando necessário
- `setupPeriodicCleanup()`: Configura limpeza automática a cada 5 minutos

### 4. Otimização nos Componentes

- **RecommendationsSection**: Limita recomendações a 30 itens
- **ProductsContext**: Limita produtos a 50 itens
- **AdminProductModal**: Processo de salvamento otimizado

## Como Usar

### Limpeza Manual

Para limpar manualmente o localStorage:

1. Acesse: `/cleanup-localstorage.html` no seu site
2. Clique em "Limpar Dados Antigos"
3. Verifique o status atual

### Script Node.js

Execute o script de limpeza via terminal:

```bash
node scripts/cleanup-localstorage.js
```

## Monitoramento

O sistema agora monitora automaticamente o uso do localStorage e:

- Exibe warnings quando o uso ultrapassa 80%
- Executa limpeza automática quando necessário
- Mantém apenas os dados mais recentes e relevantes

## Boas Práticas

1. **Evite criar muitas chaves temporárias**
2. **Limite o tamanho dos dados armazenados**
3. **Use sempre `safeSetItem` em vez de `localStorage.setItem` diretamente**
4. **Monitore regularmente o uso do localStorage em ambientes de desenvolvimento**

## Chaves Mantidas

As seguintes chaves são preservadas durante a limpeza:

- `gang-boyz-active-theme`
- `gang-boyz-about-info`
- `gang-boyz-test-products` (limitado a 50 itens)
- `gang-boyz-products`
- `gang-boyz-recommendations` (limitado a 30 itens)
- `gang-boyz-editable-contents`
- `gang-boyz-user-preferences`

## Contato

Para mais informações ou suporte, consulte a equipe de desenvolvimento.