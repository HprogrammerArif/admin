import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api-proxy/auth/login/',
        destination: 'https://api.floruit.co.uk/auth/login/',
      },
      {
        source: '/api-proxy/:path*',
        destination: 'https://api.floruit.co.uk/:path*',
      },

    ];

  },
};


export default nextConfig;
