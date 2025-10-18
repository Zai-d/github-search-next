/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // App Router is default in Next 15
  },
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
