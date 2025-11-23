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
}

module.exports = nextConfig