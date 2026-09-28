/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required by OpenNext so the Prisma client is patched for Cloudflare Workers
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

module.exports = nextConfig
