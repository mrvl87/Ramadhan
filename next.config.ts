import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdfpxrbiofptltzsdlui.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'v3b.fal.media', // Also add Fal just in case we render raw output sometimes
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
