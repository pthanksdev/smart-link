/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:alias',
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/:alias`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
