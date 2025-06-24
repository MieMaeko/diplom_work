// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     if (process.env.NODE_ENV === 'development') {
//       return [
//         {
//           source: '/api/:path*',
//           destination: 'http://localhost:3001/:path*', // локальный backend
//         },
//       ];
//     }

//     return [];
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Разрешаем изображения только с localhost
  },
};

module.exports = nextConfig;
