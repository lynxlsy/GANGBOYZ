// Lista de páginas que devem ser ignoradas durante a geração estática
module.exports = {
  // Páginas de admin que requerem autenticação
  '/admin/contatos': { page: '/admin/contatos' },
  '/auth/signin': { page: '/auth/signin' },
  '/auth/signup': { page: '/auth/signup' },
  
  // Páginas de teste
  '/test-firebase': { page: '/test-firebase' },
  '/busca': { page: '/busca' },
  '/delete': { page: '/delete' },
  '/demo-editable-button': { page: '/demo-editable-button' },
}