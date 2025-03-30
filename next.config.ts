// next.config.js or next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/vnc/:path*',
        destination: 'http://44.218.170.241:6080/:path*', // Rewrite to your VNC server
      },
    ];
  },
};

export default nextConfig;