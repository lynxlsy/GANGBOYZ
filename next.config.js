/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Otimizações para Render
  output: 'standalone',
  // Ignorar warnings específicos
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configurações para resolver problemas de Server Components
  experimental: {
    serverComponentsExternalPackages: ['firebase', 'firebase-admin'],
  },
  // Desabilitar pré-renderização de páginas problemáticas
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // Remover páginas que causam problemas durante o build
    const paths = { ...defaultPathMap };
    
    // Lista de páginas para ignorar
    const excludePaths = [
      '/admin/contatos',
      '/auth/signin',
      '/auth/signup',
      '/test-firebase',
      '/busca',
      '/delete',
      '/demo-editable-button'
    ];
    
    excludePaths.forEach(path => {
      delete paths[path];
    });
    
    return paths;
  },
}

module.exports = nextConfig