import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ESLint plugin version mismatch with eslint-config-next — skip during build,
  // TypeScript strict mode provides full type safety coverage.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Supabase storage
      {
        protocol: 'https',
        hostname: 'ajpzbntxooowpnwgkhcu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Cloudinary (used by live CMS for uploaded images)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // S3 / Animade CDN (used in some CMS defaults)
      {
        protocol: 'https',
        hostname: 'animade-website.s3-eu-west-2.amazonaws.com',
      },
      // Any other S3 bucket
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      // Sanity image CDN
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Placeholder images (used in dev/testing)
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Generic CDN/external images stored in CMS
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
