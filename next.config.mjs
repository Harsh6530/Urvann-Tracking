/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.storehippo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'cdn.storehippo.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
