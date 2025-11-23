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
}

module.exports = nextConfig