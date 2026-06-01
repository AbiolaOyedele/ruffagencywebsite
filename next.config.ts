import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
    ],
  },
}

export default nextConfig
