/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Ignorar erros de static generation durante build
  staticGenerationIgnoreDynamicPages: true,
  // Configuração para lidar com Server Components
  transpilePackages: [],
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
  serverExternalPackages: ['firebase', 'firebase-admin'],
  // Desabilitar pré-renderização de páginas problemáticas
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return defaultPathMap
  },
}

module.exports = nextConfig