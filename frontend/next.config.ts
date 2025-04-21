import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Все запросы с /api будут перенаправлены
        destination: 'http://localhost:3001/:path*', // На сервер Nest, на порт 3001
      },
    ];
  },
};

export default nextConfig;